"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { UserIcon } from "@/components/ui/icons";
import { useAuth } from "@/hooks/useAuth";

/** 헤더 우측 유저 영역 — 로그인 시 아바타(→마이페이지), 아니면 로그인 아이콘 */
export function HeaderUser() {
  const { isAuthenticated, user } = useAuth();

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
