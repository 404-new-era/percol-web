"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
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

/** 셀프테스트 채점 */
export function useSubmitSelfTest() {
  return useMutation<DiagnosisResult, Error, SelfTestSubmitInput>({
    mutationFn: (input) => diagnosisApi.submitSelfTest(input),
  });
}

/** 사진 자동분석 */
export function useSubmitPhoto() {
  return useMutation<DiagnosisResult, Error, File>({
    mutationFn: (image) => diagnosisApi.submitPhoto(image),
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
