"use client";

import { cn } from "@/lib/utils";
import type { QuestionStage } from "@/types";

/** 텍스트 문항 한 단계 — 선택지 버튼 목록 */
export function QuestionStageView({
  stage,
  selected,
  onSelect,
}: {
  stage: QuestionStage;
  selected?: string;
  onSelect: (choiceId: string) => void;
}) {
  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="text-center text-lg font-bold text-zinc-900">
        {stage.title}
      </h2>
      <div className="mt-6 flex flex-col gap-3">
        {stage.choices.map((c) => {
          const active = selected === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              className={cn(
                "flex h-14 items-center rounded-xl border px-5 text-left text-sm transition",
                active
                  ? "border-ink bg-ink text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300",
              )}
              aria-pressed={active}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
