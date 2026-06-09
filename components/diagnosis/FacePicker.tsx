"use client";

import { useRef, useState } from "react";
import { UserIcon } from "@/components/ui/icons";
import { useT } from "@/hooks/useT";
import { CameraModal } from "./CameraModal";

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
  const galleryRef = useRef<HTMLInputElement>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const { t } = useT();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onPick(file, URL.createObjectURL(file));
    e.target.value = ""; // 같은 파일 다시 선택 가능하게
  };

  const handleCapture = (file: File) => {
    onPick(file, URL.createObjectURL(file));
    setCameraOpen(false);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <button
        type="button"
        onClick={() => galleryRef.current?.click()}
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

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setCameraOpen(true)}
          className="inline-flex h-11 items-center rounded-xl bg-ink px-5 text-sm font-semibold text-white hover:opacity-90"
        >
          📷 {t("diagnosis.face.camera")}
        </button>
        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          className="inline-flex h-11 items-center rounded-xl border border-zinc-300 px-5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          {t("diagnosis.face.choose")}
        </button>
      </div>

      {/* 앨범 선택 */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />

      {cameraOpen && (
        <CameraModal
          onCapture={handleCapture}
          onClose={() => setCameraOpen(false)}
        />
      )}
    </div>
  );
}
