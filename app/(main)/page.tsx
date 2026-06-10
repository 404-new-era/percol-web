"use client";

import { DiagnosisBanner } from "@/components/home/DiagnosisBanner";
import { SectionHeader } from "@/components/home/SectionHeader";
import { RecommendGrid } from "@/components/home/RecommendGrid";
import { BrandSpotlight } from "@/components/home/BrandSpotlight";
import { HomeSnaps } from "@/components/home/HomeSnaps";
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
        <HomeSnaps />
      </section>

      <BrandSpotlight />
    </div>
  );
}
