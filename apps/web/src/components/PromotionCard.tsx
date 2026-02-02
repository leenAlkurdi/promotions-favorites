"use client";
import Image from 'next/image';
import React from 'react';
import { PromotionWithFavorite } from '@promotions-favorites/shared';
import { Heart, Clock } from 'lucide-react';

type Props = {
  promotion: PromotionWithFavorite;
  isUpdating?: boolean; // حالة التحديث
  onToggleFavorite?: (id: string) => void;
};

export default function PromotionCard({ promotion, onToggleFavorite, isUpdating = false }: Props) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
      
      {/* Image */}
      <div className="h-44 w-full relative bg-gray-100">
        {promotion.thumbnailUrl ? (
          <Image
            src={promotion.thumbnailUrl}
            alt={promotion.title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-sm text-textSecondary">
            No image
          </div>
        )}

        {/* Favorite */}
        <button
          aria-pressed={promotion.isFavorite}
          aria-label={promotion.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => onToggleFavorite?.(promotion.id)}
          disabled={isUpdating}
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Heart
            className={`h-5 w-5 ${
              promotion.isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-400'
            }`}
          />
        </button>

        {/* Expiry badge */}
        {promotion.daysUntilExpiry <= 7 && (
          <div className="absolute left-3 top-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Clock className="h-3 w-3" />
            ينتهي خلال {promotion.daysUntilExpiry} أيام
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
            {promotion.title}
          </h3>
          <p className="text-xs text-textSecondary">
            {promotion.merchant}
          </p>
        </div>

        <div className="text-sm font-bold text-primary">
          {promotion.rewardAmount} {promotion.rewardCurrency}
        </div>

        <p className="text-xs text-gray-600 line-clamp-2">
          {promotion.description}
        </p>

        <div className="mt-auto flex items-center justify-between text-xs text-textSecondary">
          <span>
            ينتهي بتاريخ {new Date(promotion.expiresAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </article>
  );
}
