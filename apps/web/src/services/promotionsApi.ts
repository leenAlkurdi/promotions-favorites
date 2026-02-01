import { api } from "./api";
import { ApiResponse, Promotion, PromotionWithFavorite, FavoritesResponse } from '@promotions-favorites/shared';

export const favoritePromotion = async (promotionId: string): Promise<ApiResponse<Promotion>> => {
  const res = await api.post<ApiResponse<Promotion>>(`/promotions/${promotionId}/favorite`);
  return res.data;
};

export const unfavoritePromotion = async (promotionId: string): Promise<ApiResponse<Promotion>> => {
  const res = await api.delete<ApiResponse<Promotion>>(`/promotions/${promotionId}/favorite`);
  return res.data;
};

export const getPromotions = async (): Promise<ApiResponse<Promotion[]>> => {
  const res = await api.get<ApiResponse<Promotion[]>>('/promotions');
  return res.data;
};

export const getFavorites = async (
  page = 1,
  limit = 10
): Promise<ApiResponse<FavoritesResponse>> => {
  const res = await api.get<ApiResponse<FavoritesResponse>>(
    `/promotions/favorites?page=${page}&limit=${limit}`
  );
  return res.data;
};

