"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ResumeContent } from "@openresume/schema";

interface PersonalEditorProps {
  content: ResumeContent;
  updateContent: (updater: (content: ResumeContent) => ResumeContent) => void;
}

const CropCorners = () => (
  <>
    <span className="absolute top-1 left-1 text-[11px] text-zinc-300 font-mono select-none pointer-events-none leading-none">┌</span>
    <span className="absolute top-1 right-1 text-[11px] text-zinc-300 font-mono select-none pointer-events-none leading-none">┐</span>
    <span className="absolute bottom-1 left-1 text-[11px] text-zinc-300 font-mono select-none pointer-events-none leading-none">└</span>
    <span className="absolute bottom-1 right-1 text-[11px] text-zinc-300 font-mono select-none pointer-events-none leading-none">┘</span>
  </>
);

export function PersonalEditor({ content, updateContent }: PersonalEditorProps) {
  const { personal } = content;

  const updatePersonal = (field: keyof typeof personal, value: string) => {
    updateContent((c) => ({
      ...c,
      personal: { ...c.personal, [field]: value },
    }));
  };

  const labelClass = "text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-1 block";

  return (
    <div className="border border-[#1A1A1A] bg-white p-5 relative shadow-[2px_2px_0px_0px_#1A1A1A] space-y-4">
      <CropCorners />
      
      <div>
        <label htmlFor="fullName" className={labelClass}>Full Name</label>
        <Input
          id="fullName"
          value={personal.fullName}
          onChange={(e) => updatePersonal("fullName", e.target.value)}
          placeholder="e.g. Alex Johnson"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className={labelClass}>Email Address</label>
          <Input
            id="email"
            type="email"
            value={personal.email}
            onChange={(e) => updatePersonal("email", e.target.value)}
            placeholder="e.g. alex@example.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Phone Number</label>
          <Input
            id="phone"
            value={personal.phone ?? ""}
            onChange={(e) => updatePersonal("phone", e.target.value)}
            placeholder="e.g. +1 (555) 019-2834"
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className={labelClass}>Location</label>
        <Input
          id="location"
          value={personal.location ?? ""}
          onChange={(e) => updatePersonal("location", e.target.value)}
          placeholder="e.g. San Francisco, CA"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="website" className={labelClass}>Portfolio Link</label>
          <Input
            id="website"
            value={personal.website ?? ""}
            onChange={(e) => updatePersonal("website", e.target.value)}
            placeholder="e.g. portfolio.com"
          />
        </div>
        <div>
          <label htmlFor="linkedin" className={labelClass}>LinkedIn Username</label>
          <Input
            id="linkedin"
            value={personal.linkedin ?? ""}
            onChange={(e) => updatePersonal("linkedin", e.target.value)}
            placeholder="e.g. alex-johnson"
          />
        </div>
        <div>
          <label htmlFor="github" className={labelClass}>GitHub Username</label>
          <Input
            id="github"
            value={personal.github ?? ""}
            onChange={(e) => updatePersonal("github", e.target.value)}
            placeholder="e.g. alexj"
          />
        </div>
      </div>

      <div>
        <label htmlFor="summary" className={labelClass}>Professional Summary</label>
        <Textarea
          id="summary"
          value={personal.summary ?? ""}
          onChange={(e) => updatePersonal("summary", e.target.value)}
          placeholder="Brief overview of your experience, core strengths, and goals..."
          rows={4}
        />
      </div>
    </div>
  );
}
