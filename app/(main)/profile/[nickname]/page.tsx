import { Stub } from "@/components/ui/Stub";

/** 공개 프로필 */
export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ nickname: string }>;
}) {
  const { nickname } = await params;
  return <Stub title="프로필" note={`@${decodeURIComponent(nickname)}`} />;
}
