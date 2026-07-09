"use client";

import { useByokStore } from "@/lib/ai/byok-store";
import { ByokSettings } from "./byok-settings";
import { Key, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ByokGateProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  variant?: "card" | "inline";
}

export function ByokGate({
  children,
  className,
  title = "Bring Your Own Key",
  description = "AI features on OpenResume are powered by Gemini. Add your own free API key from Google AI Studio to enable them. Your key stays in your browser.",
  variant = "card",
}: ByokGateProps) {
  const hasKey = Boolean(useByokStore((s) => s.geminiApiKey));

  if (hasKey) {
    return <>{children}</>;
  }

  if (variant === "inline") {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-start gap-2 p-3 border border-[#E65100]/30 bg-orange-50">
          <Key className="w-4 h-4 text-[#E65100] mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
              {title}
            </p>
            <p className="text-[9.5px] font-mono text-zinc-600 leading-relaxed">{description}</p>
          </div>
        </div>
        <ByokSettings compact />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white border border-[#1A1A1A] p-5 relative shadow-[2px_2px_0px_0px_#1A1A1A] space-y-4",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
        <Sparkles className="w-3.5 h-3.5 text-[#E65100]" />
        <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
          {title}
        </span>
      </div>
      <p className="text-[10px] font-mono text-zinc-600 leading-relaxed">{description}</p>
      <ByokSettings />
    </div>
  );
}
