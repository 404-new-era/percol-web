import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { config } from "@/lib/config";
import { tokenStore } from "@/lib/auth/token";
import type { ApiErrorBody, ApiSuccess, TokenPair } from "@/types";

/**
 * 공통 axios 인스턴스.
 * - 요청: accessToken 자동 첨부
 * - 응답: { success, data, meta } 래퍼 언래핑 → data만 반환 (meta는 헤더에 보존)
 * - 401: refreshToken으로 1회 재발급 후 원요청 재시도, 실패 시 토큰 정리
 *
 * 사용처에서는 `const me = await api.get<Me>('/users/me')` 처럼 data 타입만 신경쓰면 됨.
 */
export const http = axios.create({
  baseURL: config.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});

// ── 요청 인터셉터: 토큰 첨부 ──────────────────────────
http.interceptors.request.use((req: InternalAxiosRequestConfig) => {
  const token = tokenStore.getAccess();
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ── 응답 인터셉터: 언래핑 + 401 재발급 ────────────────
let refreshing: Promise<TokenPair> | null = null;

async function runRefresh(): Promise<TokenPair> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) throw new Error("NO_REFRESH_TOKEN");
  // 인터셉터를 타지 않는 raw 호출 (무한루프 방지)
  const res = await axios.post<ApiSuccess<TokenPair>>(
    `${config.apiBaseUrl}/auth/refresh`,
    { refreshToken },
    { headers: { "Content-Type": "application/json" } },
  );
  const pair = res.data.data;
  tokenStore.set(pair);
  return pair;
}

http.interceptors.response.use(
  // 성공 응답: data.data 언래핑, meta는 응답 헤더에 보존
  (res: AxiosResponse<ApiSuccess<unknown>>) => {
    const body = res.data;
    if (body && typeof body === "object" && "data" in body) {
      if (body.meta) res.headers["x-meta"] = JSON.stringify(body.meta);
      res.data = body.data as never;
    }
    return res;
  },
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;
    const status = error.response?.status;

    // 401 → refresh 1회 재시도
    if (status === 401 && original && !original._retried) {
      original._retried = true;
      try {
        refreshing ??= runRefresh().finally(() => {
          refreshing = null;
        });
        const { accessToken } = await refreshing;
        original.headers.Authorization = `Bearer ${accessToken}`;
        return http(original);
      } catch {
        tokenStore.clear();
      }
    }

    return Promise.reject(normalizeError(error));
  },
);

/** axios 에러를 ApiError 형태로 정규화 */
export interface NormalizedError {
  code: string;
  message: string;
  statusCode: number;
}
function normalizeError(error: AxiosError<ApiErrorBody>): NormalizedError {
  const apiError = error.response?.data?.error;
  if (apiError) return apiError;
  return {
    code: "NETWORK_ERROR",
    message: error.message || "네트워크 오류가 발생했습니다.",
    statusCode: error.response?.status ?? 0,
  };
}

/** meta가 필요한 목록 응답에서 헤더에 보존된 meta를 꺼낸다. */
export function readMeta(res: AxiosResponse): import("@/types").PageMeta {
  const raw = res.headers["x-meta"];
  return raw
    ? JSON.parse(raw)
    : { page: 1, limit: 20, total: 0 };
}

/** 언래핑된 data를 바로 반환하는 얇은 헬퍼 (대부분 케이스) */
export const api = {
  get: <T>(url: string, params?: object) =>
    http.get<T>(url, { params }).then((r) => r.data as T),
  post: <T>(url: string, body?: object) =>
    http.post<T>(url, body).then((r) => r.data as T),
  patch: <T>(url: string, body?: object) =>
    http.patch<T>(url, body).then((r) => r.data as T),
  delete: <T>(url: string) => http.delete<T>(url).then((r) => r.data as T),
};
