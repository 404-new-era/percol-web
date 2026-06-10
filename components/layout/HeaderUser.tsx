"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { UserIcon } from "@/components/ui/icons";
import { useAuth } from "@/hooks/useAuth";

/** 헤더 우측 유저 영역 — 로그인 시 아바타(→마이페이지), 아니면 로그인 아이콘 */
export function HeaderUser() {
  const { isAuthenticated, user, isLoading } = useAuth();

  // 인증 확정 전엔 스켈레톤 (로그인 아이콘 → 아바타 플래시 방지)
  if (isLoading) {
    return <span className="h-7 w-7 animate-pulse rounded-full bg-zinc-100" />;
  }

  if (isAuthenticated && user) {
    return (
      <Link href="/profile" aria-label="마이페이지">
        <Avatar src={user.image} name={user.nickname} size={28} />
      </Link>
    );
  }

  return (
    <Link href="/login" aria-label="로그인" className="hover:text-brand">
      <UserIcon />
    </Link>
  );
}
