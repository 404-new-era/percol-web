import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "@/components/ui/icons";
import { BookmarkButton } from "./BookmarkButton";
import { imageUrl } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  rating?: number;
  reviewCount?: number;
  likeCount?: number;
}

/** 추천/목록 상품 카드 — 실제 이미지 + 브랜드/상품명/가격(세일 표시), 상세로 링크 */
export function ProductCard({
  product,
  rating,
  reviewCount,
  likeCount,
}: ProductCardProps) {
  const onSale = product.discountRate != null && product.discountRate > 0;
  return (
    <Link href={`/products/${product.id}`} className="group flex flex-col">
      <div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-zinc-100"
        style={{ backgroundColor: product.colorHex }}
      >
        {product.imageUrl && (
          <Image
            src={imageUrl(product.imageUrl)!}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        )}
        <BookmarkButton
          productId={product.id}
          size={20}
          className="absolute right-1.5 top-1.5 rounded-full bg-white/70 p-1.5 backdrop-blur hover:bg-white"
        />
        {likeCount != null && (
          <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
            {likeCount}
          </span>
        )}
      </div>

      <p className="mt-2 text-xs font-medium text-zinc-900">{product.brand}</p>
      <p className="line-clamp-1 text-xs text-zinc-500">{product.name}</p>

      <p className="mt-1 flex items-center gap-1 text-sm font-bold">
        {onSale && (
          <span className="text-[#e8402e]">{product.discountRate}%</span>
        )}
        <span className="text-zinc-900">
          {product.price.toLocaleString("ko-KR")}
        </span>
      </p>
      {onSale && product.originalPrice != null && (
        <p className="text-xs text-zinc-400 line-through">
          {product.originalPrice.toLocaleString("ko-KR")}
        </p>
      )}

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
