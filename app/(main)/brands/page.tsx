"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { useAllProducts } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

/** 브랜드 로고 (있는 브랜드만) */
const BRAND_LOGOS: Record<string, string> = {
  유니클로: "/assets/brands/uniqlo.png",
};

const PAGE_SIZE = 40;

/** 브랜드 페이지 — 브랜드별로 분리해서 옷 보기 */
export default function BrandsPage() {
  // 브랜드 목록 + 상품을 한 번에 (샘플 8페이지)
  const { data, isLoading } = useAllProducts(undefined, { maxPages: 8 });
  const [selected, setSelected] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const brands = useMemo(() => {
    const m = new Map<string, number>();
    (data ?? []).forEach((p) => m.set(p.brand, (m.get(p.brand) ?? 0) + 1));
    return [...m.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const active = selected ?? brands[0]?.name ?? null;
  const products = useMemo(
    () => (data ?? []).filter((p) => p.brand === active),
    [data, active],
  );
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const pageItems = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading)
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-sm text-zinc-400">
        브랜드를 불러오는 중…
      </div>
    );

  return (
    <div className="py-6 pb-16">
      <h1 className="mb-4 text-lg font-bold text-ink">브랜드</h1>

      {/* 브랜드 선택 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {brands.map((b) => {
          const isActive = active === b.name;
          const logo = BRAND_LOGOS[b.name];
          return (
            <button
              key={b.name}
              onClick={() => {
                setSelected(b.name);
                setPage(1);
              }}
              className={cn(
                "flex h-12 items-center gap-2 rounded-xl border px-4 transition",
                isActive
                  ? "border-ink bg-ink/[0.03]"
                  : "border-zinc-200 hover:border-zinc-300",
              )}
            >
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt={b.name} className="h-5 w-auto object-contain" />
              ) : (
                <span className="text-sm font-semibold text-ink">{b.name}</span>
              )}
              <span className="text-xs text-zinc-400">{b.count}</span>
            </button>
          );
        })}
      </div>

      {/* 선택 브랜드 상품 */}
      {active && (
        <>
          <div className="mb-3 flex items-center gap-2">
            {BRAND_LOGOS[active] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={BRAND_LOGOS[active]}
                alt={active}
                className="h-6 w-auto object-contain"
              />
            ) : (
              <h2 className="text-base font-bold text-ink">{active}</h2>
            )}
            <span className="text-sm text-zinc-400">
              {products.length.toLocaleString()}개
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {pageItems.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

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
