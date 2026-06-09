"use client";

import Link from "next/link";
import {
  CameraIcon,
  ChecklistIcon,
  ChevronRightIcon,
  ClockIcon,
} from "@/components/ui/icons";
import { useT } from "@/hooks/useT";

/** 진단 시작 — 방식 선택 */
export default function DiagnosisPage() {
  const { t } = useT();
  return (
    <div className="mx-auto w-full max-w-xl py-12">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand">
          {t("diagnosis.kicker")}
        </p>
        <h1 className="mt-2 text-[26px] font-bold leading-tight text-ink">
          {t("diagnosis.chooseTitle")}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{t("diagnosis.chooseSub")}</p>
      </div>

      <div className="mt-9 flex flex-col gap-3.5">
        <MethodCard
          href="/diagnosis/photo"
          title={t("diagnosis.photo.title")}
          desc={t("diagnosis.photo.desc")}
          meta={t("diagnosis.photo.meta")}
          badge={t("diagnosis.best")}
          visual={
            <Visual tint="#fbe9e0" color="#e0552b">
              <CameraIcon width={26} height={26} />
            </Visual>
          }
        />

        <MethodCard
          href="/diagnosis/color-test"
          title={t("diagnosis.color.title")}
          desc={t("diagnosis.color.desc")}
          meta={t("diagnosis.color.meta")}
          visual={<SwatchVisual />}
        />

        <MethodCard
          href="/diagnosis/self-test"
          title={t("diagnosis.question.title")}
          desc={t("diagnosis.question.desc")}
          meta={t("diagnosis.question.meta")}
          visual={
            <Visual tint="#eef1f6" color="#4a5a78">
              <ChecklistIcon width={24} height={24} />
            </Visual>
          }
        />
      </div>
    </div>
  );
}

function MethodCard({
  href,
  title,
  desc,
  meta,
  badge,
  visual,
}: {
  href: string;
  title: string;
  desc: string;
  meta: string;
  badge?: string;
  visual: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
    >
      {visual}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-ink">{title}</h2>
          {badge && (
            <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-sm text-zinc-500">{desc}</p>
        <span className="mt-1.5 inline-flex items-center gap-1 text-xs text-zinc-400">
          <ClockIcon />
          {meta}
        </span>
      </div>

      <ChevronRightIcon className="shrink-0 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-500" />
    </Link>
  );
}

function Visual({
  tint,
  color,
  children,
}: {
  tint: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
      style={{ backgroundColor: tint, color }}
    >
      {children}
    </span>
  );
}

/** 색 카드 방식 시각화 — 2×2 미니 스와치 (시즌 4색) */
function SwatchVisual() {
  const colors = ["#ff8d7a", "#f2a9c4", "#5b6b2f", "#1f3a5f"];
  return (
    <span className="grid h-14 w-14 shrink-0 grid-cols-2 gap-0.5 overflow-hidden rounded-2xl">
      {colors.map((c) => (
        <span key={c} style={{ backgroundColor: c }} />
      ))}
    </span>
  );
}
