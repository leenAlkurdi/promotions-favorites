"use client";
import PromotionsList from '@/components/PromotionsList';
import usePromotions from '@/hooks/usePromotions';
import { useFavoritePromotion } from '@/hooks/useFavoritePromotion';
import { useUnfavoritePromotion } from '@/hooks/useUnfavoritePromotion';

export default function Home() {
  const { data: promotions = [], isLoading } = usePromotions();
  const fav = useFavoritePromotion();
  const unfav = useUnfavoritePromotion();

  const handleToggle = (id: string) => {
    // naive toggle: call favorite (real app should check current state)
    fav.mutate(id);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Promotions</h1>
      <PromotionsList promotions={promotions} isLoading={isLoading} onToggleFavorite={handleToggle} />
    </main>
  );
}
