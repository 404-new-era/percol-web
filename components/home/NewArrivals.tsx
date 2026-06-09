"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { dedupeById } from "@/lib/utils";

/** 최신 등록 상품 10개 */
export function NewArrivals() {
  const { data, isLoading } = useProducts({ sort: "recent", limit: 10 });
  const items = dedupeById(data?.items ?? []).slice(0, 10);

  if (isLoading)
    return (
      <Grid>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] animate-pulse rounded-lg bg-zinc-100"
          />
        ))}
      </Grid>
    );

  if (items.length === 0) return null;

  return (
    <Grid>
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </Grid>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-5">
      {children}
    </div>
  );
}
