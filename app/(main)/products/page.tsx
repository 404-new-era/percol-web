"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import type { ProductSort } from "@/types";

const SORTS: { key: ProductSort; label: string }[] = [
  { key: "recent", label: "최신순" },
  { key: "price_asc", label: "낮은 가격순" },
  { key: "price_desc", label: "높은 가격순" },
];

/** 상품 목록 — 필터/정렬/페이지 (실 API) */
export default function ProductsPage() {
  const [sort, setSort] = useState<ProductSort>("recent");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching } = useProducts({
    sort,
    page,
    limit: 40,
  });

  const total = data?.meta.total ?? 0;
  const limit = data?.meta.limit ?? 40;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="py-6 pb-16">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-ink">
          상품 <span className="text-sm font-normal text-zinc-400">{total}</span>
        </h1>
        <div className="flex gap-1">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setSort(s.key);
                setPage(1);
              }}
              className={`rounded-full px-3 py-1 text-xs ${
                sort === s.key
                  ? "bg-ink text-white"
                  : "text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Grid>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-lg bg-zinc-100"
            />
          ))}
        </Grid>
      ) : isError || !data ? (
        <p className="py-20 text-center text-sm text-zinc-400">
          상품을 불러오지 못했어요.
        </p>
      ) : (
        <>
          <Grid>
            {data.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Grid>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3 text-sm">
              <button
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 disabled:opacity-40"
              >
                이전
              </button>
              <span className="text-zinc-500">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 disabled:opacity-40"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {children}
    </div>
  );
}
