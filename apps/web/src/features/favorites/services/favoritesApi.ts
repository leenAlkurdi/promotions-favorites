import { api } from "@/services/api";
import { ApiResponse, FavoritesResponse } from "@promotions-favorites/shared";

type FavoritesQuery = {
  limit?: number;
  cursor?: string | null;
};

export const getFavorites = async ({ limit = 10, cursor = null }: FavoritesQuery = {}): Promise<ApiResponse<FavoritesResponse>> => {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (cursor) {
    params.set("cursor", cursor);
  }

  const res = await api.get<ApiResponse<FavoritesResponse>>(`/promotions/favorites?${params.toString()}`);
  return res.data;
};
