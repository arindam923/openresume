"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { authClient } from "@/lib/auth-client";

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  user: { id: string; name: string; email: string; image?: string | null; isAnonymous?: boolean } | null;
  session: { token: string; userId: string } | null;
  signInAnonymous: () => Promise<void>;
  signOut: () => Promise<void>;
  refetch: () => Promise<{
    session: { token: string; userId: string } | null;
    user: { id: string; name: string; email: string; image?: string | null; isAnonymous?: boolean } | null;
  } | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [sessionData, setSessionData] = useState<{
    session: AuthContextValue["session"] | null;
    user: AuthContextValue["user"] | null;
  }>({ session: null, user: null });
  const anonymousAttemptedRef = useRef(false);

  const fetchSession = useCallback(async () => {
    try {
      const { data, error } = await authClient.getSession();
      if (error) {
        console.error("Failed to fetch session", error);
        setSessionData({ session: null, user: null });
        return null;
      }
      const mapped = {
        session: data?.session
          ? { token: data.session.token, userId: data.session.userId }
          : null,
        user: data?.user
          ? {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              image: data.user.image,
              isAnonymous: (data.user as { isAnonymous?: boolean }).isAnonymous,
            }
          : null,
      };
      setSessionData(mapped);
      return mapped;
    } catch (error) {
      console.error("Failed to fetch session", error);
      setSessionData({ session: null, user: null });
      return null;
    }
  }, []);

  const signInAnonymous = useCallback(async (force = false) => {
    if (!force && anonymousAttemptedRef.current) return;
    anonymousAttemptedRef.current = true;
    try {
      const { error } = await authClient.signIn.anonymous();
      if (error) {
        // Already anonymous is a common, harmless race; don't log as error.
        if (error.message?.toLowerCase().includes("anonymous users cannot")) {
          console.warn("Anonymous sign-in skipped: already anonymous");
        } else {
          console.error("Anonymous sign-in failed", error);
        }
        return;
      }
      await fetchSession();
    } catch (error) {
      console.error("Anonymous sign-in failed", error);
    }
  }, [fetchSession]);

  const signOut = useCallback(async () => {
    try {
      await authClient.signOut();
      setSessionData({ session: null, user: null });
      // Sign in anonymously again for guest continuity
      anonymousAttemptedRef.current = false;
      await signInAnonymous(true);
    } catch (error) {
      console.error("Sign out failed", error);
    }
  }, [signInAnonymous]);

  useEffect(() => {
    let mounted = true;

    async function init() {
      setIsLoading(true);
      const session = await fetchSession();
      if (mounted && !session?.session) {
        await signInAnonymous();
      }
      if (mounted) {
        setIsLoading(false);
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [fetchSession, signInAnonymous]);

  const value: AuthContextValue = {
    isLoading,
    isAuthenticated: !!sessionData.session,
    isAnonymous: sessionData.user?.isAnonymous ?? false,
    user: sessionData.user,
    session: sessionData.session,
    signInAnonymous,
    signOut,
    refetch: fetchSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
