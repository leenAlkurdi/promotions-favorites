import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritePromotion } from "@/services/promotionsApi";

export function useFavoritePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: favoritePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
}
