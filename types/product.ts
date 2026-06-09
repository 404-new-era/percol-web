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
  category: string;
  price: number;
  imageUrl: string;
  productUrl: string;
  colorName: string;
  colorHex: string;
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
