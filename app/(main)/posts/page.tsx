"use client";

import { useState } from "react";
import Link from "next/link";
import { SnapFeedCard } from "@/components/post/SnapFeedCard";
import { usePosts } from "@/hooks/usePosts";
import { cn, dedupeById } from "@/lib/utils";
import type { Season } from "@/types";

const SEASON_FILTERS: { key?: Season; label: string }[] = [
  { key: undefined, label: "전체" },
  { key: "SPRING", label: "봄" },
  { key: "SUMMER", label: "여름" },
  { key: "FALL", label: "가을" },
  { key: "WINTER", label: "겨울" },
];

/** 코디 스냅 피드 — 무신사풍 메이슨리 */
export default function PostsPage() {
  const [season, setSeason] = useState<Season | undefined>(undefined);
  const { data, isLoading } = usePosts({ season, limit: 30 });
  const posts = dedupeById(data?.items ?? []);

  return (
    <div className="py-6 pb-20">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-ink">코디 스냅</h1>
        <Link
          href="/posts/new"
          className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
        >
          + 스냅 올리기
        </Link>
      </div>

      {/* 시즌 필터 */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {SEASON_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setSeason(f.key)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm transition",
              season === f.key
                ? "bg-ink text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="columns-2 gap-4 sm:columns-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="mb-4 break-inside-avoid rounded-xl bg-zinc-100"
              style={{ height: 180 + (i % 3) * 70 }}
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-sm text-zinc-500">
            {season ? "이 시즌 스냅이 아직 없어요." : "아직 올라온 스냅이 없어요."}
          </p>
          <Link
            href="/posts/new"
            className="mt-4 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white"
          >
            첫 스냅 올리기
          </Link>
        </div>
      ) : (
        <div className="columns-2 gap-4 sm:columns-3">
          {posts.map((p) => (
            <SnapFeedCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
