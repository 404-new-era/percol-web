"use client";

import { useRef } from "react";
import { UserIcon } from "@/components/ui/icons";
import { useT } from "@/hooks/useT";

/**
 * 얼굴 사진 선택기 (preview.webp 기준).
 * 선택 시 File과 미리보기 objectURL을 부모로 올린다.
 * - 사진 진단: File을 백엔드로 전송
 * - 색 카드: objectURL만 프론트 합성에 사용 (File 미전송)
 */
export function FacePicker({
  previewUrl,
  onPick,
}: {
  previewUrl?: string;
  onPick: (file: File, url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useT();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onPick(file, URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-zinc-100 ring-1 ring-zinc-200 transition hover:bg-zinc-50"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="선택한 얼굴"
            className="h-full w-full object-cover"
          />
        ) : (
          <UserIcon width={44} height={44} className="text-zinc-400" />
        )}
      </button>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex h-11 items-center rounded-xl bg-ink px-6 text-sm font-semibold text-white hover:opacity-90"
      >
        {t("diagnosis.face.choose")}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
