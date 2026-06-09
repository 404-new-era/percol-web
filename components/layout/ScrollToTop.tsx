"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** 경로 변경(네비 클릭) 시 맨 위로 스크롤 */
export function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}
