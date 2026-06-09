import type { PageQuery } from "./api";
import type { Season, Tone } from "./enums";
import type { Product } from "./product";

export interface PostImage {
  url: string;
  order: number;
}

export interface PostAuthor {
  id: string;
  nickname: string;
  image: string | null;
}

export interface Post {
  id: string;
  content: string;
  season: Season;
  tone: Tone;
  createdAt: string;
  user: PostAuthor;
  images: PostImage[];
  productTags: { product: Product }[];
  likeCount: number;
  commentCount: number;
  /** 현재 로그인 사용자의 좋아요 여부 (비로그인 false) */
  liked: boolean;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: PostAuthor;
}

/** POST/PATCH /posts body */
export interface CreatePostInput {
  content: string;
  season: Season;
  tone: Tone;
  images: string[]; // 업로드로 받은 URL
  productIds: string[];
}
export type UpdatePostInput = Partial<CreatePostInput>;

export interface PostListQuery extends PageQuery {
  season?: Season;
}

/** 좋아요 토글 응답 */
export interface LikeToggleResult {
  liked: boolean;
  likeCount: number;
}
