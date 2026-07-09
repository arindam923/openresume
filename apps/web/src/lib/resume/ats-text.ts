import type { ResumeContent } from "@openresume/schema";

export function resumeToPlainText(content: ResumeContent): string {
  const lines: string[] = [];

  lines.push(content.personal.fullName);
  lines.push(
    [
      content.personal.email,
      content.personal.phone,
      content.personal.location,
      content.personal.website,
      content.personal.linkedin ? `linkedin.com/in/${content.personal.linkedin}` : "",
      content.personal.github ? `github.com/${content.personal.github}` : "",
    ]
      .filter(Boolean)
      .join(" | ")
  );
  lines.push("");

  if (content.personal.summary) {
    lines.push("SUMMARY");
    lines.push(content.personal.summary);
    lines.push("");
  }

  if (content.experience.length > 0) {
    lines.push("EXPERIENCE");
    for (const job of content.experience) {
      lines.push(`${job.role} at ${job.company}`);
      lines.push(`${job.startDate || "N/A"} - ${job.current ? "Present" : job.endDate || "N/A"}`);
      if (job.location) lines.push(job.location);
      for (const highlight of job.highlights) {
        lines.push(`- ${highlight}`);
      }
      lines.push("");
    }
  }

  if (content.education.length > 0) {
    lines.push("EDUCATION");
    for (const edu of content.education) {
      lines.push(`${edu.degree}${edu.field ? `, ${edu.field}` : ""}`);
      lines.push(edu.institution);
      lines.push(`${edu.startDate || "N/A"} - ${edu.current ? "Present" : edu.endDate || "N/A"}`);
      lines.push("");
    }
  }

  if (content.projects.length > 0) {
    lines.push("PROJECTS");
    for (const project of content.projects) {
      lines.push(project.name);
      if (project.url) lines.push(project.url);
      if (project.description) lines.push(project.description);
      for (const highlight of project.highlights) {
        lines.push(`- ${highlight}`);
      }
      lines.push("");
    }
  }

  if (content.skills.length > 0) {
    lines.push("SKILLS");
    lines.push(content.skills.map((s) => s.name).join(", "));
    lines.push("");
  }

  if (content.certifications.length > 0) {
    lines.push("CERTIFICATIONS");
    for (const cert of content.certifications) {
      lines.push(`${cert.name}${cert.issuer ? ` - ${cert.issuer}` : ""}${cert.date ? ` (${cert.date})` : ""}`);
    }
    lines.push("");
  }

  if (content.awards.length > 0) {
    lines.push("AWARDS");
    for (const award of content.awards) {
      lines.push(`${award.title}${award.issuer ? ` - ${award.issuer}` : ""}${award.date ? ` (${award.date})` : ""}`);
    }
    lines.push("");
  }

  if (content.languages.length > 0) {
    lines.push("LANGUAGES");
    lines.push(content.languages.map((l) => `${l.name}${l.proficiency ? ` (${l.proficiency})` : ""}`).join(", "));
    lines.push("");
  }

  if (content.customSections.length > 0) {
    for (const section of content.customSections) {
      lines.push(section.title.toUpperCase());
      for (const item of section.items) {
        lines.push(`${item.title}${item.description ? ` - ${item.description}` : ""}`);
      }
      lines.push("");
    }
  }

  return lines.join("\n").trim();
}
