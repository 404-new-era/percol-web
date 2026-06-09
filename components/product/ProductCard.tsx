import { HeartIcon, StarIcon } from "@/components/ui/icons";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  rating?: number;
  reviewCount?: number;
  likeCount?: number;
  discountRate?: number;
}

/** 추천 아이템 카드 (목업: 색 배경 + 찜수 + 브랜드/상품명/할인가/별점) */
export function ProductCard({
  product,
  rating,
  reviewCount,
  likeCount,
  discountRate,
}: ProductCardProps) {
  return (
    <article className="flex flex-col">
      <div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-lg"
        style={{ backgroundColor: product.colorHex }}
      >
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
    </article>
  );
}
