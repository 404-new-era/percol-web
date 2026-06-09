"use client";

import { useState } from "react";
import { cn, imageUrl } from "@/lib/utils";

/** 사람 실루엣 기본 프로필 (이미지 없거나 로딩 실패 시) */
function DefaultProfile() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[62%] w-[62%] text-zinc-400"
      fill="currentColor"
    >
      <circle cx="12" cy="8.5" r="4" />
      <path d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5Z" />
    </svg>
  );
}

/** 프로필 아바타 — 이미지 없거나 로딩 실패하면 기본 프로필 표시 */
export function Avatar({
  src,
  name,
  size = 64,
  className,
}: {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}) {
  const url = imageUrl(src ?? undefined);
  const [errored, setErrored] = useState(false);

  // src가 바뀌면 에러 상태 초기화 (렌더 중 이전값 비교 — effect 불필요)
  const [prevUrl, setPrevUrl] = useState(url);
  if (url !== prevUrl) {
    setPrevUrl(url);
    setErrored(false);
  }

  const showImage = url && !errored;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={name ?? "프로필"}
          // 구글/소셜 아바타는 referrer 없을 때만 로드되는 경우가 많음
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <DefaultProfile />
      )}
    </span>
  );
}
