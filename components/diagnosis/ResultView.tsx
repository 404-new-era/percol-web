"use client";

import Link from "next/link";
import { RecommendGrid } from "@/components/home/RecommendGrid";
import { ShareButton } from "@/components/ui/ShareButton";
import { seasonContent, seasonKR, seasonTheme } from "@/lib/personalColor";
import { useT } from "@/hooks/useT";
import type { DiagnosisResult } from "@/types";

/** 진단 결과 화면 (색상환 burst + 얼굴) */
export function ResultView({
  result,
  faceUrl,
}: {
  result: DiagnosisResult;
  faceUrl?: string;
}) {
  const { t, locale } = useT();
  const content = seasonContent(result.season, locale);
  const th = seasonTheme(result.season);
  const burstGradient = `conic-gradient(${content.burst
    .map(
      (c, i) =>
        `${c} ${(i * 360) / content.burst.length}deg ${((i + 1) * 360) / content.burst.length}deg`,
    )
    .join(", ")})`;

  return (
    <div className="mx-auto w-full max-w-lg pb-20 pt-6 text-center">
      <p className="text-sm text-zinc-400">{t("result.lead")}</p>
      <h1
        className="mt-1 text-4xl font-extrabold tracking-tight"
        style={{ color: th.accent }}
      >
        {content.labelKR}
      </h1>
      <p className="mt-1.5 text-sm text-zinc-500">
        {content.tagline} · {t("result.accuracy")}{" "}
        {Math.round(result.confidence * 100)}%
      </p>

      <div className="mt-3 flex justify-center">
        <ShareButton
          label={t("result.share")}
          title="PerCol"
          text={`내 퍼스널 컬러는 "${content.labelKR}"! 너도 측정해봐`}
          url={
            typeof window !== "undefined"
              ? `${window.location.origin}/diagnosis`
              : "/diagnosis"
          }
          className="rounded-full border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
        />
      </div>

      {/* 색상환 burst + 얼굴 */}
      <div className="relative mx-auto mt-7 h-56 w-56">
        <div
          className="h-full w-full rounded-3xl"
          style={{ background: burstGradient }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="h-24 w-24 overflow-hidden rounded-full bg-white shadow-md ring-4 ring-white">
            {faceUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={faceUrl}
                alt="face"
                className="h-full w-full object-cover"
              />
            )}
          </span>
        </div>
      </div>

      {/* 키워드 */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {content.keywords.map((k) => (
          <span
            key={k}
            className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700"
          >
            {k}
          </span>
        ))}
      </div>

      {/* 설명 */}
      <div className="mt-6 space-y-3 text-left text-sm leading-6 text-zinc-600">
        {content.description.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* 추천 팔레트 (백엔드 recommendPalette) */}
      <Palette title={t("result.recommendPalette")} colors={result.recommendPalette} />

      {/* 자매 / 회피 시즌 */}
      <div className="mt-6 flex justify-center gap-6 text-sm">
        <span className="text-zinc-500">
          {t("result.sister")} ·{" "}
          <b className="text-zinc-800">
            {seasonKR(result.sisterPalette, locale)}
          </b>
        </span>
        <span className="text-zinc-500">
          {t("result.avoid")} ·{" "}
          <b className="text-zinc-800">
            {seasonKR(result.avoidPalette, locale)}
          </b>
        </span>
      </div>

      {/* 내 퍼스널 컬러에 어울리는 옷 추천 */}
      <div className="mt-10 text-left">
        <div className="mb-1 flex items-end justify-between">
          <h2 className="text-base font-bold text-ink">
            {t("result.recommendTitle")}
          </h2>
          <Link
            href="/products/recommend"
            className="text-xs text-zinc-400 hover:text-zinc-600"
          >
            {t("common.seeMore")} ›
          </Link>
        </div>
        <p className="mb-4 text-xs text-zinc-500">{t("result.recommendSub")}</p>
        <RecommendGrid season={result.season} tone={result.tone} limit={10} />
      </div>

      {/* CTA */}
      <div className="mt-10 flex justify-center gap-3">
        <Link
          href="/products/recommend"
          className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white hover:opacity-90"
        >
          {t("result.seeRecommend")}
        </Link>
        <Link
          href="/diagnosis"
          className="inline-flex h-11 items-center rounded-full border border-zinc-300 px-6 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          {t("common.retake")}
        </Link>
      </div>
    </div>
  );
}

function Palette({ title, colors }: { title: string; colors: string[] }) {
  if (!colors?.length) return null;
  return (
    <div className="mt-7">
      <p className="mb-2 text-left text-sm font-semibold text-zinc-800">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {colors.map((hex) => (
          <span
            key={hex}
            title={hex}
            className="h-10 w-10 rounded-lg ring-1 ring-black/5"
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>
    </div>
  );
}
