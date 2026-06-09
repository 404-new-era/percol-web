import { api } from "./client";
import { config } from "@/lib/config";
import type {
  AuthUser,
  DevLoginInput,
  DevLoginResult,
  Provider,
  TokenPair,
} from "@/types";

/** 소셜 로그인 시작 — fetch가 아니라 브라우저를 백엔드로 직접 이동 (프록시 X) */
export function socialLoginUrl(provider: Lowercase<Provider>): string {
  return `${config.oauthBaseUrl}/auth/${provider}`;
}

export const authApi = {
  me: () => api.get<AuthUser>("/auth/me"),
  refresh: (refreshToken: string) =>
    api.post<TokenPair>("/auth/refresh", { refreshToken }),
  logout: (refreshToken?: string) =>
    api.post<void>("/auth/logout", { refreshToken }),
  /** [개발용] 소셜 없이 토큰 발급 (운영 비활성) */
  devLogin: (input: DevLoginInput) =>
    api.post<DevLoginResult>("/auth/dev-login", input),
};
