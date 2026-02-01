import { PromotionWithFavorite } from "../types";

export interface FavoritesResponse {
  items: PromotionWithFavorite[];
  page: number;
  limit: number;
  total: number;
  totalFavorites: number;
  totalPotentialRewards: number;
  nextPage?: number;
}
