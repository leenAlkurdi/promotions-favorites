"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfavoritePromotion } from "../services/promotionsApi";
import { mapErrorToI18n } from "@/lib/errorMapper";
import { getToast } from "@/lib/ToastProvider";

export function useUnfavoritePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unfavoritePromotion,
    onMutate: async (promotionId: string) => {
      console.debug("[useUnfavoritePromotion] onMutate", promotionId);
      await queryClient.cancelQueries({ queryKey: ["promotions"] });
      await queryClient.cancelQueries({ queryKey: ["favorites"] });

      const previousPromotions = queryClient.getQueriesData({ queryKey: ["promotions"] });
      const previousFavorites = queryClient.getQueriesData({ queryKey: ["favorites"] });

      previousPromotions.forEach(([key]) => {
        queryClient.setQueryData(key as any, (old: any) => {
          if (!old || (!Array.isArray(old) && !old.items)) return old;
          if (Array.isArray(old)) {
            return old.map((p: any) => (p.id === promotionId ? { ...p, isFavorite: false } : p));
          }
          return {
            ...old,
            items: (old.items || []).map((p: any) => (p.id === promotionId ? { ...p, isFavorite: false } : p)),
          };
        });
      });

      previousFavorites.forEach(([key]) => {
        queryClient.setQueryData(key as any, (old: any) => {
          if (!old) return old;
          try {
            return {
              ...old,
              totalFavorites: Math.max((old.totalFavorites || 1) - 1, 0),
            };
          } catch (_) {
            return old;
          }
        });
      });

      return { previousPromotions, previousFavorites };
    },
    onError: async (err: any, _vars, context: any) => {
      console.debug("[useUnfavoritePromotion] onError", err, context);
      const mapped = mapErrorToI18n(err);
      const toast = getToast();
      toast.error(mapped.key, { traceId: err?.traceId });

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
      console.debug("[useUnfavoritePromotion] onSuccess", res);
      const toast = getToast();
      toast.success("toasts.unfavorited", { traceId: res?.traceId });
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
