import type { Role } from "./enums";
import type { DiagnosisSummary } from "./diagnosis";

/** GET /users/me */
export interface Me {
  id: string;
  email: string | null;
  name: string | null;
  nickname: string;
  image: string | null;
  bio: string | null;
  role: Role;
  createdAt: string;
  latestDiagnosis: DiagnosisSummary | null;
}

/** PATCH /users/me */
export interface UpdateMeInput {
  nickname?: string;
  bio?: string;
  /** 이미지 URL. null을 보내면 기본 프로필로 비워짐(제거) */
  image?: string | null;
}

/** GET /users/me/page */
export interface MyPageCounts {
  postCount: number;
  bookmarkCount: number;
  diagnosisCount: number;
}

/** GET /users/:nickname */
export interface PublicProfile {
  id: string;
  nickname: string;
  image: string | null;
  bio: string | null;
  createdAt: string;
  postCount: number;
}
