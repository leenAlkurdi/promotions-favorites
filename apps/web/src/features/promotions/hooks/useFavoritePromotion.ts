"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritePromotion } from "../services/promotionsApi";
import { mapErrorToI18n } from "@/lib/errorMapper";
import { getToast } from "@/lib/ToastProvider";

export function useFavoritePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: favoritePromotion,
    onMutate: async (promotionId: string) => {
      await queryClient.cancelQueries({ queryKey: ["promotions"] });

      const previousPromotions = queryClient.getQueriesData({ queryKey: ["promotions"] });

      previousPromotions.forEach(([key]) => {
        queryClient.setQueryData(key as any, (old: any) => {
          if (!old) return old;
          if (Array.isArray(old)) {
            return old.map((p: any) => (p.id === promotionId ? { ...p, isFavorite: !p.isFavorite } : p));
          }
          return {
            ...old,
            items: (old.items || []).map((p: any) => (p.id === promotionId ? { ...p, isFavorite: !p.isFavorite } : p)),
          };
        });
      });

      return { previousPromotions };
    },

    onError: async (err: any, _vars, context: any) => {
      console.debug("[useFavoritePromotion] onError", err, context);
      const mapped = mapErrorToI18n(err);
      const toast = getToast();
      toast.error(mapped.key, { traceId: err?.traceId, params: mapped.params });

      if (context?.previousPromotions) {
        context.previousPromotions.forEach(([key, data]: any) => {
          queryClient.setQueryData(key as any, data);
        });
      }
      if (context?.previousFavorites) {
        context.previousFavorites.forEach(([key, data]: any) => {
          queryClient.setQueryData(key as any, data);
        });
      }
    },
    onSuccess: async (res: any) => {
      console.debug("[useFavoritePromotion] onSuccess", res);
      const toast = getToast();
      toast.success("toasts.favorited", { traceId: res?.traceId });
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
