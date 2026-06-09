"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { diagnosisApi } from "@/lib/api";
import { qk } from "@/lib/query/keys";
import type {
  DiagnosisResult,
  SelfTestSubmitInput,
} from "@/types";

/** 셀프테스트 단계 세트 조회 (question | color) */
export function useSelfTestStages(mode: "question" | "color") {
  return useQuery({
    queryKey: ["diagnosis", "start", mode],
    queryFn: () => diagnosisApi.start(mode),
    staleTime: Infinity, // 단계 세트는 세션 동안 고정
  });
}

/**
 * 진단 저장 성공 시 관련 캐시 무효화.
 * → 홈/마이페이지의 latestDiagnosis(=/users/me)가 즉시 갱신되어 퍼스널 컬러가 바로 반영됨.
 */
function invalidateAfterDiagnosis(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: qk.users.me });
  void qc.invalidateQueries({ queryKey: qk.users.myPage });
  void qc.invalidateQueries({ queryKey: qk.diagnosis.all });
}

/** 셀프테스트 채점 */
export function useSubmitSelfTest() {
  const qc = useQueryClient();
  return useMutation<DiagnosisResult, Error, SelfTestSubmitInput>({
    mutationFn: (input) => diagnosisApi.submitSelfTest(input),
    onSuccess: () => invalidateAfterDiagnosis(qc),
  });
}

/** 사진 자동분석 */
export function useSubmitPhoto() {
  const qc = useQueryClient();
  return useMutation<DiagnosisResult, Error, File>({
    mutationFn: (image) => diagnosisApi.submitPhoto(image),
    onSuccess: () => invalidateAfterDiagnosis(qc),
  });
}

/** 진단 결과 상세 (저장된 기록 — 로그인) */
export function useDiagnosisRecord(id: string, enabled = true) {
  return useQuery({
    queryKey: qk.diagnosis.detail(id),
    queryFn: () => diagnosisApi.get(id),
    enabled: enabled && !!id,
  });
}
