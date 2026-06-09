import { RequireAuth } from "@/components/auth/RequireAuth";
import { Stub } from "@/components/ui/Stub";

/** 내 북마크 목록 (로그인 필요) */
export default function BookmarksPage() {
  return (
    <RequireAuth messageKey="auth.gateBookmark">
      <Stub title="북마크" note="내가 찜한 상품" />
    </RequireAuth>
  );
}
