"use client";

import Link from "next/link";
import { CameraIcon } from "@/components/ui/icons";
import { EyedropperOrb } from "./EyedropperOrb";
import { useAuth } from "@/hooks/useAuth";
import { useMe } from "@/hooks/useUser";
import { useT } from "@/hooks/useT";
import { seasonContent, seasonTheme } from "@/lib/personalColor";
import type { Season, Tone } from "@/types";

/**
 * 홈 히어로 — 내 퍼스널 컬러 진단 결과 배너.
 * 진단 결과 반영은 "로그인 사용자"만 (서버 저장값 latestDiagnosis 기준).
 * 비로그인은 테스트했어도 홈엔 반영하지 않고 온보딩 → 로그인 유도.
 */
export function DiagnosisBanner() {
  const { isLoading } = useAuth();
  const { data: me, isLoading: meLoading } = useMe();

  if (isLoading || meLoading) return <BannerSkeleton />;

  const summary = me?.latestDiagnosis ?? null;
  if (!summary) return <OnboardingBanner />;

  return <ResultBanner season={summary.season} tone={summary.tone} />;
}

function ResultBanner({ season }: { season: Season; tone: Tone }) {
  const { t, locale } = useT();
  const content = seasonContent(season, locale);
  const th = seasonTheme(season);
  return (
    <section
      className="mt-4 overflow-hidden rounded-2xl px-7 py-8"
      style={{ backgroundColor: th.bg }}
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex flex-col">
          <span className="text-sm" style={{ color: th.textMuted }}>
            {t("home.myColor")}
          </span>
          <h1
            className="mt-1 text-[40px] font-extrabold leading-tight tracking-tight"
            style={{ color: th.text }}
          >
            {content.labelKR}
          </h1>
          <p className="mt-1 text-sm font-medium" style={{ color: th.accent }}>
            {content.tagline}
          </p>

          <div className="mt-4 flex gap-2">
            {content.burst.slice(0, 4).map((hex) => (
              <span
                key={hex}
                className="h-9 w-9 rounded-full ring-1 ring-black/5"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/products/recommend"
              className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-white hover:opacity-90"
            >
              {t("home.seePicks")}
            </Link>
            <Link
              href="/diagnosis"
              className="inline-flex h-11 items-center rounded-full border bg-white/70 px-5 text-sm font-medium hover:bg-white"
              style={{ color: th.text, borderColor: th.chip }}
            >
              {t("common.retake")}
            </Link>
          </div>
        </div>

        {/* 시즌 컬러 오브 (스포이드) */}
        <EyedropperOrb
          colors={content.burst}
          size={160}
          className="hidden shrink-0 sm:block"
        />
      </div>
    </section>
  );
}

function OnboardingBanner() {
  const { t } = useT();
  return (
    <section className="mt-4 overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 px-7 py-9">
      <div className="flex items-center justify-between gap-6">
        <div className="flex flex-col">
          <span className="text-sm text-zinc-400">
            {t("home.onboarding.kicker")}
          </span>
          <h1 className="mt-1 whitespace-pre-line text-3xl font-bold leading-snug tracking-tight text-ink">
            {t("home.onboarding.title")}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {t("home.onboarding.desc")}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/diagnosis"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white hover:opacity-90"
            >
              <CameraIcon width={18} height={18} />
              {t("home.onboarding.cta")}
            </Link>
          </div>
        </div>

        {/* 중립: '모든 색을 발견한다' 무지개 오브 (스포이드) */}
        <EyedropperOrb
          colors={["#ff8d7a", "#ffd24c", "#9acd32", "#4cc9d6", "#7d6bb0", "#e83e8c"]}
          size={160}
          className="hidden shrink-0 sm:block"
        />
      </div>
    </section>
  );
}

function BannerSkeleton() {
  return (
    <section className="mt-4 h-48 animate-pulse rounded-2xl bg-zinc-100" />
  );
}
