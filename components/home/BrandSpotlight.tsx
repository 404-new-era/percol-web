"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronRightIcon } from "@/components/ui/icons";
import { useHydrated } from "@/hooks/useHydrated";
import { useProducts } from "@/hooks/useProducts";
import { useT } from "@/hooks/useT";
import { dedupeById } from "@/lib/utils";

const BRANDS = [{ name: "유니클로" }, { name: "탑텐" }];

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

/** "유니클로는 어때요?" — 한 브랜드 상품 10개 (새로고침마다 브랜드 교대) */
export function BrandSpotlight() {
  const mounted = useHydrated();
  const { t } = useT();
  const brand = PICK.name;

  const { data, isLoading } = useProducts(
    { keyword: brand, limit: 20 },
    { enabled: mounted },
  );
  // keyword는 부분일치라 정확 브랜드만
  const items = dedupeById(data?.items ?? [])
    .filter((p) => p.brand === brand)
    .slice(0, 10);

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-lg font-bold text-ink">{brand}는 어때요?</h2>
        <Link
          href={`/brands?brand=${encodeURIComponent(brand)}`}
          className="flex items-center gap-0.5 text-xs text-zinc-400 hover:text-zinc-600"
        >
          {t("common.seeAll")}
          <ChevronRightIcon />
        </Link>
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
