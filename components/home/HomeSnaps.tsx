"use client";

import Link from "next/link";
import { SnapFeedCard } from "@/components/post/SnapFeedCard";
import { usePosts } from "@/hooks/usePosts";
import { dedupeById } from "@/lib/utils";

/** 홈 코디 스냅 — 최신 게시물 (없으면 첫 스냅 유도) */
export function HomeSnaps() {
  const { data, isLoading } = usePosts({ limit: 8 });
  const posts = dedupeById(data?.items ?? []).slice(0, 8);

  if (isLoading)
    return (
      <div className="columns-2 gap-4 sm:columns-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="mb-4 break-inside-avoid rounded-xl bg-zinc-100"
            style={{ height: 160 + (i % 2) * 60 }}
          />
        ))}
      </div>
    );

  if (posts.length === 0)
    return (
      <Link
        href="/posts/new"
        className="flex items-center justify-between rounded-2xl border border-dashed border-zinc-300 p-5 hover:bg-zinc-50"
      >
        <div>
          <p className="text-sm font-semibold text-ink">
            아직 올라온 스냅이 없어요
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">
            첫 코디 스냅을 올려보세요
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">
          스냅 올리기
        </span>
      </Link>
    );

  return (
    <div className="columns-2 gap-4 sm:columns-4">
      {posts.map((p) => (
        <SnapFeedCard key={p.id} post={p} />
      ))}
    </div>
  );
}
