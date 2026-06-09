import { http, readMeta } from "./client";
import type {
  DiagnosisRecord,
  DiagnosisResult,
  PageQuery,
  Paginated,
  SelfTestStartResult,
  SelfTestSubmitInput,
  UpdateDiagnosisInput,
} from "@/types";

export const diagnosisApi = {
  /** 셀프테스트 단계 세트 조회 (mode: question 기본 | color) */
  start: (mode: "question" | "color" = "question") =>
    http
      .post<SelfTestStartResult>(`/diagnosis/self-test/start`, undefined, {
        params: { mode },
      })
      .then((r) => r.data),

  /** 셀프테스트 채점 (로그인 시 저장) */
  submitSelfTest: (input: SelfTestSubmitInput) =>
    http
      .post<DiagnosisResult>("/diagnosis/self-test", input)
      .then((r) => r.data),

  /** 사진 자동분석 — multipart/form-data, 필드명 image (저장 안 함) */
  submitPhoto: (image: File) => {
    const form = new FormData();
    form.append("image", image);
    return http
      .post<DiagnosisResult>("/diagnosis/photo", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  /** 내 진단 기록 목록 */
  list: (query?: PageQuery): Promise<Paginated<DiagnosisRecord>> =>
    http
      .get<DiagnosisRecord[]>("/diagnosis", { params: query })
      .then((r) => ({ items: r.data, meta: readMeta(r) })),

  get: (id: string) =>
    http.get<DiagnosisRecord>(`/diagnosis/${id}`).then((r) => r.data),

  update: (id: string, input: UpdateDiagnosisInput) =>
    http.patch<DiagnosisRecord>(`/diagnosis/${id}`, input).then((r) => r.data),

  remove: (id: string) =>
    http.delete<void>(`/diagnosis/${id}`).then((r) => r.data),
};
