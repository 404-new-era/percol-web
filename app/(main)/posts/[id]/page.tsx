import { Stub } from "@/components/ui/Stub";

/** 게시물 상세 (이미지/상품태그/좋아요/댓글) */
export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Stub title="코디 상세" note={`post id: ${id}`} />;
}
