import { createMiddleware } from "hono/factory";
import { createAuth } from "./auth.js";
import type { Env } from "./db.js";

export interface AuthContext {
  user: { id: string; email: string; name: string; isAnonymous?: boolean } | null;
  session: { id: string; token: string; userId: string } | null;
}

export const authMiddleware = createMiddleware<{ Bindings: Env; Variables: { auth: AuthContext } }>(
  async (c, next) => {
    const auth = createAuth(c.env) as unknown as { api: { getSession: (opts: { headers: Headers }) => Promise<{ user?: { id: string; email: string; name: string; isAnonymous?: boolean }; session?: { id: string; token: string; userId: string } } | null> } };
    try {
      const result = await auth.api.getSession({ headers: c.req.raw.headers });
      c.set("auth", {
        user: result?.user
          ? {
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              isAnonymous: (result.user as { isAnonymous?: boolean }).isAnonymous,
            }
          : null,
        session: result?.session
          ? {
              id: result.session.id,
              token: result.session.token,
              userId: result.session.userId,
            }
          : null,
      });
    } catch (error) {
      console.error("Auth middleware error", error);
      c.set("auth", { user: null, session: null });
    }
    await next();
  }
);

export const requireAuth = createMiddleware<{ Bindings: Env; Variables: { auth: AuthContext } }>(
  async (c, next) => {
    const auth = c.get("auth");
    if (!auth.user || !auth.session) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    await next();
    return;
  }
);
