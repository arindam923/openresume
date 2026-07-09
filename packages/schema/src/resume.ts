import { z } from "zod";

export const RESUME_SECTIONS = [
  "personal",
  "experience",
  "education",
  "projects",
  "skills",
  "certifications",
  "awards",
  "languages",
] as const;

export type ResumeSectionId = (typeof RESUME_SECTIONS)[number];

export const SECTION_LABELS: Record<ResumeSectionId, string> = {
  personal: "Personal Info",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  certifications: "Certifications",
  awards: "Awards",
  languages: "Languages",
};

export const personalSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  summary: z.string().optional(),
});

export const experienceItemSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  highlights: z.array(z.string()).default([]),
});

export const educationItemSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
});

export const projectItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  url: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  highlights: z.array(z.string()).default([]),
});

export const skillItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Skill is required"),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
});

export const certificationItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().optional(),
  date: z.string().optional(),
  url: z.string().optional(),
});

export const awardItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Award title is required"),
  issuer: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
});

export const languageItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Language is required"),
  proficiency: z.enum(["elementary", "limited", "professional", "fluent", "native"]).optional(),
});

export const customSectionItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Section title is required"),
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(1, "Item title is required"),
      description: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
  ).default([]),
});

export const resumeSectionOrderSchema = z.array(z.enum(RESUME_SECTIONS)).optional();
export const resumeSectionVisibilitySchema = z
  .record(z.enum(RESUME_SECTIONS), z.boolean())
  .optional();
export const resumeFontSizeSchema = z.number().min(8).max(16).optional();

export const resumeContentSchema = z.object({
  personal: personalSchema,
  experience: z.array(experienceItemSchema).default([]),
  education: z.array(educationItemSchema).default([]),
  projects: z.array(projectItemSchema).default([]),
  skills: z.array(skillItemSchema).default([]),
  certifications: z.array(certificationItemSchema).default([]),
  awards: z.array(awardItemSchema).default([]),
  languages: z.array(languageItemSchema).default([]),
  customSections: z.array(customSectionItemSchema).default([]),
  sectionOrder: resumeSectionOrderSchema,
  sectionVisibility: resumeSectionVisibilitySchema,
  fontSize: resumeFontSizeSchema,
});

// Draft variant used for saving in-progress resumes. It relaxes required
// string length/email checks so users can save partial work without the API
// rejecting incomplete items.
export const draftPersonalSchema = personalSchema.extend({
  fullName: z.string().default(""),
  email: z.string().default(""),
});

export const draftExperienceItemSchema = experienceItemSchema.extend({
  id: z.string().default(""),
  company: z.string().default(""),
  role: z.string().default(""),
});

export const draftEducationItemSchema = educationItemSchema.extend({
  id: z.string().default(""),
  institution: z.string().default(""),
  degree: z.string().default(""),
});

export const draftProjectItemSchema = projectItemSchema.extend({
  id: z.string().default(""),
  name: z.string().default(""),
});

export const draftSkillItemSchema = skillItemSchema.extend({
  id: z.string().default(""),
  name: z.string().default(""),
});

export const draftCertificationItemSchema = certificationItemSchema.extend({
  id: z.string().default(""),
  name: z.string().default(""),
});

export const draftAwardItemSchema = awardItemSchema.extend({
  id: z.string().default(""),
  title: z.string().default(""),
});

export const draftLanguageItemSchema = languageItemSchema.extend({
  id: z.string().default(""),
  name: z.string().default(""),
});

export const draftCustomSectionItemSchema = customSectionItemSchema.extend({
  id: z.string().default(""),
  title: z.string().default(""),
  items: z.array(
    z.object({
      id: z.string().default(""),
      title: z.string().default(""),
      description: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
  ).default([]),
});

export const draftResumeContentSchema = z.object({
  personal: draftPersonalSchema,
  experience: z.array(draftExperienceItemSchema).default([]),
  education: z.array(draftEducationItemSchema).default([]),
  projects: z.array(draftProjectItemSchema).default([]),
  skills: z.array(draftSkillItemSchema).default([]),
  certifications: z.array(draftCertificationItemSchema).default([]),
  awards: z.array(draftAwardItemSchema).default([]),
  languages: z.array(draftLanguageItemSchema).default([]),
  customSections: z.array(draftCustomSectionItemSchema).default([]),
  sectionOrder: resumeSectionOrderSchema,
  sectionVisibility: resumeSectionVisibilitySchema,
  fontSize: resumeFontSizeSchema,
});

export type Personal = z.infer<typeof personalSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
export type SkillItem = z.infer<typeof skillItemSchema>;
export type CertificationItem = z.infer<typeof certificationItemSchema>;
export type AwardItem = z.infer<typeof awardItemSchema>;
export type LanguageItem = z.infer<typeof languageItemSchema>;
export type CustomSectionItem = z.infer<typeof customSectionItemSchema>;
export type ResumeContent = z.infer<typeof resumeContentSchema>;

export const templateConfigSchema = z.object({
  font: z.string().optional(),
  color: z.string().optional(),
  pageSize: z.enum(["A4", "letter"]).default("A4"),
  showPhoto: z.boolean().default(false),
});

export type TemplateConfig = z.infer<typeof templateConfigSchema>;
