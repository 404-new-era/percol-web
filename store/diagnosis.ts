import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { DiagnosisResult } from "@/types";

/**
 * 진단 결과를 결과 페이지에서 새로고침에도 유지하기 위한 저장소(localStorage).
 * - 로그인: 결과에 id가 있어 /diagnosis/result/:id 로 이동 (서버 재조회도 가능)
 * - 비로그인: id=null → 서버에 없으므로 이 스토어로 결과 페이지에서만 유지 (/result/latest)
 *   ※ 홈/마이페이지 "내 퍼스널 컬러" 반영은 로그인 사용자만 (여기 결과는 반영하지 않음)
 * faceUrl: 얼굴 미리보기(결과 합성용, 프론트 전용). dataURL만 저장(복원 가능), blob은 제외.
 */
interface DiagnosisState {
  lastResult: DiagnosisResult | null;
  faceUrl: string | null;
  setLastResult: (r: DiagnosisResult, faceUrl?: string) => void;
  clear: () => void;
}

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useDiagnosisStore = create<DiagnosisState>()(
  persist(
    (set) => ({
      lastResult: null,
      faceUrl: null,
      setLastResult: (r, faceUrl) =>
        set({ lastResult: r, faceUrl: faceUrl ?? null }),
      clear: () => set({ lastResult: null, faceUrl: null }),
    }),
    {
      name: "percol.diagnosisResult",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage,
      ),
      // blob: objectURL은 새로고침 후 죽으므로 dataURL만 보존
      partialize: (s) => ({
        lastResult: s.lastResult,
        faceUrl: s.faceUrl?.startsWith("data:") ? s.faceUrl : null,
      }),
    },
  ),
);
