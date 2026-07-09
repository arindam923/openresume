import type { ResumeContent } from "@openresume/schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

interface CreateResumeInput {
  title: string;
  templateId: string;
  content: ResumeContent;
}

interface UpdateResumeInput {
  title?: string;
  templateId?: string;
  content?: ResumeContent;
}

export class ResumeApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchWithCredentials(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    console.error("API request failed", { path, status: response.status, error });
    throw new ResumeApiError(error.error || `HTTP ${response.status}`, response.status);
  }

  return response.json();
}

export const resumeApi = {
  async list() {
    return fetchWithCredentials("/api/resumes");
  },

  async get(id: string) {
    return fetchWithCredentials(`/api/resumes/${id}`);
  },

  async create(input: CreateResumeInput) {
    return fetchWithCredentials("/api/resumes", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async update(id: string, input: UpdateResumeInput) {
    return fetchWithCredentials(`/api/resumes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  async delete(id: string) {
    return fetchWithCredentials(`/api/resumes/${id}`, {
      method: "DELETE",
    });
  },
};
