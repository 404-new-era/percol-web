"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronRightIcon } from "@/components/ui/icons";
import { useHydrated } from "@/hooks/useHydrated";
import { useProducts } from "@/hooks/useProducts";
import { useT } from "@/hooks/useT";
import { dedupeById } from "@/lib/utils";

const BRANDS = [
  { name: "유니클로", logo: "/assets/brands/uniqlo.png" },
  { name: "탑텐", logo: "/assets/brands/topten.jpg" },
];

/** 페이지 로드마다 유니클로 ↔ 탑텐 번갈아 (localStorage 카운터, 모듈 1회) */
function pickBrand() {
  if (typeof window === "undefined") return BRANDS[0];
  try {
    const last = Number(
      window.localStorage.getItem("percol.brandSpotlight") ?? "1",
    );
    const idx = (last + 1) % BRANDS.length;
    window.localStorage.setItem("percol.brandSpotlight", String(idx));
    return BRANDS[idx];
  } catch {
    return BRANDS[0];
  }
}
const PICK = pickBrand();

// 페이지 로드 시드로 상품 셔플 (새로고침마다 다른 10개)
const SEED = `${Math.floor(Math.random() * 1e9)}`;
function shuffleKey(id: string): number {
  let h = 2166136261;
  const s = id + SEED;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** "유니클로는 어때요?" — 한 브랜드 상품 10개(셔플), 새로고침마다 브랜드 교대 */
export function BrandSpotlight() {
  const mounted = useHydrated();
  const { t } = useT();
  const brand = PICK.name;

  const { data, isLoading } = useProducts(
    { keyword: brand, limit: 50 },
    { enabled: mounted },
  );

  const items = useMemo(
    () =>
      dedupeById(data?.items ?? [])
        .filter((p) => p.brand === brand)
        .sort((a, b) => shuffleKey(a.id) - shuffleKey(b.id))
        .slice(0, 10),
    [data, brand],
  );

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-end justify-between">
        {mounted ? (
          <>
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PICK.logo}
                alt={brand}
                className="h-5 w-auto object-contain"
              />
              {brand}는 어때요?
            </h2>
            <Link
              href={`/brands?brand=${encodeURIComponent(brand)}`}
              className="flex items-center gap-0.5 text-xs text-zinc-400 hover:text-zinc-600"
            >
              {t("common.seeAll")}
              <ChevronRightIcon />
            </Link>
          </>
        ) : (
          <div className="h-6 w-36 animate-pulse rounded bg-zinc-100" />
        )}
      </div>

      {!mounted || isLoading ? (
        <Grid>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-lg bg-zinc-100"
            />
          ))}
        </Grid>
      ) : items.length === 0 ? null : (
        <Grid>
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Grid>
      )}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-5">
      {children}
    </div>
  );
}
