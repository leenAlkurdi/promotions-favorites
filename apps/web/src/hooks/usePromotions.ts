import { useQuery } from "@tanstack/react-query";
import { getPromotions } from "@/services/promotionsApi";

export function usePromotions() {
  return useQuery({
    queryKey: ["promotions"],
    queryFn: getPromotions,
  });
}
