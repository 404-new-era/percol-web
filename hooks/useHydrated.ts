"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * 클라이언트 하이드레이션 완료 여부.
 * SSR/첫 렌더에선 false, 클라이언트에선 true → sessionStorage 등
 * 클라이언트 전용 상태를 읽기 전에 가드로 사용 (하이드레이션 미스매치 방지).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
