"use client";
import React from 'react';
import PromotionCard from './PromotionCard';
import SkeletonPromotionCard from './SkeletonPromotionCard';
import EmptyState from './EmptyState';
import { Promotion } from '@promotions-favorites/shared';

type Props = {
  promotions?: Promotion[];
  isLoading?: boolean;
  view?: 'grid' | 'list';
  onToggleFavorite?: (id: string) => void;
};

export default function PromotionsList({ promotions = [], isLoading = false, view = 'grid', onToggleFavorite }: Props) {
  if (!isLoading && promotions.length === 0) {
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
      {promotions.map((p) => (
        <div key={p.id} role="listitem">
          <PromotionCard promotion={p} onToggleFavorite={onToggleFavorite} />
        </div>
      ))}
    </div>
  );
}
