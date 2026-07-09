"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiApiError, aiApi } from "@/lib/ai/api";
import { useByokStore } from "@/lib/ai/byok-store";
import { useResumeStore } from "@/lib/resume/store";
import { ByokSettings } from "./byok-settings";
import { Key, Loader2, MessageSquare, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatResume() {
  const { setContent, setTitle } = useResumeStore();
  const hasKey = Boolean(useByokStore((s) => s.geminiApiKey));
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! Tell me about your work experience, skills, and what kind of job you're targeting. I'll build your resume.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (!hasKey) {
      setError("Add a Gemini API key below to start chatting.");
      return;
    }

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const conversation = [...messages, { role: "user" as const, content: userMessage }]
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n\n");

      const response = await aiApi.generate(conversation, "chat");
      setContent(response.content);
      if (response.content.personal.fullName) {
        setTitle(`${response.content.personal.fullName}'s Resume`);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I've updated your resume based on what you shared. Keep telling me more, or switch to the editor to refine details.",
        },
      ]);
    } catch (e) {
      console.error("Chat generation failed", e);
      if (e instanceof AiApiError && e.code === "byok_required") {
        setError("Add a Gemini API key below to start chatting.");
      } else {
        setError("Sorry, I couldn't generate a resume right now. Please try again.");
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't generate a resume right now. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col h-[400px]">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-slate-700" />
        <h3 className="font-semibold">Chat to Build Resume</h3>
        {!hasKey ? (
          <span className="ml-auto inline-flex items-center gap-1 text-[9px] font-mono text-[#E65100] uppercase tracking-wider">
            <Key className="w-3 h-3" />
            BYOK
          </span>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg text-sm ${
              message.role === "user" ? "bg-slate-900 text-white ml-8" : "bg-slate-100 text-slate-800 mr-8"
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="bg-slate-100 text-slate-800 mr-8 p-3 rounded-lg text-sm flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Building resume...
          </div>
        )}
      </div>

      {error ? <p className="text-[9px] font-mono text-red-600 mb-2">{error}</p> : null}

      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={hasKey ? "I've worked as a React developer for 4 years..." : "Add a Gemini API key below to start chatting..."}
          rows={2}
          className="flex-1 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend} disabled={isLoading || !input.trim() || !hasKey} className="self-end">
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {!hasKey ? (
        <div className="mt-3 pt-3 border-t border-dashed border-zinc-200">
          <ByokSettings compact />
        </div>
      ) : null}
    </div>
  );
}
