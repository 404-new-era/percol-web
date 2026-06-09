/**
 * 임시 화면 자리표시자 — 라우트 골격 확인용.
 * 실제 UI 작업 시 각 page.tsx 내용을 교체한다.
 */
export function Stub({
  title,
  note,
}: {
  title: string;
  note?: string;
}) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {note && <p className="max-w-md text-sm text-zinc-500">{note}</p>}
      <span className="mt-2 rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-400">
        구현 예정
      </span>
    </section>
  );
}
