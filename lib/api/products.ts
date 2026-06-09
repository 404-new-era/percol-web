import { http, readMeta } from "./client";
import type {
  Paginated,
  Product,
  ProductListQuery,
  RecommendResult,
} from "@/types";

export const productsApi = {
  list: (query?: ProductListQuery): Promise<Paginated<Product>> =>
    http
      .get<Product[]>("/products", { params: query })
      .then((r) => ({ items: r.data, meta: readMeta(r) })),

  get: (id: string) =>
    http.get<Product>(`/products/${id}`).then((r) => r.data),

  /** 내 진단 기반 추천 — 진단 없으면 400 */
  recommend: () =>
    http.get<RecommendResult>("/products/recommend").then((r) => r.data),
};
