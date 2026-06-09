"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { SearchIcon } from "@/components/ui/icons";
import { useAllProducts } from "@/hooks/useProducts";
import { cn, dedupeById } from "@/lib/utils";

/** 로고 있는 브랜드 */
const BRAND_LOGOS: Record<string, string> = {
  유니클로: "/assets/brands/uniqlo.png",
  탑텐: "/assets/brands/topten.jpg",
};
/** 상단 고정 브랜드 (오래돼서 샘플에 안 잡혀도 항상 노출) */
const FEATURED = ["유니클로", "탑텐"];
const PAGE_SIZE = 40;

/** 브랜드 페이지 — featured + 검색 + 목록, 선택 브랜드 상품 보기 */
export default function BrandsPage() {
  // 브랜드 목록용 샘플 (10페이지=500개, 191개 브랜드 대부분 포함)
  const { data: sample } = useAllProducts(undefined, { maxPages: 10 });
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("유니클로");
  const [page, setPage] = useState(1);

  const brands = useMemo(() => {
    const m = new Map<string, number>();
    (sample ?? []).forEach((p) => m.set(p.brand, (m.get(p.brand) ?? 0) + 1));
    return [...m.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [sample]);

  const q = query.trim();
  const listed = q ? brands.filter((b) => b.name.includes(q)) : brands;

  // 선택 브랜드 상품: keyword로 받아 정확 브랜드만 (substring 매칭 "클로→유니클로" 방지)
  const { data: brandAll, isLoading } = useAllProducts(
    { keyword: brand },
    { maxPages: 20 },
  );
  const matched = useMemo(
    () => dedupeById((brandAll ?? []).filter((p) => p.brand === brand)),
    [brandAll, brand],
  );
  const total = matched.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const items = matched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pick = (name: string) => {
    setBrand(name);
    setPage(1);
  };

  return (
    <div className="py-6 pb-16">
      <h1 className="mb-4 text-lg font-bold text-ink">브랜드</h1>

      {/* featured */}
      <div className="mb-4 flex gap-2">
        {FEATURED.map((name) => {
          const active = brand === name;
          const logo = BRAND_LOGOS[name];
          return (
            <button
              key={name}
              onClick={() => pick(name)}
              className={cn(
                "flex h-14 flex-1 items-center justify-center rounded-xl border transition",
                active
                  ? "border-ink bg-ink/[0.03]"
                  : "border-zinc-200 hover:border-zinc-300",
              )}
            >
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={name}
                  className="h-6 w-auto object-contain"
                />
              ) : (
                <span className="text-base font-bold text-ink">{name}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 검색 */}
      <div className="relative mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="브랜드 검색"
          className="h-10 w-full rounded-xl bg-zinc-100 pl-4 pr-10 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
        <SearchIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>

      {/* 브랜드 목록 (스크롤) */}
      <div className="mb-6 flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
        {listed.map((b) => (
          <button
            key={b.name}
            onClick={() => pick(b.name)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs transition",
              brand === b.name
                ? "bg-ink text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
            )}
          >
            {b.name}
          </button>
        ))}
        {q && listed.length === 0 && (
          <button
            onClick={() => pick(q)}
            className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600"
          >
            “{q}” 검색
          </button>
        )}
      </div>

      {/* 선택 브랜드 상품 */}
      <div className="mb-3 flex items-center gap-2">
        {BRAND_LOGOS[brand] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={BRAND_LOGOS[brand]}
            alt={brand}
            className="h-6 w-auto object-contain"
          />
        ) : (
          <h2 className="text-base font-bold text-ink">{brand}</h2>
        )}
        <span className="text-sm text-zinc-400">
          {total.toLocaleString()}개
        </span>
      </div>

      {isLoading ? (
        <Grid>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-lg bg-zinc-100"
            />
          ))}
        </Grid>
      ) : items.length === 0 ? (
        <p className="py-16 text-center text-sm text-zinc-400">
          상품이 없어요.
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
