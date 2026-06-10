"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ProductTagPicker } from "@/components/post/ProductTagPicker";
import { Button } from "@/components/ui/Button";
import { useCreatePost } from "@/hooks/usePosts";
import { uploadsApi } from "@/lib/api";
import { cn, imageUrl } from "@/lib/utils";
import { Season, Tone } from "@/types";
import type { Product } from "@/types";

const SEASONS: { key: Season; label: string }[] = [
  { key: "SPRING", label: "봄" },
  { key: "SUMMER", label: "여름" },
  { key: "FALL", label: "가을" },
  { key: "WINTER", label: "겨울" },
];
const TONES: { key: Tone; label: string }[] = [
  { key: "WARM", label: "웜톤" },
  { key: "COOL", label: "쿨톤" },
];

export default function NewPostPage() {
  return (
    <RequireAuth messageKey="auth.gatePost">
      <NewPostForm />
    </RequireAuth>
  );
}

function NewPostForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState("");
  const [season, setSeason] = useState<Season | null>(null);
  const [tone, setTone] = useState<Tone | null>(null);
  const [tagged, setTagged] = useState<Product[]>([]);
  const create = useCreatePost();

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      try {
        const { url } = await uploadsApi.image(file);
        setImages((prev) => [...prev, url]);
      } catch {
        /* skip */
      }
    }
    setUploading(false);
  };

  const canSubmit =
    images.length > 0 && !!season && !!tone && !create.isPending && !uploading;

  const submit = () => {
    if (!season || !tone) return;
    create.mutate(
      {
        content: content.trim(),
        season,
        tone,
        images,
        productIds: tagged.map((p) => p.id),
      },
      { onSuccess: (post) => router.push(`/posts/${post.id}`) },
    );
  };

  return (
    <div className="mx-auto w-full max-w-lg py-6 pb-20">
      <h1 className="mb-5 text-lg font-bold text-ink">스냅 올리기</h1>

      {/* 사진 */}
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-zinc-700">사진</p>
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div
              key={url}
              className="relative h-24 w-24 overflow-hidden rounded-xl bg-zinc-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl(url)}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  setImages((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex h-24 w-24 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 text-xs text-zinc-400 hover:bg-zinc-50"
          >
            {uploading ? "업로드 중…" : "+ 사진"}
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* 캡션 */}
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-zinc-700">내용</p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="오늘의 코디를 소개해주세요"
          className="w-full resize-none rounded-xl border border-zinc-200 p-3 text-sm focus:border-zinc-400 focus:outline-none"
        />
      </div>

      {/* 시즌/톤 */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <p className="mb-2 text-sm font-medium text-zinc-700">시즌</p>
          <div className="flex flex-wrap gap-1.5">
            {SEASONS.map((s) => (
              <Chip
                key={s.key}
                active={season === s.key}
                onClick={() => setSeason(s.key)}
              >
                {s.label}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-zinc-700">톤</p>
          <div className="flex flex-wrap gap-1.5">
            {TONES.map((tn) => (
              <Chip
                key={tn.key}
                active={tone === tn.key}
                onClick={() => setTone(tn.key)}
              >
                {tn.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {/* 상품 태그 */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-zinc-700">
          입은 상품 태그{" "}
          <span className="text-xs font-normal text-zinc-400">(선택)</span>
        </p>
        <ProductTagPicker selected={tagged} onChange={setTagged} />
      </div>

      <Button className="w-full" disabled={!canSubmit} onClick={submit}>
        {create.isPending ? "올리는 중…" : "스냅 올리기"}
      </Button>
      {create.isError && (
        <p className="mt-3 text-center text-sm text-red-500">
          업로드에 실패했어요. 잠시 후 다시 시도해주세요.
        </p>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm transition",
        active
          ? "bg-ink text-white"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
      )}
    >
      {children}
    </button>
  );
}
