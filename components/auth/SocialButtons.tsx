"use client";

import { startSocialLogin } from "@/lib/auth/login";
import { useT } from "@/hooks/useT";

const PROVIDERS = [
  {
    id: "kakao" as const,
    labelKey: "auth.kakao",
    icon: "/assets/social/kakao.svg",
    className: "bg-[#FEE500] text-[#191600] hover:brightness-95",
  },
  {
    id: "naver" as const,
    labelKey: "auth.naver",
    icon: "/assets/social/naver.svg",
    className: "bg-[#03C75A] text-white hover:brightness-95",
  },
  {
    id: "google" as const,
    labelKey: "auth.google",
    icon: "/assets/social/google.svg",
    className:
      "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50",
  },
];

/** 소셜 로그인 버튼 묶음 — 좌측 브랜드 마크 + 중앙 텍스트, 클릭 시 OAuth 이동 */
export function SocialButtons({ returnUrl }: { returnUrl?: string }) {
  const { t } = useT();
  return (
    <div className="flex w-full flex-col gap-2.5">
      {PROVIDERS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => startSocialLogin(p.id, returnUrl)}
          className={`relative flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold transition ${p.className}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.icon}
            alt=""
            aria-hidden
            className="absolute left-4 h-[18px] w-[18px]"
          />
          {t(p.labelKey)}
        </button>
      ))}
    </div>
  );
}
