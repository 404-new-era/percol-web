import type { PageQuery } from "./api";
import type { Season, Tone } from "./enums";

export interface SeasonTag {
  season: Season;
  tone: Tone;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  /** 출처(브랜드 구분용, 예: TOPTEN/UNIQLO) */
  source?: string;
  category: string;
  price: number;
  /** 세일 시에만 — 정가 (아니면 null) */
  originalPrice: number | null;
  /** 세일 시에만 — 할인율 % (아니면 null) */
  discountRate: number | null;
  imageUrl: string;
  productUrl: string;
  colorName: string;
  colorHex: string;
  rank?: number;
  seasonTags: SeasonTag[];
}

export type ProductSort = "recent" | "price_asc" | "price_desc";

/** GET /products 쿼리 */
export interface ProductListQuery extends PageQuery {
  season?: Season;
  tone?: Tone;
  category?: string;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
}

/** GET /products/recommend */
export interface RecommendResult {
  basis: { season: Season; tone: Tone };
  items: { score: number; product: Product }[];
}
