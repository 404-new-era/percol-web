"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { useAuth } from "@/hooks/useAuth";
import { useHydrated } from "@/hooks/useHydrated";
import { useProducts } from "@/hooks/useProducts";
import { useMe } from "@/hooks/useUser";
import { useT } from "@/hooks/useT";
import { seasonContent, seasonTheme } from "@/lib/personalColor";
import { cn, dedupeById } from "@/lib/utils";

import { CATEGORY_TABS as CATEGORIES } from "@/lib/categories";
const PROMPT_SWATCH = ["#ff8d7a", "#f2a9c4", "#5b6b2f", "#1f3a5f"];

/** 맞춤 추천 — 로그인 저장 진단(latestDiagnosis) 기반. 없으면 진단 유도 + 인기 상품 */
export default function RecommendPage() {
  const mounted = useHydrated();
  const { t, locale } = useT();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: me, isLoading: meLoading } = useMe();

  const season = me?.latestDiagnosis?.season;
  const tone = me?.latestDiagnosis?.tone;

  const [category, setCategory] = useState("전체");
  const [page, setPage] = useState(1);

  // 인증·내정보 확정 전엔 결정 보류 (진단 유도 카드 플래시 방지)
  const resolving = !mounted || authLoading || (isAuthenticated && meLoading);

  const hasDiagnosis = !!season;
  const { data, isLoading, isFetching } = useProducts(
    {
      season,
      tone,
      category: category === "전체" ? undefined : category,
      // 정렬 미전달 = 백엔드 기본(rank, 29CM 우선)
      page,
      limit: 30,
    },
    { enabled: !resolving },
  );

  if (resolving) return <RecommendSkeleton />;

  const content = hasDiagnosis ? seasonContent(season, locale) : null;
  const th = hasDiagnosis ? seasonTheme(season) : null;
  const items = dedupeById(data?.items ?? []);
  const total = data?.meta.total ?? 0;
  const limit = data?.meta.limit ?? 30;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="py-6 pb-16">
      {/* 진단 있음: 시즌 헤더 / 없음: 진단 유도 배너 */}
      {hasDiagnosis && content && th ? (
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-zinc-400">
              {t("result.recommendTitle")}
            </p>
            <h1
              className="text-2xl font-extrabold tracking-tight"
              style={{ color: th.accent }}
            >
              {content.labelKR}
            </h1>
            <p className="mt-0.5 text-xs text-zinc-500">
              {content.tagline}
              {!isLoading && ` · ${total.toLocaleString()}개`}
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
      ) : (
        <div className="mb-5">
          <Link
            href="/diagnosis"
            className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
          >
            <span className="grid h-11 w-11 shrink-0 grid-cols-2 gap-0.5 overflow-hidden rounded-xl">
              {PROMPT_SWATCH.map((c) => (
                <span key={c} style={{ backgroundColor: c }} />
              ))}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink">
                {t("profile.noDiagnosisTitle")}
              </p>
              <p className="mt-0.5 truncate text-xs text-zinc-500">
                {t("profile.noDiagnosisSub")}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">
              {t("nav.diagnosis")}
            </span>
          </Link>
          <h1 className="mt-5 text-lg font-bold text-ink">
            {t("result.popular")}
          </h1>
        </div>
      )}

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
      ) : items.length === 0 ? (
        <p className="py-20 text-center text-sm text-zinc-400">
          추천할 상품이 없어요.
        </p>
      ) : (
        <>
          <Grid>
            {items.map((p) => (
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

/** 인증/내정보 확정 전 스켈레톤 (헤더 + 카테고리 + 그리드) */
function RecommendSkeleton() {
  return (
    <div className="py-6 pb-16">
      <div className="mb-5 h-12 w-48 animate-pulse rounded bg-zinc-100" />
      <div className="mb-4 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-14 animate-pulse rounded-full bg-zinc-100"
          />
        ))}
      </div>
      <Grid>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] animate-pulse rounded-lg bg-zinc-100"
          />
        ))}
      </Grid>
    </div>
  );
}
