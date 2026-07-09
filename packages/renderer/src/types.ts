import type { ResumeContent, TemplateConfig } from "@openresume/schema";
import type { ReactNode } from "react";

export interface ResumeTemplateProps {
  content: ResumeContent;
  config?: TemplateConfig;
}

export type TemplateCategory =
  | "modern"
  | "minimal"
  | "faang"
  | "startup"
  | "academic"
  | "student";

export interface TemplateDefinition {
  id: string;
  name: string;
  category: TemplateCategory;
  description?: string;
  atsScore: number;
  supportsPhoto: boolean;
  defaultFont: string;
  render: (props: ResumeTemplateProps) => ReactNode;
}
