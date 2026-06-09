"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/icons";
import { useT } from "@/hooks/useT";

/** 섹션 제목 + 전체보기 (목업 기준) */
export function SectionHeader({
  title,
  subtitle,
  moreHref,
}: {
  title: React.ReactNode;
  subtitle?: string;
  moreHref?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>}
      </div>
      {moreHref && <MoreLink href={moreHref} />}
    </div>
  );
}

function MoreLink({ href }: { href: string }) {
  const { t } = useT();
  return (
    <Link
      href={href}
      className="flex items-center gap-0.5 text-xs text-zinc-400 hover:text-zinc-600"
    >
      {t("common.seeAll")}
      <ChevronRightIcon />
    </Link>
  );
}
