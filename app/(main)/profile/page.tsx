import { RequireAuth } from "@/components/auth/RequireAuth";
import { MyPage } from "@/components/profile/MyPage";

/** 마이페이지 (로그인 필요) */
export default function MyProfilePage() {
  return (
    <RequireAuth messageKey="auth.gateProfile">
      <MyPage />
    </RequireAuth>
  );
}
