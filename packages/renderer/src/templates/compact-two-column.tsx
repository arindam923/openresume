import { registerTemplate } from "../registry.js";
import { getEffectiveFontSize, getEffectiveSectionVisibility } from "../sections.js";
import type { TemplateDefinition } from "../types.js";

const CompactTwoColumn: React.FC<{
  content: import("@openresume/schema").ResumeContent;
}> = ({ content }) => {
  const { personal, experience, education, projects, skills, certifications, languages } = content;
  const fontSize = getEffectiveFontSize(content);
  const visibility = getEffectiveSectionVisibility(content);

  return (
    <div
      className="font-sans text-slate-900 bg-white p-6"
      style={{ fontSize: `${fontSize}px` }}
    >
      {visibility.personal && (
        <header className="mb-4 pb-3 border-b border-slate-200">
          <h1 className="text-3xl font-bold text-slate-900">{personal.fullName}</h1>
          <p className="text-sm text-slate-600 mt-1">
            {personal.email}
            {personal.phone && ` · ${personal.phone}`}
            {personal.location && ` · ${personal.location}`}
            {personal.linkedin && ` · linkedin.com/in/${personal.linkedin}`}
          </p>
        </header>
      )}

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          {visibility.personal && personal.summary && (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">Summary</h2>
              <p className="text-sm leading-relaxed">{personal.summary}</p>
            </section>
          )}

          {visibility.experience && experience.length > 0 && (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">Experience</h2>
              {experience.map((job) => (
                <div key={job.id} className="mb-3">
                  <h3 className="font-semibold text-sm">{job.role}</h3>
                  <p className="text-xs text-slate-600">{job.company} | {job.startDate} – {job.current ? "Present" : job.endDate}</p>
                  <ul className="list-disc list-inside text-xs mt-1 space-y-0.5">
                    {job.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {visibility.education && education.length > 0 && (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <h3 className="font-semibold text-sm">{edu.institution}</h3>
                  <p className="text-xs text-slate-700">{edu.degree}{edu.field && `, ${edu.field}`}</p>
                  <p className="text-xs text-slate-500">{edu.startDate} – {edu.current ? "Present" : edu.endDate}</p>
                </div>
              ))}
            </section>
          )}

          {visibility.projects && projects.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">Projects</h2>
              {projects.map((project) => (
                <div key={project.id} className="mb-2">
                  <h3 className="font-semibold text-sm">{project.name}</h3>
                  <p className="text-xs text-slate-700">{project.description}</p>
                </div>
              ))}
            </section>
          )}
        </div>

        <div className="col-span-1">
          {visibility.skills && skills.length > 0 && (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill) => (
                  <span key={skill.id} className="text-xs px-2 py-0.5 bg-slate-100 rounded">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {visibility.certifications && certifications.length > 0 && (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">Certifications</h2>
              {certifications.map((cert) => (
                <p key={cert.id} className="text-xs mb-1">{cert.name}</p>
              ))}
            </section>
          )}

          {visibility.languages && languages.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">Languages</h2>
              {languages.map((lang) => (
                <p key={lang.id} className="text-xs mb-1">
                  {lang.name}{lang.proficiency && ` — ${lang.proficiency}`}
                </p>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export const compactTwoColumn: TemplateDefinition = {
  id: "compact-two-column",
  name: "Compact Two-Column",
  category: "modern",
  description: "Space-efficient two-column layout for experienced professionals.",
  atsScore: 94,
  supportsPhoto: false,
  defaultFont: "Inter",
  render: ({ content }) => <CompactTwoColumn content={content} />,
};

registerTemplate(compactTwoColumn);
