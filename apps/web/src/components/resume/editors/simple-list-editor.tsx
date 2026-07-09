"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  options?: string[];
}

interface SimpleListEditorProps<T extends { id: string }> {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  fields: FieldConfig[];
}

const CropCorners = () => (
  <>
    <span className="absolute top-1 left-1 text-[11px] text-zinc-300 font-mono select-none pointer-events-none leading-none">┌</span>
    <span className="absolute top-1 right-1 text-[11px] text-zinc-300 font-mono select-none pointer-events-none leading-none">┐</span>
    <span className="absolute bottom-1 left-1 text-[11px] text-zinc-300 font-mono select-none pointer-events-none leading-none">└</span>
    <span className="absolute bottom-1 right-1 text-[11px] text-zinc-300 font-mono select-none pointer-events-none leading-none">┘</span>
  </>
);

export function SimpleListEditor<T extends { id: string }>({
  items,
  onChange,
  fields,
}: SimpleListEditorProps<T>) {
  const addItem = () => {
    onChange([...items, { id: uuidv4() } as T]);
  };

  const updateItem = (index: number, key: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value } as T;
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const labelClass = "text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-1 block";

  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div 
          key={item.id} 
          className="bg-white border border-[#1A1A1A] p-4 relative shadow-[2px_2px_0px_0px_#1A1A1A] space-y-4"
        >
          <CropCorners />
          
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
            <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
              {(item as Record<string, string>)[fields[0].key] || `NEW RECORD ENTRY`}
            </span>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-400 hover:text-[#1A1A1A] rounded-none hover:bg-zinc-100 disabled:opacity-30"
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                title="Move up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-400 hover:text-[#1A1A1A] rounded-none hover:bg-zinc-100 disabled:opacity-30"
                onClick={() => moveItem(index, 1)}
                disabled={index === items.length - 1}
                title="Move down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </Button>
              <div className="w-px h-4 bg-zinc-200 mx-1" />
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-zinc-400 hover:text-red-650 rounded-none hover:bg-red-50/50"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
          
          {fields.map((field) => (
            <div key={field.key}>
              <label className={labelClass}>{field.label}</label>
              {field.type === "textarea" ? (
                <Textarea
                  value={((item as Record<string, string>)[field.key] as string) ?? ""}
                  onChange={(e) => updateItem(index, field.key, e.target.value)}
                  placeholder={field.label}
                  rows={3}
                />
              ) : field.type === "select" ? (
                <select
                  value={((item as Record<string, string>)[field.key] as string) ?? ""}
                  onChange={(e) => updateItem(index, field.key, e.target.value)}
                  className="flex h-9 w-full border border-[#1A1A1A] bg-white px-2.5 py-1 text-xs transition-all focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/10 focus-visible:outline-none"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  value={((item as Record<string, string>)[field.key] as string) ?? ""}
                  onChange={(e) => updateItem(index, field.key, e.target.value)}
                  placeholder={field.label}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      
      <Button 
        variant="outline" 
        onClick={addItem} 
        className="w-full text-xs font-mono font-bold py-2.5 rounded-none border border-[#1A1A1A] hover:bg-[#FAF9F5] shadow-[2px_2px_0px_0px_#1A1A1A] hover:translate-y-[-1px] transition-all"
      >
        <Plus className="w-3.5 h-3.5 mr-1.5" />
        Add Record Entry
      </Button>
    </div>
  );
}
