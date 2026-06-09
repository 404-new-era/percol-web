"use client";

import { cn } from "@/lib/utils";
import type { ColorOption } from "@/types";

/**
 * 색 카드 진단 UI — 색 배경 위에 사용자 얼굴(원형)을 올려 보여준다.
 * 얼굴-색 합성은 프론트 담당. faceUrl은 사용자가 올린 얼굴 사진(원형 마스킹).
 */
export function ColorCard({
  color,
  faceUrl,
  selected,
  onSelect,
}: {
  color: ColorOption;
  faceUrl?: string;
  selected?: boolean;
  onSelect?: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(color.id)}
      className={cn(
        "flex aspect-[4/5] items-center justify-center rounded-xl transition",
        selected
          ? "ring-4 ring-zinc-900 ring-offset-2"
          : "hover:ring-2 hover:ring-zinc-300 hover:ring-offset-1",
      )}
      style={{ backgroundColor: color.hex }}
      aria-pressed={selected}
    >
      {/* 얼굴 크기는 카드에 비례 (열 수가 많아도 자동 축소) */}
      <span className="aspect-square w-3/5 overflow-hidden rounded-full bg-zinc-800/20">
        {faceUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={faceUrl}
            alt="얼굴 미리보기"
            className="h-full w-full object-cover"
          />
        )}
      </span>
    </button>
  );
}
