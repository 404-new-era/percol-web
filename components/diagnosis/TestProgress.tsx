/** 셀프테스트 진행바 — "n/total Stage" (preview (1) 기준) */
export function TestProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-zinc-700 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-center text-sm font-bold text-zinc-700">
        {current}/{total} Stage
      </p>
    </div>
  );
}
