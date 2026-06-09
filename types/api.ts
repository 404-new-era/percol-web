/** 백엔드 공통 응답 래퍼 — 모든 응답은 이 형태로 감싸진다. */
export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PageMeta;
}

export interface ApiErrorBody {
  success: false;
  error: ApiError;
}

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  statusCode: number;
}

export type ApiErrorCode =
  | "VALIDATION_ERROR" // 400
  | "AUTH_REQUIRED" // 401
  | "FORBIDDEN" // 403
  | "NOT_FOUND" // 404
  | "CONFLICT" // 409
  | "INTERNAL_ERROR"; // 500

/** 목록(페이지네이션) 응답에만 포함 */
export interface PageMeta {
  page: number;
  limit: number;
  total: number;
}

/** 목록 공통 쿼리 (page 기본 1, limit 기본 20·최대 50) */
export interface PageQuery {
  page?: number;
  limit?: number;
}

/** 언래핑된 페이지 결과 (data + meta를 함께 들고 다닐 때) */
export interface Paginated<T> {
  items: T[];
  meta: PageMeta;
}
