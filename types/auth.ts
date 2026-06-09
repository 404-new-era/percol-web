import type { Role } from "./enums";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/** POST /auth/dev-login 응답 */
export interface DevLoginResult extends TokenPair {
  userId: string;
}

/** GET /auth/me 응답 — 현재 사용자 요약 */
export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  nickname: string;
  image: string | null;
  role: Role;
}

export interface DevLoginInput {
  nickname?: string;
  role?: Role;
}
