"use client";

import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { useLoginPrompt } from "@/store/loginPrompt";

/**
 * 동작 단위 로그인 게이트.
 * const ensureAuth = useRequireAuth();
 * <button onClick={() => ensureAuth(() => like(id), "좋아요는 로그인 후 가능해요")}>
 *
 * 로그인 상태면 action 실행, 아니면 로그인 유도 모달을 띄운다.
 */
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const requireLogin = useLoginPrompt((s) => s.requireLogin);

  return useCallback(
    (action: () => void, message?: string) => {
      if (isAuthenticated) {
        action();
      } else {
        requireLogin(message);
      }
    },
    [isAuthenticated, requireLogin],
  );
}
