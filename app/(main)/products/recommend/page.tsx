import { RequireAuth } from "@/components/auth/RequireAuth";
import { Stub } from "@/components/ui/Stub";

/** 내 진단 기반 추천 상품 (로그인 필요) */
export default function RecommendPage() {
  return (
    <RequireAuth messageKey="auth.gateRecommend">
      <Stub title="맞춤 추천" note="내 진단 기반 추천 상품" />
    </RequireAuth>
  );
}
