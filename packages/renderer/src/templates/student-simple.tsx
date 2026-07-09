import { registerTemplate } from "../registry.js";
import { getEffectiveFontSize, OrderedSections } from "../sections.js";
import type { TemplateDefinition } from "../types.js";

const StudentSimple: React.FC<{
  content: import("@openresume/schema").ResumeContent;
}> = ({ content }) => {
  const { personal, experience, education, projects, skills, certifications, awards } = content;
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
              <header className="text-center mb-5">
                <h1 className="text-3xl font-bold text-slate-900">{personal.fullName}</h1>
                <p className="text-sm text-slate-600 mt-1">
                  {personal.email}
                  {personal.phone && ` · ${personal.phone}`}
                  {personal.location && ` · ${personal.location}`}
                  {personal.linkedin && ` · linkedin.com/in/${personal.linkedin}`}
                </p>
              </header>
              {personal.summary && (
                <section className="mb-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2">Summary</h2>
                  <p className="text-sm leading-relaxed">{personal.summary}</p>
                </section>
              )}
            </>
          ),
          education: () => (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2">Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">{edu.institution}</h3>
                    <span className="text-sm text-slate-600">{edu.startDate} – {edu.current ? "Present" : edu.endDate}</span>
                  </div>
                  <p className="text-sm">{edu.degree}{edu.field && `, ${edu.field}`}</p>
                </div>
              ))}
            </section>
          ),
          experience: () => (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2">Experience</h2>
              {experience.map((job) => (
                <div key={job.id} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">{job.role}</h3>
                    <span className="text-sm text-slate-600">{job.startDate} – {job.current ? "Present" : job.endDate}</span>
                  </div>
                  <p className="text-sm text-slate-700">{job.company}{job.location && `, ${job.location}`}</p>
                  <ul className="list-disc list-inside text-sm mt-1 space-y-0.5">
                    {job.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ),
          projects: () => (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2">Projects</h2>
              {projects.map((project) => (
                <div key={project.id} className="mb-2">
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-sm text-slate-700">{project.description}</p>
                </div>
              ))}
            </section>
          ),
          skills: () => (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2">Skills</h2>
              <p className="text-sm">{skills.map((s) => s.name).join(" · ")}</p>
            </section>
          ),
          certifications: () => (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2">Certifications</h2>
              {certifications.map((cert) => (
                <p key={cert.id} className="text-sm mb-1">
                  {cert.name}{cert.issuer && ` — ${cert.issuer}`}{cert.date && ` (${cert.date})`}
                </p>
              ))}
            </section>
          ),
          awards: () => (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2">Awards</h2>
              {awards.map((award) => (
                <p key={award.id} className="text-sm mb-1">
                  {award.title}{award.issuer && ` — ${award.issuer}`}{award.date && ` (${award.date})`}
                </p>
              ))}
            </section>
          ),
        }}
      />
    </div>
  );
};

export const studentSimple: TemplateDefinition = {
  id: "student-simple",
  name: "Student Simple",
  category: "student",
  description: "Easy-to-read layout perfect for students and interns.",
  atsScore: 98,
  supportsPhoto: false,
  defaultFont: "Inter",
  render: ({ content }) => <StudentSimple content={content} />,
};

registerTemplate(studentSimple);
