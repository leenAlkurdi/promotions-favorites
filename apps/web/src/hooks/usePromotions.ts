"use client";
import { useQuery } from '@/lib/query';
import { getPromotions, PaginatedPromotions, PromotionsQueryParams } from "@/services/promotionsApi";
import { Promotion } from '@promotions-favorites/shared';

export function usePromotions(filters: PromotionsQueryParams = {}) {
  return useQuery<PaginatedPromotions, Error>({
    queryKey: ['promotions', filters],
    queryFn: async () => {
      const res = await getPromotions(filters);
      if (!res?.data) {
        throw new Error(res?.message ?? "Failed to load promotions");
      }
      return res.data as PaginatedPromotions;
    },
    placeholderData: (previousData) => previousData,
  });
}
