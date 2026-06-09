"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ResultView } from "@/components/diagnosis/ResultView";
import { useDiagnosisRecord } from "@/hooks/useDiagnosis";
import { useHydrated } from "@/hooks/useHydrated";
import { useT } from "@/hooks/useT";
import { useDiagnosisStore } from "@/store/diagnosis";

/**
 * 진단 결과 — 우선순위:
 * 1) 방금 받은 결과(스토어, sessionStorage 영속): /result/latest 또는 id 일치
 * 2) 서버 저장 기록(로그인): id로 조회
 * 스토어는 클라이언트에서 복원되므로 마운트 전엔 판단을 보류한다.
 */
export default function DiagnosisResultPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useT();
  const { lastResult, faceUrl } = useDiagnosisStore();

  // sessionStorage 복원은 클라이언트에서만 → 하이드레이션 후 평가
  const mounted = useHydrated();

  const fromStore =
    lastResult && (id === "latest" || lastResult.id === id)
      ? lastResult
      : null;

  const shouldFetch = mounted && !fromStore && id !== "latest";
  const { data, isLoading, isError } = useDiagnosisRecord(id, shouldFetch);

  const result = fromStore ?? data ?? null;

  if (!mounted || (shouldFetch && isLoading))
    return <Centered>{t("common.loading")}</Centered>;

  if (!result || (shouldFetch && isError))
    return (
      <Centered>
        <p>{t("result.notFound")}</p>
        <Link
          href="/diagnosis"
          className="mt-3 inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white"
        >
          {t("common.retake")}
        </Link>
      </Centered>
    );

  return <ResultView result={result} faceUrl={fromStore ? faceUrl ?? undefined : undefined} />;
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-24 text-center text-sm text-zinc-500">
      {children}
    </div>
  );
}
