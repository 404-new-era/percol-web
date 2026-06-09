"use client";

import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { qk } from "@/lib/query/keys";
import { dedupeById } from "@/lib/utils";
import type { ProductListQuery } from "@/types";

export function useProducts(
  query?: ProductListQuery,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: qk.products.list(query),
    queryFn: () => productsApi.list(query),
    enabled: options?.enabled ?? true,
  });
}

/**
 * 필터에 맞는 상품을 페이지를 돌며 전부 모아온다 (색 필터처럼 클라이언트 후처리용).
 * 백엔드가 color 필터를 지원하면 이건 제거 가능.
 */
export function useAllProducts(
  query?: ProductListQuery,
  options?: { enabled?: boolean; maxPages?: number },
) {
  const maxPages = options?.maxPages ?? 20;
  return useQuery({
    queryKey: ["products", "all", maxPages, query ?? {}],
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
    queryFn: async () => {
      const limit = 50;
      const items: Awaited<ReturnType<typeof productsApi.list>>["items"] = [];
      for (let page = 1; page <= maxPages; page++) {
        const res = await productsApi.list({ ...query, page, limit });
        items.push(...res.items);
        if (items.length >= res.meta.total || res.items.length < limit) break;
      }
      return dedupeById(items);
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: qk.products.detail(id),
    queryFn: () => productsApi.get(id),
    enabled: !!id,
  });
}

/** 내 진단 기반 추천 (진단 없으면 400 → 호출부에서 안내) */
export function useRecommend(enabled = true) {
  return useQuery({
    queryKey: qk.products.recommend,
    queryFn: () => productsApi.recommend(),
    enabled,
  });
}
