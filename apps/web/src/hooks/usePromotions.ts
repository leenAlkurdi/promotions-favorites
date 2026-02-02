"use client";
import { useQuery } from '@/lib/query';
import { getPromotions } from "@/services/promotionsApi";
import { Promotion } from '@promotions-favorites/shared';

export function usePromotions() {
  return useQuery<Promotion[], Error>({
    queryKey: ["promotions"],
    queryFn: async () => {
      const res = await getPromotions();
      if (!res || !res.data) {
        throw new Error(res?.message ?? "Failed to load promotions");
      }
      return res.data;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  });
}

export default usePromotions;
