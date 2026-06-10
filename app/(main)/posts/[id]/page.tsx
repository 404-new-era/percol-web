"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { HeartIcon } from "@/components/ui/icons";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
  useAddComment,
  useComments,
  useDeleteComment,
  usePost,
  useToggleLike,
} from "@/hooks/usePosts";
import { cn, imageUrl, seasonLabel, toneLabel } from "@/lib/utils";

/** 스냅 상세 */
export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: post, isLoading, isError } = usePost(id);
  const ensureAuth = useRequireAuth();
  const like = useToggleLike();

  if (isLoading)
    return (
      <div className="py-24 text-center text-sm text-zinc-400">
        불러오는 중…
      </div>
    );
  if (isError || !post)
    return (
      <div className="py-24 text-center text-sm text-zinc-400">
        스냅을 찾을 수 없어요.
      </div>
    );

  const toggleLike = () =>
    ensureAuth(() => like.mutate(post.id), "좋아요는 로그인 후 가능해요.");

  return (
    <div className="mx-auto w-full max-w-lg py-6 pb-20">
      {/* 작성자 */}
      <Link
        href={`/profile/${encodeURIComponent(post.user.nickname)}`}
        className="flex items-center gap-2"
      >
        <Avatar src={post.user.image} name={post.user.nickname} size={36} />
        <span className="text-sm font-semibold text-ink">
          {post.user.nickname}
        </span>
      </Link>

      {/* 사진 */}
      <div className="mt-4 space-y-2">
        {post.images.map((img) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.url}
            src={imageUrl(img.url)}
            alt={post.content}
            className="w-full rounded-2xl"
          />
        ))}
      </div>

      {/* 좋아요 + 시즌 */}
      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={toggleLike}
          className="flex items-center gap-1.5 text-sm font-medium"
        >
          <HeartIcon
            width={22}
            height={22}
            filled={post.liked}
            className={post.liked ? "text-[#e8402e]" : "text-zinc-500"}
          />
          <span className={post.liked ? "text-[#e8402e]" : "text-zinc-600"}>
            {post.likeCount}
          </span>
        </button>
        <div className="flex gap-1.5">
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600">
            {seasonLabel(post.season)} · {toneLabel(post.tone)}톤
          </span>
        </div>
      </div>

      {/* 캡션 */}
      {post.content && (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
          {post.content}
        </p>
      )}

      {/* 태그된 상품 */}
      {post.productTags?.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-bold text-ink">이 코디에 입은 상품</p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {post.productTags.map(({ product }) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="w-28 shrink-0"
              >
                <div
                  className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-zinc-100"
                  style={{ backgroundColor: product.colorHex }}
                >
                  {product.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl(product.imageUrl)}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <p className="mt-1 text-[11px] text-zinc-500">{product.brand}</p>
                <p className="line-clamp-1 text-[11px]">{product.name}</p>
                <p className="text-xs font-bold">
                  {product.price.toLocaleString("ko-KR")}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Comments postId={post.id} />
    </div>
  );
}

function Comments({ postId }: { postId: string }) {
  const { data } = useComments(postId, { limit: 50 });
  const { user } = useAuth();
  const ensureAuth = useRequireAuth();
  const add = useAddComment(postId);
  const del = useDeleteComment(postId);
  const [text, setText] = useState("");

  const comments = data?.items ?? [];

  const submit = () => {
    const v = text.trim();
    if (!v || add.isPending) return;
    ensureAuth(() => {
      add.mutate(v, { onSuccess: () => setText("") });
    }, "댓글은 로그인 후 작성할 수 있어요.");
  };

  return (
    <div className="mt-8 border-t border-zinc-100 pt-5">
      <p className="mb-3 text-sm font-bold text-ink">
        댓글 {comments.length}
      </p>

      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="flex items-start gap-2">
            <Avatar src={c.user.image} name={c.user.nickname} size={28} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-ink">
                {c.user.nickname}
              </p>
              <p className="text-sm text-zinc-700">{c.content}</p>
            </div>
            {user?.id === c.user.id && (
              <button
                onClick={() => del.mutate(c.id)}
                className="text-xs text-zinc-400 hover:text-zinc-600"
              >
                삭제
              </button>
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <p className="py-4 text-center text-xs text-zinc-400">
            첫 댓글을 남겨보세요.
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="댓글 달기…"
          className="h-10 flex-1 rounded-full bg-zinc-100 px-4 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
        <button
          onClick={submit}
          disabled={!text.trim() || add.isPending}
          className={cn(
            "shrink-0 rounded-full px-4 text-sm font-semibold",
            text.trim()
              ? "bg-ink text-white"
              : "bg-zinc-100 text-zinc-400",
          )}
        >
          등록
        </button>
      </div>
    </div>
  );
}
