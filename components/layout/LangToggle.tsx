"use client";

import { useLocaleStore } from "@/store/locale";

/** 한/영 언어 토글 (KOR ↔ ENG) */
export function LangToggle() {
  const locale = useLocaleStore((s) => s.locale);
  const toggle = useLocaleStore((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="언어 전환"
      className="flex items-center gap-1 rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-semibold text-zinc-500 hover:bg-zinc-50"
    >
      <span className={locale === "ko" ? "text-ink" : ""}>KOR</span>
      <span className="text-zinc-300">·</span>
      <span className={locale === "en" ? "text-ink" : ""}>ENG</span>
    </button>
  );
}
