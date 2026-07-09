import { registerTemplate } from "../registry.js";
import { getEffectiveFontSize, OrderedSections } from "../sections.js";
import type { TemplateDefinition } from "../types.js";

const AppleStyle: React.FC<{
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
            <header className="mb-6">
              <h1 className="text-4xl font-semibold tracking-tight">{personal.fullName}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-2">
                {personal.email && <span>{personal.email}</span>}
                {personal.phone && <span>{personal.phone}</span>}
                {personal.location && <span>{personal.location}</span>}
                {personal.website && <span>{personal.website}</span>}
                {personal.linkedin && <span>LinkedIn</span>}
                {personal.github && <span>GitHub</span>}
              </div>
              {personal.summary && <p className="mt-4 text-sm leading-relaxed text-slate-700">{personal.summary}</p>}
            </header>
          ),
          experience: () => (
            <section className="mb-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Experience</h2>
              {experience.map((job) => (
                <div key={job.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-slate-900">{job.role}</h3>
                    <span className="text-sm text-slate-500">
                      {job.startDate} – {job.current ? "Present" : job.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{job.company}{job.location && ` · ${job.location}`}</p>
                  <ul className="list-disc list-inside text-sm mt-1.5 space-y-1 text-slate-700">
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
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-slate-900">{edu.institution}</h3>
                    <span className="text-sm text-slate-500">
                      {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{edu.degree}{edu.field && ` · ${edu.field}`}</p>
                </div>
              ))}
            </section>
          ),
          projects: () => (
            <section className="mb-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Projects</h2>
              {projects.map((project) => (
                <div key={project.id} className="mb-2">
                  <h3 className="font-semibold text-slate-900">{project.name}</h3>
                  <p className="text-sm text-slate-700">{project.description}</p>
                </div>
              ))}
            </section>
          ),
          skills: () => (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Skills</h2>
              <p className="text-sm text-slate-700">{skills.map((s) => s.name).join(" · ")}</p>
            </section>
          ),
        }}
      />
    </div>
  );
};

export const appleStyle: TemplateDefinition = {
  id: "apple-style",
  name: "Apple Style",
  category: "modern",
  description: "Clean and spacious layout inspired by Apple's design language.",
  atsScore: 97,
  supportsPhoto: false,
  defaultFont: "SF Pro",
  render: ({ content }) => <AppleStyle content={content} />,
};

registerTemplate(appleStyle);
