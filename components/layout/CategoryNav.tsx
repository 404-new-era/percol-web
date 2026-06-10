"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MenuIcon } from "@/components/ui/icons";
import { useT } from "@/hooks/useT";
import { useMe } from "@/hooks/useUser";
import { seasonTheme } from "@/lib/personalColor";

/** 홈 | 추천(맞춤) 랭킹 진단 스냅 브랜드 — 각 탭 고유 경로 */
const NAV = [
  { key: "nav.home", href: "/" },
  { key: "nav.recommend", href: "/products/recommend" },
  { key: "nav.ranking", href: "/products" },
  { key: "nav.sale", href: "/sale" },
  { key: "nav.diagnosis", href: "/diagnosis" },
  { key: "nav.snap", href: "/posts" },
  { key: "nav.brand", href: "/brands" },
];

/** 현재 경로에 매칭되는 nav href 중 가장 긴 것 (최장 프리픽스 → /products/recommend가 /products보다 우선) */
function activeHref(pathname: string): string | null {
  let best: string | null = null;
  for (const { href } of NAV) {
    const match =
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(`${href}/`);
    if (match && (best === null || href.length > best.length)) best = href;
  }
  return best;
}

export function CategoryNav() {
  const pathname = usePathname();
  const { t } = useT();
  const active = activeHref(pathname);
  // 활성 탭 underline 색 = 내 퍼스널 컬러 시즌 색 (진단 있으면), 없으면 검정
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
        const isActive = active === item.href;
        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={() => window.scrollTo({ top: 0 })}
            className={cn(
              "relative shrink-0 pb-1 text-zinc-500 hover:text-ink",
              isActive && "font-semibold text-ink",
            )}
          >
            {t(item.key)}
            {isActive && (
              <span
                className="absolute -bottom-[3px] left-0 h-0.5 w-full rounded-full transition-colors duration-300"
                style={{ backgroundColor: underlineColor }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
