"use client";

import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/hooks/useT";
import { SocialButtons } from "./SocialButtons";

/**
 * 페이지 단위 로그인 게이트.
 * 로그인 상태면 children, 아니면 인라인 로그인 유도 화면.
 * messageKey: 사전 키 (예: "auth.gateBookmark")
 */
export function RequireAuth({
  children,
  messageKey,
}: {
  children: React.ReactNode;
  messageKey?: string;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useT();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-sm text-zinc-400">
        {t("common.loading")}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center py-20 text-center">
        <h1 className="text-xl font-bold text-ink">{t("auth.loginNeeded")}</h1>
        <p className="mt-2 text-sm text-zinc-500">
          {t(messageKey ?? "auth.loginDefault")}
        </p>
        <div className="mt-7 w-full">
          <SocialButtons />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
