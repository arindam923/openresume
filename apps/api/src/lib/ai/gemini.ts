import { GoogleGenAI } from "@google/genai";
import type { Env } from "../../db.js";
import { getDb } from "../../db.js";
import { aiRequests } from "@openresume/db";

export type AiModel = "gemini-2.5-flash" | "gemini-2.5-pro";

// Approximate costs per 1M tokens (USD) — update as Gemini pricing changes
const COST_PER_MTOKENS: Record<AiModel, { input: number; output: number }> = {
  "gemini-2.5-flash": { input: 0.15, output: 0.6 },
  "gemini-2.5-pro": { input: 1.25, output: 10.0 },
};

export const BYOK_HEADER = "x-byok-key";

export function extractByokKey(headers: Headers): string | null {
  const key = headers.get(BYOK_HEADER);
  return key && key.trim() ? key.trim() : null;
}

export function createGeminiClient(apiKey: string) {
  return new GoogleGenAI({ apiKey });
}

interface GenerateOptions {
  env: Env;
  userId: string;
  type: string;
  apiKey: string;
  model?: AiModel;
  systemPrompt: string;
  prompt: string;
  jsonMode?: boolean;
}

export async function generateWithGemini({
  env,
  userId,
  type,
  apiKey,
  model = "gemini-2.5-flash",
  systemPrompt,
  prompt,
  jsonMode = true,
}: GenerateOptions): Promise<{ result: string; costUsd: number; latencyMs: number }> {
  const client = createGeminiClient(apiKey);
  const start = Date.now();

  const response = await client.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: jsonMode ? "application/json" : "text/plain",
      temperature: 0.3,
    },
  });

  const latencyMs = Date.now() - start;
  const text = response.text ?? "";

  const usage = response.usageMetadata;
  const tokensIn = usage?.promptTokenCount ?? 0;
  const tokensOut = usage?.candidatesTokenCount ?? 0;
  const costUsd =
    (tokensIn / 1_000_000) * COST_PER_MTOKENS[model].input +
    (tokensOut / 1_000_000) * COST_PER_MTOKENS[model].output;

  // Track usage (best-effort, never block the response)
  try {
    const db = getDb(env);
    await db.insert(aiRequests).values({
      id: crypto.randomUUID(),
      userId,
      type: `byok:${type}`,
      model,
      tokensIn,
      tokensOut,
      costUsd,
      latencyMs,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to track AI request", error);
  }

  return { result: text, costUsd, latencyMs };
}

export async function validateByokKey(apiKey: string): Promise<boolean> {
  if (!apiKey || !apiKey.startsWith("AIza") || apiKey.length < 30) {
    return false;
  }
  try {
    const client = createGeminiClient(apiKey);
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "ping",
      config: { maxOutputTokens: 1, temperature: 0 },
    });
    return Boolean(response.text !== undefined || response.candidates !== undefined);
  } catch (error) {
    console.error("BYOK validation failed", error);
    return false;
  }
}

export function parseJsonResponse<T>(text: string): T | null {
  try {
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonText = codeBlockMatch ? codeBlockMatch[1].trim() : text.trim();
    return JSON.parse(jsonText) as T;
  } catch {
    return null;
  }
}
