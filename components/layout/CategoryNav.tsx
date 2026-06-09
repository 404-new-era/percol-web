"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MenuIcon } from "@/components/ui/icons";
import { useT } from "@/hooks/useT";

/** 카테고리 | 추천 랭킹 세일 진단 스냅 브랜드 (목업 기준) */
const NAV = [
  { key: "nav.recommend", href: "/" },
  { key: "nav.ranking", href: "/products?sort=recent" },
  { key: "nav.sale", href: "/products" },
  { key: "nav.diagnosis", href: "/diagnosis" },
  { key: "nav.snap", href: "/posts" },
  { key: "nav.brand", href: "/products" },
];

export function CategoryNav() {
  const pathname = usePathname();
  const { t } = useT();
  return (
    <nav className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 pb-2 text-sm">
      <button className="flex items-center gap-1 font-medium text-ink">
        <MenuIcon width={18} height={18} />
        {t("nav.category")}
      </button>
      <span className="h-3 w-px bg-zinc-200" />
      {NAV.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("?")[0]);
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
              <span className="absolute -bottom-[3px] left-0 h-0.5 w-full bg-brand" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
