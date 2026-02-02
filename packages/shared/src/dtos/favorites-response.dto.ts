import { PromotionWithFavorite } from "../types";

export interface FavoritesResponseMeta {
  page: number;
  limit: number;
  totalFavorites: number;
  totalPotentialRewards: number;
  nextPageCursor: string | null;
}

export interface FavoritesResponse {
  active: PromotionWithFavorite[];
  expired: PromotionWithFavorite[];
  meta: FavoritesResponseMeta;
}
