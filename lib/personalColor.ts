import type { Season } from "@/types";
import type { Locale } from "@/store/locale";

/**
 * 시즌별 표시 콘텐츠 (라벨/태그라인/키워드/설명) — 한·영.
 * 백엔드 DiagnosisResult에는 season·tone·palette만 오므로, 설명형 콘텐츠는
 * 프론트에서 시즌 기준으로 매핑한다.
 */
export interface SeasonContent {
  /** 화면 라벨 (예: 가을 웜톤 / Autumn Warm) */
  labelKR: string;
  tagline: string;
  keywords: string[];
  /** 색상환 burst용 대표 색 (locale 무관) */
  burst: string[];
  description: string[];
}

type LocalizedSeason = {
  burst: string[];
} & Record<Locale, Omit<SeasonContent, "burst">>;

const SEASON_DATA: Record<Season, LocalizedSeason> = {
  SPRING: {
    burst: ["#ff9a76", "#ffd166", "#9bd17b", "#7ad7c5", "#ffb3a7", "#f4e285"],
    ko: {
      labelKR: "봄 웜톤",
      tagline: "맑고 화사한 따뜻함",
      keywords: ["코랄", "살구", "골든 옐로", "클리어"],
      description: [
        "봄 웜톤 팔레트는 따뜻하고 맑은 색이 중심이에요. 코랄, 살구, 골든 옐로처럼 생기 있는 색이 잘 어울립니다.",
        "탁한 회색이나 차가운 파스텔은 화사함을 가려요. 아이보리·크림이 흰색의 가장 좋은 버전입니다.",
      ],
    },
    en: {
      labelKR: "Spring Warm",
      tagline: "Clear, bright warmth",
      keywords: ["Coral", "Apricot", "Golden Yellow", "Clear"],
      description: [
        "The Spring Warm palette centers on warm, clear colors. Lively shades like coral, apricot, and golden yellow suit you best.",
        "Muddy grays and cool pastels dull your glow. Ivory and cream are your best version of white.",
      ],
    },
  },
  SUMMER: {
    burst: ["#a7c7e7", "#c9a7d4", "#9ad0c2", "#e7a7c0", "#b8c4e0", "#d4b8e0"],
    ko: {
      labelKR: "여름 쿨톤",
      tagline: "부드럽고 시원한 우아함",
      keywords: ["라벤더", "더스티 핑크", "소프트 블루", "뮤트"],
      description: [
        "여름 쿨톤 팔레트는 시원하고 부드러운 색이 중심이에요. 라벤더, 더스티 핑크, 소프트 블루가 잘 어울립니다.",
        "쨍한 원색이나 따뜻한 골드는 인상을 무겁게 해요. 소프트 화이트가 가장 좋은 흰색입니다.",
      ],
    },
    en: {
      labelKR: "Summer Cool",
      tagline: "Soft, cool elegance",
      keywords: ["Lavender", "Dusty Pink", "Soft Blue", "Muted"],
      description: [
        "The Summer Cool palette centers on cool, soft colors. Lavender, dusty pink, and soft blue suit you best.",
        "Vivid primaries and warm gold weigh you down. Soft white is your best white.",
      ],
    },
  },
  FALL: {
    burst: ["#c2843f", "#8a5a2b", "#5c5a30", "#b5703a", "#d6a85a", "#7a6a32"],
    ko: {
      labelKR: "가을 웜톤",
      tagline: "깊고 그윽한 따뜻함",
      keywords: ["카멜", "올리브", "골든 브라운", "테라코타"],
      description: [
        "가을 웜톤 팔레트는 따뜻한 그린, 골든 옐로, 오렌지빛 레드와 골든 브라운이 풍부해요. 다크 브라운과 올리브 그린이 가장 좋은 다크 뉴트럴입니다.",
        "베이지·크림·에크루가 흰색의 가장 좋은 버전이에요. 파스텔 핑크나 아이스 블루는 타고난 따뜻함과 충돌해 인상을 흐리게 합니다.",
      ],
    },
    en: {
      labelKR: "Autumn Warm",
      tagline: "Deep, mellow warmth",
      keywords: ["Camel", "Olive", "Golden Brown", "Terracotta"],
      description: [
        "The Autumn Warm palette is rich in warm greens, golden yellows, orange-reds, and golden browns. Dark brown and olive green are your best dark neutrals.",
        "Beige, cream, and ecru are your best whites. Pastel pink or icy blue clashes with your natural warmth.",
      ],
    },
  },
  WINTER: {
    burst: ["#1f3a5f", "#c0392b", "#2c2c54", "#0e8a7d", "#8e2de2", "#e83e8c"],
    ko: {
      labelKR: "겨울 쿨톤",
      tagline: "선명하고 시원한 또렷함",
      keywords: ["퓨어 화이트", "트루 레드", "로열 블루", "비비드"],
      description: [
        "겨울 쿨톤 팔레트는 시원하고 선명한 색이 중심이에요. 퓨어 화이트, 트루 레드, 로열 블루처럼 또렷한 색이 잘 어울립니다.",
        "탁하거나 따뜻한 어스 톤은 생기를 떨어뜨려요. 차가운 순백이 가장 좋은 흰색입니다.",
      ],
    },
    en: {
      labelKR: "Winter Cool",
      tagline: "Vivid, crisp clarity",
      keywords: ["Pure White", "True Red", "Royal Blue", "Vivid"],
      description: [
        "The Winter Cool palette centers on cool, vivid colors. Crisp shades like pure white, true red, and royal blue suit you best.",
        "Muddy or warm earth tones drain your vitality. Cool pure white is your best white.",
      ],
    },
  },
};

/**
 * 시즌별 UI 테마 — 결과/배너 표면 색을 진단 시즌에 맞춘다.
 * (가을이면 웜 크림, 겨울이면 쿨 아이스 톤 …)
 */
export interface SeasonTheme {
  bg: string; // 배너 배경
  text: string; // 강조 텍스트
  textMuted: string; // 보조 텍스트
  accent: string; // 포인트(라벨/키워드)
  chip: string; // 얼굴 원형 배경
  chipText: string;
}

export const SEASON_THEME: Record<Season, SeasonTheme> = {
  SPRING: {
    bg: "#fdeadf",
    text: "#7a4a2e",
    textMuted: "#bb845c",
    accent: "#ff7a59",
    chip: "#f7c9ad",
    chipText: "#9a5a38",
  },
  SUMMER: {
    bg: "#eef0f7",
    text: "#3f4668",
    textMuted: "#838cac",
    accent: "#7d6bb0",
    chip: "#cdd2e6",
    chipText: "#5a5a86",
  },
  FALL: {
    bg: "#f4eee2",
    text: "#4a3526",
    textMuted: "#9a7b53",
    accent: "#c2843f",
    chip: "#d9c3a4",
    chipText: "#6b4f31",
  },
  WINTER: {
    bg: "#e9eef3",
    text: "#22303d",
    textMuted: "#6c7d8b",
    accent: "#1f5fd1",
    chip: "#c5d2dd",
    chipText: "#2f4654",
  },
};

export function seasonTheme(season: Season): SeasonTheme {
  return SEASON_THEME[season];
}

/**
 * 시즌 색들을 여러 위치의 radial-gradient로 겹쳐 부드럽게 블렌딩한 오브 배경.
 * (조각조각 갈리는 conic 대신 수채화처럼 번지는 느낌)
 */
export function orbBackground(burst: string[]): string {
  const b = burst.length ? burst : ["#cccccc"];
  const at = (x: number, y: number, c: string, r = 55) =>
    `radial-gradient(circle at ${x}% ${y}%, ${c}, transparent ${r}%)`;
  return [
    "radial-gradient(circle at 30% 24%, rgba(255,255,255,0.6), transparent 42%)",
    at(72, 28, b[1] ?? b[0]),
    at(78, 76, b[2] ?? b[0]),
    at(24, 74, b[3] ?? b[0]),
    at(48, 52, b[4] ?? b[0], 70),
    b[0],
  ].join(", ");
}

const SEASON_NAME: Record<Locale, Record<Season, string>> = {
  ko: { SPRING: "봄", SUMMER: "여름", FALL: "가을", WINTER: "겨울" },
  en: { SPRING: "Spring", SUMMER: "Summer", FALL: "Fall", WINTER: "Winter" },
};

/** locale별 시즌 콘텐츠 (라벨/태그라인/키워드/설명 + 공유 burst) */
export function seasonContent(
  season: Season,
  locale: Locale = "ko",
): SeasonContent {
  const d = SEASON_DATA[season];
  return { ...d[locale], burst: d.burst };
}

/** 시즌 이름 (봄 / Spring) */
export function seasonKR(season: Season, locale: Locale = "ko"): string {
  return SEASON_NAME[locale][season];
}
