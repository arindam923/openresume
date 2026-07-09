"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ResumeContent, ExperienceItem } from "@openresume/schema";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { AiToolbar } from "../ai-toolbar";

interface ExperienceEditorProps {
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

export function ExperienceEditor({ content, updateContent }: ExperienceEditorProps) {
  const addExperience = () => {
    updateContent((c) => ({
      ...c,
      experience: [
        ...c.experience,
        {
          id: uuidv4(),
          company: "",
          role: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          highlights: [""],
        },
      ],
    }));
  };

  const updateExperience = (id: string, updates: Partial<ExperienceItem>) => {
    updateContent((c) => ({
      ...c,
      experience: c.experience.map((job) => (job.id === id ? { ...job, ...updates } : job)),
    }));
  };

  const removeExperience = (id: string) => {
    updateContent((c) => ({
      ...c,
      experience: c.experience.filter((job) => job.id !== id),
    }));
  };

  const moveExperience = (index: number, direction: -1 | 1) => {
    updateContent((c) => {
      const next = [...c.experience];
      const target = index + direction;
      if (target < 0 || target >= next.length) return c;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...c, experience: next };
    });
  };

  const updateHighlight = (jobId: string, index: number, value: string) => {
    updateContent((c) => ({
      ...c,
      experience: c.experience.map((job) => {
        if (job.id !== jobId) return job;
        const highlights = [...job.highlights];
        highlights[index] = value;
        return { ...job, highlights };
      }),
    }));
  };

  const addHighlight = (jobId: string) => {
    updateContent((c) => ({
      ...c,
      experience: c.experience.map((job) =>
        job.id === jobId ? { ...job, highlights: [...job.highlights, ""] } : job
      ),
    }));
  };

  const removeHighlight = (jobId: string, index: number) => {
    updateContent((c) => ({
      ...c,
      experience: c.experience.map((job) => {
        if (job.id !== jobId) return job;
        const highlights = job.highlights.filter((_, i) => i !== index);
        return { ...job, highlights };
      }),
    }));
  };

  const labelClass = "text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-1 block";

  return (
    <div className="space-y-6">
      {content.experience.map((job, index) => (
        <div 
          key={job.id} 
          className="bg-white border border-[#1A1A1A] p-4 relative shadow-[2px_2px_0px_0px_#1A1A1A] space-y-4"
        >
          <CropCorners />
          
          {/* Card Header Bar */}
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
            <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
              {job.company || "NEW EXPERIENCE RECORD"}
            </span>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-400 hover:text-[#1A1A1A] rounded-none hover:bg-zinc-100 disabled:opacity-30"
                onClick={() => moveExperience(index, -1)}
                disabled={index === 0}
                title="Move up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-400 hover:text-[#1A1A1A] rounded-none hover:bg-zinc-100 disabled:opacity-30"
                onClick={() => moveExperience(index, 1)}
                disabled={index === content.experience.length - 1}
                title="Move down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </Button>
              <div className="w-px h-4 bg-zinc-200 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-400 hover:text-red-600 rounded-none hover:bg-red-55/40"
                onClick={() => removeExperience(job.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Card Body */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Company Name</label>
                <Input
                  value={job.company}
                  onChange={(e) => updateExperience(job.id, { company: e.target.value })}
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div>
                <label className={labelClass}>Job Title / Role</label>
                <Input
                  value={job.role}
                  onChange={(e) => updateExperience(job.id, { role: e.target.value })}
                  placeholder="e.g. Lead Frontend Engineer"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Office Location</label>
              <Input
                value={job.location ?? ""}
                onChange={(e) => updateExperience(job.id, { location: e.target.value })}
                placeholder="e.g. New York, NY or Remote"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Start Date</label>
                <Input
                  value={job.startDate ?? ""}
                  onChange={(e) => updateExperience(job.id, { startDate: e.target.value })}
                  placeholder="e.g. 2022-04"
                />
              </div>
              <div>
                <label className={labelClass}>End Date</label>
                <Input
                  value={job.current ? "Present" : job.endDate ?? ""}
                  onChange={(e) => updateExperience(job.id, { endDate: e.target.value, current: false })}
                  placeholder="e.g. 2024-06"
                  disabled={job.current}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id={`current-${job.id}`}
                checked={job.current}
                onChange={(e) => updateExperience(job.id, { current: e.target.checked })}
                className="w-3.5 h-3.5 border border-[#1A1A1A] rounded-none text-[#1A1A1A] focus:ring-[#E65100]/20 focus:ring-offset-0 focus:ring-2 cursor-pointer"
              />
              <label htmlFor={`current-${job.id}`} className="text-[10px] font-mono font-bold text-zinc-600 select-none cursor-pointer">
                I currently work in this role
              </label>
            </div>

            {/* Highlights Section */}
            <div className="space-y-3.5 border-t border-dashed border-zinc-200 pt-3.5">
              <label className={labelClass}>Work Highlights & Achievements</label>
              
              <div className="space-y-3">
                {job.highlights.map((highlight, index) => (
                  <div key={index} className="p-3 bg-[#FAF9F5]/40 border border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A] space-y-2 relative">
                    <div className="flex gap-2 items-start">
                      <Textarea
                        value={highlight}
                        onChange={(e) => updateHighlight(job.id, index, e.target.value)}
                        placeholder="Describe key impact (e.g. Reduced loading latencies by 20% by refactoring...)"
                        rows={2}
                        className="bg-white min-h-[50px]"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-zinc-400 hover:text-red-650 shrink-0 hover:bg-red-50/55 rounded-none"
                        onClick={() => removeHighlight(job.id, index)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    
                    {/* AI Assistant panel right underneath */}
                    <div className="px-1 border-t border-dashed border-zinc-200/80 pt-1.5">
                      <AiToolbar
                        text={highlight}
                        onApply={(newText) => updateHighlight(job.id, index, newText)}
                        className="justify-start opacity-90 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => addHighlight(job.id)}
                className="text-[9px] font-mono font-bold uppercase h-8 px-3 rounded-none border border-[#1A1A1A] hover:bg-[#FAF9F5] shadow-[1.5px_1.5px_0px_0px_#1A1A1A] hover:translate-y-[-1px] transition-all"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Highlight Item
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      <Button 
        variant="outline" 
        onClick={addExperience} 
        className="w-full text-xs font-mono font-bold py-2.5 rounded-none border border-[#1A1A1A] hover:bg-[#FAF9F5] shadow-[2px_2px_0px_0px_#1A1A1A] hover:translate-y-[-1px] transition-all"
      >
        <Plus className="w-3.5 h-3.5 mr-1.5" />
        Add Work Experience
      </Button>
    </div>
  );
}
