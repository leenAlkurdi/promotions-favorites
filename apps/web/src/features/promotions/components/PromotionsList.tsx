"use client";
import List from "@/components/List/List";
import { CardItem } from "@/components/Card/Card.types";
import { PromotionWithFavorite } from "@promotions-favorites/shared";
import { useFavoritePromotion } from "../hooks/useFavoritePromotion";
import { useUnfavoritePromotion } from "../hooks/useUnfavoritePromotion";
import { ListView } from "@/components/List/List.types";

type Props = {
  promotions?: PromotionWithFavorite[];
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

export default function PromotionsList({ promotions = [], isLoading = false, view = "grid" }: Props) {
  const favoriteMutation = useFavoritePromotion();
  const unfavoriteMutation = useUnfavoritePromotion();

  const isUpdating = favoriteMutation.status === "pending" || unfavoriteMutation.status === "pending";

  const toggleFavorite = (id: string, nextIsFavorite: boolean) => {
    if (nextIsFavorite) {
      favoriteMutation.mutate(id);
    } else {
      unfavoriteMutation.mutate(id);
    }
  };

  const items: CardItem[] = promotions.map((p) => toCardItem(p));

  return (
    <List
      items={items}
      isLoading={isLoading}
      view={view}
      onToggleFavorite={toggleFavorite}
      isUpdating={isUpdating}
      emptyTitle="No promotions found"
      emptyBody="Try adjusting your filters or check back later."
    />
  );
}
