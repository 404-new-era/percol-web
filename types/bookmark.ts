import type { Product } from "./product";

/** GET /bookmarks 목록 항목 (상품 포함) */
export interface Bookmark {
  id: string;
  createdAt: string;
  product: Product;
}
