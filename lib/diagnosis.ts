import type { ColorOption, ColorStage } from "@/types";

const SEASON_ORDER = ["spring", "summer", "fall", "winter"] as const;

/** id(s1_spring_0 / s1_spring)에서 시즌 추출 */
function seasonOf(id: string): string | null {
  const m = id.match(/_(spring|summer|fall|winter)/);
  return m ? m[1] : null;
}

export interface DisplayStage {
  stage: number;
  hint: string;
  /** 봄·여름·가을·겨울 순 4색 (9단계 전체에서 hex 중복 제거) */
  colors: ColorOption[];
}

/**
 * 백엔드의 시즌당 여러 변형(최대 6개)에서 시즌당 1색만 추리되,
 * 앞 단계에서 이미 쓴 hex는 피해 9단계에 걸쳐 색이 겹치지 않게 한다.
 * 입력이 결정적이므로 출력도 결정적(새로고침해도 동일).
 */
export function buildColorStages(stages: ColorStage[]): DisplayStage[] {
  const usedHex = new Set<string>();

  return stages.map((st) => {
    const bySeason: Record<string, ColorOption[]> = {};
    for (const c of st.colors) {
      const s = seasonOf(c.id);
      if (s) (bySeason[s] ??= []).push(c);
    }

    const colors = SEASON_ORDER.map((season) => {
      const cands = bySeason[season] ?? [];
      // 아직 안 쓴 hex 우선, 없으면 첫 번째라도 사용
      const pick =
        cands.find((c) => !usedHex.has(c.hex.toLowerCase())) ?? cands[0];
      if (pick) usedHex.add(pick.hex.toLowerCase());
      return pick;
    }).filter((c): c is ColorOption => !!c);

    return { stage: st.stage, hint: st.hint, colors };
  });
}
