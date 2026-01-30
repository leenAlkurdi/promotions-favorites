import { Promotion } from './promotion.type';

export type PromotionWithFavorite = Promotion & {
  isFavorite: boolean;
  daysUntilExpiry: number;
};
