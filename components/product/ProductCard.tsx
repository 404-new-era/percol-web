import Link from "next/link";
import { HeartIcon, StarIcon } from "@/components/ui/icons";
import { imageUrl } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  rating?: number;
  reviewCount?: number;
  likeCount?: number;
  discountRate?: number;
}

/** 추천/목록 상품 카드 — 실제 이미지 + 브랜드/상품명/가격, 상세로 링크 */
export function ProductCard({
  product,
  rating,
  reviewCount,
  likeCount,
  discountRate,
}: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group flex flex-col">
      <div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-zinc-100"
        style={{ backgroundColor: product.colorHex }}
      >
        {product.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl(product.imageUrl)}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        )}
        {likeCount != null && (
          <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
            <HeartIcon width={12} height={12} filled />
            {likeCount}
          </span>
        )}
      </div>

      <p className="mt-2 text-xs font-medium text-zinc-900">{product.brand}</p>
      <p className="line-clamp-1 text-xs text-zinc-500">{product.name}</p>

      <p className="mt-1 flex items-center gap-1 text-sm font-bold">
        {discountRate != null && (
          <span className="text-[#e8402e]">{discountRate}%</span>
        )}
        <span className="text-zinc-900">
          {product.price.toLocaleString("ko-KR")}
        </span>
      </p>

      {rating != null && (
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-400">
          <StarIcon width={11} height={11} className="text-amber-400" />
          {rating.toFixed(1)}
          {reviewCount != null && <span>· {reviewCount.toLocaleString()}</span>}
        </p>
      )}
    </Link>
  );
}
