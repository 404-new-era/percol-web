"use client";

import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { qk } from "@/lib/query/keys";
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
