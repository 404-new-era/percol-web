"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 카메라 촬영 모달 — getUserMedia로 웹캠/전면카메라 미리보기 후 캡처.
 * (input capture는 데스크탑에서 앨범이 열려서 직접 구현)
 */
export function CameraModal({
  onCapture,
  onClose,
}: {
  onCapture: (file: File) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setError("이 브라우저는 카메라를 지원하지 않아요.");
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setReady(true);
      } catch {
        setError("카메라를 열 수 없어요. 권한을 허용했는지 확인해주세요.");
      }
    };
    void start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        onCapture(new File([blob], "capture.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.9,
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {error ? (
          <p className="px-2 py-10 text-center text-sm text-zinc-500">
            {error}
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl bg-black">
            <video
              ref={videoRef}
              playsInline
              muted
              className="aspect-[3/4] w-full -scale-x-100 object-cover"
            />
          </div>
        )}

        <div className="mt-4 flex gap-2">
          {!error && (
            <button
              type="button"
              onClick={capture}
              disabled={!ready}
              className="h-11 flex-1 rounded-xl bg-ink text-sm font-semibold text-white disabled:opacity-50"
            >
              📷 촬영
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="h-11 flex-1 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-700"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
