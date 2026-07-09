import { Fragment, type ReactNode } from "react";
import { RESUME_SECTIONS, SECTION_LABELS, type ResumeContent, type ResumeSectionId } from "@openresume/schema";

export { RESUME_SECTIONS, SECTION_LABELS };
export type { ResumeSectionId };

export const DEFAULT_SECTION_ORDER: ResumeSectionId[] = [
  "personal",
  "experience",
  "education",
  "projects",
  "skills",
  "certifications",
  "awards",
  "languages",
];

export const DEFAULT_SECTION_VISIBILITY: Record<ResumeSectionId, boolean> = {
  personal: true,
  experience: true,
  education: true,
  projects: true,
  skills: true,
  certifications: true,
  awards: true,
  languages: true,
};

export const DEFAULT_FONT_SIZE = 10;

export interface SectionDescriptor {
  id: ResumeSectionId;
  label: string;
  hasContent: (content: ResumeContent) => boolean;
}

export const SECTION_DESCRIPTORS: SectionDescriptor[] = [
  {
    id: "personal",
    label: SECTION_LABELS.personal,
    hasContent: (c) => Boolean(c.personal?.fullName || c.personal?.email),
  },
  {
    id: "experience",
    label: SECTION_LABELS.experience,
    hasContent: (c) => c.experience.length > 0,
  },
  {
    id: "education",
    label: SECTION_LABELS.education,
    hasContent: (c) => c.education.length > 0,
  },
  {
    id: "projects",
    label: SECTION_LABELS.projects,
    hasContent: (c) => c.projects.length > 0,
  },
  {
    id: "skills",
    label: SECTION_LABELS.skills,
    hasContent: (c) => c.skills.length > 0,
  },
  {
    id: "certifications",
    label: SECTION_LABELS.certifications,
    hasContent: (c) => c.certifications.length > 0,
  },
  {
    id: "awards",
    label: SECTION_LABELS.awards,
    hasContent: (c) => c.awards.length > 0,
  },
  {
    id: "languages",
    label: SECTION_LABELS.languages,
    hasContent: (c) => c.languages.length > 0,
  },
];

export function getEffectiveSectionOrder(content: ResumeContent): ResumeSectionId[] {
  const declared = content.sectionOrder?.filter((s): s is ResumeSectionId =>
    (RESUME_SECTIONS as readonly string[]).includes(s)
  );
  const base = declared && declared.length === RESUME_SECTIONS.length ? declared : DEFAULT_SECTION_ORDER;
  return base;
}

export function getEffectiveSectionVisibility(
  content: ResumeContent
): Record<ResumeSectionId, boolean> {
  const declared = content.sectionVisibility;
  const next: Record<ResumeSectionId, boolean> = { ...DEFAULT_SECTION_VISIBILITY };
  if (declared) {
    for (const id of RESUME_SECTIONS) {
      if (typeof declared[id] === "boolean") next[id] = declared[id];
    }
  }
  return next;
}

export function isSectionVisible(
  content: ResumeContent,
  id: ResumeSectionId
): boolean {
  return getEffectiveSectionVisibility(content)[id];
}

export function getEffectiveFontSize(content: ResumeContent): number {
  return content.fontSize ?? DEFAULT_FONT_SIZE;
}

export interface SectionRenderers {
  personal?: () => ReactNode;
  experience?: () => ReactNode;
  education?: () => ReactNode;
  projects?: () => ReactNode;
  skills?: () => ReactNode;
  certifications?: () => ReactNode;
  awards?: () => ReactNode;
  languages?: () => ReactNode;
}

export interface OrderedSectionsProps {
  content: ResumeContent;
  renderers: SectionRenderers;
  hideEmpty?: boolean;
}

export function OrderedSections({ content, renderers, hideEmpty = true }: OrderedSectionsProps) {
  const order = getEffectiveSectionOrder(content);
  const visibility = getEffectiveSectionVisibility(content);
  const hasContent = SECTION_DESCRIPTORS.reduce<Record<ResumeSectionId, boolean>>(
    (acc, d) => {
      acc[d.id] = d.hasContent(content);
      return acc;
    },
    {
      personal: true,
      experience: false,
      education: false,
      projects: false,
      skills: false,
      certifications: false,
      awards: false,
      languages: false,
    }
  );

  return (
    <>
      {order.map((id) => {
        if (!visibility[id]) return null;
        if (hideEmpty && !hasContent[id]) return null;
        const render = renderers[id];
        if (!render) return null;
        return <Fragment key={id}>{render()}</Fragment>;
      })}
    </>
  );
}

