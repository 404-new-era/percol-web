export const Season = {
  SPRING: "SPRING",
  SUMMER: "SUMMER",
  FALL: "FALL",
  WINTER: "WINTER",
} as const;
export type Season = (typeof Season)[keyof typeof Season];

export const Tone = {
  WARM: "WARM",
  COOL: "COOL",
} as const;
export type Tone = (typeof Tone)[keyof typeof Tone];

export const Method = {
  PHOTO: "PHOTO",
  SELF_TEST: "SELF_TEST",
} as const;
export type Method = (typeof Method)[keyof typeof Method];

export const Role = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const Provider = {
  KAKAO: "KAKAO",
  NAVER: "NAVER",
  GOOGLE: "GOOGLE",
} as const;
export type Provider = (typeof Provider)[keyof typeof Provider];

/** 셀프테스트 모드 */
export const SelfTestMode = {
  QUESTION: "QUESTION",
  COLOR: "COLOR",
} as const;
export type SelfTestMode = (typeof SelfTestMode)[keyof typeof SelfTestMode];
