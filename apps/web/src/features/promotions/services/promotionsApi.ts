import { api } from "@/services/api";
import { ApiResponse, PromotionWithFavorite } from "@promotions-favorites/shared";

export const favoritePromotion = async (promotionId: string): Promise<ApiResponse<PromotionWithFavorite>> => {
  const res = await api.post<ApiResponse<PromotionWithFavorite>>(`/promotions/${promotionId}/favorite`);
  return res.data;
};

export const unfavoritePromotion = async (promotionId: string): Promise<ApiResponse<PromotionWithFavorite>> => {
  const res = await api.delete<ApiResponse<PromotionWithFavorite>>(`/promotions/${promotionId}/favorite`);
  return res.data;
};

export type PromotionsQueryParams = {
  page?: number;
  limit?: number;
  q?: string;
  merchant?: string;
  expiresBefore?: string;
};

export type PaginatedPromotions = {
  items: PromotionWithFavorite[];
  page: number;
  limit: number;
  total: number;
  nextPage?: number;
};

export const getPromotions = async (
  params: PromotionsQueryParams = {}
): Promise<ApiResponse<PaginatedPromotions>> => {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.q) qs.set("q", params.q);
  if (params.merchant) qs.set("merchant", params.merchant);
  if (params.expiresBefore) qs.set("expiresBefore", params.expiresBefore);

  const url = `/promotions${qs.toString() ? `?${qs.toString()}` : ""}`;
  const res = await api.get<ApiResponse<PaginatedPromotions>>(url);
  return res.data;
};

export const getMerchants = async (): Promise<string[]> => {
  const res = await api.get("/promotions/merchants");
  if (res && res.data) {
    if (Array.isArray((res.data as any).data)) return (res.data as any).data as string[];
    if (Array.isArray(res.data)) return res.data as string[];
  }
  return [];
};
