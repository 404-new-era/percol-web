/**
 * 업로드 파일을 축소 썸네일 dataURL로 변환.
 * 색 카드 테스트에서 얼굴을 sessionStorage에 저장(새로고침 복원)하기 위함 —
 * objectURL은 새로고침 시 사라지므로 dataURL로, 용량 위해 축소.
 */
export function fileToThumbnailDataUrl(
  file: File,
  maxSize = 320,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("canvas context 없음"));
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지 로드 실패"));
    };
    img.src = url;
  });
}
