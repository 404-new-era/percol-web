import { create } from "zustand";

/** 로그인 유도 모달 상태 — 보호 동작 시도 시 open() */
interface LoginPromptState {
  open: boolean;
  message: string | null;
  requireLogin: (message?: string) => void;
  close: () => void;
}

export const useLoginPrompt = create<LoginPromptState>((set) => ({
  open: false,
  message: null,
  requireLogin: (message) => set({ open: true, message: message ?? null }),
  close: () => set({ open: false, message: null }),
}));
