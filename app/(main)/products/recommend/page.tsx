"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { useHydrated } from "@/hooks/useHydrated";
import { useProducts } from "@/hooks/useProducts";
import { useMe } from "@/hooks/useUser";
import { useT } from "@/hooks/useT";
import { useDiagnosisStore } from "@/store/diagnosis";
import { seasonContent, seasonTheme } from "@/lib/personalColor";
import { cn } from "@/lib/utils";

const CATEGORIES = ["전체", "상의", "하의", "아우터", "원피스", "잡화"];

/** 맞춤 추천 — 내 퍼스널 컬러(시즌/톤)에 맞는 상품. 로그인 latestDiagnosis 또는 비로그인 결과(스토어) 기반 */
export default function RecommendPage() {
  const mounted = useHydrated();
  const { t, locale } = useT();
  const { data: me } = useMe();
  const lastResult = useDiagnosisStore((s) => s.lastResult);

  const season = me?.latestDiagnosis?.season ?? lastResult?.season;
  const tone = me?.latestDiagnosis?.tone ?? lastResult?.tone;

  const [category, setCategory] = useState("전체");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useProducts(
    {
      season,
      tone,
      category: category === "전체" ? undefined : category,
      page,
      limit: 30,
    },
    { enabled: mounted && !!season },
  );

  if (!mounted)
    return (
      <Centered>{t("common.loading")}</Centered>
    );

  // 진단 이력 없음 → 진단 유도 (로그인 아님)
  if (!season) {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center py-20 text-center">
        <h1 className="text-xl font-bold text-ink">
          {t("profile.noDiagnosisTitle")}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {t("profile.noDiagnosisSub")}
        </p>
        <Link
          href="/diagnosis"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white"
        >
          {t("home.onboarding.cta")}
        </Link>
      </div>
    );
  }

  const content = seasonContent(season, locale);
  const th = seasonTheme(season);
  const total = data?.meta.total ?? 0;
  const limit = data?.meta.limit ?? 30;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="py-6 pb-16">
      {/* 헤더 (컴팩트) */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-zinc-400">{t("result.recommendTitle")}</p>
          <h1
            className="text-2xl font-extrabold tracking-tight"
            style={{ color: th.accent }}
          >
            {content.labelKR}
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500">
            {content.tagline} · {total.toLocaleString()}개
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          {content.burst.slice(0, 4).map((hex) => (
            <span
              key={hex}
              className="h-7 w-7 rounded-full ring-1 ring-black/5"
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </div>

      {/* 카테고리 */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCategory(c);
              setPage(1);
            }}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm transition",
              category === c
                ? "bg-ink text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Grid>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-lg bg-zinc-100"
            />
          ))}
        </Grid>
      ) : !data || data.items.length === 0 ? (
        <p className="py-20 text-center text-sm text-zinc-400">
          추천할 상품이 없어요.
        </p>
      ) : (
        <>
          <Grid>
            {data.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Grid>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3 text-sm">
              <button
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 disabled:opacity-40"
              >
                {t("common.prev")}
              </button>
              <span className="text-zinc-500">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 disabled:opacity-40"
              >
                {t("common.next")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {children}
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center py-24 text-sm text-zinc-400">
      {children}
    </div>
  );
}
