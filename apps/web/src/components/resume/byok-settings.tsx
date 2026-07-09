"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  isLikelyValidGeminiKey,
  maskKey,
  useByokStore,
} from "@/lib/ai/byok-store";
import { Check, ExternalLink, Eye, EyeOff, Key, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ByokSettingsProps {
  className?: string;
  compact?: boolean;
  onSaved?: () => void;
}

export function ByokSettings({ className, compact = false, onSaved }: ByokSettingsProps) {
  const { geminiApiKey, setGeminiApiKey, clear } = useByokStore();
  const [draft, setDraft] = useState("");
  const [reveal, setReveal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validated, setValidated] = useState(false);

  const startEdit = () => {
    setDraft(geminiApiKey ?? "");
    setError(null);
    setValidated(false);
    setIsEditing(true);
  };

  const cancel = () => {
    setDraft("");
    setError(null);
    setValidated(false);
    setIsEditing(false);
    setReveal(false);
  };

  const save = async () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setError("Enter a key to continue");
      return;
    }
    if (!isLikelyValidGeminiKey(trimmed)) {
      setError("That doesn't look like a Gemini API key. They start with 'AIza'.");
      return;
    }
    setIsValidating(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}/api/ai/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-byok-key": trimmed },
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "API key validation failed");
      }
      setGeminiApiKey(trimmed);
      setValidated(true);
      setIsEditing(false);
      setDraft("");
      setReveal(false);
      onSaved?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not validate key");
    } finally {
      setIsValidating(false);
    }
  };

  const remove = () => {
    clear();
    setIsEditing(false);
    setDraft("");
    setReveal(false);
    setValidated(false);
    setError(null);
  };

  const hasKey = Boolean(geminiApiKey);

  if (compact) {
    return (
      <div className={cn("space-y-2", className)}>
        {hasKey && !isEditing ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 border border-emerald-200 uppercase tracking-wider">
              <Check className="w-3 h-3" />
              AI Key Active
            </div>
            <button
              type="button"
              onClick={remove}
              className="text-[9px] font-mono text-zinc-500 hover:text-red-600 underline uppercase tracking-wider"
            >
              Remove
            </button>
          </div>
        ) : null}
        {isEditing ? (
          <div className="space-y-1.5">
            <Input
              type={reveal ? "text" : "password"}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="AIzaSy..."
              className="h-8 text-xs font-mono"
              autoComplete="off"
              spellCheck={false}
            />
            {error ? (
              <p className="text-[9px] font-mono text-red-600">{error}</p>
            ) : null}
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                onClick={save}
                disabled={isValidating || !draft.trim()}
                className="h-7 text-[9px] font-mono font-bold uppercase rounded-none"
              >
                {isValidating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={cancel}
                className="h-7 text-[9px] font-mono font-bold uppercase rounded-none"
              >
                Cancel
              </Button>
              <button
                type="button"
                onClick={() => setReveal((v) => !v)}
                className="text-[9px] font-mono text-zinc-500 hover:text-[#1A1A1A] uppercase tracking-wider"
              >
                {reveal ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        ) : !hasKey ? (
          <Button
            variant="outline"
            size="sm"
            onClick={startEdit}
            className="h-7 text-[9px] font-mono font-bold uppercase rounded-none"
          >
            <Key className="w-3 h-3 mr-1" />
            Add Gemini API Key
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white border border-[#1A1A1A] p-4 relative shadow-[2px_2px_0px_0px_#1A1A1A]",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 mb-3">
        <Key className="w-3.5 h-3.5 text-[#E65100]" />
        <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
          Gemini API Key
        </span>
        {hasKey ? (
          <span className="ml-auto text-[8.5px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 inline-flex items-center gap-1">
            <Check className="w-2.5 h-2.5" />
            Active
          </span>
        ) : null}
      </div>

      {hasKey && !isEditing ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-[#FAF9F5] border border-zinc-200 px-2.5 py-1.5">
            <span className="text-[10px] font-mono text-[#1A1A1A] flex-1 truncate">
              {reveal ? geminiApiKey : maskKey(geminiApiKey ?? "")}
            </span>
            <button
              type="button"
              onClick={() => setReveal((v) => !v)}
              className="text-zinc-500 hover:text-[#1A1A1A]"
              title={reveal ? "Hide key" : "Reveal key"}
            >
              {reveal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={startEdit}
              className="h-7 text-[9px] font-mono font-bold uppercase rounded-none"
            >
              Replace
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={remove}
              className="h-7 text-[9px] font-mono font-bold uppercase rounded-none text-zinc-500 hover:text-red-600"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Input
            type={reveal ? "text" : "password"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="AIzaSy..."
            className="h-8 text-xs font-mono"
            autoComplete="off"
            spellCheck={false}
          />
          {error ? (
            <p className="text-[9px] font-mono text-red-600">{error}</p>
          ) : null}
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              onClick={save}
              disabled={isValidating || !draft.trim()}
              className="h-7 text-[9px] font-mono font-bold uppercase rounded-none bg-[#1A1A1A] text-white hover:bg-[#E65100]"
            >
              {isValidating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
              {isValidating ? "Validating..." : "Save Key"}
            </Button>
            {isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={cancel}
                className="h-7 text-[9px] font-mono font-bold uppercase rounded-none"
              >
                Cancel
              </Button>
            ) : null}
            <button
              type="button"
              onClick={() => setReveal((v) => !v)}
              className="text-[9px] font-mono text-zinc-500 hover:text-[#1A1A1A] uppercase tracking-wider ml-auto"
            >
              {reveal ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      )}

      <a
        href="https://aistudio.google.com/apikey"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-[9px] font-mono text-zinc-500 hover:text-[#1A1A1A] underline uppercase tracking-wider"
      >
        Get a free key from Google AI Studio
        <ExternalLink className="w-3 h-3" />
      </a>
      <p className="mt-2 text-[9px] font-mono text-zinc-500 leading-relaxed">
        Your key is stored only in this browser. It never leaves your device unless you make an AI request, and we never log it.
      </p>
    </div>
  );
}
