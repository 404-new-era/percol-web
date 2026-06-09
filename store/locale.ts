import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Locale = "ko" | "en";

interface LocaleState {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
}

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: "ko",
      setLocale: (locale) => set({ locale }),
      toggle: () => set({ locale: get().locale === "ko" ? "en" : "ko" }),
    }),
    {
      name: "percol.locale",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage,
      ),
      // SSR과 첫 렌더는 기본값(ko)으로 맞추고, 마운트 후 수동 복원 (하이드레이션 미스매치 방지)
      skipHydration: true,
    },
  ),
);
