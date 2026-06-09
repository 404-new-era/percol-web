/**
 * 목업(preview.png) 재현용 샘플 데이터.
 * 백엔드 연동 전 홈 화면 시각 확인용 — 실제 타입과 동일하게 맞춰두어
 * 추후 useRecommend()/usePosts() 결과로 그대로 교체 가능.
 */
import type { DiagnosisSummary, Product } from "@/types";

export const MOCK_DIAGNOSIS: DiagnosisSummary & {
  label: string;
  keywords: string[];
  palette: string[];
} = {
  id: "mock",
  season: "FALL",
  tone: "WARM",
  subType: "TRUE_AUTUMN",
  createdAt: "2026-06-09T00:00:00.000Z",
  label: "True Autumn",
  keywords: ["Warm", "Graceful", "Plentiful", "Golden"],
  palette: ["#8a5a2b", "#b5703a", "#5c5a30", "#c2843f"],
};

interface MockProduct extends Product {
  rating: number;
  reviewCount: number;
  likeCount: number;
  discountRate?: number;
}

export const MOCK_RECOMMEND: MockProduct[] = [
  {
    id: "p1",
    name: "오버핏 코튼 셔츠",
    brand: "무신사 스탠다드",
    category: "상의",
    price: 59000,
    discountRate: 20,
    imageUrl: "",
    productUrl: "#",
    colorName: "카멜브라운",
    colorHex: "#a86b3c",
    seasonTags: [{ season: "FALL", tone: "WARM" }],
    rating: 4.8,
    reviewCount: 324,
    likeCount: 324,
  },
  {
    id: "p2",
    name: "워시드 치노 팬츠",
    brand: "라퍼지스토어",
    category: "하의",
    price: 42000,
    discountRate: 15,
    imageUrl: "",
    productUrl: "#",
    colorName: "테라코타",
    colorHex: "#c08552",
    seasonTags: [{ season: "FALL", tone: "WARM" }],
    rating: 4.7,
    reviewCount: 980,
    likeCount: 891,
  },
  {
    id: "p3",
    name: "코듀로이 셔츠",
    brand: "토트",
    category: "상의",
    price: 38000,
    imageUrl: "",
    productUrl: "#",
    colorName: "올리브",
    colorHex: "#565a31",
    seasonTags: [{ season: "FALL", tone: "WARM" }],
    rating: 4.9,
    reviewCount: 2131,
    likeCount: 522,
  },
  {
    id: "p4",
    name: "오버사이즈 셔츠",
    brand: "코드그라피",
    category: "상의",
    price: 49000,
    discountRate: 30,
    imageUrl: "",
    productUrl: "#",
    colorName: "샌드베이지",
    colorHex: "#c7a06b",
    seasonTags: [{ season: "FALL", tone: "WARM" }],
    rating: 4.6,
    reviewCount: 690,
    likeCount: 147,
  },
  {
    id: "p5",
    name: "릴렉스 보정 팬츠",
    brand: "유니클로 U",
    category: "하의",
    price: 35100,
    discountRate: 10,
    imageUrl: "",
    productUrl: "#",
    colorName: "카키",
    colorHex: "#8a8253",
    seasonTags: [{ season: "FALL", tone: "WARM" }],
    rating: 4.5,
    reviewCount: 1531,
    likeCount: 733,
  },
];

export interface MockSnap {
  id: string;
  nickname: string;
  avatarHex: string;
  coverHex: string;
}

export const MOCK_SNAPS: MockSnap[] = [
  { id: "s1", nickname: "yuna_ac", avatarHex: "#e0552b", coverHex: "#e8c7a0" },
  { id: "s2", nickname: "minho.fit", avatarHex: "#5c7a3a", coverHex: "#a9b08a" },
  { id: "s3", nickname: "daily_seo", avatarHex: "#e0552b", coverHex: "#c9a06a" },
  { id: "s4", nickname: "jin_look", avatarHex: "#5c7a3a", coverHex: "#8a8453" },
];
