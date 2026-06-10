"use client";

import { useState } from "react";
import { ShareIcon } from "./icons";
import { cn } from "@/lib/utils";

/** 공유 버튼 — Web Share API, 미지원 시 링크 복사 */
export function ShareButton({
  title,
  text,
  url,
  label = "공유",
  className,
}: {
  title?: string;
  text: string;
  url: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // 취소/실패 시 복사로 폴백
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <button
      type="button"
      onClick={onShare}
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      <ShareIcon />
      <span>{copied ? "복사됨" : label}</span>
    </button>
  );
}
