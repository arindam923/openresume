import { registerTemplate } from "../registry.js";
import { getEffectiveFontSize, OrderedSections } from "../sections.js";
import type { TemplateDefinition } from "../types.js";

const GoogleStyle: React.FC<{
  content: import("@openresume/schema").ResumeContent;
}> = ({ content }) => {
  const { personal, experience, education, projects, skills } = content;
  const fontSize = getEffectiveFontSize(content);

  return (
    <div
      className="font-sans text-slate-800 bg-white p-8"
      style={{ fontSize: `${fontSize}px` }}
    >
      <OrderedSections
        content={content}
        renderers={{
          personal: () => (
            <header className="mb-5">
              <h1 className="text-4xl font-normal text-slate-900">{personal.fullName}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 mt-2">
                {personal.email && <span>{personal.email}</span>}
                {personal.phone && <span>{personal.phone}</span>}
                {personal.location && <span>{personal.location}</span>}
                {personal.linkedin && <span>linkedin.com/in/{personal.linkedin}</span>}
                {personal.github && <span>github.com/{personal.github}</span>}
                {personal.website && <span>{personal.website}</span>}
              </div>
              {personal.summary && <p className="mt-3 text-sm leading-relaxed">{personal.summary}</p>}
            </header>
          ),
          experience: () => (
            <section className="mb-5">
              <h2 className="text-lg font-normal text-blue-700 mb-2">Experience</h2>
              <div className="h-px bg-slate-200 mb-3" />
              {experience.map((job) => (
                <div key={job.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-slate-900">{job.company}</h3>
                    <span className="text-sm text-slate-500">
                      {job.startDate} – {job.current ? "Present" : job.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 italic">{job.role}</p>
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
              <h2 className="text-lg font-normal text-blue-700 mb-2">Education</h2>
              <div className="h-px bg-slate-200 mb-3" />
              {education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-slate-900">{edu.institution}</h3>
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
              <h2 className="text-lg font-normal text-blue-700 mb-2">Projects</h2>
              <div className="h-px bg-slate-200 mb-3" />
              {projects.map((project) => (
                <div key={project.id} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-slate-900">{project.name}</h3>
                    {project.url && <span className="text-sm text-slate-500">{project.url}</span>}
                  </div>
                  <p className="text-sm text-slate-700">{project.description}</p>
                </div>
              ))}
            </section>
          ),
          skills: () => (
            <section>
              <h2 className="text-lg font-normal text-blue-700 mb-2">Skills</h2>
              <div className="h-px bg-slate-200 mb-3" />
              <p className="text-sm">{skills.map((s) => s.name).join(" · ")}</p>
            </section>
          ),
        }}
      />
    </div>
  );
};

export const googleStyle: TemplateDefinition = {
  id: "google-style",
  name: "Google Style",
  category: "faang",
  description: "Simple, readable style inspired by Google resumes.",
  atsScore: 97,
  supportsPhoto: false,
  defaultFont: "Roboto",
  render: ({ content }) => <GoogleStyle content={content} />,
};

registerTemplate(googleStyle);
