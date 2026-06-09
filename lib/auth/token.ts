import type { TokenPair } from "@/types";

/** 토큰 저장소 — localStorage 기반 (SSR 안전 가드 포함) */
const ACCESS_KEY = "percol.accessToken";
const REFRESH_KEY = "percol.refreshToken";

const isBrowser = () => typeof window !== "undefined";

export const tokenStore = {
  getAccess(): string | null {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(ACCESS_KEY);
  },
  getRefresh(): string | null {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(REFRESH_KEY);
  },
  set({ accessToken, refreshToken }: TokenPair): void {
    if (!isBrowser()) return;
    window.localStorage.setItem(ACCESS_KEY, accessToken);
    window.localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
  },
  has(): boolean {
    return !!this.getAccess();
  },
};
