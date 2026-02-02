"use client";
import React from 'react';
import PromotionCard from './PromotionCard';
import SkeletonPromotionCard from './SkeletonPromotionCard';
import EmptyState from './EmptyState';
import { Promotion, PromotionWithFavorite } from '@promotions-favorites/shared';

type Props = {
  promotions?: Promotion[];
  isLoading?: boolean;
  view?: 'grid' | 'list';
  onToggleFavorite?: (id: string) => void;
};

export default function PromotionsList({ promotions = [], isLoading = false, view = 'grid', onToggleFavorite }: Props) {
  const daysUntil = (dateStr?: string) => {
    if (!dateStr) return 0;
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  };

  // Map API model -> UI model (PromotionWithFavorite)
  const uiPromotions: PromotionWithFavorite[] = (promotions || []).map((p) => ({
    ...p,
    isFavorite: (p as any).isFavorite ?? false,
    daysUntilExpiry: daysUntil((p as any).expiresAt ?? (p as any).expiresAt),
  }));

  if (!isLoading && uiPromotions.length === 0) {
    return <EmptyState title="No promotions found" body="Try adjusting your filters or check back later." />;
  }

  if (isLoading) {
    const skeletons = Array.from({ length: 6 }).map((_, i) => (
      <SkeletonPromotionCard key={i} />
    ));
    return (
      <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {skeletons}
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`} role="list">
      {uiPromotions.map((p) => (
        <div key={p.id} role="listitem">
          <PromotionCard promotion={p as any} onToggleFavorite={onToggleFavorite} />
        </div>
      ))}
    </div>
  );
}
