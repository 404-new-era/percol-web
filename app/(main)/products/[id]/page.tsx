"use client";

import { use } from "react";
import { useProduct } from "@/hooks/useProducts";
import { imageUrl, seasonLabel, toneLabel } from "@/lib/utils";

/** 상품 상세 (실 API) */
export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: product, isLoading, isError } = useProduct(id);

  if (isLoading)
    return (
      <div className="py-24 text-center text-sm text-zinc-400">
        불러오는 중…
      </div>
    );
  if (isError || !product)
    return (
      <div className="py-24 text-center text-sm text-zinc-400">
        상품을 찾을 수 없어요.
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div
          className="aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100"
          style={{ backgroundColor: product.colorHex }}
        >
          {product.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl(product.imageUrl)}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-sm text-zinc-500">{product.brand}</p>
          <h1 className="mt-1 text-xl font-bold text-ink">{product.name}</h1>
          {product.discountRate != null && product.discountRate > 0 ? (
            <div className="mt-3">
              <p className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-[#e8402e]">
                  {product.discountRate}%
                </span>
                <span className="text-2xl font-extrabold">
                  {product.price.toLocaleString("ko-KR")}원
                </span>
              </p>
              {product.originalPrice != null && (
                <p className="text-sm text-zinc-400 line-through">
                  {product.originalPrice.toLocaleString("ko-KR")}원
                </p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-2xl font-extrabold">
              {product.price.toLocaleString("ko-KR")}원
            </p>
          )}

          <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
            <span
              className="h-5 w-5 rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: product.colorHex }}
            />
            {product.colorName}
          </div>

          {product.seasonTags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.seasonTags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600"
                >
                  {seasonLabel(tag.season)} · {toneLabel(tag.tone)}톤
                </span>
              ))}
            </div>
          )}

          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-ink text-sm font-semibold text-white hover:opacity-90"
          >
            구매하러 가기
          </a>
          <p className="mt-2 text-center text-xs text-zinc-400">
            {product.category}
          </p>
        </div>
      </div>
    </div>
  );
}
