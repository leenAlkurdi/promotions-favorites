"use client";
import Image from "next/image";
import { PromotionWithFavorite } from "@promotions-favorites/shared";
import { Heart } from "lucide-react";

type Props = {
  promotion: PromotionWithFavorite;
  onToggleFavorite?: (id: string) => void;
};

export default function PromotionCard({ promotion, onToggleFavorite }: Props) {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition">
      {/* Image */}
      <div className="relative h-44 bg-gray-100">
        {/* Badge */}
        <span className="absolute left-3 top-3 z-10 rounded-md bg-accent px-2 py-1 text-xs font-medium text-white">
          Limited
        </span>

        {/* Favorite */}
        <button
          onClick={() => onToggleFavorite?.(promotion.id)}
          aria-label={promotion.isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={promotion.isFavorite}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow hover:bg-gray-50 transition"
        >
          <Heart
            className={`h-5 w-5 transition-transform duration-150 ${promotion.isFavorite
                ? "fill-red-500 stroke-red-500 scale-110"
                : "stroke-gray-400"
              }`}
          />

        </button>


        {promotion.thumbnailUrl ? (
          <Image
            src={promotion.thumbnailUrl}
            alt={promotion.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-textMuted">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-textPrimary line-clamp-2">
            {promotion.title}
          </h3>
          <p className="mt-1 text-xs text-textMuted">
            {promotion.merchant}
          </p>
        </div>

        {/* Reward */}
        <div className="rounded-lg bg-main-alt px-3 py-2 text-sm text-primary font-medium">
          Earn {promotion.rewardAmount} {promotion.rewardCurrency}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-textMuted">
          <span> {promotion.daysUntilExpiry} days left</span>
        </div>

        {/* CTA */}
        <button className="mt-2 w-full rounded-lg bg-primary py-2 text-sm font-medium text-white hover:opacity-90">
          Claim Promo
        </button>
      </div>
    </article>
  );
}
