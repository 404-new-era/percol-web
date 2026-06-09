"use client";

import { useMemo } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { useMe } from "@/hooks/useUser";
import { useProducts } from "@/hooks/useProducts";
import { dedupeById } from "@/lib/utils";
import type { Season, Tone } from "@/types";

// 페이지 로드마다 1회 생성되는 시드 (새로고침 시 새 값 → 추천 순서 바뀜).
// 모듈 스코프라 렌더 순수성에 영향 없음.
const SHUFFLE_SEED = `${Math.floor(Math.random() * 1e9)}`;

/** id+시드 결정적 해시 (렌더 중 안전) */
function shuffleKey(id: string): number {
  let h = 2166136261;
  const s = id + SHUFFLE_SEED;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * 시즌/톤에 맞는 상품 그리드.
 * - season/tone prop 주면 그걸로 (결과 페이지 등, 비로그인도 동작)
 * - 없으면 로그인 사용자의 latestDiagnosis로, 그것도 없으면 일반 목록
 * 풀(50)을 받아 마운트마다 셔플 → 새로고침할 때마다 다른 상품이 보인다.
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
  const { data, isLoading } = useProducts({ season, tone, limit: 50 });

  // 페이지 로드 시드로 셔플해서 limit개만 (새로고침마다 다른 상품)
  const items = useMemo(() => {
    const pool = dedupeById(data?.items ?? []);
    return [...pool]
      .sort((a, b) => shuffleKey(a.id) - shuffleKey(b.id))
      .slice(0, limit);
  }, [data, limit]);

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
