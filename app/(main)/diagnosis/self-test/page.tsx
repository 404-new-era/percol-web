"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TestProgress } from "@/components/diagnosis/TestProgress";
import { QuestionStageView } from "@/components/diagnosis/QuestionStageView";
import { Button } from "@/components/ui/Button";
import {
  useSelfTestStages,
  useSubmitSelfTest,
} from "@/hooks/useDiagnosis";
import { useT } from "@/hooks/useT";
import { useDiagnosisStore } from "@/store/diagnosis";
import { SelfTestMode } from "@/types";

/** 셀프테스트 — 텍스트 문항 모드 (9단계) */
export default function SelfTestPage() {
  const router = useRouter();
  const { t } = useT();
  const { data, isLoading, isError, refetch } = useSelfTestStages("question");
  const submit = useSubmitSelfTest();
  const setLastResult = useDiagnosisStore((s) => s.setLastResult);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  if (isLoading) return <Centered>{t("diagnosis.question.loading")}</Centered>;
  if (isError || !data || data.mode !== "QUESTION")
    return (
      <Centered>
        <p>{t("diagnosis.question.loadError")}</p>
        <Button variant="outline" className="mt-3" onClick={() => refetch()}>
          {t("common.retry")}
        </Button>
      </Centered>
    );

  const stages = data.stages;
  const stage = stages[index];
  const isLast = index === stages.length - 1;
  const picked = answers[stage.stage];

  const handleSelect = (choiceId: string) =>
    setAnswers((prev) => ({ ...prev, [stage.stage]: choiceId }));

  const handleNext = () => {
    if (!picked) return;
    if (!isLast) {
      setIndex((i) => i + 1);
      return;
    }
    const payload = stages.map((s) => ({
      stage: s.stage,
      choice: answers[s.stage],
    }));
    submit.mutate(
      { mode: SelfTestMode.QUESTION, answers: payload },
      {
        onSuccess: (result) => {
          setLastResult(result);
          router.push(`/diagnosis/result/${result.id ?? "latest"}`);
        },
      },
    );
  };

  return (
    <div className="py-10">
      <TestProgress current={index + 1} total={stages.length} />

      <div className="mt-10">
        <QuestionStageView
          stage={stage}
          selected={picked}
          onSelect={handleSelect}
        />
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-md gap-3">
        {index > 0 && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIndex((i) => i - 1)}
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
