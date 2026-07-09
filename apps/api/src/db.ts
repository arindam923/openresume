import { drizzle } from "drizzle-orm/d1";
import * as schema from "@openresume/db";

export type Env = {
  DB: D1Database;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  APPLE_CLIENT_ID: string;
  APPLE_CLIENT_SECRET: string;
  // AI is BYOK-only now; this env key is kept optional for any non-user
  // internal use (e.g. background jobs) but the AI routes no longer fall
  // back to it.
  GEMINI_API_KEY?: string;
};

export function getDb(env: Env) {
  return drizzle(env.DB, { schema });
}
