import { socialLoginUrl } from "@/lib/api";
import type { Provider } from "@/types";

const RETURN_KEY = "percol.returnUrl";

/**
 * 소셜 로그인 시작 — fetch가 아니라 브라우저를 이동시킨다.
 * 로그인 후 돌아올 경로를 저장해두고, 콜백에서 복원한다.
 */
export function startSocialLogin(
  provider: Lowercase<Provider>,
  returnUrl?: string,
) {
  if (typeof window === "undefined") return;
  const back = returnUrl ?? window.location.pathname + window.location.search;
  try {
    window.sessionStorage.setItem(RETURN_KEY, back);
  } catch {
    // sessionStorage 불가 시 무시 (홈으로 복귀)
  }
  window.location.href = socialLoginUrl(provider);
}

/** 콜백에서 복귀 경로를 꺼낸다 (없으면 홈) */
export function popReturnUrl(): string {
  if (typeof window === "undefined") return "/";
  try {
    const url = window.sessionStorage.getItem(RETURN_KEY);
    window.sessionStorage.removeItem(RETURN_KEY);
    return url || "/";
  } catch {
    return "/";
  }
}
