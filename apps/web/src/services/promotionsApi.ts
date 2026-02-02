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

export type PaginatedPromotions = {
  items: Promotion[];
  page: number;
  limit: number;
  total: number;
  nextPage?: number;
};

export const getPromotions = async (
  params: PromotionsQueryParams = {}
): Promise<ApiResponse<PaginatedPromotions>> => {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.q) qs.set('q', params.q);
  if (params.merchant) qs.set('merchant', params.merchant);
  if (params.expiresBefore) qs.set('expiresBefore', params.expiresBefore);

  const url = `/promotions${qs.toString() ? `?${qs.toString()}` : ''}`;
  const res = await api.get<ApiResponse<PaginatedPromotions>>(url);
  return res.data;
};

export const getMerchants = async (): Promise<string[]> => {
  const res = await api.get('/promotions/merchants');
  // handle controller returning raw array or ApiResponse wrapper
  if (res && res.data) {
    if (Array.isArray((res.data as any).data)) return (res.data as any).data as string[];
    if (Array.isArray(res.data)) return res.data as string[];
  }
  return [];
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

