"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { useMe } from "@/hooks/useUser";
import { useProducts } from "@/hooks/useProducts";
import type { Season, Tone } from "@/types";

/**
 * 시즌/톤에 맞는 상품 그리드.
 * - season/tone prop 주면 그걸로 (결과 페이지 등, 비로그인도 동작)
 * - 없으면 로그인 사용자의 latestDiagnosis로, 그것도 없으면 일반 목록
 */
export function RecommendGrid({
  season: seasonProp,
  tone: toneProp,
  limit = 10,
}: {
  season?: Season;
  tone?: Tone;
  limit?: number;
}) {
  const { data: me } = useMe();
  const season = seasonProp ?? me?.latestDiagnosis?.season;
  const tone = toneProp ?? me?.latestDiagnosis?.tone;
  const { data, isLoading } = useProducts({ season, tone, limit });

  if (isLoading)
    return (
      <Grid>
        {Array.from({ length: Math.min(limit, 5) }).map((_, i) => (
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
