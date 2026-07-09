"use client";

import { useEffect, useState } from "react";
import { AiApiError, aiApi } from "@/lib/ai/api";
import { useByokStore } from "@/lib/ai/byok-store";
import type { ResumeContent } from "@openresume/schema";
import { Key, Loader2, Sparkles, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface AtsScoreProps {
  content: ResumeContent;
  jobDescription?: string;
  className?: string;
}

export function AtsScore({ content, jobDescription, className }: AtsScoreProps) {
  const [score, setScore] = useState<number | null>(null);
  const [sections, setSections] = useState<Record<string, { score: number; feedback: string }> | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasKey = Boolean(useByokStore((s) => s.geminiApiKey));

  useEffect(() => {
    let cancelled = false;

    async function loadScore() {
      setIsLoading(true);
      setError(null);
      setNeedsKey(false);
      try {
        const result = await aiApi.score(content, jobDescription);
        if (!cancelled) {
          setScore(result.score);
          setSections(result.sections);
          setSuggestions(result.suggestions);
          setAiGenerated(Boolean(result.aiGenerated));
        }
      } catch (e) {
        console.error("Failed to load ATS score", e);
        if (!cancelled) {
          if (e instanceof AiApiError && e.code === "byok_required") {
            setNeedsKey(true);
          } else {
            setError("Could not load AI score. Showing heuristic only.");
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    const timeout = setTimeout(loadScore, 1000);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [content, jobDescription, hasKey]);

  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className={cn("bg-white border border-slate-200 rounded-xl p-4", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-slate-700" />
        <h3 className="font-semibold">ATS Score</h3>
        {aiGenerated ? (
          <span className="ml-auto inline-flex items-center gap-1 text-[9px] font-mono text-[#E65100] bg-orange-50 px-1.5 py-0.5 border border-orange-200 uppercase tracking-wider">
            <Sparkles className="w-2.5 h-2.5" />
            AI
          </span>
        ) : null}
        {!aiGenerated && score !== null ? (
          <span className="ml-auto text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Heuristic</span>
        ) : null}
      </div>

      {isLoading || score === null ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center py-4">
            <div className={cn("text-5xl font-bold", getScoreColor(score))}>{score}</div>
            <span className="text-slate-400 text-lg ml-1">/100</span>
          </div>

          {sections && (
            <div className="space-y-2 mb-4">
              {Object.entries(sections).map(([name, data]) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="capitalize text-slate-700">{name}</span>
                    <span className={getScoreColor(data.score)}>{data.score}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        data.score >= 80 ? "bg-green-500" : data.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                      )}
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {(needsKey || (!aiGenerated && !hasKey)) ? (
            <div className="mb-3 p-2.5 border border-[#E65100]/30 bg-orange-50 flex items-start gap-2">
              <Key className="w-3.5 h-3.5 text-[#E65100] mt-0.5 shrink-0" />
              <p className="text-[9.5px] font-mono text-zinc-700 leading-relaxed">
                Add your Gemini API key in the AI panel for a deeper AI-powered score with personalized suggestions.
              </p>
            </div>
          ) : null}

          {error ? <p className="text-[9px] font-mono text-red-600 mb-2">{error}</p> : null}

          {suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Suggestions</h4>
              <ul className="space-y-1">
                {suggestions.slice(0, 5).map((suggestion, index) => (
                  <li key={index} className="text-xs text-slate-600 flex gap-2">
                    <span className="text-slate-400">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
