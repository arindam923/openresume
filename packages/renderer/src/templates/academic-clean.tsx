import { registerTemplate } from "../registry.js";
import { getEffectiveFontSize, OrderedSections } from "../sections.js";
import type { TemplateDefinition } from "../types.js";

const AcademicClean: React.FC<{
  content: import("@openresume/schema").ResumeContent;
}> = ({ content }) => {
  const { personal, experience, education, skills, awards } = content;
  const fontSize = getEffectiveFontSize(content);

  return (
    <div
      className="font-serif text-slate-900 bg-white p-8"
      style={{ fontSize: `${fontSize}px` }}
    >
      <OrderedSections
        content={content}
        renderers={{
          personal: () => (
            <>
              <header className="text-center mb-6">
                <h1 className="text-3xl font-bold">{personal.fullName}</h1>
                <p className="text-sm text-slate-600 mt-2">
                  {personal.email}
                  {personal.phone && ` · ${personal.phone}`}
                  {personal.location && ` · ${personal.location}`}
                </p>
                <p className="text-sm text-slate-600">
                  {personal.website && `${personal.website}`}
                  {personal.linkedin && ` · LinkedIn`}
                </p>
              </header>
              {personal.summary && (
                <section className="mb-5">
                  <h2 className="text-center text-sm font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">Profile</h2>
                  <p className="text-sm leading-relaxed text-justify">{personal.summary}</p>
                </section>
              )}
            </>
          ),
          education: () => (
            <section className="mb-5">
              <h2 className="text-center text-sm font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-sm">{edu.institution}</h3>
                    <span className="text-sm text-slate-600">{edu.startDate} – {edu.current ? "Present" : edu.endDate}</span>
                  </div>
                  <p className="text-sm italic">{edu.degree}{edu.field && `, ${edu.field}`}</p>
                  {edu.description && <p className="text-sm">{edu.description}</p>}
                </div>
              ))}
            </section>
          ),
          experience: () => (
            <section className="mb-5">
              <h2 className="text-center text-sm font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">Experience</h2>
              {experience.map((job) => (
                <div key={job.id} className="mb-3">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-sm">{job.role}</h3>
                    <span className="text-sm text-slate-600">{job.startDate} – {job.current ? "Present" : job.endDate}</span>
                  </div>
                  <p className="text-sm italic">{job.company}{job.location && `, ${job.location}`}</p>
                  <ul className="list-disc list-inside text-sm mt-1 space-y-0.5">
                    {job.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ),
          awards: () => (
            <section className="mb-5">
              <h2 className="text-center text-sm font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">Awards</h2>
              {awards.map((award) => (
                <p key={award.id} className="text-sm mb-1">
                  {award.title}{award.issuer && `, ${award.issuer}`}{award.date && ` (${award.date})`}
                </p>
              ))}
            </section>
          ),
          skills: () => (
            <section>
              <h2 className="text-center text-sm font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">Skills</h2>
              <p className="text-sm">{skills.map((s) => s.name).join(" · ")}</p>
            </section>
          ),
        }}
      />
    </div>
  );
};

export const academicClean: TemplateDefinition = {
  id: "academic-clean",
  name: "Academic Clean",
  category: "academic",
  description: "Traditional academic CV layout with centered headers.",
  atsScore: 96,
  supportsPhoto: false,
  defaultFont: "Georgia",
  render: ({ content }) => <AcademicClean content={content} />,
};

registerTemplate(academicClean);
