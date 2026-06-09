import { RequireAuth } from "@/components/auth/RequireAuth";
import { Stub } from "@/components/ui/Stub";

/** 코디 작성 (로그인 필요) */
export default function NewPostPage() {
  return (
    <RequireAuth messageKey="auth.gatePost">
      <Stub title="코디 작성" note="이미지 업로드 → 캡션 · 상품 태그" />
    </RequireAuth>
  );
}
