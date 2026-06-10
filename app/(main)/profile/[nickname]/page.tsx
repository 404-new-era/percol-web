"use client";

import { use } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { usePublicProfile } from "@/hooks/useUser";

/** 공개 프로필 (GET /users/:nickname) */
export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ nickname: string }>;
}) {
  const { nickname: raw } = use(params);
  const nickname = decodeURIComponent(raw);
  const { data, isLoading, isError } = usePublicProfile(nickname);

  if (isLoading)
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-sm text-zinc-400">
        불러오는 중…
      </div>
    );

  if (isError || !data)
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24 text-center text-sm text-zinc-400">
        프로필을 찾을 수 없어요.
      </div>
    );

  const joined = new Date(data.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="mx-auto w-full max-w-lg py-10">
      <div className="flex flex-col items-center text-center">
        <Avatar src={data.image} name={data.nickname} size={88} />
        <h1 className="mt-4 text-xl font-bold text-ink">{data.nickname}</h1>
        {data.bio && (
          <p className="mt-1.5 max-w-sm text-sm text-zinc-500">{data.bio}</p>
        )}

        <div className="mt-6 flex items-center gap-8">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-ink">
              {data.postCount}
            </span>
            <span className="mt-0.5 text-xs text-zinc-500">코디</span>
          </div>
          <span className="h-8 w-px bg-zinc-200" />
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-zinc-600">{joined}</span>
            <span className="mt-0.5 text-xs text-zinc-500">가입</span>
          </div>
        </div>
      </div>

      <p className="mt-12 text-center text-sm text-zinc-400">
        아직 등록한 코디가 없어요.
      </p>
    </div>
  );
}
