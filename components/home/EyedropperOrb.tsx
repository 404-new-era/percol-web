"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 컬러 오브 + 스포이드 — 색들을 원형 conic 휠로 그리고,
 * 마우스를 올리면 그 지점의 색(hex)을 피그마 스포이드처럼 보여준다.
 */
export function EyedropperOrb({
  colors,
  size = 160,
  className,
}: {
  colors: string[];
  size?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<{ x: number; y: number; hex: string } | null>(
    null,
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    const cols = colors.length ? colors : ["#cccccc"];
    const grad = ctx.createConicGradient(-Math.PI / 2, cx, cy);
    const n = cols.length;
    for (let i = 0; i <= n; i++) grad.addColorStop(i / n, cols[i % n]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // 입체감용 하이라이트
    const rg = ctx.createRadialGradient(cx * 0.7, cy * 0.6, 0, cx, cy, r);
    rg.addColorStop(0, "rgba(255,255,255,0.4)");
    rg.addColorStop(0.55, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, size, size);
    ctx.restore();
  }, [colors, size]);

  const onMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = size / 2;
    const cy = size / 2;
    if ((x - cx) ** 2 + (y - cy) ** 2 > (size / 2 - 1) ** 2) {
      setHover(null);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const d = ctx.getImageData(
      Math.floor(x * dpr),
      Math.floor(y * dpr),
      1,
      1,
    ).data;
    const hex =
      "#" +
      [d[0], d[1], d[2]]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("");
    setHover({ x, y, hex });
  };

  return (
    <div
      className={`relative ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="cursor-crosshair rounded-full"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      />
      {hover && (
        <div
          className="pointer-events-none absolute z-10 flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2 py-1 text-[11px] font-semibold text-white shadow-lg"
          style={{
            left: Math.min(hover.x + 12, size - 4),
            top: hover.y + 12,
          }}
        >
          <span
            className="h-3 w-3 rounded-full ring-1 ring-white/40"
            style={{ backgroundColor: hover.hex }}
          />
          {hover.hex.toUpperCase()}
        </div>
      )}
    </div>
  );
}
