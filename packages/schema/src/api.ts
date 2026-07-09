import { z } from "zod";
import { draftResumeContentSchema } from "./resume";

export const createResumeSchema = z.object({
  title: z.string().min(1),
  templateId: z.string().min(1),
  content: draftResumeContentSchema,
});

export const updateResumeSchema = z.object({
  title: z.string().min(1).optional(),
  templateId: z.string().min(1).optional(),
  content: draftResumeContentSchema.optional(),
});

export const aiRewriteSchema = z.object({
  text: z.string().min(1),
  action: z.enum(["improve", "shorten", "expand", "grammar", "tone"]),
  tone: z.enum(["professional", "executive", "creative", "startup", "academic", "student"]).optional(),
});

export const aiGenerateSchema = z.object({
  input: z.string().min(1),
  type: z.enum(["chat", "questionnaire", "github", "portfolio"]),
});

export const aiTailorSchema = z.object({
  resumeId: z.string().min(1),
  jobDescription: z.string().min(1),
});

export const aiScoreSchema = z.object({
  resumeId: z.string().min(1),
  jobDescription: z.string().optional(),
});

export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
export type AiRewriteInput = z.infer<typeof aiRewriteSchema>;
export type AiGenerateInput = z.infer<typeof aiGenerateSchema>;
export type AiTailorInput = z.infer<typeof aiTailorSchema>;
export type AiScoreInput = z.infer<typeof aiScoreSchema>;
