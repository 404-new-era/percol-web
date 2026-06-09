"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FacePicker } from "@/components/diagnosis/FacePicker";
import { Button } from "@/components/ui/Button";
import { LockIcon } from "@/components/ui/icons";
import { useSubmitPhoto } from "@/hooks/useDiagnosis";
import { useT } from "@/hooks/useT";
import { useDiagnosisStore } from "@/store/diagnosis";
import { fileToThumbnailDataUrl } from "@/lib/image";

/** 사진 자동분석 — 얼굴 업로드 → /diagnosis/photo (사진 미저장) */
export default function PhotoDiagnosisPage() {
  const router = useRouter();
  const { t } = useT();
  const [file, setFile] = useState<File>();
  const [faceUrl, setFaceUrl] = useState<string>();
  const submit = useSubmitPhoto();
  const setLastResult = useDiagnosisStore((s) => s.setLastResult);

  const handleAnalyze = () => {
    if (!file) return;
    submit.mutate(file, {
      onSuccess: (result) => {
        setLastResult(result, faceUrl);
        router.push(`/diagnosis/result/${result.id ?? "latest"}`);
      },
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center py-14 text-center">
      <FacePicker
        previewUrl={faceUrl}
        onPick={async (f, url) => {
          setFile(f);
          // 결과 새로고침 복원을 위해 dataURL로 보존 (실패 시 objectURL 폴백)
          try {
            setFaceUrl(await fileToThumbnailDataUrl(f));
          } catch {
            setFaceUrl(url);
          }
        }}
      />

      <p className="mt-6 text-sm text-zinc-700">
        {t("diagnosis.photo.pickGuide")}
      </p>

      <div className="mt-5 w-full rounded-xl bg-zinc-50 p-4 text-left">
        <p className="flex items-center gap-1.5 text-sm font-medium text-zinc-700">
          <LockIcon />
          {t("diagnosis.photo.noteTitle")}
        </p>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          {t("diagnosis.photo.note")}
        </p>
      </div>

      <Button
        className="mt-8 w-full"
        disabled={!file || submit.isPending}
        onClick={handleAnalyze}
      >
        {submit.isPending ? t("common.analyzing") : t("diagnosis.photo.analyze")}
      </Button>

      {submit.isError && (
        <p className="mt-4 text-sm text-red-500">{t("diagnosis.photo.error")}</p>
      )}
    </div>
  );
}
