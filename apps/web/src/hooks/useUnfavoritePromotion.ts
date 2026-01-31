import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfavoritePromotion } from "@/services/promotionsApi";

export function useUnfavoritePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unfavoritePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
}
