/** 환경 설정 — 모든 외부 URL은 여기서만 읽는다. */

/** 배포 백엔드 오리진 (OAuth 리다이렉트 시작용 절대 URL, HTTPS) */
const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN ?? "https://43.201.8.235.sslip.io";

export const config = {
  /**
   * API Base — same-origin 상대경로. next.config.ts rewrites가 백엔드로 프록시.
   * → 브라우저 fetch는 CORS 없이 동작 (로컬·배포 공통).
   */
  apiBaseUrl: "/api/v1",
  /** 업로드 이미지도 same-origin(/uploads) → 프록시 */
  uploadsBaseUrl: "",
  /**
   * 소셜 로그인 시작 URL용 절대 베이스. OAuth는 fetch가 아니라 브라우저
   * 전체 이동(+백엔드가 쿠키/state 관리)이라 프록시를 거치면 안 되고 백엔드로 직접 간다.
   */
  oauthBaseUrl: `${BACKEND_ORIGIN}/api/v1`,
} as const;
