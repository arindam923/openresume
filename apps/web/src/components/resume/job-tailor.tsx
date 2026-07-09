"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiApiError, aiApi } from "@/lib/ai/api";
import { useByokStore } from "@/lib/ai/byok-store";
import { useResumeStore } from "@/lib/resume/store";
import { ByokSettings } from "./byok-settings";
import { Briefcase, Key, Loader2, Wand2 } from "lucide-react";

export function JobTailor() {
  const { content, setContent } = useResumeStore();
  const hasKey = Boolean(useByokStore((s) => s.geminiApiKey));
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    matchScore: number;
    missingSkills: string[];
    suggestions: string[];
  } | null>(null);

  const handleTailor = async () => {
    if (!jobDescription.trim()) return;
    if (!hasKey) {
      setError("Add a Gemini API key below to enable tailoring.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await aiApi.tailor(content, jobDescription);
      setContent(response.content);
      setResult({
        matchScore: response.matchScore,
        missingSkills: response.missingSkills,
        suggestions: response.suggestions,
      });
    } catch (e) {
      console.error("Tailoring failed", e);
      if (e instanceof AiApiError && e.code === "byok_required") {
        setError("Add a Gemini API key below to enable tailoring.");
      } else {
        setError("Tailoring failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="w-5 h-5 text-slate-700" />
        <h3 className="font-semibold">Job Tailoring</h3>
        {!hasKey ? (
          <span className="ml-auto inline-flex items-center gap-1 text-[9px] font-mono text-[#E65100] uppercase tracking-wider">
            <Key className="w-3 h-3" />
            BYOK
          </span>
        ) : null}
      </div>

      <Textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the job description here..."
        rows={6}
        className="mb-3"
      />

      <Button
        onClick={handleTailor}
        disabled={isLoading || !jobDescription.trim()}
        className="w-full"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Wand2 className="w-4 h-4 mr-2" />
        )}
        Tailor Resume to Job
      </Button>

      {error ? <p className="mt-2 text-[9px] font-mono text-red-600">{error}</p> : null}

      {!hasKey ? (
        <div className="mt-4 pt-4 border-t border-dashed border-zinc-200">
          <ByokSettings compact />
        </div>
      ) : null}

      {result && (
        <div className="mt-4 space-y-3">
          <div className="text-center">
            <span className="text-sm text-slate-500">Match Score</span>
            <div className="text-3xl font-bold text-slate-900">{result.matchScore}%</div>
          </div>

          {result.missingSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Missing Skills</h4>
              <div className="flex flex-wrap gap-1">
                {result.missingSkills.map((skill, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Suggestions</h4>
              <ul className="space-y-1">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-xs text-slate-600">• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
