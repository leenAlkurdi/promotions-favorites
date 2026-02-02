"use client";
import React from 'react';
import PromotionCard from './PromotionCard';
import SkeletonPromotionCard from './SkeletonPromotionCard';
import EmptyState from './EmptyState';
import { PromotionWithFavorite } from '@promotions-favorites/shared';
import { useFavoritePromotion } from '@/hooks/useFavoritePromotion';
import { useUnfavoritePromotion } from '@/hooks/useUnfavoritePromotion';
type Props = {
  promotions?: PromotionWithFavorite[];
  isLoading?: boolean;
  view?: 'grid' | 'list';
};

export default function PromotionsList({ promotions = [], isLoading = false, view = 'grid' }: Props) {
  const favoriteMutation = useFavoritePromotion();
  const unfavoriteMutation = useUnfavoritePromotion();

  const toggleFavorite = (id: string, isFavorite: boolean) => {
    if (isFavorite) {
      unfavoriteMutation.mutate(id);
    } else {
      favoriteMutation.mutate(id);
    }
  };

  const daysUntil = (dateStr?: string) => {
    if (!dateStr) return 0;
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  };

  const uiPromotions: PromotionWithFavorite[] = (promotions || []).map((p) => ({
    ...p,
    daysUntilExpiry: daysUntil(p.expiresAt),
  }));

  if (!isLoading && uiPromotions.length === 0) {
    return <EmptyState title="No promotions found" body="Try adjusting your filters or check back later." />;
  }

  if (isLoading) {
    const skeletons = Array.from({ length: 6 }).map((_, i) => <SkeletonPromotionCard key={i} />);
    return (
      <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {skeletons}
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`} role="list">
      {uiPromotions.map((p) => {
        const isUpdating =
          favoriteMutation.status === 'pending' ||
          unfavoriteMutation.status === 'pending';

        return (
          <div key={p.id} role="listitem">
            <PromotionCard
              promotion={p}
              onToggleFavorite={(id) => toggleFavorite(id, p.isFavorite)}
              isUpdating={isUpdating}
            />
          </div>
        );
      })}


    </div>
  );
}
