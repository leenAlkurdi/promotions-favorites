import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritePromotion } from "@/services/promotionsApi";
import { useToast } from '@/lib/ToastProvider';
import { mapErrorToI18n } from '@/lib/errorMapper';
import { useTranslation } from 'next-i18next';

export function useFavoritePromotion() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: favoritePromotion,
    onMutate: async (promotionId: string) => {
      await queryClient.cancelQueries({ queryKey: ['promotions'] });
      // optional optimistic update could go here
      return { promotionId };
    },
    onError: (err: any, _vars, context) => {
      const mapped = mapErrorToI18n(err);
      toast.error(mapped.key, { traceId: err?.traceId });
      // rollback logic if optimistic update applied
      if (context) {
        queryClient.invalidateQueries({ queryKey: ['promotions'] });
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
      }
    },
    onSuccess: (res: any) => {
      toast.success('toasts.favorited', { traceId: res?.traceId });
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}
