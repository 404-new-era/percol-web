"use client";

import { useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useUpdateMe } from "@/hooks/useUser";
import { useT } from "@/hooks/useT";
import { uploadsApi } from "@/lib/api";
import type { Me } from "@/types";

/** 내 정보 수정 — 닉네임/소개/프로필 이미지 */
export function ProfileEditForm({
  me,
  onDone,
}: {
  me: Me;
  onDone: () => void;
}) {
  const { t } = useT();
  const [nickname, setNickname] = useState(me.nickname);
  const [bio, setBio] = useState(me.bio ?? "");
  const [image, setImage] = useState<string | null>(me.image);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const update = useUpdateMe();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadsApi.image(file);
      setImage(url);
    } catch {
      setError(t("profile.uploadError"));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    setError(null);
    update.mutate(
      // image=null 이면 그대로 null 전송 → 백엔드가 기본 프로필로 비움
      { nickname: nickname.trim(), bio: bio.trim(), image },
      {
        onSuccess: onDone,
        onError: (err: unknown) => {
          const code = (err as { code?: string })?.code;
          setError(
            code === "CONFLICT"
              ? t("profile.nicknameTaken")
              : t("profile.saveError"),
          );
        },
      },
    );
  };

  return (
    <div className="rounded-2xl border border-zinc-200 p-6">
      <h2 className="text-base font-bold text-ink">{t("profile.editTitle")}</h2>

      <div className="mt-5 flex items-center gap-4">
        <Avatar src={image} name={nickname} size={64} />
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            disabled={uploading}
          >
            {uploading ? t("profile.uploading") : t("profile.changePhoto")}
          </button>
          {image && (
            <button
              type="button"
              onClick={() => setImage(null)}
              className="ml-2 text-xs text-zinc-400 hover:text-zinc-600"
            >
              {t("profile.remove")}
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>

      <label className="mt-5 block">
        <span className="text-xs font-medium text-zinc-500">
          {t("profile.nickname")}
        </span>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          className="mt-1 h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm focus:border-zinc-400 focus:outline-none"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-medium text-zinc-500">
          {t("profile.bio")}
        </span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={150}
          placeholder={t("profile.bioPlaceholder")}
          className="mt-1 w-full resize-none rounded-xl border border-zinc-200 p-3 text-sm focus:border-zinc-400 focus:outline-none"
        />
      </label>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <div className="mt-5 flex gap-2">
        <Button
          className="flex-1"
          disabled={!nickname.trim() || update.isPending || uploading}
          onClick={handleSave}
        >
          {update.isPending ? t("common.saving") : t("common.save")}
        </Button>
        <Button variant="outline" className="flex-1" onClick={onDone}>
          {t("common.cancel")}
        </Button>
      </div>
    </div>
  );
}
