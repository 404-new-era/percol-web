"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TestProgress } from "@/components/diagnosis/TestProgress";
import { ColorStageView } from "@/components/diagnosis/ColorStageView";
import { FacePicker } from "@/components/diagnosis/FacePicker";
import { Button } from "@/components/ui/Button";
import { LockIcon } from "@/components/ui/icons";
import { useSelfTestStages, useSubmitSelfTest } from "@/hooks/useDiagnosis";
import { useT } from "@/hooks/useT";
import { useDiagnosisStore } from "@/store/diagnosis";
import { buildColorStages } from "@/lib/diagnosis";
import { fileToThumbnailDataUrl } from "@/lib/image";
import { SelfTestMode } from "@/types";

const STORAGE_KEY = "percol.colorTest";

interface Persisted {
  faceDataUrl: string;
  index: number;
  answers: Record<number, string>;
}

function loadPersisted(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Persisted) : null;
  } catch {
    return null;
  }
}

/** 셀프테스트 — 색 카드 모드 (얼굴 업로드 → 9단계, 진행상태 새로고침 복원) */
export default function ColorTestPage() {
  const router = useRouter();
  // 새로고침 복원: 저장된 진행상태로 초기화
  const [faceUrl, setFaceUrl] = useState<string | undefined>(
    () => loadPersisted()?.faceDataUrl,
  );
  const [index, setIndex] = useState<number>(() => loadPersisted()?.index ?? 0);
  const [answers, setAnswers] = useState<Record<number, string>>(
    () => loadPersisted()?.answers ?? {},
  );

  const { t } = useT();
  const setLastResult = useDiagnosisStore((s) => s.setLastResult);
  const submit = useSubmitSelfTest();
  const { data, isLoading, isError, refetch } = useSelfTestStages("color");

  // 9단계 전체에서 색 중복 제거 (결정적이라 새로고침해도 동일)
  const displayStages = useMemo(
    () => (data?.mode === "COLOR" ? buildColorStages(data.stages) : []),
    [data],
  );

  // 진행상태 영속화 (얼굴 고른 뒤에만)
  useEffect(() => {
    if (!faceUrl) return;
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ faceDataUrl: faceUrl, index, answers }),
      );
    } catch {
      // 용량 초과 등은 무시 (저장 실패해도 진행은 가능)
    }
  }, [faceUrl, index, answers]);

  const handlePick = async (file: File) => {
    try {
      setFaceUrl(await fileToThumbnailDataUrl(file));
    } catch {
      setFaceUrl(URL.createObjectURL(file)); // 폴백(새로고침 복원은 불가)
    }
  };

  // 1) 얼굴 선택 화면
  if (!faceUrl) {
    return (
      <div className="mx-auto w-full max-w-md py-14 text-center">
        <h1 className="text-2xl font-bold text-ink">
          {t("diagnosis.color.title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {t("diagnosis.color.intro")}
        </p>
        <div className="mt-10">
          <FacePicker onPick={(file) => handlePick(file)} />
        </div>
        <p className="mt-8 flex items-center justify-center gap-1.5 rounded-xl bg-zinc-50 p-3 text-xs text-zinc-400">
          <LockIcon className="shrink-0" />
          {t("diagnosis.color.privacy")}
        </p>
      </div>
    );
  }

  // 2) 단계 로딩/에러
  if (isLoading) return <Centered>{t("common.loading")}</Centered>;
  if (isError || displayStages.length === 0)
    return (
      <Centered>
        <p>{t("diagnosis.color.loadError")}</p>
        <Button variant="outline" className="mt-3" onClick={() => refetch()}>
          {t("common.retry")}
        </Button>
      </Centered>
    );

  const safeIndex = Math.min(index, displayStages.length - 1);
  const stage = displayStages[safeIndex];
  const isLast = safeIndex === displayStages.length - 1;
  const picked = answers[stage.stage];

  const handleSelect = (colorId: string) =>
    setAnswers((prev) => ({ ...prev, [stage.stage]: colorId }));

  const handleNext = () => {
    if (!picked) return;
    if (!isLast) {
      setIndex(safeIndex + 1);
      return;
    }
    const payload = displayStages.map((s) => ({
      stage: s.stage,
      choice: answers[s.stage],
    }));
    submit.mutate(
      { mode: SelfTestMode.COLOR, answers: payload },
      {
        onSuccess: (result) => {
          try {
            window.sessionStorage.removeItem(STORAGE_KEY);
          } catch {
            /* noop */
          }
          setLastResult(result, faceUrl);
          router.push(`/diagnosis/result/${result.id ?? "latest"}`);
        },
      },
    );
  };

  return (
    <div className="py-10">
      <TestProgress current={safeIndex + 1} total={displayStages.length} />

      <div className="mt-8">
        <ColorStageView
          colors={stage.colors}
          hint={stage.hint}
          faceUrl={faceUrl}
          selected={picked}
          onSelect={handleSelect}
        />
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-md gap-3">
        {safeIndex > 0 && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIndex(safeIndex - 1)}
          >
            {t("common.prev")}
          </Button>
        )}
        <Button
          className="flex-1"
          disabled={!picked || submit.isPending}
          onClick={handleNext}
        >
          {submit.isPending
            ? t("common.analyzing")
            : isLast
              ? t("common.seeResult")
              : t("common.next")}
        </Button>
      </div>

      {submit.isError && (
        <p className="mt-4 text-center text-sm text-red-500">
          {t("diagnosis.submitError")}
        </p>
      )}
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-24 text-center text-sm text-zinc-500">
      {children}
    </div>
  );
}
