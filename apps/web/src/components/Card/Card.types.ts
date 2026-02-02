export type CardItem = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  rewardAmount?: number;
  rewardCurrency?: string;
  expiresAt?: string;
  thumbnailUrl?: string;
  isFavorite?: boolean;
  daysUntilExpiry?: number;
};

export type CardActionHandlers = {
  onToggleFavorite?: (itemId: string, nextIsFavorite: boolean) => void;
  isUpdating?: boolean;
};
