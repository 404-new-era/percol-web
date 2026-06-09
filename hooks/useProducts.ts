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
      // 1페이지로 총 개수 파악 → 나머지 페이지 병렬 요청 (빠르게 전체 수집)
      const first = await productsApi.list({ ...query, page: 1, limit });
      const pages = Math.min(maxPages, Math.ceil(first.meta.total / limit));
      const rest =
        pages > 1
          ? await Promise.all(
              Array.from({ length: pages - 1 }, (_, i) =>
                productsApi.list({ ...query, page: i + 2, limit }),
              ),
            )
          : [];
      const items = [first.items, ...rest.map((r) => r.items)].flat();
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
