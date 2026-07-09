import { registerTemplate } from "../registry.js";
import { getEffectiveFontSize, OrderedSections } from "../sections.js";
import type { TemplateDefinition } from "../types.js";

const ProfessionalClassic: React.FC<{
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
              <header className="border-b-2 border-slate-800 pb-4 mb-5">
                <h1 className="text-4xl font-bold text-slate-900">{personal.fullName}</h1>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-700 mt-2">
                  {personal.email && <span>{personal.email}</span>}
                  {personal.phone && <span>• {personal.phone}</span>}
                  {personal.location && <span>• {personal.location}</span>}
                  {personal.website && <span>• {personal.website}</span>}
                  {personal.linkedin && <span>• linkedin.com/in/{personal.linkedin}</span>}
                </div>
              </header>
              {personal.summary && (
                <section className="mb-5">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">Professional Summary</h2>
                  <p className="text-sm leading-relaxed">{personal.summary}</p>
                </section>
              )}
            </>
          ),
          experience: () => (
            <section className="mb-5">
              <h2 className="text-lg font-bold text-slate-800 mb-3">Work Experience</h2>
              {experience.map((job) => (
                <div key={job.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold">{job.company}</h3>
                    <span className="text-sm text-slate-600">{job.startDate} – {job.current ? "Present" : job.endDate}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{job.role}</p>
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
              <h2 className="text-lg font-bold text-slate-800 mb-3">Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold">{edu.institution}</h3>
                    <span className="text-sm text-slate-600">{edu.startDate} – {edu.current ? "Present" : edu.endDate}</span>
                  </div>
                  <p className="text-sm">{edu.degree}{edu.field && `, ${edu.field}`}</p>
                </div>
              ))}
            </section>
          ),
          projects: () => (
            <section className="mb-5">
              <h2 className="text-lg font-bold text-slate-800 mb-3">Projects</h2>
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
              <h2 className="text-lg font-bold text-slate-800 mb-3">Skills</h2>
              <p className="text-sm">{skills.map((s) => s.name).join(" • ")}</p>
            </section>
          ),
        }}
      />
    </div>
  );
};

export const professionalClassic: TemplateDefinition = {
  id: "professional-classic",
  name: "Professional Classic",
  category: "modern",
  description: "Traditional professional layout suitable for any industry.",
  atsScore: 98,
  supportsPhoto: false,
  defaultFont: "Inter",
  render: ({ content }) => <ProfessionalClassic content={content} />,
};

registerTemplate(professionalClassic);
