"use client";
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getFavorites } from '../services/promotionsApi';
import { FavoritesResponse } from '@promotions-favorites/shared';

export function useFavorites(page = 1, limit = 10) {
  const query = useQuery<FavoritesResponse, Error>({
    queryKey: ['favorites', page, limit],
    queryFn: async () => {
      const res = await getFavorites(page, limit);

      if (!res || !res.data) {
        throw new Error(res?.message ?? 'Failed to load favorites');
      }

      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    items: query.data?.items ?? [],
    aggregates: {
      totalFavorites: query.data?.totalFavorites ?? 0,
      totalPotentialRewards: query.data?.totalPotentialRewards ?? 0,
    },
    pagination: {
      page: query.data?.page ?? page,
      limit: query.data?.limit ?? limit,
      total: query.data?.total ?? 0,
      nextPage: query.data?.nextPage,
    },
  };
}
