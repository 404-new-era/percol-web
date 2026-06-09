import type {
  PageQuery,
  PostListQuery,
  ProductListQuery,
} from "@/types";

/** React Query 키 팩토리 — 무효화(invalidate) 일관성을 위해 한 곳에서 관리 */
export const qk = {
  auth: {
    me: ["auth", "me"] as const,
  },
  users: {
    me: ["users", "me"] as const,
    myPage: ["users", "me", "page"] as const,
    profile: (nickname: string) => ["users", nickname] as const,
  },
  diagnosis: {
    all: ["diagnosis"] as const,
    list: (q?: PageQuery) => ["diagnosis", "list", q ?? {}] as const,
    detail: (id: string) => ["diagnosis", id] as const,
  },
  products: {
    all: ["products"] as const,
    list: (q?: ProductListQuery) => ["products", "list", q ?? {}] as const,
    detail: (id: string) => ["products", id] as const,
    recommend: ["products", "recommend"] as const,
  },
  bookmarks: {
    list: (q?: PageQuery) => ["bookmarks", "list", q ?? {}] as const,
  },
  posts: {
    all: ["posts"] as const,
    list: (q?: PostListQuery) => ["posts", "list", q ?? {}] as const,
    detail: (id: string) => ["posts", id] as const,
    comments: (id: string, q?: PageQuery) =>
      ["posts", id, "comments", q ?? {}] as const,
  },
} as const;
