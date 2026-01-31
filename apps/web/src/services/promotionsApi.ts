import { api } from "./api";
import { ApiResponse, Promotion } from '@promotions-favorites/shared';

export const getPromotions = async (): Promise<ApiResponse<Promotion[]>> => {
  const res = await api.get<ApiResponse<Promotion[]>>("/promotions");
  return res.data;
};
