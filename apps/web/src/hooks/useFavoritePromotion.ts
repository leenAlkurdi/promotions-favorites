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
      // optional optimistic update could go here
      return { promotionId };
    },
    onError: async (err: any, _vars, context) => {
      const mapped = mapErrorToI18n(err);
      try {
        const mod = await import('@/lib/ToastProvider');
        const toast = mod.useToast();
        toast.error(mapped.key, { traceId: err?.traceId });
      } catch (_) {}
      // rollback logic if optimistic update applied
      if (context) {
        queryClient.invalidateQueries({ queryKey: ['promotions'] });
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
      }
    },
    onSuccess: async (res: any) => {
      try {
        const mod = await import('@/lib/ToastProvider');
        const toast = mod.useToast();
        toast.success('toasts.favorited', { traceId: res?.traceId });
      } catch (_) {}
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}
