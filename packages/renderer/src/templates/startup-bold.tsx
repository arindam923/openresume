import { registerTemplate } from "../registry.js";
import { getEffectiveFontSize, OrderedSections } from "../sections.js";
import type { TemplateDefinition } from "../types.js";

const StartupBold: React.FC<{
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
            <header className="bg-indigo-600 text-white p-6 -m-8 mb-6">
              <h1 className="text-4xl font-bold">{personal.fullName}</h1>
              <p className="mt-2 text-indigo-100">
                {personal.email}
                {personal.phone && ` · ${personal.phone}`}
                {personal.location && ` · ${personal.location}`}
              </p>
              <p className="mt-1 text-sm text-indigo-200">
                {personal.linkedin && `linkedin.com/in/${personal.linkedin}`}
                {personal.github && ` · github.com/${personal.github}`}
                {personal.website && ` · ${personal.website}`}
              </p>
              {personal.summary && <p className="mt-4 text-sm leading-relaxed text-indigo-50">{personal.summary}</p>}
            </header>
          ),
          experience: () => (
            <section className="mb-5">
              <h2 className="text-lg font-bold text-indigo-600 mb-3">Experience</h2>
              {experience.map((job) => (
                <div key={job.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold">{job.role}</h3>
                    <span className="text-sm text-slate-500">
                      {job.startDate} – {job.current ? "Present" : job.endDate}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{job.company}{job.location && `, ${job.location}`}</p>
                  <ul className="list-disc list-inside text-sm mt-1 space-y-0.5 text-slate-700">
                    {job.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ),
          education: () => (
            <section className="mb-5">
              <h2 className="text-lg font-bold text-indigo-600 mb-3">Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold">{edu.institution}</h3>
                    <span className="text-sm text-slate-500">
                      {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{edu.degree}{edu.field && `, ${edu.field}`}</p>
                </div>
              ))}
            </section>
          ),
          projects: () => (
            <section className="mb-5">
              <h2 className="text-lg font-bold text-indigo-600 mb-3">Projects</h2>
              {projects.map((project) => (
                <div key={project.id} className="mb-2">
                  <h3 className="font-bold">{project.name}</h3>
                  <p className="text-sm text-slate-700">{project.description}</p>
                </div>
              ))}
            </section>
          ),
          skills: () => (
            <section>
              <h2 className="text-lg font-bold text-indigo-600 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.id} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          ),
        }}
      />
    </div>
  );
};

export const startupBold: TemplateDefinition = {
  id: "startup-bold",
  name: "Startup Bold",
  category: "startup",
  description: "Bold header with color accents for startup roles.",
  atsScore: 95,
  supportsPhoto: false,
  defaultFont: "Inter",
  render: ({ content }) => <StartupBold content={content} />,
};

registerTemplate(startupBold);
