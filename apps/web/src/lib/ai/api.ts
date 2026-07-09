import type { ResumeContent } from "@openresume/schema";
import { BYOK_HEADER, useByokStore } from "./byok-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

class AiApiError extends Error {
  code: string;
  status: number;
  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function fetchWithCredentials(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const apiKey = useByokStore.getState().geminiApiKey;
  if (apiKey) {
    headers.set(BYOK_HEADER, apiKey);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new AiApiError(
      error.error || `HTTP ${response.status}`,
      error.code || "unknown",
      response.status
    );
  }

  return response.json();
}

export { AiApiError };

export const aiApi = {
  async rewrite(text: string, action: string, tone?: string) {
    return fetchWithCredentials("/api/ai/rewrite", {
      method: "POST",
      body: JSON.stringify({ text, action, tone }),
    });
  },

  async generate(input: string, type: "chat" | "questionnaire" | "github" | "portfolio") {
    return fetchWithCredentials("/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({ input, type }),
    }) as Promise<{ content: ResumeContent }>;
  },

  async tailor(content: ResumeContent, jobDescription: string) {
    return fetchWithCredentials("/api/ai/tailor", {
      method: "POST",
      body: JSON.stringify({ content, jobDescription }),
    }) as Promise<{
      content: ResumeContent;
      matchScore: number;
      missingSkills: string[];
      suggestions: string[];
    }>;
  },

  async score(content: ResumeContent, jobDescription?: string) {
    return fetchWithCredentials("/api/ai/score", {
      method: "POST",
      body: JSON.stringify({ content, jobDescription }),
    }) as Promise<{
      score: number;
      sections: Record<string, { score: number; feedback: string }>;
      suggestions: string[];
      aiGenerated: boolean;
    }>;
  },
};
