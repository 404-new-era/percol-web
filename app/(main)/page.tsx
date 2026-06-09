"use client";

import { DiagnosisBanner } from "@/components/home/DiagnosisBanner";
import { SectionHeader } from "@/components/home/SectionHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { SnapCard } from "@/components/post/SnapCard";
import { MOCK_RECOMMEND, MOCK_SNAPS } from "@/lib/mock";
import { useT } from "@/hooks/useT";

/**
 * 홈 — 진단결과 배너 + 추천 아이템 + 코디 스냅 (preview.png 기준).
 * 현재 MOCK_* 데이터로 렌더. 추후 useRecommend()/usePosts()로 교체.
 */
export default function HomePage() {
  const { t } = useT();
  return (
    <div className="pb-16">
      <DiagnosisBanner />

      <section className="mt-10">
        <SectionHeader
          title={t("home.recommendTitle")}
          subtitle={t("home.recommendSub")}
          moreHref="/products/recommend"
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-5">
          {MOCK_RECOMMEND.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              rating={p.rating}
              reviewCount={p.reviewCount}
              likeCount={p.likeCount}
              discountRate={p.discountRate}
            />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHeader title={t("home.snapTitle")} moreHref="/posts" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {MOCK_SNAPS.map((s) => (
            <SnapCard
              key={s.id}
              nickname={s.nickname}
              coverHex={s.coverHex}
              avatarHex={s.avatarHex}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
