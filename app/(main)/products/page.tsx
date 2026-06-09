"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { SearchIcon } from "@/components/ui/icons";
import { useProducts } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";
import type { ProductSort } from "@/types";

const CATEGORIES = ["전체", "상의", "하의", "아우터", "원피스", "잡화"];
const SORTS: { key: ProductSort; label: string }[] = [
  { key: "recent", label: "최신순" },
  { key: "price_asc", label: "낮은 가격순" },
  { key: "price_desc", label: "높은 가격순" },
];

function ProductsInner() {
  const sp = useSearchParams();

  // URL 쿼리에서 초기값 (헤더 검색 등으로 진입 시)
  const [category, setCategory] = useState(sp.get("category") ?? "전체");
  const [input, setInput] = useState(sp.get("keyword") ?? "");
  const [keyword, setKeyword] = useState(sp.get("keyword") ?? "");
  const [sort, setSort] = useState<ProductSort>("recent");
  const [page, setPage] = useState(1);

  // 엔터 없이 실시간 검색 — 입력 멈추면 300ms 뒤 자동 반영
  useEffect(() => {
    const id = setTimeout(() => {
      setKeyword(input.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(id);
  }, [input]);

  const { data, isLoading, isError, isFetching } = useProducts({
    category: category === "전체" ? undefined : category,
    keyword: keyword || undefined,
    sort,
    page,
    limit: 40,
  });

  const total = data?.meta.total ?? 0;
  const limit = data?.meta.limit ?? 40;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const reset = () => setPage(1);

  return (
    <div className="py-6 pb-16">
      {/* 검색 (입력 즉시 필터) */}
      <div className="relative mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="상품명, 브랜드 검색"
          className="h-11 w-full rounded-xl bg-zinc-100 pl-4 pr-11 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
        {input ? (
          <button
            type="button"
            aria-label="지우기"
            onClick={() => setInput("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-zinc-400 hover:text-ink"
          >
            ×
          </button>
        ) : (
          <SearchIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        )}
      </div>

      {/* 카테고리 탭 */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCategory(c);
              reset();
            }}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm transition",
              category === c
                ? "bg-ink text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 정렬 + 개수 */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-zinc-500">
          {keyword && <b className="text-ink">“{keyword}” </b>}
          {total.toLocaleString()}개
        </span>
        <div className="flex gap-1">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setSort(s.key);
                reset();
              }}
              className={cn(
                "rounded-full px-3 py-1 text-xs",
                sort === s.key
                  ? "bg-ink text-white"
                  : "text-zinc-500 hover:bg-zinc-100",
              )}
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
      ) : data.items.length === 0 ? (
        <p className="py-20 text-center text-sm text-zinc-400">
          조건에 맞는 상품이 없어요.
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

/** 상품 목록 — 카테고리/검색/정렬/페이지 (실 API) */
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-24" />}>
      <ProductsInner />
    </Suspense>
  );
}
