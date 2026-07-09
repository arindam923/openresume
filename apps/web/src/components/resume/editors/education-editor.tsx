"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ResumeContent, EducationItem } from "@openresume/schema";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface EducationEditorProps {
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

export function EducationEditor({ content, updateContent }: EducationEditorProps) {
  const addEducation = () => {
    updateContent((c) => ({
      ...c,
      education: [
        ...c.education,
        {
          id: uuidv4(),
          institution: "",
          degree: "",
          field: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
        },
      ],
    }));
  };

  const updateEducation = (id: string, updates: Partial<EducationItem>) => {
    updateContent((c) => ({
      ...c,
      education: c.education.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu)),
    }));
  };

  const removeEducation = (id: string) => {
    updateContent((c) => ({
      ...c,
      education: c.education.filter((edu) => edu.id !== id),
    }));
  };

  const moveEducation = (index: number, direction: -1 | 1) => {
    updateContent((c) => {
      const next = [...c.education];
      const target = index + direction;
      if (target < 0 || target >= next.length) return c;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...c, education: next };
    });
  };

  const labelClass = "text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-1 block";

  return (
    <div className="space-y-6">
      {content.education.map((edu, index) => (
        <div 
          key={edu.id} 
          className="bg-white border border-[#1A1A1A] p-4 relative shadow-[2px_2px_0px_0px_#1A1A1A] space-y-4"
        >
          <CropCorners />
          
          {/* Card Header Bar */}
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
            <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
              {edu.institution || "NEW EDUCATION RECORD"}
            </span>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-400 hover:text-[#1A1A1A] rounded-none hover:bg-zinc-100 disabled:opacity-30"
                onClick={() => moveEducation(index, -1)}
                disabled={index === 0}
                title="Move up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-400 hover:text-[#1A1A1A] rounded-none hover:bg-zinc-100 disabled:opacity-30"
                onClick={() => moveEducation(index, 1)}
                disabled={index === content.education.length - 1}
                title="Move down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </Button>
              <div className="w-px h-4 bg-zinc-200 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-400 hover:text-red-600 rounded-none hover:bg-red-55/40"
                onClick={() => removeEducation(edu.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Card Body */}
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Institution / School Name</label>
              <Input
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                placeholder="e.g. Stanford University"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Degree</label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                  placeholder="e.g. Bachelor of Science"
                />
              </div>
              <div>
                <label className={labelClass}>Field of Study</label>
                <Input
                  value={edu.field ?? ""}
                  onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Location</label>
              <Input
                value={edu.location ?? ""}
                onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                placeholder="e.g. Stanford, CA"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Start Date</label>
                <Input
                  value={edu.startDate ?? ""}
                  onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                  placeholder="e.g. 2018-09"
                />
              </div>
              <div>
                <label className={labelClass}>End Date</label>
                <Input
                  value={edu.current ? "Present" : edu.endDate ?? ""}
                  onChange={(e) => updateEducation(edu.id, { endDate: e.target.value, current: false })}
                  placeholder="e.g. 2022-06"
                  disabled={edu.current}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id={`current-${edu.id}`}
                checked={edu.current}
                onChange={(e) => updateEducation(edu.id, { current: e.target.checked })}
                className="w-3.5 h-3.5 border border-[#1A1A1A] rounded-none text-[#1A1A1A] focus:ring-[#E65100]/20 focus:ring-offset-0 focus:ring-2 cursor-pointer"
              />
              <label htmlFor={`current-${edu.id}`} className="text-[10px] font-mono font-bold text-zinc-650 select-none cursor-pointer">
                I am currently studying here
              </label>
            </div>
          </div>
        </div>
      ))}
      
      <Button 
        variant="outline" 
        onClick={addEducation} 
        className="w-full text-xs font-mono font-bold py-2.5 rounded-none border border-[#1A1A1A] hover:bg-[#FAF9F5] shadow-[2px_2px_0px_0px_#1A1A1A] hover:translate-y-[-1px] transition-all"
      >
        <Plus className="w-3.5 h-3.5 mr-1.5" />
        Add Education Record
      </Button>
    </div>
  );
}
