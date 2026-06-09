import { imageUrl } from "@/lib/utils";
import type { Post } from "@/types";

interface SnapCardProps {
  /** 실제 게시물 (백엔드 연동 시) */
  post?: Post;
  /** 목업/간이 표시용 */
  nickname?: string;
  coverHex?: string;
  avatarHex?: string;
}

/** 코디 스냅 카드 (목업: 정사각 이미지 + 아바타·아이디 오버레이) */
export function SnapCard({ post, nickname, coverHex, avatarHex }: SnapCardProps) {
  const cover = post?.images[0]?.url;
  const name = post?.user.nickname ?? nickname ?? "";

  return (
    <article className="relative aspect-square w-full overflow-hidden rounded-lg">
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl(cover)}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className="h-full w-full"
          style={{ backgroundColor: coverHex ?? "#e5e1d8" }}
        />
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-black/40 to-transparent px-2 py-1.5">
        <span
          className="h-4 w-4 rounded-full ring-1 ring-white/60"
          style={{ backgroundColor: avatarHex ?? "#e0552b" }}
        />
        <span className="text-[11px] font-medium text-white">{name}</span>
      </div>
    </article>
  );
}
