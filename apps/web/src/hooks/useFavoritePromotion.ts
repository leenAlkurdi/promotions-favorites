"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritePromotion } from "@/services/promotionsApi";
import { mapErrorToI18n } from '@/lib/errorMapper';
import { useTranslation } from 'next-i18next';

export function useFavoritePromotion() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: favoritePromotion,
    onMutate: async (promotionId: string) => {
      await queryClient.cancelQueries({ queryKey: ['promotions'] });

      const previousPromotions = queryClient.getQueriesData({ queryKey: ['promotions'] });

      // toggle favorite
      previousPromotions.forEach(([key]) => {
        queryClient.setQueryData(key as any, (old: any) => {
          if (!old) return old;
          if (Array.isArray(old)) {
            return old.map((p: any) => p.id === promotionId ? { ...p, isFavorite: !p.isFavorite } : p);
          }
          return {
            ...old,
            items: (old.items || []).map((p: any) => p.id === promotionId ? { ...p, isFavorite: !p.isFavorite } : p),
          };
        });
      });

      return { previousPromotions };
    },

    onError: async (err: any, _vars, context: any) => {
      console.debug('[useFavoritePromotion] onError', err, context);
      const mapped = mapErrorToI18n(err);
      try {
        const mod = await import('@/lib/ToastProvider');
        const toast = mod.useToast();
        toast.error(mapped.key, { traceId: err?.traceId });
      } catch (_) { }
      // rollback optimistic updates
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
      console.debug('[useFavoritePromotion] onSuccess', res);
      try {
        const mod = await import('@/lib/ToastProvider');
        const toast = mod.useToast();
        toast.success('toasts.favorited', { traceId: res?.traceId });
      } catch (_) { }
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}
