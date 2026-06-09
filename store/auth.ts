import { create } from "zustand";
import { authApi } from "@/lib/api";
import { tokenStore } from "@/lib/auth/token";
import type { AuthUser, TokenPair } from "@/types";

interface AuthState {
  user: AuthUser | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  /** 앱 시작 시 1회 — 저장된 토큰이 있으면 /auth/me로 유저 복원 */
  hydrate: () => Promise<void>;
  /** 토큰 저장 후 유저 로드 (콜백/dev-login 후 호출) */
  setSession: (tokens: TokenPair) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "idle",

  hydrate: async () => {
    if (!tokenStore.has()) {
      set({ status: "unauthenticated", user: null });
      return;
    }
    set({ status: "loading" });
    try {
      const user = await authApi.me();
      set({ user, status: "authenticated" });
    } catch {
      tokenStore.clear();
      set({ user: null, status: "unauthenticated" });
    }
  },

  setSession: async (tokens) => {
    tokenStore.set(tokens);
    set({ status: "loading" });
    const user = await authApi.me();
    set({ user, status: "authenticated" });
  },

  logout: async () => {
    const refreshToken = tokenStore.getRefresh() ?? undefined;
    try {
      await authApi.logout(refreshToken);
    } catch {
      // 서버 실패해도 로컬 세션은 정리
    }
    tokenStore.clear();
    set({ user: null, status: "unauthenticated" });
  },
}));
