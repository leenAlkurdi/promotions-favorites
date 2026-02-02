"use client";
import PromotionsList from '@/components/PromotionsList';
import { useFavoritePromotion } from '@/hooks/useFavoritePromotion';
import { useUnfavoritePromotion } from '@/hooks/useUnfavoritePromotion';
import FilterBar from '@/components/FilterBar';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePromotions } from '@/hooks/usePromotions';
import { PromotionWithFavorite } from '@promotions-favorites/shared';

type Filters = {
  q?: string;
  merchant?: string;
  expiresBefore?: string;
};

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get('page') ?? '1');
  const limit = Number(searchParams.get('limit') ?? '9');
  const q = searchParams.get('q') ?? undefined;
  const merchant = searchParams.get('merchant') ?? undefined;
  const expiresBefore = searchParams.get('expiresBefore') ?? undefined;

  const filters: Filters = { q, merchant, expiresBefore };

  const { data, isLoading } = usePromotions({ page, limit, q, merchant, expiresBefore } as any);
  const fav = useFavoritePromotion();
  const unfav = useUnfavoritePromotion();

  const handlePrev = () => {
    if (page <= 1) return;
    const params = new URLSearchParams(Object.fromEntries(searchParams.entries()));
    params.set('page', String(page - 1));
    router.replace(`/?${params.toString()}`);
  };

  const handleNext = () => {
    const params = new URLSearchParams(Object.fromEntries(searchParams.entries()));
    params.set('page', String(page + 1));
    router.replace(`/?${params.toString()}`);
  };

  const items = data?.items ?? [];
  const currentPage = data?.page ?? page;
  const currentLimit = data?.limit ?? limit;
  const total = data?.total ?? 0;

  // Prepare `PromotionWithFavorite[]` for the UI (attach isFavorite + daysUntilExpiry)
  const promotionsForUi: PromotionWithFavorite[] = (items as any[]).map((p) => {
    const expiresAt = new Date(p.expiresAt);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    const daysUntilExpiry = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    return {
      ...p,
      isFavorite: false,
      daysUntilExpiry,
    } as PromotionWithFavorite;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Promotions</h1>
      <FilterBar initial={{ merchant, expiresBefore }} onChange={() => { /* FilterBar updates URL itself */ }} />
      <PromotionsList promotions={promotionsForUi} isLoading={isLoading} />

      {/* Pagination controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          disabled={currentPage <= 1}
          onClick={handlePrev}
        >
          Previous
        </button>

        <span>Page {currentPage} of {Math.ceil(total / currentLimit) || 1}</span>

        <button
          className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          disabled={currentPage * currentLimit >= total}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </main>
  );
}
