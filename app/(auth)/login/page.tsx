"use client";

import Link from "next/link";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { useT } from "@/hooks/useT";

/** 로그인 — 구글/카카오/네이버 소셜 로그인 (window.location 이동) */
export default function LoginPage() {
  const { t } = useT();
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center py-20 text-center">
      <Link href="/" className="text-2xl font-extrabold tracking-tight text-ink">
        percol
      </Link>
      <p className="mt-3 whitespace-pre-line text-sm text-zinc-500">
        {t("auth.pageSub")}
      </p>

      <div className="mt-8 w-full">
        <SocialButtons returnUrl="/" />
      </div>

      <p className="mt-6 text-xs text-zinc-400">
        {t("auth.guestHintPre")}
        <Link href="/diagnosis" className="underline">
          {t("auth.guestHintLink")}
        </Link>
        {t("auth.guestHint")}
      </p>
    </div>
  );
}
