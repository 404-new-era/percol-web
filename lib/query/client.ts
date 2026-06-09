import { QueryClient } from "@tanstack/react-query";

/** 브라우저용 QueryClient 팩토리 (Provider에서 1회 생성) */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1분
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}
