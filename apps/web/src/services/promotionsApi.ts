export const favoritePromotion = async (promotionId: string): Promise<ApiResponse<Promotion>> => {
  const res = await api.post<ApiResponse<Promotion>>(`/promotions/${promotionId}/favorite`);
  return res.data;
};

export const unfavoritePromotion = async (promotionId: string): Promise<ApiResponse<Promotion>> => {
  const res = await api.delete<ApiResponse<Promotion>>(`/promotions/${promotionId}/favorite`);
  return res.data;
};
import { api } from "./api";
import { ApiResponse, Promotion } from '@promotions-favorites/shared';

export const getPromotions = async (): Promise<ApiResponse<Promotion[]>> => {
  const res = await api.get<ApiResponse<Promotion[]>>("/promotions");
  return res.data;
};
