import { http, readMeta } from "./client";
import type { Bookmark, PageQuery, Paginated } from "@/types";

export const bookmarksApi = {
  list: (query?: PageQuery): Promise<Paginated<Bookmark>> =>
    http
      .get<Bookmark[]>("/bookmarks", { params: query })
      .then((r) => ({ items: r.data, meta: readMeta(r) })),

  /** 멱등 — 중복 추가 OK */
  add: (productId: string) =>
    http.post<Bookmark>("/bookmarks", { productId }).then((r) => r.data),

  /** 해제 (없으면 404) */
  remove: (productId: string) =>
    http.delete<void>(`/bookmarks/${productId}`).then((r) => r.data),
};
