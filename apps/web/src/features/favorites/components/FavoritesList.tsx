"use client";
import List from "@/components/List/List";
import { CardItem } from "@components/Card/Card.types";
import { PromotionWithFavorite } from "@promotions-favorites/shared";
import { useFavoritePromotion } from "@/features/promotions/hooks/useFavoritePromotion";
import { useUnfavoritePromotion } from "@/features/promotions/hooks/useUnfavoritePromotion";
import { ListView } from "@/components/List/List.types";
import { useMemo, useState } from "react";
import PromotionDetailModal from "@/features/promotions/components/PromotionDetailModal";

type Props = {
  favorites?: PromotionWithFavorite[];
  isLoading?: boolean;
  view?: ListView;
};

const daysUntil = (dateStr?: string) => {
  if (!dateStr) return 0;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
};

const toCardItem = (promotion: PromotionWithFavorite): CardItem => ({
  id: promotion.id,
  title: promotion.title,
  subtitle: promotion.merchant,
  description: promotion.description,
  rewardAmount: promotion.rewardAmount,
  rewardCurrency: promotion.rewardCurrency,
  expiresAt: promotion.expiresAt,
  thumbnailUrl: promotion.thumbnailUrl,
  isFavorite: promotion.isFavorite,
  daysUntilExpiry: promotion.daysUntilExpiry ?? daysUntil(promotion.expiresAt),
});

export default function FavoritesList({ favorites = [], isLoading = false, view = "grid" }: Props) {
  const favoriteMutation = useFavoritePromotion();
  const unfavoriteMutation = useUnfavoritePromotion();
  const [selected, setSelected] = useState<PromotionWithFavorite | null>(null);

  const isUpdating = favoriteMutation.status === "pending" || unfavoriteMutation.status === "pending";

  const toggleFavorite = (id: string, nextIsFavorite: boolean) => {
    setSelected((prev) => (prev && prev.id === id ? { ...prev, isFavorite: nextIsFavorite } : prev));

    if (nextIsFavorite) {
      favoriteMutation.mutate(id);
    } else {
      unfavoriteMutation.mutate(id);
    }
  };

  const items: CardItem[] = favorites.map((p) => toCardItem(p));

  const favoriteById = useMemo(() => {
    const map = new Map<string, PromotionWithFavorite>();
    favorites.forEach((f) => map.set(f.id, f));
    return map;
  }, [favorites]);

  const handleSelect = (item: CardItem) => {
    const promo = favoriteById.get(item.id);
    if (promo) setSelected(promo);
  };

  return (
    <>
      <List
        items={items}
        isLoading={isLoading}
        view={view}
        onToggleFavorite={toggleFavorite}
        onSelect={handleSelect}
        isUpdating={isUpdating}
        emptyTitle="No favorites yet"
        emptyBody="Save promotions you like to find them here."
      />

      {selected && (
        <PromotionDetailModal
          promotion={selected}
          onClose={() => setSelected(null)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </>
  );
}
