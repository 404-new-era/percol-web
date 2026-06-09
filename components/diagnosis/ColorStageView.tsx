"use client";

import { ColorCard } from "./ColorCard";
import { HelpIcon } from "./HelpIcon";
import { useT } from "@/hooks/useT";
import type { ColorOption } from "@/types";

/** 색 카드 한 단계 — 봄·여름·가을·겨울 4색 (preview (1) 기준, 색은 상위에서 계산해 전달) */
export function ColorStageView({
  colors,
  hint,
  faceUrl,
  selected,
  onSelect,
}: {
  colors: ColorOption[];
  hint?: string;
  faceUrl?: string;
  selected?: string;
  onSelect: (colorId: string) => void;
}) {
  const { t } = useT();
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="flex items-center justify-center gap-1.5">
        <h2 className="text-center text-lg font-bold text-zinc-900">
          {t("diagnosis.color.pickHeading")}
        </h2>
        <HelpIcon hint={hint} />
      </div>
      <p className="mt-1 text-center text-sm text-zinc-500">
        {t("diagnosis.color.pickSub")}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {colors.map((color) => (
          <ColorCard
            key={color.id}
            color={color}
            faceUrl={faceUrl}
            selected={selected === color.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
