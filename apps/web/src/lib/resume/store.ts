import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import type { ResumeContent } from "@openresume/schema";

const idbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export const STORAGE_KEY = "openresume-current-resume";

const HISTORY_LIMIT = 50;

export interface ResumeState {
  resumeId: string | null;
  title: string;
  templateId: string;
  content: ResumeContent;
  lastSyncedAt: number | null;
  history: ResumeContent[];
  historyIndex: number;
  setResumeId: (resumeId: string | null) => void;
  setTitle: (title: string) => void;
  setTemplateId: (templateId: string) => void;
  setContent: (content: ResumeContent) => void;
  updateContent: (updater: (content: ResumeContent) => ResumeContent) => void;
  setLastSyncedAt: (timestamp: number | null) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  reset: () => void;
}

const defaultContent: ResumeContent = {
  personal: {
    fullName: "",
    email: "",
  },
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  awards: [],
  languages: [],
  customSections: [],
};

const initialState = {
  resumeId: null,
  title: "My Resume",
  templateId: "modern-minimal",
  content: defaultContent,
  lastSyncedAt: null,
  history: [defaultContent],
  historyIndex: 0,
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setResumeId: (resumeId) => set({ resumeId }),
      setTitle: (title) => set({ title }),
      setTemplateId: (templateId) => set({ templateId }),
      setContent: (content) =>
        set((state) => ({
          content,
          history: [...state.history.slice(0, state.historyIndex + 1), content].slice(-HISTORY_LIMIT),
          historyIndex: Math.min(state.historyIndex + 1, HISTORY_LIMIT - 1),
        })),
      updateContent: (updater) =>
        set((state) => {
          const newContent = updater(state.content);
          if (newContent === state.content) return state;
          const newHistory = [...state.history.slice(0, state.historyIndex + 1), newContent].slice(-HISTORY_LIMIT);
          return {
            content: newContent,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        }),
      setLastSyncedAt: (lastSyncedAt) => set({ lastSyncedAt }),
      undo: () =>
        set((state) => {
          if (state.historyIndex <= 0) return state;
          return {
            historyIndex: state.historyIndex - 1,
            content: state.history[state.historyIndex - 1],
          };
        }),
      redo: () =>
        set((state) => {
          if (state.historyIndex >= state.history.length - 1) return state;
          return {
            historyIndex: state.historyIndex + 1,
            content: state.history[state.historyIndex + 1],
          };
        }),
      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,
      reset: () => set(initialState),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        resumeId: state.resumeId,
        title: state.title,
        templateId: state.templateId,
        content: state.content,
        lastSyncedAt: state.lastSyncedAt,
      }),
    }
  )
);
