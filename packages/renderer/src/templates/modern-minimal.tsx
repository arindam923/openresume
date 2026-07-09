import { registerTemplate } from "../registry.js";
import { getEffectiveFontSize, OrderedSections } from "../sections.js";
import type { TemplateDefinition } from "../types.js";

const ModernMinimal: React.FC<{
  content: import("@openresume/schema").ResumeContent;
}> = ({ content }) => {
  const { personal, experience, education, projects, skills } = content;
  const fontSize = getEffectiveFontSize(content);

  return (
    <div
      className="font-sans text-slate-900 bg-white p-8"
      style={{ fontSize: `${fontSize}px` }}
    >
      <OrderedSections
        content={content}
        renderers={{
          personal: () => (
            <header className="border-b border-slate-200 pb-4 mb-4">
              <h1 className="text-3xl font-bold tracking-tight">{personal.fullName}</h1>
              <p className="text-slate-600 mt-1">
                {personal.email}
                {personal.phone && ` · ${personal.phone}`}
                {personal.location && ` · ${personal.location}`}
              </p>
              <p className="text-slate-600 text-sm mt-1">
                {personal.linkedin && `linkedin.com/in/${personal.linkedin}`}
                {personal.github && ` · github.com/${personal.github}`}
                {personal.website && ` · ${personal.website}`}
              </p>
              {personal.summary && <p className="mt-3 text-sm leading-relaxed">{personal.summary}</p>}
            </header>
          ),
          experience: () => (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2">
                Experience
              </h2>
              {experience.map((job) => (
                <div key={job.id} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">{job.role}</h3>
                    <span className="text-sm text-slate-500">
                      {job.startDate} – {job.current ? "Present" : job.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{job.company}{job.location && `, ${job.location}`}</p>
                  <ul className="list-disc list-inside text-sm mt-1 space-y-0.5">
                    {job.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ),
          education: () => (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2">
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">{edu.institution}</h3>
                    <span className="text-sm text-slate-500">
                      {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {edu.degree}{edu.field && `, ${edu.field}`}
                  </p>
                </div>
              ))}
            </section>
          ),
          projects: () => (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2">
                Projects
              </h2>
              {projects.map((project) => (
                <div key={project.id} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">{project.name}</h3>
                    {project.url && <span className="text-sm text-slate-500">{project.url}</span>}
                  </div>
                  <p className="text-sm text-slate-600">{project.description}</p>
                </div>
              ))}
            </section>
          ),
          skills: () => (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2">
                Skills
              </h2>
              <p className="text-sm">{skills.map((s) => s.name).join(" · ")}</p>
            </section>
          ),
        }}
      />
    </div>
  );
};

export const modernMinimal: TemplateDefinition = {
  id: "modern-minimal",
  name: "Modern Minimal",
  category: "minimal",
  description: "Clean, minimal template with excellent ATS readability.",
  atsScore: 98,
  supportsPhoto: false,
  defaultFont: "Inter",
  render: ({ content }) => <ModernMinimal content={content} />,
};

registerTemplate(modernMinimal);
