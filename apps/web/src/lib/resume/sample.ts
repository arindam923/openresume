import type { ResumeContent } from "@openresume/schema";

export const sampleResume: ResumeContent = {
  personal: {
    fullName: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "alexrivera",
    github: "arivera",
    website: "alexrivera.dev",
    summary:
      "Full-stack engineer with 5+ years building scalable web applications. Passionate about clean code, performance, and user experience. Led teams to ship products used by millions.",
  },
  experience: [
    {
      id: "1",
      company: "TechCorp",
      role: "Senior Full-Stack Engineer",
      location: "San Francisco, CA",
      startDate: "2021-03",
      endDate: "",
      current: true,
      highlights: [
        "Led migration to Next.js, improving page load times by 40%.",
        "Built real-time collaboration features serving 500K+ monthly active users.",
        "Mentored 4 junior engineers and established frontend best practices.",
      ],
    },
    {
      id: "2",
      company: "StartupXYZ",
      role: "Full-Stack Developer",
      location: "Remote",
      startDate: "2018-06",
      endDate: "2021-02",
      current: false,
      highlights: [
        "Developed core product features using React, Node.js, and PostgreSQL.",
        "Implemented CI/CD pipeline reducing deployment time from hours to minutes.",
        "Optimized database queries resulting in 50% faster API responses.",
      ],
    },
  ],
  education: [
    {
      id: "1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "Berkeley, CA",
      startDate: "2014-08",
      endDate: "2018-05",
      current: false,
    },
  ],
  projects: [
    {
      id: "1",
      name: "OpenResume",
      description: "Open-source AI-powered resume builder with React templates.",
      url: "github.com/openresume/openresume",
      highlights: ["Built with Next.js, Tailwind, and Zustand.", "Supports ATS-friendly PDF export."],
    },
  ],
  skills: [
    { id: "1", name: "React", level: "expert" },
    { id: "2", name: "TypeScript", level: "expert" },
    { id: "3", name: "Node.js", level: "advanced" },
    { id: "4", name: "PostgreSQL", level: "advanced" },
    { id: "5", name: "TailwindCSS", level: "advanced" },
    { id: "6", name: "AWS", level: "intermediate" },
  ],
  certifications: [],
  awards: [],
  languages: [{ id: "1", name: "English", proficiency: "native" }],
  customSections: [],
};
