"use client";

import { useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { bookmarksApi } from "@/lib/api";
import { qk } from "@/lib/query/keys";
import { useAuth } from "./useAuth";
import type { PageQuery } from "@/types";

export function useBookmarks(query?: PageQuery) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: qk.bookmarks.list(query),
    queryFn: () => bookmarksApi.list(query),
    enabled: isAuthenticated,
  });
}

/** 찜한 상품 id 집합 (찜 상태 표시용, 로그인 시에만) */
export function useBookmarkIds(): Set<string> {
  const { isAuthenticated } = useAuth();
  const { data } = useQuery({
    queryKey: ["bookmarks", "ids"],
    queryFn: () => bookmarksApi.list({ limit: 50 }),
    enabled: isAuthenticated,
  });
  return useMemo(
    () => new Set((data?.items ?? []).map((b) => b.product.id)),
    [data],
  );
}

export function useToggleBookmark() {
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["bookmarks"] });
  return {
    add: useMutation({
      mutationFn: (productId: string) => bookmarksApi.add(productId),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (productId: string) => bookmarksApi.remove(productId),
      onSuccess: invalidate,
    }),
  };
}
