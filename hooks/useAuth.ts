"use client";

import { useAuthStore } from "@/store/auth";

/** 인증 상태 셀렉터 — 컴포넌트에서 가볍게 사용 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const logout = useAuthStore((s) => s.logout);
  return {
    user,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading" || status === "idle",
    logout,
  };
}
