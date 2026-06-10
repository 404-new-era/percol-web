/**
 * 코디 스냅 자리표시 데이터 (게시물 API 연동 전까지).
 * 상품/추천은 실 API로 전환됨 — 여기엔 스냅만 남김.
 */
export interface MockSnap {
  id: string;
  nickname: string;
  avatarHex: string;
  coverHex: string;
}

export const MOCK_SNAPS: MockSnap[] = [
  { id: "s1", nickname: "yuna_ac", avatarHex: "#e0552b", coverHex: "#e8c7a0" },
  { id: "s2", nickname: "minho.fit", avatarHex: "#5c7a3a", coverHex: "#a9b08a" },
  { id: "s3", nickname: "daily_seo", avatarHex: "#e0552b", coverHex: "#c9a06a" },
  { id: "s4", nickname: "jin_look", avatarHex: "#5c7a3a", coverHex: "#8a8453" },
];
