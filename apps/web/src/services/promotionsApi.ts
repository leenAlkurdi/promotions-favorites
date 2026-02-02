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

export type PromotionsQueryParams = {
  page?: number;
  limit?: number;
  q?: string;
  merchant?: string;
  expiresBefore?: string; // ISO date string (YYYY-MM-DD)
};

export const getPromotions = async (
  params: PromotionsQueryParams = {}
): Promise<ApiResponse<Promotion[]>> => {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.q) qs.set('q', params.q);
  if (params.merchant) qs.set('merchant', params.merchant);
  if (params.expiresBefore) qs.set('expiresBefore', params.expiresBefore);

  const url = `/promotions${qs.toString() ? `?${qs.toString()}` : ''}`;
  const res = await api.get<ApiResponse<Promotion[]>>(url);
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

