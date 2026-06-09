"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { postsApi } from "@/lib/api";
import { qk } from "@/lib/query/keys";
import type { PostListQuery } from "@/types";

export function usePosts(query?: PostListQuery) {
  return useQuery({
    queryKey: qk.posts.list(query),
    queryFn: () => postsApi.list(query),
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: qk.posts.detail(id),
    queryFn: () => postsApi.get(id),
    enabled: !!id,
  });
}

export function useToggleLike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => postsApi.toggleLike(id),
    onSuccess: (_data, id) => {
      void qc.invalidateQueries({ queryKey: qk.posts.detail(id) });
      void qc.invalidateQueries({ queryKey: qk.posts.all });
    },
  });
}
