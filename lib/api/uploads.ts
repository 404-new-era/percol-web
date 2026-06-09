import { http } from "./client";
import type { UploadResult } from "@/types";

export const uploadsApi = {
  /** 게시물/프로필용 이미지 업로드 → URL 반환 (multipart, 필드명 image) */
  image: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return http
      .post<UploadResult>("/uploads/image", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};
