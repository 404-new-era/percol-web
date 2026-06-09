"use client";

import { useEffect } from "react";
import { useLoginPrompt } from "@/store/loginPrompt";
import { useT } from "@/hooks/useT";
import { SocialButtons } from "./SocialButtons";

/** 전역 로그인 유도 모달 — 보호 동작 시도 시 떠오른다 */
export function LoginModal() {
  const { open, message, close } = useLoginPrompt();
  const { t } = useT();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-0 sm:items-center sm:pb-4"
      onClick={close}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h2 className="text-lg font-bold text-ink">{t("auth.loginNeeded")}</h2>
          <p className="mt-1.5 text-sm text-zinc-500">
            {message ?? t("auth.loginDefault")}
          </p>
        </div>

        <div className="mt-6">
          <SocialButtons />
        </div>

        <button
          type="button"
          onClick={close}
          className="mt-3 h-10 w-full text-sm text-zinc-400 hover:text-zinc-600"
        >
          {t("auth.maybeLater")}
        </button>
      </div>
    </div>
  );
}
