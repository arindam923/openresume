"use client";

import { Button } from "@/components/ui/button";
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_SECTION_ORDER,
  DEFAULT_SECTION_VISIBILITY,
  SECTION_DESCRIPTORS,
  type ResumeSectionId,
} from "@openresume/renderer";
import type { ResumeContent } from "@openresume/schema";
import { ArrowDown, ArrowUp, Eye, EyeOff, RotateCcw, Type } from "lucide-react";
import { useMemo } from "react";

interface LayoutPanelProps {
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

export function LayoutPanel({ content, updateContent }: LayoutPanelProps) {
  const order = content.sectionOrder ?? DEFAULT_SECTION_ORDER;
  const visibility = useMemo(
    () => ({ ...DEFAULT_SECTION_VISIBILITY, ...(content.sectionVisibility ?? {}) }),
    [content.sectionVisibility]
  );
  const fontSize = content.fontSize ?? DEFAULT_FONT_SIZE;

  const moveSection = (id: ResumeSectionId, direction: -1 | 1) => {
    const idx = order.indexOf(id);
    if (idx < 0) return;
    const target = idx + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[idx], next[target]] = [next[target], next[idx]];
    updateContent((c) => ({ ...c, sectionOrder: next }));
  };

  const toggleSection = (id: ResumeSectionId) => {
    const next = !visibility[id];
    updateContent((c) => {
      const current = { ...DEFAULT_SECTION_VISIBILITY, ...(c.sectionVisibility ?? {}) };
      current[id] = next;
      return { ...c, sectionVisibility: current };
    });
  };

  const setFontSize = (value: number) => {
    updateContent((c) => ({ ...c, fontSize: value }));
  };

  const resetLayout = () => {
    updateContent((c) => ({
      ...c,
      sectionOrder: undefined,
      sectionVisibility: undefined,
      fontSize: undefined,
    }));
  };

  const labelClass = "text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-1 block";

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#1A1A1A] p-4 relative shadow-[2px_2px_0px_0px_#1A1A1A] space-y-4">
        <CropCorners />

        <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
          <div className="flex items-center gap-2">
            <Type className="w-3.5 h-3.5 text-[#E65100]" />
            <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
              Base Font Size
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">{fontSize}px</span>
        </div>

        <div>
          <input
            type="range"
            min={8}
            max={16}
            step={0.5}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full accent-[#E65100] cursor-pointer"
          />
          <div className="flex justify-between mt-1 text-[8px] font-mono text-zinc-400 uppercase">
            <span>Compact · 8px</span>
            <span>Default · 10px</span>
            <span>Roomy · 16px</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#1A1A1A] p-4 relative shadow-[2px_2px_0px_0px_#1A1A1A] space-y-3">
        <CropCorners />

        <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
          <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
            Section Order & Visibility
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetLayout}
            className="h-6 text-[8.5px] font-mono font-bold uppercase rounded-none hover:bg-[#FAF9F5] text-zinc-500 hover:text-[#1A1A1A] px-1.5"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>

        <p className="text-[9.5px] font-mono text-zinc-500 leading-relaxed">
          Reorder, show, or hide top-level sections. Hidden sections won't render in the preview or PDF.
        </p>

        <div className="space-y-1.5">
          {order.map((id, index) => {
            const descriptor = SECTION_DESCRIPTORS.find((d) => d.id === id);
            if (!descriptor) return null;
            const isVisible = visibility[id];
            const isFirst = index === 0;
            const isLast = index === order.length - 1;
            return (
              <div
                key={id}
                className={`flex items-center gap-1.5 border p-2 ${
                  isVisible
                    ? "border-[#1A1A1A] bg-white"
                    : "border-zinc-200 bg-[#FAF9F5] opacity-60"
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveSection(id, -1)}
                    disabled={isFirst}
                    className="w-5 h-5 flex items-center justify-center text-zinc-500 hover:text-[#1A1A1A] hover:bg-[#FAF9F5] disabled:opacity-25 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(id, 1)}
                    disabled={isLast}
                    className="w-5 h-5 flex items-center justify-center text-zinc-500 hover:text-[#1A1A1A] hover:bg-[#FAF9F5] disabled:opacity-25 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                <span className="text-[9px] font-mono font-bold text-zinc-400 w-5 text-center">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex-1 min-w-0">
                  <span className="text-[10.5px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider truncate block">
                    {descriptor.label}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleSection(id)}
                  className={`w-7 h-7 flex items-center justify-center border ${
                    isVisible
                      ? "border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#FAF9F5]"
                      : "border-zinc-300 text-zinc-400 hover:bg-zinc-50"
                  }`}
                  title={isVisible ? "Hide section" : "Show section"}
                >
                  {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
