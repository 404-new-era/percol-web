"use client";

import { useCallback } from "react";
import { useLocaleStore } from "@/store/locale";
import { translate } from "@/lib/i18n/dict";

/** 번역 훅 — const { t, locale } = useT(); t("home.recommendTitle") */
export function useT() {
  const locale = useLocaleStore((s) => s.locale);
  const t = useCallback((key: string) => translate(locale, key), [locale]);
  return { t, locale };
}
