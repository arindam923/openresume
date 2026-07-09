"use client";

import { useMemo } from "react";
import type { ResumeContent } from "@openresume/schema";
import { resumeToPlainText } from "@/lib/resume/ats-text";

interface AtsPreviewProps {
  content: ResumeContent;
  className?: string;
}

export function AtsPreview({ content, className }: AtsPreviewProps) {
  const plainText = useMemo(() => resumeToPlainText(content), [content]);

  return (
    <div className={`bg-slate-50 border border-slate-200 rounded-lg overflow-hidden ${className}`}>
      <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700">ATS Plain Text Preview</h3>
      </div>
      <pre className="p-4 text-sm font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
        {plainText}
      </pre>
    </div>
  );
}
