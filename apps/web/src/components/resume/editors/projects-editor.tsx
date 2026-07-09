"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ResumeContent, ProjectItem } from "@openresume/schema";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { AiToolbar } from "../ai-toolbar";

interface ProjectsEditorProps {
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

export function ProjectsEditor({ content, updateContent }: ProjectsEditorProps) {
  const addProject = () => {
    updateContent((c) => ({
      ...c,
      projects: [
        ...c.projects,
        {
          id: uuidv4(),
          name: "",
          description: "",
          url: "",
          highlights: [""],
        },
      ],
    }));
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    updateContent((c) => ({
      ...c,
      projects: c.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const removeProject = (id: string) => {
    updateContent((c) => ({
      ...c,
      projects: c.projects.filter((p) => p.id !== id),
    }));
  };

  const moveProject = (index: number, direction: -1 | 1) => {
    updateContent((c) => {
      const next = [...c.projects];
      const target = index + direction;
      if (target < 0 || target >= next.length) return c;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...c, projects: next };
    });
  };

  const updateHighlight = (projectId: string, index: number, value: string) => {
    updateContent((c) => ({
      ...c,
      projects: c.projects.map((p) => {
        if (p.id !== projectId) return p;
        const highlights = [...p.highlights];
        highlights[index] = value;
        return { ...p, highlights };
      }),
    }));
  };

  const addHighlight = (projectId: string) => {
    updateContent((c) => ({
      ...c,
      projects: c.projects.map((p) =>
        p.id === projectId ? { ...p, highlights: [...p.highlights, ""] } : p
      ),
    }));
  };

  const removeHighlight = (projectId: string, index: number) => {
    updateContent((c) => ({
      ...c,
      projects: c.projects.map((p) => {
        if (p.id !== projectId) return p;
        const highlights = p.highlights.filter((_, i) => i !== index);
        return { ...p, highlights };
      }),
    }));
  };

  const labelClass = "text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-1 block";

  return (
    <div className="space-y-6">
      {content.projects.map((project, index) => (
        <div 
          key={project.id} 
          className="bg-white border border-[#1A1A1A] p-4 relative shadow-[2px_2px_0px_0px_#1A1A1A] space-y-4"
        >
          <CropCorners />
          
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
            <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
              {project.name || "NEW PROJECT RECORD"}
            </span>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-400 hover:text-[#1A1A1A] rounded-none hover:bg-zinc-100 disabled:opacity-30"
                onClick={() => moveProject(index, -1)}
                disabled={index === 0}
                title="Move up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-400 hover:text-[#1A1A1A] rounded-none hover:bg-zinc-100 disabled:opacity-30"
                onClick={() => moveProject(index, 1)}
                disabled={index === content.projects.length - 1}
                title="Move down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </Button>
              <div className="w-px h-4 bg-zinc-200 mx-1" />
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-zinc-400 hover:text-red-650 rounded-none hover:bg-red-50/50"
                onClick={() => removeProject(project.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Project Name</label>
              <Input
                value={project.name}
                onChange={(e) => updateProject(project.id, { name: e.target.value })}
                placeholder="Project Name"
              />
            </div>
            
            <div>
              <label className={labelClass}>Project URL</label>
              <Input
                value={project.url ?? ""}
                onChange={(e) => updateProject(project.id, { url: e.target.value })}
                placeholder="github.com/username/project"
              />
            </div>

            <div>
              <label className={labelClass}>Description / Summary</label>
              <Textarea
                value={project.description ?? ""}
                onChange={(e) => updateProject(project.id, { description: e.target.value })}
                placeholder="Briefly summarize what you built and the target goal..."
                rows={3}
              />
            </div>

            <div className="space-y-3.5 border-t border-dashed border-zinc-200 pt-3.5">
              <label className={labelClass}>Highlights & Key Achievements</label>
              
              <div className="space-y-3">
                {project.highlights.map((highlight, index) => (
                  <div key={index} className="p-3 bg-[#FAF9F5]/40 border border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A] space-y-2 relative">
                    <div className="flex gap-2">
                      <Textarea
                        value={highlight}
                        onChange={(e) => updateHighlight(project.id, index, e.target.value)}
                        placeholder="Describe a key implementation details or metric impact..."
                        rows={2}
                        className="bg-white min-h-[50px]"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-zinc-400 hover:text-red-650 shrink-0 hover:bg-red-50/50 rounded-none"
                        onClick={() => removeHighlight(project.id, index)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    
                    <div className="px-1 border-t border-dashed border-zinc-200/80 pt-1.5">
                      <AiToolbar
                        text={highlight}
                        onApply={(newText) => updateHighlight(project.id, index, newText)}
                        className="justify-start opacity-90 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => addHighlight(project.id)}
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
        onClick={addProject} 
        className="w-full text-xs font-mono font-bold py-2.5 rounded-none border border-[#1A1A1A] hover:bg-[#FAF9F5] shadow-[2px_2px_0px_0px_#1A1A1A] hover:translate-y-[-1px] transition-all"
      >
        <Plus className="w-3.5 h-3.5 mr-1.5" />
        Add Project Record
      </Button>
    </div>
  );
}
