"use client";

import { useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { imageUrl } from "@/lib/utils";
import type { Product } from "@/types";

/** 코디에 입은 상품 태그 — 검색해서 추가, 선택 목록 표시 */
export function ProductTagPicker({
  selected,
  onChange,
}: {
  selected: Product[];
  onChange: (next: Product[]) => void;
}) {
  const [input, setInput] = useState("");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setKeyword(input.trim()), 300);
    return () => clearTimeout(id);
  }, [input]);

  const { data } = useProducts(
    { keyword, limit: 8 },
    { enabled: keyword.length > 0 },
  );
  const results = (data?.items ?? []).filter(
    (p) => !selected.some((s) => s.id === p.id),
  );

  const add = (p: Product) => {
    onChange([...selected, p]);
    setInput("");
    setKeyword("");
  };
  const remove = (id: string) =>
    onChange(selected.filter((p) => p.id !== id));

  return (
    <div>
      <div className="relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="입은 상품 검색 (상품명·브랜드)"
          className="h-11 w-full rounded-xl bg-zinc-100 px-4 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
        {keyword && results.length > 0 && (
          <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg">
            {results.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => add(p)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-zinc-50"
              >
                <span
                  className="h-10 w-10 shrink-0 overflow-hidden rounded bg-zinc-100"
                  style={{ backgroundColor: p.colorHex }}
                >
                  {p.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl(p.imageUrl)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-zinc-500">{p.brand}</span>
                  <span className="block truncate text-sm">{p.name}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selected.map((p) => (
            <span
              key={p.id}
              className="flex items-center gap-1.5 rounded-full bg-zinc-100 py-1 pl-1 pr-2.5 text-xs"
            >
              <span
                className="h-6 w-6 shrink-0 overflow-hidden rounded-full"
                style={{ backgroundColor: p.colorHex }}
              >
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl(p.imageUrl)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </span>
              <span className="max-w-[100px] truncate">{p.name}</span>
              <button
                type="button"
                onClick={() => remove(p.id)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
