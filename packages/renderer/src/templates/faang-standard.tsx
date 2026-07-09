import { registerTemplate } from "../registry.js";
import { getEffectiveFontSize, OrderedSections } from "../sections.js";
import type { TemplateDefinition } from "../types.js";

const FaangStandard: React.FC<{
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
            <>
              <header className="mb-5">
                <h1 className="text-3xl font-bold">{personal.fullName}</h1>
                <p className="text-sm text-slate-600 mt-1">
                  {personal.email}
                  {personal.phone && ` | ${personal.phone}`}
                  {personal.location && ` | ${personal.location}`}
                </p>
                <p className="text-sm text-slate-600">
                  {personal.linkedin && `linkedin.com/in/${personal.linkedin}`}
                  {personal.github && ` | github.com/${personal.github}`}
                  {personal.website && ` | ${personal.website}`}
                </p>
              </header>
              {personal.summary && (
                <section className="mb-4">
                  <p className="text-sm leading-relaxed">{personal.summary}</p>
                </section>
              )}
            </>
          ),
          experience: () => (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Experience</h2>
              {experience.map((job) => (
                <div key={job.id} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold">{job.company}</span>
                    <span className="text-sm text-slate-600">{job.startDate} – {job.current ? "Present" : job.endDate}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm italic text-slate-700">{job.role}</span>
                    {job.location && <span className="text-sm text-slate-600">{job.location}</span>}
                  </div>
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
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold">{edu.institution}</span>
                    <span className="text-sm text-slate-600">{edu.startDate} – {edu.current ? "Present" : edu.endDate}</span>
                  </div>
                  <p className="text-sm text-slate-700">{edu.degree}{edu.field && `, ${edu.field}`}</p>
                </div>
              ))}
            </section>
          ),
          projects: () => (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Projects</h2>
              {projects.map((project) => (
                <div key={project.id} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold">{project.name}</span>
                    {project.url && <span className="text-sm text-slate-600">{project.url}</span>}
                  </div>
                  <p className="text-sm">{project.description}</p>
                  {project.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-sm mt-1 space-y-0.5">
                      {project.highlights.map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          ),
          skills: () => (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Skills</h2>
              <p className="text-sm">{skills.map((s) => s.name).join(", ")}</p>
            </section>
          ),
        }}
      />
    </div>
  );
};

export const faangStandard: TemplateDefinition = {
  id: "faang-standard",
  name: "FAANG Standard",
  category: "faang",
  description: "Standard layout optimized for tech company applications.",
  atsScore: 99,
  supportsPhoto: false,
  defaultFont: "Inter",
  render: ({ content }) => <FaangStandard content={content} />,
};

registerTemplate(faangStandard);
