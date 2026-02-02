"use client";
import PromotionsList from '@/components/PromotionsList';
import usePromotions from '@/hooks/usePromotions';
import { useFavoritePromotion } from '@/hooks/useFavoritePromotion';
import { useUnfavoritePromotion } from '@/hooks/useUnfavoritePromotion';
import FilterBar from '@/components/FilterBar';
import { useState } from 'react';

type Filters = {
  q?: string;
  merchant?: string;
  expiresBefore?: string;
};

export default function Home() {
  const [filters, setFilters] = useState<Filters>({});
  const { data: promotions = [], isLoading } = usePromotions(filters);
  const fav = useFavoritePromotion();
  const unfav = useUnfavoritePromotion();

  const handleToggle = (id: string) => {
    // naive toggle: call favorite (real app should check current state)
    fav.mutate(id);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Promotions</h1>
      <FilterBar initial={filters} onChange={(f) => setFilters(f)} />
      <PromotionsList promotions={promotions} isLoading={isLoading} onToggleFavorite={handleToggle} />
    </main>
  );
}
