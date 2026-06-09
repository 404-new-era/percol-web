"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CategoryNav } from "./CategoryNav";
import { HeaderUser } from "./HeaderUser";
import { LangToggle } from "./LangToggle";
import { HeartIcon, SearchIcon } from "@/components/ui/icons";
import { useT } from "@/hooks/useT";

/** 전역 헤더 — 로고 / 검색 / 언어·찜·프로필 + 하위 카테고리 네비 */
export function Header() {
  const { t } = useT();
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const v = q.trim();
    router.push(v ? `/products?keyword=${encodeURIComponent(v)}` : "/products");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-4 px-4">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-ink"
        >
          percol
        </Link>

        <form onSubmit={onSearch} className="relative flex-1">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("header.search")}
            className="h-9 w-full rounded-lg bg-zinc-100 pl-4 pr-10 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          />
          <button
            type="submit"
            aria-label="검색"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-ink"
          >
            <SearchIcon />
          </button>
        </form>

        <div className="flex items-center gap-3 text-zinc-700">
          <LangToggle />
          <Link href="/bookmarks" aria-label="찜" className="hover:text-brand">
            <HeartIcon />
          </Link>
          <HeaderUser />
        </div>
      </div>
      <CategoryNav />
    </header>
  );
}
