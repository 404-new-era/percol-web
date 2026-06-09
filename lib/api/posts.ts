import { http, readMeta } from "./client";
import type {
  Comment,
  CreatePostInput,
  LikeToggleResult,
  PageQuery,
  Paginated,
  Post,
  PostListQuery,
  UpdatePostInput,
} from "@/types";

export const postsApi = {
  list: (query?: PostListQuery): Promise<Paginated<Post>> =>
    http
      .get<Post[]>("/posts", { params: query })
      .then((r) => ({ items: r.data, meta: readMeta(r) })),

  get: (id: string) => http.get<Post>(`/posts/${id}`).then((r) => r.data),

  create: (input: CreatePostInput) =>
    http.post<Post>("/posts", input).then((r) => r.data),

  update: (id: string, input: UpdatePostInput) =>
    http.patch<Post>(`/posts/${id}`, input).then((r) => r.data),

  remove: (id: string) => http.delete<void>(`/posts/${id}`).then((r) => r.data),

  toggleLike: (id: string) =>
    http.post<LikeToggleResult>(`/posts/${id}/like`).then((r) => r.data),

  // ── 댓글 ──
  listComments: (id: string, query?: PageQuery): Promise<Paginated<Comment>> =>
    http
      .get<Comment[]>(`/posts/${id}/comments`, { params: query })
      .then((r) => ({ items: r.data, meta: readMeta(r) })),

  addComment: (id: string, content: string) =>
    http.post<Comment>(`/posts/${id}/comments`, { content }).then((r) => r.data),

  removeComment: (commentId: string) =>
    http.delete<void>(`/comments/${commentId}`).then((r) => r.data),
};
