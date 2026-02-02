"use client";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { getFavorites } from "../services/favoritesApi";
import { FavoritesResponse } from "@promotions-favorites/shared";

export function useFavorites(limit = 9) {
  const query = useInfiniteQuery<FavoritesResponse, Error, InfiniteData<FavoritesResponse>, ["favorites", number], string | null>({
    queryKey: ["favorites", limit],
    queryFn: async ({ pageParam }) => {
      const res = await getFavorites({ cursor: pageParam ?? null, limit });

      if (!res || !res.data) {
        throw new Error(res?.message ?? "Failed to load favorites");
      }

      return res.data;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.meta.nextPageCursor,
  });

  const pages = query.data?.pages ?? [];

  const active = pages.flatMap((page) => page.active);
  const expired = pages.flatMap((page) => page.expired);
  const meta = pages[0]?.meta;

  return {
    ...query,
    active,
    expired,
    aggregates: {
      totalFavorites: meta?.totalFavorites ?? 0,
      totalPotentialRewards: meta?.totalPotentialRewards ?? 0,
    },
    hasNextPage: Boolean(query.hasNextPage),
    isLoading: query.isLoading && !query.isFetchingNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    loadMore: query.fetchNextPage,
  };
}
