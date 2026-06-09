"use client";

import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/query/client";
import { useAuthStore } from "@/store/auth";
import { useLocaleStore } from "@/store/locale";
import { LoginModal } from "@/components/auth/LoginModal";

export function Providers({ children }: { children: React.ReactNode }) {
  // QueryClient는 컴포넌트 생애주기 동안 1회만 생성 (lazy init)
  const [queryClient] = useState(makeQueryClient);

  const hydrate = useAuthStore((s) => s.hydrate);
  const locale = useLocaleStore((s) => s.locale);
  useEffect(() => {
    void hydrate();
    // 저장된 언어 복원 (skipHydration이라 수동 호출)
    void useLocaleStore.persist.rehydrate();
  }, [hydrate]);

  // <html lang> 동기화
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <LoginModal />
    </QueryClientProvider>
  );
}
