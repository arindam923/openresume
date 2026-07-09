"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ResumeContent, SkillItem } from "@openresume/schema";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface SkillsEditorProps {
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

export function SkillsEditor({ content, updateContent }: SkillsEditorProps) {
  const addSkill = () => {
    updateContent((c) => ({
      ...c,
      skills: [...c.skills, { id: uuidv4(), name: "" }],
    }));
  };

  const updateSkill = (id: string, updates: Partial<SkillItem>) => {
    updateContent((c) => ({
      ...c,
      skills: c.skills.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const removeSkill = (id: string) => {
    updateContent((c) => ({
      ...c,
      skills: c.skills.filter((s) => s.id !== id),
    }));
  };

  const moveSkill = (index: number, direction: -1 | 1) => {
    updateContent((c) => {
      const next = [...c.skills];
      const target = index + direction;
      if (target < 0 || target >= next.length) return c;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...c, skills: next };
    });
  };

  const labelClass = "text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-1 block";

  return (
    <div className="bg-white border border-[#1A1A1A] p-5 relative shadow-[2px_2px_0px_0px_#1A1A1A] space-y-4">
      <CropCorners />
      
      {content.skills.length > 0 && (
        <div className="grid grid-cols-12 gap-3 mb-1 px-1">
          <div className="col-span-5">
            <span className={labelClass}>Skill Name / Tech Tag</span>
          </div>
          <div className="col-span-3">
            <span className={labelClass}>Proficiency Level</span>
          </div>
          <div className="col-span-4" />
        </div>
      )}

      <div className="space-y-3">
        {content.skills.map((skill, index) => (
          <div key={skill.id} className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-5">
              <Input
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                placeholder="e.g. React, Python"
              />
            </div>
            <div className="col-span-3">
              <select
                value={skill.level ?? ""}
                onChange={(e) =>
                  updateSkill(skill.id, { level: e.target.value as SkillItem["level"] })
                }
                className="w-full flex h-8 w-full border border-[#1A1A1A] bg-white px-2.5 py-1 text-xs transition-all focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/10 focus-visible:outline-none"
              >
                <option value="">Optional</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div className="col-span-4 flex justify-end items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-[#1A1A1A] rounded-none hover:bg-zinc-100 disabled:opacity-30"
                onClick={() => moveSkill(index, -1)}
                disabled={index === 0}
                title="Move up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-[#1A1A1A] rounded-none hover:bg-zinc-100 disabled:opacity-30"
                onClick={() => moveSkill(index, 1)}
                disabled={index === content.skills.length - 1}
                title="Move down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-red-650 rounded-none hover:bg-red-50/50"
                onClick={() => removeSkill(skill.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={addSkill} 
        className="w-full text-xs font-mono font-bold py-2 rounded-none border border-[#1A1A1A] hover:bg-[#FAF9F5] shadow-[1.5px_1.5px_0px_0px_#1A1A1A] hover:translate-y-[-1px] transition-all"
      >
        <Plus className="w-3.5 h-3.5 mr-1" />
        Add Skill Item
      </Button>
    </div>
  );
}
