"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "openresume-byok-settings";

export interface ByokState {
  geminiApiKey: string | null;
  setGeminiApiKey: (key: string | null) => void;
  clear: () => void;
}

export const useByokStore = create<ByokState>()(
  persist(
    (set) => ({
      geminiApiKey: null,
      setGeminiApiKey: (geminiApiKey) => {
        const trimmed = geminiApiKey?.trim();
        set({ geminiApiKey: trimmed ? trimmed : null });
      },
      clear: () => set({ geminiApiKey: null }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ geminiApiKey: state.geminiApiKey }),
    }
  )
);

export const BYOK_HEADER = "x-byok-key";

export function maskKey(key: string): string {
  if (!key) return "";
  if (key.length <= 8) return "•".repeat(key.length);
  return `${key.slice(0, 4)}${"•".repeat(Math.max(key.length - 8, 4))}${key.slice(-4)}`;
}

export function isLikelyValidGeminiKey(key: string): boolean {
  const trimmed = key.trim();
  if (!trimmed) return false;
  return trimmed.startsWith("AIza") && trimmed.length >= 30;
}
