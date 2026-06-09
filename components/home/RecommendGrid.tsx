"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { useMe } from "@/hooks/useUser";
import { useProducts } from "@/hooks/useProducts";

/**
 * 홈 추천 아이템 그리드.
 * 로그인 + 진단 있으면 내 시즌/톤으로 필터, 아니면 일반 목록.
 */
export function RecommendGrid() {
  const { data: me } = useMe();
  const season = me?.latestDiagnosis?.season;
  const tone = me?.latestDiagnosis?.tone;
  const { data, isLoading } = useProducts({ season, tone, limit: 10 });

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

  const items = data?.items ?? [];
  if (items.length === 0)
    return (
      <p className="py-10 text-center text-sm text-zinc-400">
        표시할 상품이 없어요.
      </p>
    );

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
