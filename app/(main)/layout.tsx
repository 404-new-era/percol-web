import { Header } from "@/components/layout/Header";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

/** 전역 헤더가 붙는 메인 레이아웃 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4">
        {children}
      </main>
    </>
  );
}
