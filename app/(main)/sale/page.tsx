"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { useAllProducts } from "@/hooks/useProducts";
import { cn, dedupeById } from "@/lib/utils";
import type { Product } from "@/types";

const CATEGORIES = ["전체", "상의", "하의", "아우터", "원피스", "잡화"];
const SORTS = [
  { key: "discount", label: "할인율순" },
  { key: "price_asc", label: "낮은 가격순" },
  { key: "price_desc", label: "높은 가격순" },
] as const;
type SortKey = (typeof SORTS)[number]["key"];
const PAGE_SIZE = 40;

/** 세일 — 할인(discountRate) 있는 상품만 (백엔드 세일 필터 없어 클라 필터) */
export default function SalePage() {
  const [category, setCategory] = useState("전체");
  const [sort, setSort] = useState<SortKey>("discount");
  const [page, setPage] = useState(1);

  // 전체 수집 후 세일만 필터
  const { data, isLoading } = useAllProducts(
    { category: category === "전체" ? undefined : category },
    { maxPages: 40 },
  );

  const saleItems = useMemo(() => {
    const items = dedupeById(data ?? []).filter(
      (p) => p.discountRate != null && p.discountRate > 0,
    );
    const cmp: Record<SortKey, (a: Product, b: Product) => number> = {
      discount: (a, b) => (b.discountRate ?? 0) - (a.discountRate ?? 0),
      price_asc: (a, b) => a.price - b.price,
      price_desc: (a, b) => b.price - a.price,
    };
    return [...items].sort(cmp[sort]);
  }, [data, sort]);

  const total = saleItems.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageItems = saleItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="py-6 pb-16">
      <h1 className="mb-1 text-lg font-bold text-ink">
        세일 <span className="text-[#e8402e]">SALE</span>
      </h1>
      <p className="mb-4 text-xs text-zinc-500">
        지금 할인 중인 상품 {total.toLocaleString()}개
      </p>

      {/* 카테고리 */}
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCategory(c);
              setPage(1);
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

      {/* 정렬 */}
      <div className="mb-4 flex justify-end gap-1">
        {SORTS.map((s) => (
          <button
            key={s.key}
            onClick={() => {
              setSort(s.key);
              setPage(1);
            }}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs",
              sort === s.key
                ? "bg-ink text-white"
                : "text-zinc-500 hover:bg-zinc-100",
            )}
          >
            {s.label}
          </button>
        ))}
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
      ) : pageItems.length === 0 ? (
        <p className="py-20 text-center text-sm text-zinc-400">
          할인 중인 상품이 없어요.
        </p>
      ) : (
        <>
          <Grid>
            {pageItems.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Grid>
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3 text-sm">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 disabled:opacity-40"
              >
                이전
              </button>
              <span className="text-zinc-500">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
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
