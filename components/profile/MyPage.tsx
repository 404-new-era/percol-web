"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ChevronRightIcon } from "@/components/ui/icons";
import { ProfileEditForm } from "./ProfileEditForm";
import { useAuth } from "@/hooks/useAuth";
import { useMe, useMyPage } from "@/hooks/useUser";
import { useT } from "@/hooks/useT";
import { useDiagnosisStore } from "@/store/diagnosis";
import { seasonContent, seasonTheme } from "@/lib/personalColor";

/** 마이페이지 — 로그인 사용자 */
export function MyPage() {
  const { t } = useT();
  const { logout } = useAuth();
  const { data: me, isLoading } = useMe();
  const { data: counts } = useMyPage();
  const [editing, setEditing] = useState(false);

  if (isLoading || !me)
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-sm text-zinc-400">
        {t("common.loading")}
      </div>
    );

  const handleLogout = async () => {
    await logout();
    // 진단 결과 스토어 비우고, 캐시(이전 계정 me/퍼스널컬러) 초기화 위해 하드 리프레시
    useDiagnosisStore.getState().clear();
    window.location.href = "/";
  };

  return (
    <div className="mx-auto w-full max-w-lg py-8">
      {editing ? (
        <ProfileEditForm me={me} onDone={() => setEditing(false)} />
      ) : (
        <ProfileHeader me={me} onEdit={() => setEditing(true)} />
      )}

      <PersonalColorCard latest={me.latestDiagnosis} />

      <StatsRow
        diagnosis={counts?.diagnosisCount ?? 0}
        post={counts?.postCount ?? 0}
        bookmark={counts?.bookmarkCount ?? 0}
      />

      <nav className="mt-6 overflow-hidden rounded-2xl border border-zinc-200">
        <MenuItem href="/bookmarks" label={t("profile.menuBookmark")} />
        <MenuItem href="/diagnosis" label={t("profile.menuHistory")} />
        <MenuItem
          href={`/profile/${encodeURIComponent(me.nickname)}`}
          label={t("profile.menuPublic")}
        />
      </nav>

      <Button
        variant="outline"
        className="mt-4 w-full text-red-500"
        onClick={handleLogout}
      >
        {t("profile.logout")}
      </Button>
    </div>
  );
}

function ProfileHeader({
  me,
  onEdit,
}: {
  me: import("@/types").Me;
  onEdit: () => void;
}) {
  const { t } = useT();
  return (
    <div className="flex items-center gap-4">
      <Avatar src={me.image} name={me.nickname} size={72} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-xl font-bold text-ink">
            {me.nickname}
          </h1>
          {me.role === "ADMIN" && (
            <span className="rounded bg-ink px-1.5 py-0.5 text-[10px] font-bold text-white">
              ADMIN
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-sm text-zinc-500">
          {me.bio || t("profile.noBio")}
        </p>
        {me.email && (
          <p className="mt-0.5 truncate text-xs text-zinc-400">{me.email}</p>
        )}
      </div>
      <Button variant="outline" className="h-9 px-4 text-xs" onClick={onEdit}>
        {t("profile.edit")}
      </Button>
    </div>
  );
}

function PersonalColorCard({
  latest,
}: {
  latest: import("@/types").Me["latestDiagnosis"];
}) {
  const { t, locale } = useT();
  if (!latest) {
    return (
      <Link
        href="/diagnosis"
        className="mt-6 flex items-center justify-between rounded-2xl border border-dashed border-zinc-300 p-5 hover:bg-zinc-50"
      >
        <div>
          <p className="text-sm font-semibold text-ink">
            {t("profile.noDiagnosisTitle")}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">
            {t("profile.noDiagnosisSub")}
          </p>
        </div>
        <ChevronRightIcon />
      </Link>
    );
  }

  const th = seasonTheme(latest.season);
  const content = seasonContent(latest.season, locale);
  return (
    <Link
      href={`/diagnosis/result/${latest.id}`}
      className="mt-6 flex items-center justify-between rounded-2xl p-5"
      style={{ backgroundColor: th.bg }}
    >
      <div>
        <p className="text-xs" style={{ color: th.textMuted }}>
          {t("profile.myColor")}
        </p>
        <p
          className="mt-0.5 text-2xl font-extrabold tracking-tight"
          style={{ color: th.text }}
        >
          {content.labelKR}
        </p>
        <p className="mt-0.5 text-xs" style={{ color: th.accent }}>
          {content.tagline}
        </p>
      </div>
      <div className="flex gap-1.5">
        {content.burst.slice(0, 4).map((hex) => (
          <span
            key={hex}
            className="h-7 w-7 rounded-full ring-1 ring-black/5"
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>
    </Link>
  );
}

function StatsRow({
  diagnosis,
  post,
  bookmark,
}: {
  diagnosis: number;
  post: number;
  bookmark: number;
}) {
  const { t } = useT();
  const stats = [
    { label: t("profile.statDiagnosis"), value: diagnosis, href: "/diagnosis" },
    { label: t("profile.statPost"), value: post, href: "/posts" },
    { label: t("profile.statBookmark"), value: bookmark, href: "/bookmarks" },
  ];
  return (
    <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-2xl border border-zinc-200">
      {stats.map((s, i) => (
        <Link
          key={s.label}
          href={s.href}
          className={`flex flex-col items-center py-4 hover:bg-zinc-50 ${i > 0 ? "border-l border-zinc-200" : ""}`}
        >
          <span className="text-lg font-bold text-ink">{s.value}</span>
          <span className="mt-0.5 text-xs text-zinc-500">{s.label}</span>
        </Link>
      ))}
    </div>
  );
}

function MenuItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 text-sm text-zinc-700 last:border-b-0 hover:bg-zinc-50"
    >
      {label}
      <ChevronRightIcon className="text-zinc-300" />
    </Link>
  );
}
