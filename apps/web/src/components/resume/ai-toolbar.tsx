"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AiApiError, aiApi } from "@/lib/ai/api";
import { useByokStore } from "@/lib/ai/byok-store";
import { Wand2, Scissors, Expand, SpellCheck, Palette, Loader2, Key } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiToolbarProps {
  text: string;
  onApply: (newText: string) => void;
  className?: string;
}

const actions = [
  { id: "improve", label: "Improve", icon: Wand2 },
  { id: "shorten", label: "Shorten", icon: Scissors },
  { id: "expand", label: "Expand", icon: Expand },
  { id: "grammar", label: "Grammar", icon: SpellCheck },
];

const tones = [
  { value: "professional", label: "Professional" },
  { value: "executive", label: "Executive" },
  { value: "creative", label: "Creative" },
  { value: "startup", label: "Startup" },
  { value: "academic", label: "Academic" },
  { value: "student", label: "Student" },
];

export function AiToolbar({ text, onApply, className }: AiToolbarProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState("professional");
  const [error, setError] = useState<string | null>(null);
  const hasKey = Boolean(useByokStore((s) => s.geminiApiKey));

  const handleAction = async (action: string) => {
    if (!text.trim() || isLoading) return;
    if (!hasKey) {
      setError("Add a Gemini API key in the AI panel to use AI features.");
      return;
    }
    setIsLoading(action);
    setError(null);
    try {
      const result = await aiApi.rewrite(text, action, action === "tone" ? selectedTone : undefined);
      onApply(result.result);
    } catch (e) {
      console.error("AI action failed", e);
      if (e instanceof AiApiError && e.code === "byok_required") {
        setError("Add a Gemini API key in the AI panel to use AI features.");
      } else {
        setError("AI action failed. Please try again.");
      }
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            onClick={() => handleAction(action.id)}
            disabled={!!isLoading}
            title={!hasKey ? "Add a Gemini API key to enable AI" : undefined}
          >
            {isLoading === action.id ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <action.icon className="w-3 h-3 mr-1" />
            )}
            {action.label}
          </Button>
        ))}

        <div className="flex items-center gap-1">
          <Palette className="w-3 h-3 text-slate-500" />
          <select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            className="h-7 text-xs border-slate-200 rounded bg-transparent focus:outline-none focus:ring-1 focus:ring-slate-950"
          >
            {tones.map((tone) => (
              <option key={tone.value} value={tone.value}>
                {tone.label}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            onClick={() => handleAction("tone")}
            disabled={!!isLoading}
            title={!hasKey ? "Add a Gemini API key to enable AI" : undefined}
          >
            {isLoading === "tone" ? <Loader2 className="w-3 h-3 animate-spin" /> : "Tone"}
          </Button>
        </div>

        {!hasKey ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono text-[#E65100] uppercase tracking-wider">
            <Key className="w-3 h-3" />
            BYOK
          </span>
        ) : null}
      </div>
      {error ? (
        <p className="text-[9px] font-mono text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
