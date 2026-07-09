import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth } from "./auth.js";
import { authMiddleware } from "./auth-middleware.js";
import { getDb } from "./db.js";
import { resumes, resumeVersions } from "@openresume/db";
import { createResumeSchema, updateResumeSchema, resumeContentSchema } from "@openresume/schema";
import { extractByokKey, generateWithGemini, parseJsonResponse, validateByokKey } from "./lib/ai/gemini.js";
import { SYSTEM_PROMPTS, buildRewritePrompt, buildGeneratePrompt, buildTailorPrompt, buildScorePrompt } from "./lib/ai/prompts.js";
import { calculateAtsScore } from "./lib/ai/ats-score.js";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import type { Env } from "./db.js";

const app = new Hono<{ Bindings: Env; Variables: { auth: { user: { id: string } | null; session: unknown } } }>();

// CORS
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "https://openresume.dev"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    maxAge: 86400,
  })
);

// Health check
app.get("/health", (c) => c.json({ status: "ok" }));

// Mount better-auth
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});

// Resume routes
app.use("/api/resumes/*", authMiddleware);

app.get("/api/resumes", async (c) => {
  const auth = c.get("auth");
  if (!auth.user) return c.json({ error: "Unauthorized" }, 401);

  const db = getDb(c.env);
  const userResumes = await db.query.resumes.findMany({
    where: eq(resumes.userId, auth.user.id),
    orderBy: desc(resumes.updatedAt),
  });

  return c.json({ resumes: userResumes });
});

app.get("/api/resumes/:id", async (c) => {
  const auth = c.get("auth");
  if (!auth.user) return c.json({ error: "Unauthorized" }, 401);

  const db = getDb(c.env);
  const id = c.req.param("id");
  const resume = await db.query.resumes.findFirst({
    where: eq(resumes.id, id),
    with: {
      versions: {
        orderBy: desc(resumeVersions.createdAt),
        limit: 1,
      },
    },
  });

  if (!resume) return c.json({ error: "Not found" }, 404);
  if (resume.userId !== auth.user.id) return c.json({ error: "Forbidden" }, 403);

  return c.json({ resume });
});

app.post("/api/resumes", async (c) => {
  const auth = c.get("auth");
  if (!auth.user) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json();
  const parsed = createResumeSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid input", details: parsed.error.flatten() }, 400);
  }

  const db = getDb(c.env);
  const now = new Date();
  const resumeId = uuidv4();

  await db.insert(resumes).values({
    id: resumeId,
    userId: auth.user.id,
    title: parsed.data.title,
    templateId: parsed.data.templateId,
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(resumeVersions).values({
    id: uuidv4(),
    resumeId,
    contentJson: parsed.data.content,
    createdAt: now,
  });

  const resume = await db.query.resumes.findFirst({
    where: eq(resumes.id, resumeId),
  });

  return c.json({ resume }, 201);
});

app.patch("/api/resumes/:id", async (c) => {
  const auth = c.get("auth");
  if (!auth.user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = updateResumeSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid input", details: parsed.error.flatten() }, 400);
  }

  const db = getDb(c.env);
  const existing = await db.query.resumes.findFirst({
    where: eq(resumes.id, id),
  });

  if (!existing) return c.json({ error: "Not found" }, 404);
  if (existing.userId !== auth.user.id) return c.json({ error: "Forbidden" }, 403);

  const now = new Date();
  const updates: Partial<typeof resumes.$inferInsert> = {
    updatedAt: now,
  };
  if (parsed.data.title) updates.title = parsed.data.title;
  if (parsed.data.templateId) updates.templateId = parsed.data.templateId;

  await db.update(resumes).set(updates).where(eq(resumes.id, id));

  if (parsed.data.content) {
    await db.insert(resumeVersions).values({
      id: uuidv4(),
      resumeId: id,
      contentJson: parsed.data.content,
      createdAt: now,
    });
  }

  const resume = await db.query.resumes.findFirst({
    where: eq(resumes.id, id),
  });

  return c.json({ resume });
});

app.delete("/api/resumes/:id", async (c) => {
  const auth = c.get("auth");
  if (!auth.user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  const db = getDb(c.env);
  const existing = await db.query.resumes.findFirst({
    where: eq(resumes.id, id),
  });

  if (!existing) return c.json({ error: "Not found" }, 404);
  if (existing.userId !== auth.user.id) return c.json({ error: "Forbidden" }, 403);

  await db.delete(resumes).where(eq(resumes.id, id));

  return c.json({ deleted: true });
});

// AI routes — BYOK (Bring Your Own Key). The platform no longer provides a default key.
app.use("/api/ai/*", authMiddleware);

app.post("/api/ai/validate", async (c) => {
  const apiKey = extractByokKey(c.req.raw.headers);
  if (!apiKey) {
    return c.json({ error: "Missing API key", code: "byok_required" }, 400);
  }
  const ok = await validateByokKey(apiKey);
  if (!ok) {
    return c.json({ error: "Invalid API key", code: "byok_invalid" }, 401);
  }
  return c.json({ valid: true });
});

app.post("/api/ai/rewrite", async (c) => {
  const auth = c.get("auth");
  if (!auth.user) return c.json({ error: "Unauthorized" }, 401);

  const apiKey = extractByokKey(c.req.raw.headers);
  if (!apiKey) {
    return c.json({ error: "Add your Gemini API key to use AI features.", code: "byok_required" }, 402);
  }

  const body = await c.req.json();
  const { text, action, tone } = body;
  if (!text || !action) {
    return c.json({ error: "text and action are required" }, 400);
  }

  const systemPrompt =
    action === "improve"
      ? SYSTEM_PROMPTS.rewrite
      : action === "shorten"
      ? SYSTEM_PROMPTS.shorten
      : action === "expand"
      ? SYSTEM_PROMPTS.expand
      : action === "grammar"
      ? SYSTEM_PROMPTS.grammar
      : action === "tone"
      ? SYSTEM_PROMPTS.tone
      : SYSTEM_PROMPTS.rewrite;

  const prompt = buildRewritePrompt(action, text, tone);

  try {
    const { result } = await generateWithGemini({
      env: c.env,
      userId: auth.user.id,
      type: `rewrite:${action}`,
      apiKey,
      model: "gemini-2.5-flash",
      systemPrompt,
      prompt,
    });

    const parsed = parseJsonResponse<{ result: string; explanation?: string; changes?: string[] }>(result);
    return c.json({
      original: text,
      result: parsed?.result ?? result,
      explanation: parsed?.explanation,
      changes: parsed?.changes,
    });
  } catch (error) {
    console.error("AI rewrite error", error);
    return c.json({ error: "AI rewrite failed" }, 500);
  }
});

app.post("/api/ai/generate", async (c) => {
  const auth = c.get("auth");
  if (!auth.user) return c.json({ error: "Unauthorized" }, 401);

  const apiKey = extractByokKey(c.req.raw.headers);
  if (!apiKey) {
    return c.json({ error: "Add your Gemini API key to use AI features.", code: "byok_required" }, 402);
  }

  const body = await c.req.json();
  const { input, type } = body;
  if (!input || !type) {
    return c.json({ error: "input and type are required" }, 400);
  }

  try {
    const { result } = await generateWithGemini({
      env: c.env,
      userId: auth.user.id,
      type: `generate:${type}`,
      apiKey,
      model: "gemini-2.5-pro",
      systemPrompt: SYSTEM_PROMPTS.generate,
      prompt: buildGeneratePrompt(input, type),
    });

    const parsed = parseJsonResponse<Record<string, unknown>>(result);
    if (!parsed) {
      return c.json({ error: "Failed to parse AI response" }, 500);
    }

    const contentValidation = resumeContentSchema.safeParse(parsed);
    if (!contentValidation.success) {
      return c.json({ error: "AI response did not match resume schema", details: contentValidation.error.flatten() }, 500);
    }

    return c.json({ content: contentValidation.data });
  } catch (error) {
    console.error("AI generate error", error);
    return c.json({ error: "AI generation failed" }, 500);
  }
});

app.post("/api/ai/tailor", async (c) => {
  const auth = c.get("auth");
  if (!auth.user) return c.json({ error: "Unauthorized" }, 401);

  const apiKey = extractByokKey(c.req.raw.headers);
  if (!apiKey) {
    return c.json({ error: "Add your Gemini API key to use AI features.", code: "byok_required" }, 402);
  }

  const body = await c.req.json();
  const { content, jobDescription } = body;
  if (!content || !jobDescription) {
    return c.json({ error: "content and jobDescription are required" }, 400);
  }

  const contentValidation = resumeContentSchema.safeParse(content);
  if (!contentValidation.success) {
    return c.json({ error: "Invalid resume content", details: contentValidation.error.flatten() }, 400);
  }

  try {
    const { result } = await generateWithGemini({
      env: c.env,
      userId: auth.user.id,
      type: "tailor",
      apiKey,
      model: "gemini-2.5-pro",
      systemPrompt: SYSTEM_PROMPTS.tailor,
      prompt: buildTailorPrompt(contentValidation.data, jobDescription),
    });

    const parsed = parseJsonResponse<{
      content: Record<string, unknown>;
      matchScore: number;
      keywordCoverage: string[];
      missingSkills: string[];
      missingKeywords: string[];
      strengths: string[];
      weaknesses: string[];
      suggestions: string[];
    }>(result);

    if (!parsed) {
      return c.json({ error: "Failed to parse AI response" }, 500);
    }

    const tailoredContentValidation = resumeContentSchema.safeParse(parsed.content);
    if (!tailoredContentValidation.success) {
      return c.json({ error: "AI tailored content invalid", details: tailoredContentValidation.error.flatten() }, 500);
    }

    return c.json({
      content: tailoredContentValidation.data,
      matchScore: parsed.matchScore ?? 0,
      keywordCoverage: parsed.keywordCoverage ?? [],
      missingSkills: parsed.missingSkills ?? [],
      missingKeywords: parsed.missingKeywords ?? [],
      strengths: parsed.strengths ?? [],
      weaknesses: parsed.weaknesses ?? [],
      suggestions: parsed.suggestions ?? [],
    });
  } catch (error) {
    console.error("AI tailor error", error);
    return c.json({ error: "AI tailoring failed" }, 500);
  }
});

app.post("/api/ai/score", async (c) => {
  const auth = c.get("auth");
  if (!auth.user) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json();
  const { content, jobDescription } = body;
  if (!content) {
    return c.json({ error: "content is required" }, 400);
  }

  const contentValidation = resumeContentSchema.safeParse(content);
  if (!contentValidation.success) {
    return c.json({ error: "Invalid resume content", details: contentValidation.error.flatten() }, 400);
  }

  // Heuristic ATS score is free and works without a key
  const heuristicScore = calculateAtsScore(contentValidation.data, jobDescription);

  const apiKey = extractByokKey(c.req.raw.headers);
  if (!apiKey) {
    return c.json({
      ...heuristicScore,
      aiGenerated: false,
      byokRequired: true,
    });
  }

  try {
    const { result } = await generateWithGemini({
      env: c.env,
      userId: auth.user.id,
      type: "score",
      apiKey,
      model: "gemini-2.5-flash",
      systemPrompt: SYSTEM_PROMPTS.score,
      prompt: buildScorePrompt(contentValidation.data, jobDescription),
    });

    const parsed = parseJsonResponse<{
      score: number;
      breakdown: Record<string, number>;
      sections: Record<string, { score: number; feedback: string }>;
      strengths: string[];
      weaknesses: string[];
      missingKeywords: string[];
      suggestions: string[];
    }>(result);

    if (!parsed) {
      return c.json({ ...heuristicScore, aiGenerated: false });
    }

    return c.json({
      score: parsed.score ?? heuristicScore.score,
      breakdown: parsed.breakdown ?? {},
      sections: parsed.sections ?? heuristicScore.sections,
      strengths: parsed.strengths ?? [],
      weaknesses: parsed.weaknesses ?? [],
      missingKeywords: parsed.missingKeywords ?? [],
      suggestions: parsed.suggestions?.length ? parsed.suggestions : heuristicScore.suggestions,
      aiGenerated: true,
    });
  } catch (error) {
    console.error("AI score error", error);
    return c.json({ ...heuristicScore, aiGenerated: false });
  }
});

// Export routes (placeholders)
app.post("/api/export/pdf", async (c) => {
  return c.json({ jobId: "placeholder" });
});

app.get("/api/export/pdf/:jobId", async (c) => {
  return c.json({ status: "pending" });
});

export default app;
