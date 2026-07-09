import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { anonymous, emailOTP } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@openresume/db";
import type { Env } from "./db.js";

export type Auth = {
  handler: (request: Request) => Promise<Response>;
};

export function createAuth(env: Env): Auth {
  const db = drizzle(env.DB, { schema });

  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [
      "http://localhost:3000",
      "http://localhost:8787",
      "https://openresume.dev",
      "https://openresume.pages.dev",
    ],
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      anonymous({
        onLinkAccount: async ({ anonymousUser, newUser }) => {
          // TODO: migrate resumes and job descriptions from anonymous user to new user
          const anonId = (anonymousUser.user as { id: string }).id;
          const realId = (newUser.user as { id: string }).id;
          console.log("Linking anonymous user", anonId, "to", realId);
        },
      }),
      emailOTP({
        async sendVerificationOTP({ email, otp, type }) {
          // TODO: integrate with email provider (Resend, SendGrid, etc.)
          console.log(`Sending ${type} OTP to ${email}: ${otp}`);
        },
      }),
    ],
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
      apple: {
        clientId: env.APPLE_CLIENT_ID,
        clientSecret: env.APPLE_CLIENT_SECRET,
      },
    },
  }) as Auth;
}
