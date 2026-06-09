"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { SearchIcon } from "@/components/ui/icons";
import { useAllProducts, useProducts } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";
import type { Product, ProductSort } from "@/types";

const CATEGORIES = ["전체", "상의", "하의", "아우터", "원피스", "잡화"];
const SORTS: { key: ProductSort; label: string }[] = [
  { key: "recent", label: "최신순" },
  { key: "price_asc", label: "낮은 가격순" },
  { key: "price_desc", label: "높은 가격순" },
];

/** 색 칩 — colorName(한/영) 부분일치로 매칭 */
const COLORS: { label: string; hex: string; match: string[] }[] = [
  { label: "블랙", hex: "#1a1a1a", match: ["블랙", "BLACK"] },
  { label: "화이트", hex: "#ffffff", match: ["화이트", "WHITE"] },
  { label: "그레이", hex: "#9ca3af", match: ["그레이", "GREY", "GRAY"] },
  { label: "네이비", hex: "#1f3a5f", match: ["네이비", "NAVY"] },
  { label: "블루", hex: "#3b82f6", match: ["블루", "BLUE"] },
  { label: "브라운", hex: "#7a5230", match: ["브라운", "BROWN"] },
  { label: "베이지", hex: "#d8c3a5", match: ["베이지", "BEIGE", "NATURAL"] },
  { label: "올리브", hex: "#6b6b3a", match: ["올리브", "카키", "OLIVE", "KHAKI"] },
  { label: "그린", hex: "#4a7a3a", match: ["그린", "GREEN"] },
  { label: "레드", hex: "#c0392b", match: ["레드", "RED", "와인", "WINE"] },
  { label: "오렌지", hex: "#e8772e", match: ["오렌지", "ORANGE"] },
  { label: "옐로", hex: "#f1c40f", match: ["옐로", "YELLOW"] },
  { label: "핑크", hex: "#e8a0c0", match: ["핑크", "PINK"] },
  { label: "크림", hex: "#f5ecd8", match: ["크림", "CREAM", "아이보리", "IVORY"] },
];

function matchColor(colorName: string, label: string): boolean {
  const c = COLORS.find((x) => x.label === label);
  if (!c) return true;
  const name = (colorName ?? "").toUpperCase();
  return c.match.some((m) => name.includes(m.toUpperCase()));
}

const PAGE_SIZE = 40;

function ProductsInner() {
  const sp = useSearchParams();
  const [category, setCategory] = useState(sp.get("category") ?? "전체");
  const [input, setInput] = useState(sp.get("keyword") ?? "");
  const [keyword, setKeyword] = useState(sp.get("keyword") ?? "");
  const [color, setColor] = useState<string | null>(null);
  const [sort, setSort] = useState<ProductSort>("recent");
  const [page, setPage] = useState(1);

  // 엔터 없이 실시간 검색
  useEffect(() => {
    const id = setTimeout(() => {
      setKeyword(input.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(id);
  }, [input]);

  const baseFilter = {
    category: category === "전체" ? undefined : category,
    keyword: keyword || undefined,
    sort,
  };

  // 색 선택 시: 전체 받아와 클라이언트 필터 / 아니면 서버 페이지네이션
  const colorActive = !!color;
  const paged = useProducts(
    { ...baseFilter, page, limit: PAGE_SIZE },
    { enabled: !colorActive },
  );
  const all = useAllProducts(baseFilter, { enabled: colorActive });

  let items: Product[];
  let total: number;
  let loading: boolean;
  if (colorActive) {
    const matched = (all.data ?? []).filter((p) =>
      matchColor(p.colorName, color),
    );
    total = matched.length;
    items = matched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    loading = all.isLoading;
  } else {
    items = paged.data?.items ?? [];
    total = paged.data?.meta.total ?? 0;
    loading = paged.isLoading;
  }
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isError = colorActive ? all.isError : paged.isError;

  return (
    <div className="py-6 pb-16">
      {/* 검색 (입력 즉시 필터) */}
      <div className="relative mb-3">
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

      {/* 카테고리 + 색 필터 (한 줄, 사이 구분선) */}
      <div className="mb-4 flex items-center gap-2 overflow-x-auto py-2">
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

        <span className="mx-1 h-6 w-px shrink-0 bg-zinc-200" />

        {COLORS.map((c) => {
          const active = color === c.label;
          return (
            <button
              key={c.label}
              title={c.label}
              aria-label={c.label}
              onClick={() => {
                setColor(active ? null : c.label);
                setPage(1);
              }}
              className={cn(
                "h-7 w-7 shrink-0 rounded-full ring-1 ring-black/10 transition",
                active && "ring-2 ring-ink ring-offset-2",
              )}
              style={{ backgroundColor: c.hex }}
            />
          );
        })}
        {color && (
          <button
            onClick={() => {
              setColor(null);
              setPage(1);
            }}
            className="shrink-0 whitespace-nowrap px-1 text-xs text-zinc-400 underline"
          >
            해제
          </button>
        )}
      </div>

      {/* 정렬 + 개수 */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-zinc-500">
          {keyword && <b className="text-ink">“{keyword}” </b>}
          {color && <b className="text-ink">{color} </b>}
          {total.toLocaleString()}개
        </span>
        <div className="flex gap-1">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setSort(s.key);
                setPage(1);
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

      {loading ? (
        <Grid>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-lg bg-zinc-100"
            />
          ))}
        </Grid>
      ) : isError ? (
        <p className="py-20 text-center text-sm text-zinc-400">
          상품을 불러오지 못했어요.
        </p>
      ) : items.length === 0 ? (
        <p className="py-20 text-center text-sm text-zinc-400">
          조건에 맞는 상품이 없어요.
        </p>
      ) : (
        <>
          <Grid>
            {items.map((p) => (
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

/** 상품 목록 — 카테고리/색/검색/정렬/페이지 (실 API) */
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-24" />}>
      <ProductsInner />
    </Suspense>
  );
}
