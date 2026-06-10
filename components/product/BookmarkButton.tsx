"use client";

import { HeartIcon } from "@/components/ui/icons";
import { useBookmarkIds, useToggleBookmark } from "@/hooks/useBookmarks";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { cn } from "@/lib/utils";

/** 찜 버튼 — 비로그인 클릭 시 로그인 모달, 로그인 시 북마크 토글 */
export function BookmarkButton({
  productId,
  size = 18,
  className,
}: {
  productId: string;
  size?: number;
  className?: string;
}) {
  const ids = useBookmarkIds();
  const { add, remove } = useToggleBookmark();
  const ensureAuth = useRequireAuth();
  const bookmarked = ids.has(productId);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    ensureAuth(() => {
      if (bookmarked) remove.mutate(productId);
      else add.mutate(productId);
    }, "찜은 로그인 후 이용할 수 있어요.");
  };

  return (
    <button
      type="button"
      aria-label="찜"
      aria-pressed={bookmarked}
      onClick={onClick}
      className={cn(
        "transition active:scale-90",
        bookmarked ? "text-[#e8402e]" : "text-zinc-400 hover:text-zinc-600",
        className,
      )}
    >
      <HeartIcon width={size} height={size} filled={bookmarked} />
    </button>
  );
}
