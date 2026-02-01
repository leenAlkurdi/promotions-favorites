"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfavoritePromotion } from "@/services/promotionsApi";
import { mapErrorToI18n } from '@/lib/errorMapper';
import { useTranslation } from 'next-i18next';

export function useUnfavoritePromotion() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: unfavoritePromotion,
    onError: async (err: any) => {
      const mapped = mapErrorToI18n(err);
      try {
        const mod = await import('@/lib/ToastProvider');
        const toast = mod.useToast();
        toast.error(mapped.key, { traceId: err?.traceId });
      } catch (_) {}
    },
    onSuccess: async (res: any) => {
      try {
        const mod = await import('@/lib/ToastProvider');
        const toast = mod.useToast();
        toast.success('toasts.unfavorited', { traceId: res?.traceId });
      } catch (_) {}
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
