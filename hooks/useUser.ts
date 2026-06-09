"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api";
import { qk } from "@/lib/query/keys";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "./useAuth";
import type { UpdateMeInput } from "@/types";

/** 내 정보 + latestDiagnosis (로그인 시에만 조회) */
export function useMe() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: qk.users.me,
    queryFn: () => usersApi.me(),
    enabled: isAuthenticated,
  });
}

/** 마이페이지 카운트 (게시물/북마크/진단) */
export function useMyPage() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: qk.users.myPage,
    queryFn: () => usersApi.myPage(),
    enabled: isAuthenticated,
  });
}

/** 내 정보 수정 (닉네임/소개/이미지) — 성공 시 캐시·헤더 유저 갱신 */
export function useUpdateMe() {
  const qc = useQueryClient();
  const hydrate = useAuthStore((s) => s.hydrate);
  return useMutation({
    mutationFn: (input: UpdateMeInput) => usersApi.updateMe(input),
    onSuccess: (me) => {
      qc.setQueryData(qk.users.me, me);
      void hydrate(); // 헤더의 /auth/me 유저도 갱신
    },
  });
}
