"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";

// Crop corners for technical layout drawing look
const CropCorners = () => (
  <>
    <span className="absolute top-1.5 left-1.5 text-[11px] text-zinc-400 font-mono select-none pointer-events-none leading-none">┌</span>
    <span className="absolute top-1.5 right-1.5 text-[11px] text-zinc-400 font-mono select-none pointer-events-none leading-none">┐</span>
    <span className="absolute bottom-1.5 left-1.5 text-[11px] text-zinc-400 font-mono select-none pointer-events-none leading-none">└</span>
    <span className="absolute bottom-1.5 right-1.5 text-[11px] text-zinc-400 font-mono select-none pointer-events-none leading-none">┘</span>
  </>
);

// Technical drafting ruler lines
const TechRuler = () => (
  <div className="w-full h-3 border-b border-zinc-950/10 relative flex items-end select-none pointer-events-none bg-white/20 my-4">
    <div className="absolute inset-x-0 bottom-0 h-2 ruler-ticks-h opacity-25" />
    <div className="absolute inset-x-0 bottom-0 h-1 ruler-ticks-h-sub opacity-20" />
  </div>
);

export default function SignInPage() {
  const { user, isAnonymous, isLoading: authLoading, refetch, signInAnonymous, signOut } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (mode === "signin") {
        await authClient.signIn.email({
          email,
          password,
        });
      } else {
        if (!name.trim()) {
          throw new Error("Name is required for sign-up.");
        }
        await authClient.signUp.email({
          email,
          password,
          name: name.trim(),
        });
      }
      await refetch();
      router.push("/builder");
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setIsLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/builder`,
      });
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}.`);
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user || !isAnonymous) {
        await signInAnonymous();
      }
      router.push("/builder");
    } catch (err: any) {
      setError(err.message || "Failed to continue as guest.");
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1A1A1A] selection:bg-[#E65100] selection:text-white bg-grid-drafting items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-[#1A1A1A] transition-colors uppercase tracking-wider mb-6 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back to Home
        </Link>

        {/* Auth Card Container */}
        <div className="border border-[#1A1A1A] bg-white p-6 md:p-8 relative shadow-[4px_4px_0px_0px_#1A1A1A]">
          <CropCorners />

          {/* Logo & Subtitle */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border border-[#1A1A1A] bg-[#1A1A1A] text-white flex items-center justify-center font-mono text-[10px] font-bold shadow-[1px_1px_0px_0px_#E65100]">
                O
              </div>
              <span className="text-[11px] font-mono font-bold tracking-tight text-[#1A1A1A] uppercase">
                OpenResume Auth
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#1A1A1A] font-sans pt-2">
              {mode === "signin" ? "Access Workspace" : "Create Technical Account"}
            </h2>
            <p className="text-[10px] font-mono text-zinc-500">
              {mode === "signin"
                ? "Sign in to compile, manage, and scale your resumes."
                : "Register credentials to persist designs across devices."}
            </p>
          </div>

          <TechRuler />

          {/* User Status (if already logged in as full user) */}
          {user && !isAnonymous && (
            <div className="mb-6 p-4 border border-[#E65100] bg-orange-50/50 space-y-3">
              <p className="text-[11px] font-mono text-[#1A1A1A]">
                You are currently authenticated as <span className="font-bold text-[#E65100]">{user.email}</span>.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push("/builder")}
                  className="flex-1 border border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-zinc-800 rounded-none shadow-[2px_2px_0px_0px_#E65100] font-mono text-[9.5px] font-bold uppercase tracking-wider h-8 cursor-pointer"
                >
                  Go to Builder
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    setIsLoading(true);
                    await signOut();
                    setIsLoading(false);
                  }}
                  className="flex-1 border border-[#1A1A1A] bg-white hover:bg-zinc-50 rounded-none shadow-[2px_2px_0px_0px_#1A1A1A] font-mono text-[9.5px] font-bold uppercase tracking-wider h-8 cursor-pointer"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-[10.5px] font-mono uppercase tracking-wide">
              {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => handleSocialSignIn("github")}
              disabled={isLoading || authLoading}
              className="flex items-center justify-center gap-2 py-2 px-3 border border-[#1A1A1A] bg-white hover:bg-zinc-50 hover:translate-y-[-1px] active:translate-y-[0px] font-mono text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-[2px_2px_0px_0px_#1A1A1A]"
            >
              <svg className="w-3.5 h-3.5 fill-[#1A1A1A]" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </button>
            <button
              onClick={() => handleSocialSignIn("google")}
              disabled={isLoading || authLoading}
              className="flex items-center justify-center gap-2 py-2 px-3 border border-[#1A1A1A] bg-white hover:bg-zinc-50 hover:translate-y-[-1px] active:translate-y-[0px] font-mono text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-[2px_2px_0px_0px_#1A1A1A]"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.015c1.614 0 3.08.64 4.168 1.678l3.125-3.125C19.28 3.122 16.32 1.65 13.99 1.65 8.275 1.65 3.65 6.275 3.65 12s4.625 10.35 10.34 10.35c5.96 0 10.015-4.19 10.015-10.185 0-.687-.06-1.353-.175-1.88H12.24z" />
              </svg>
              Google
            </button>
          </div>

          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <span className="relative bg-white px-3 font-mono text-[9px] text-zinc-400 uppercase tracking-widest">
              or database sign in
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1">
                <Label htmlFor="name" className="text-[10px] font-mono uppercase tracking-wider text-zinc-600">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="email" className="text-[10px] font-mono uppercase tracking-wider text-zinc-600">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-[10px] font-mono uppercase tracking-wider text-zinc-600">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || authLoading}
              className="w-full border border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-zinc-800 rounded-none shadow-[2px_2px_0px_0px_#E65100] hover:translate-y-[-1px] active:translate-y-[0px] transition-all font-mono text-[10px] font-bold uppercase tracking-wider h-9 cursor-pointer mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-1.5 justify-center">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing
                </span>
              ) : mode === "signin" ? (
                "Authenticate Account"
              ) : (
                "Register Account"
              )}
            </Button>
          </form>

          {/* Form Mode Toggle */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
              }}
              disabled={isLoading}
              className="font-mono text-[10px] text-[#E65100] hover:underline uppercase tracking-wide cursor-pointer"
            >
              {mode === "signin"
                ? "Need an account? Sign Up instead"
                : "Already registered? Sign In instead"}
            </button>
          </div>

          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <span className="relative bg-white px-3 font-mono text-[9px] text-zinc-400 uppercase tracking-widest">
              or bypass credentials
            </span>
          </div>

          {/* Anonymous Guest Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGuestSignIn}
            disabled={isLoading || authLoading}
            className="w-full border border-[#1A1A1A] bg-[#FAF9F5] text-[#1A1A1A] hover:bg-white rounded-none shadow-[2px_2px_0px_0px_#1A1A1A] hover:translate-y-[-1px] active:translate-y-[0px] transition-all font-mono text-[10px] font-bold uppercase tracking-wider h-9 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E65100] mr-1.5" />
            Continue as Guest (Anonymous)
          </Button>
        </div>
      </div>
    </div>
  );
}
