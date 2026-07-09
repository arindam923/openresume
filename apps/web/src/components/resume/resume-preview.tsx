"use client";

import { useMemo } from "react";
import { getTemplate } from "@openresume/renderer/templates";
import type { ResumeContent } from "@openresume/schema";

interface ResumePreviewProps {
  content: ResumeContent;
  templateId: string;
  className?: string;
}

export function ResumePreview({ content, templateId, className }: ResumePreviewProps) {
  const template = useMemo(() => getTemplate(templateId), [templateId]);

  if (!template) {
    return (
      <div className={`bg-white flex items-center justify-center p-8 ${className}`}>
        <p className="text-slate-500">Template not found</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white shadow-lg ${className}`}
      style={{ fontFamily: template.defaultFont }}
      data-template={template.id}
    >
      {template.render({ content })}
    </div>
  );
}
