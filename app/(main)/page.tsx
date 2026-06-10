"use client";

import { DiagnosisBanner } from "@/components/home/DiagnosisBanner";
import { SectionHeader } from "@/components/home/SectionHeader";
import { RecommendGrid } from "@/components/home/RecommendGrid";
import { BrandSuggest } from "@/components/home/BrandSuggest";
import { SnapCard } from "@/components/post/SnapCard";
import { MOCK_SNAPS } from "@/lib/mock";
import { useT } from "@/hooks/useT";

/**
 * 홈 — 진단결과 배너 + 추천 아이템(실 API) + 코디 스냅.
 * 추천 아이템은 RecommendGrid가 /products에서 실데이터 로드.
 * 코디 스냅은 게시물 데이터 들어오기 전까지 MOCK_SNAPS.
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
        <RecommendGrid />
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

      <section className="mt-12">
        <SectionHeader title={t("home.brandTitle")} moreHref="/brands" />
        <BrandSuggest />
      </section>
    </div>
  );
}
