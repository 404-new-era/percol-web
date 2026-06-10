"use client";

import Link from "next/link";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ProductCard } from "@/components/product/ProductCard";
import { useBookmarks } from "@/hooks/useBookmarks";
import { dedupeById } from "@/lib/utils";

/** 내 북마크 목록 (로그인 필요) */
export default function BookmarksPage() {
  return (
    <RequireAuth messageKey="auth.gateBookmark">
      <BookmarksContent />
    </RequireAuth>
  );
}

function BookmarksContent() {
  const { data, isLoading } = useBookmarks({ limit: 50 });
  const products = dedupeById((data?.items ?? []).map((b) => b.product));

  return (
    <div className="py-6 pb-16">
      <h1 className="mb-4 text-lg font-bold text-ink">북마크</h1>

      {isLoading ? (
        <Grid>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-lg bg-zinc-100"
            />
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-zinc-500">아직 찜한 상품이 없어요.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white"
          >
            상품 둘러보기
          </Link>
        </div>
      ) : (
        <Grid>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Grid>
      )}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {children}
    </div>
  );
}
