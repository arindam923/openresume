import type { TemplateDefinition } from "./types.js";

export const templates: TemplateDefinition[] = [];

export function registerTemplate(template: TemplateDefinition): void {
  const existing = templates.find((t) => t.id === template.id);
  if (existing) {
    throw new Error(`Template with id "${template.id}" is already registered`);
  }
  templates.push(template);
}

export function getTemplate(id: string): TemplateDefinition | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: TemplateDefinition["category"]): TemplateDefinition[] {
  return templates.filter((t) => t.category === category);
}
