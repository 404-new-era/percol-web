/** 단계 힌트 툴팁 — 동그란 ? (preview (1) 기준) */
export function HelpIcon({ hint }: { hint?: string }) {
  if (!hint) return null;
  return (
    <span className="group relative inline-flex">
      <span className="flex h-5 w-5 cursor-help items-center justify-center rounded-full bg-zinc-700 text-[11px] font-bold text-white">
        ?
      </span>
      <span className="pointer-events-none absolute left-1/2 top-7 z-10 w-48 -translate-x-1/2 rounded-lg bg-zinc-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100">
        {hint}
      </span>
    </span>
  );
}
