import { config } from "./config";

/** 조건부 className 합치기 (의존성 없는 경량 버전) */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** 업로드 이미지 경로(/uploads/x.jpg 또는 절대URL)를 절대 URL로 정규화 */
export function imageUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${config.uploadsBaseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** 원화 포맷 (39000 → 39,000원) */
export function formatKRW(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

const SEASON_LABEL: Record<string, string> = {
  SPRING: "봄",
  SUMMER: "여름",
  FALL: "가을",
  WINTER: "겨울",
};
const TONE_LABEL: Record<string, string> = { WARM: "웜", COOL: "쿨" };

export function seasonLabel(season: string): string {
  return SEASON_LABEL[season] ?? season;
}
export function toneLabel(tone: string): string {
  return TONE_LABEL[tone] ?? tone;
}
