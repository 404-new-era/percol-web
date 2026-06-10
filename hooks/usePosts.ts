"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { postsApi } from "@/lib/api";
import { qk } from "@/lib/query/keys";
import type { CreatePostInput, PageQuery, PostListQuery } from "@/types";

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

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePostInput) => postsApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.posts.all }),
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

// ── 댓글 ──
export function useComments(postId: string, query?: PageQuery) {
  return useQuery({
    queryKey: qk.posts.comments(postId, query),
    queryFn: () => postsApi.listComments(postId, query),
    enabled: !!postId,
  });
}

export function useAddComment(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => postsApi.addComment(postId, content),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
      void qc.invalidateQueries({ queryKey: qk.posts.detail(postId) });
    },
  });
}

export function useDeleteComment(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => postsApi.removeComment(commentId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
      void qc.invalidateQueries({ queryKey: qk.posts.detail(postId) });
    },
  });
}
