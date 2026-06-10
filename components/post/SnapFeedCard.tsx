import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { CommentIcon, HeartIcon } from "@/components/ui/icons";
import { imageUrl } from "@/lib/utils";
import type { Post } from "@/types";

/** 무신사풍 스냅 카드 (메이슨리 — 사진 자연 비율 + 유저/좋아요 오버레이) */
export function SnapFeedCard({ post }: { post: Post }) {
  const cover = post.images[0]?.url;
  return (
    <Link
      href={`/posts/${post.id}`}
      className="mb-4 block break-inside-avoid overflow-hidden rounded-xl bg-zinc-100"
    >
      <div className="relative">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl(cover)}
            alt={post.content}
            loading="lazy"
            className="w-full align-top"
          />
        ) : (
          <div className="aspect-[3/4] w-full bg-zinc-200" />
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/55 to-transparent px-2.5 pb-2 pt-6">
          <span className="flex min-w-0 items-center gap-1.5">
            <Avatar src={post.user.image} name={post.user.nickname} size={22} />
            <span className="truncate text-xs font-medium text-white">
              {post.user.nickname}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-2 text-xs font-medium text-white">
            <span className="flex items-center gap-1">
              <HeartIcon width={13} height={13} filled={post.liked} />
              {post.likeCount}
            </span>
            <span className="flex items-center gap-1">
              <CommentIcon width={13} height={13} />
              {post.commentCount}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
