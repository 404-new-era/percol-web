"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MenuIcon } from "@/components/ui/icons";
import { useT } from "@/hooks/useT";
import { useMe } from "@/hooks/useUser";
import { seasonTheme } from "@/lib/personalColor";

/** 카테고리 | 추천 랭킹 세일 진단 스냅 브랜드 (목업 기준) — 각 탭 고유 경로 */
const NAV = [
  { key: "nav.recommend", href: "/" },
  { key: "nav.ranking", href: "/products" },
  { key: "nav.sale", href: "/sale" },
  { key: "nav.diagnosis", href: "/diagnosis" },
  { key: "nav.snap", href: "/posts" },
  { key: "nav.brand", href: "/brands" },
];

/** 정확 매칭 (자기 경로 또는 그 하위 경로일 때만 활성) */
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function CategoryNav() {
  const pathname = usePathname();
  const { t } = useT();
  // 활성 탭 underline 색 = 내 퍼스널 컬러 시즌 색 (진단 있으면), 없으면 브랜드색
  const { data: me } = useMe();
  const season = me?.latestDiagnosis?.season;
  const underlineColor = season
    ? seasonTheme(season).accent
    : "var(--color-ink)";
  return (
    <nav className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 pb-2 text-sm">
      <button className="flex items-center gap-1 font-medium text-ink">
        <MenuIcon width={18} height={18} />
        {t("nav.category")}
      </button>
      <span className="h-3 w-px bg-zinc-200" />
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "relative pb-1 text-zinc-500 hover:text-ink",
              active && "font-semibold text-ink",
            )}
          >
            {t(item.key)}
            {active && (
              <span
                className="absolute -bottom-[3px] left-0 h-0.5 w-full rounded-full"
                style={{ backgroundColor: underlineColor }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
