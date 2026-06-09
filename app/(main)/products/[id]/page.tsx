import { Stub } from "@/components/ui/Stub";

/** 상품 상세 (+시즌 태그, 북마크) */
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Stub title="상품 상세" note={`product id: ${id}`} />;
}
