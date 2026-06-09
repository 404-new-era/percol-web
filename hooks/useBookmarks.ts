"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { bookmarksApi } from "@/lib/api";
import { qk } from "@/lib/query/keys";
import type { PageQuery } from "@/types";

export function useBookmarks(query?: PageQuery) {
  return useQuery({
    queryKey: qk.bookmarks.list(query),
    queryFn: () => bookmarksApi.list(query),
  });
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
