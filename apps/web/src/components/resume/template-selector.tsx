"use client";

import { templates, getTemplatesByCategory } from "@openresume/renderer/templates";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

const CropCorners = () => (
  <>
    <span className="absolute top-1 left-1 text-[11px] text-[#E65100] font-mono select-none pointer-events-none leading-none">┌</span>
    <span className="absolute top-1 right-1 text-[11px] text-[#E65100] font-mono select-none pointer-events-none leading-none">┐</span>
    <span className="absolute bottom-1 left-1 text-[11px] text-[#E65100] font-mono select-none pointer-events-none leading-none">└</span>
    <span className="absolute bottom-1 right-1 text-[11px] text-[#E65100] font-mono select-none pointer-events-none leading-none">┘</span>
  </>
);

export function TemplateSelector({ selectedId, onSelect, className }: TemplateSelectorProps) {
  const categories = Array.from(new Set(templates.map((t) => t.category)));

  return (
    <div className={cn("space-y-6", className)}>
      {categories.map((category) => {
        const categoryTemplates = getTemplatesByCategory(category);
        return (
          <div key={category} className="space-y-3">
            {/* Category Header */}
            <div className="flex items-center gap-2 mb-2 mt-4 select-none">
              <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                {category} LAYOUT PLANS
              </span>
              <div className="flex-1 h-[1px] border-t border-dashed border-zinc-200" />
            </div>

            {/* Templates List */}
            <div className="space-y-3">
              {categoryTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onSelect(template.id)}
                  className={cn(
                    "w-full text-left p-4 border transition-all relative flex flex-col justify-between rounded-none shadow-[2px_2px_0px_0px_#1A1A1A] hover:translate-y-[-1px]",
                    selectedId === template.id
                      ? "border-[#E65100] bg-[#FAF9F5] text-[#1A1A1A]"
                      : "border-[#1A1A1A] bg-white hover:bg-[#FAF9F5]/50 text-zinc-700"
                  )}
                >
                  {/* Crop corners for selected item */}
                  {selectedId === template.id && <CropCorners />}
                  
                  {/* Title & Badge */}
                  <div className="flex justify-between items-start gap-2 w-full mb-1">
                    <span className="font-mono font-bold text-[11px] uppercase tracking-tight text-[#1A1A1A] block">
                      {template.name.replace(/-/g, " ")}
                    </span>
                    <span className={cn(
                      "text-[8px] font-mono font-bold px-1.5 py-0.5 border rounded-xs uppercase shrink-0 leading-none",
                      selectedId === template.id
                        ? "border-[#E65100]/30 text-[#E65100] bg-[#E65100]/5"
                        : "border-zinc-200 text-zinc-400"
                    )}>
                      ATS {template.atsScore}%
                    </span>
                  </div>

                  {/* Optional Description */}
                  {template.description && (
                    <p className="text-[10px] text-zinc-500 leading-normal mb-3 mt-1.5 font-sans">
                      {template.description}
                    </p>
                  )}

                  {/* Specifications Footer */}
                  <div className="flex items-center gap-4 text-[8.5px] font-mono text-zinc-400 border-t border-dashed border-zinc-200 pt-2.5 w-full">
                    <div>FONT: <span className="text-zinc-650 font-bold">{template.defaultFont}</span></div>
                    <div>PHOTO: <span className="text-zinc-650 font-bold">{template.supportsPhoto ? "YES" : "NO"}</span></div>
                    <div className="ml-auto text-[8px] font-mono uppercase tracking-widest text-zinc-400">
                      {selectedId === template.id ? "[ACTIVE]" : "[SELECT]"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
