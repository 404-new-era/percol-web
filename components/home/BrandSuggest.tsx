"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/icons";

/** 홈 브랜드 추천 — "유니클로는 어때요?" → 브랜드 페이지로 유도 */
const BRANDS = [
  { name: "유니클로", logo: "/assets/brands/uniqlo.png", tint: "#fff0f0" },
  { name: "탑텐", logo: "/assets/brands/topten.jpg", tint: "#eef4ff" },
];

export function BrandSuggest() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {BRANDS.map((b) => (
        <Link
          key={b.name}
          href={`/brands?brand=${encodeURIComponent(b.name)}`}
          className="flex items-center justify-between rounded-2xl border border-zinc-200 p-5 transition hover:border-zinc-300 hover:shadow-sm"
          style={{ backgroundColor: b.tint }}
        >
          <span className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.logo}
              alt={b.name}
              className="h-6 w-auto object-contain"
            />
            <span className="text-sm font-medium text-zinc-600">
              {b.name} 어때요?
            </span>
          </span>
          <ChevronRightIcon className="shrink-0 text-zinc-400" />
        </Link>
      ))}
    </div>
  );
}
