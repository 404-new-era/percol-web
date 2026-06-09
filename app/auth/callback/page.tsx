"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useT } from "@/hooks/useT";
import { popReturnUrl } from "@/lib/auth/login";

/**
 * 소셜 로그인 콜백.
 * 백엔드가 {FRONTEND_URL}/auth/callback?accessToken=&refreshToken= 로 리다이렉트한다.
 * 쿼리 토큰을 저장하고 유저를 로드한 뒤 홈으로 이동.
 */
function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const { t } = useT();

  // 토큰 유효성은 렌더 중 계산 (effect 내 setState 회피)
  const accessToken = params.get("accessToken");
  const refreshToken = params.get("refreshToken");
  const missingToken = !accessToken || !refreshToken;

  const [failed, setFailed] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current || missingToken) return;
    ran.current = true;
    setSession({ accessToken: accessToken!, refreshToken: refreshToken! })
      .then(() => router.replace(popReturnUrl()))
      .catch(() => setFailed(true));
  }, [missingToken, accessToken, refreshToken, router, setSession]);

  const message = missingToken
    ? t("auth.noToken")
    : failed
      ? t("auth.signinFailed")
      : t("auth.signingIn");

  return (
    <div className="flex flex-1 items-center justify-center py-24 text-sm text-zinc-500">
      {message}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackInner />
    </Suspense>
  );
}
