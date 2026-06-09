import type { Method, Season, Tone, SelfTestMode } from "./enums";

/** 대표 진단 요약 (users/me 등에 임베드) */
export interface DiagnosisSummary {
  id: string;
  season: Season;
  tone: Tone;
  subType: string | null;
  createdAt: string;
}

/** 진단 채점/분석 공통 결과 형태 */
export interface DiagnosisResult {
  /** 로그인 시 저장된 id, 비로그인 시 null */
  id: string | null;
  method: Method;
  season: Season;
  tone: Tone;
  subType: string | null;
  confidence: number;
  /** 모드별 원본 (문항 축점수 / 색 투표 / 사진 추출색 등) */
  extractedColors: Record<string, unknown>;
  recommendPalette: string[];
  /** 자매 시즌(살짝 변형 OK) */
  sisterPalette: Season;
  /** 회피 시즌 */
  avoidPalette: Season;
}

/** 진단 기록 상세 (목록/상세) */
export interface DiagnosisRecord extends DiagnosisResult {
  id: string;
  memo: string | null;
  nickname: string | null;
  createdAt: string;
}

// ── 셀프테스트 단계 세트 ──────────────────────────────

export interface QuestionChoice {
  id: string;
  label: string;
}
export interface QuestionStage {
  stage: number;
  title: string;
  choices: QuestionChoice[];
}
export interface QuestionStartResult {
  mode: "QUESTION";
  stages: QuestionStage[];
}

export interface ColorOption {
  id: string;
  hex: string;
}
export interface ColorStage {
  stage: number;
  title: string;
  hint: string;
  colors: ColorOption[];
}
export interface ColorStartResult {
  mode: "COLOR";
  stages: ColorStage[];
}

export type SelfTestStartResult = QuestionStartResult | ColorStartResult;

// ── 제출 ──────────────────────────────────────────────

export interface SelfTestAnswer {
  stage: number;
  /** 선택지 id (color 모드는 s1_spring 형태) */
  choice: string;
}
export interface SelfTestSubmitInput {
  mode?: SelfTestMode; // 생략 시 QUESTION
  answers: SelfTestAnswer[];
}

/** PATCH /diagnosis/:id */
export interface UpdateDiagnosisInput {
  memo?: string;
  nickname?: string;
}
