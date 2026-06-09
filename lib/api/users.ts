import { api } from "./client";
import type { Me, MyPageCounts, PublicProfile, UpdateMeInput } from "@/types";

export const usersApi = {
  me: () => api.get<Me>("/users/me"),
  updateMe: (input: UpdateMeInput) => api.patch<Me>("/users/me", input),
  myPage: () => api.get<MyPageCounts>("/users/me/page"),
  publicProfile: (nickname: string) =>
    api.get<PublicProfile>(`/users/${encodeURIComponent(nickname)}`),
};
