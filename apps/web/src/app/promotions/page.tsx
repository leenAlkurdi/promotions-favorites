"use client";
import PromotionsList from "@/features/promotions/components/PromotionsList";
import FilterBar from "@/features/promotions/components/FilterBar";
import { useSearchParams, useRouter } from "next/navigation";
import { usePromotions } from "@/features/promotions/hooks/usePromotions";
import { PromotionWithFavorite } from "@promotions-favorites/shared";
import { useTranslation } from "react-i18next";

const daysUntil = (dateStr?: string) => {
  if (!dateStr) return 0;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
};

export default function PromotionsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();

  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "9");
  const q = searchParams.get("q") ?? "";
  const merchant = searchParams.get("merchant") ?? undefined;
  const expiresBefore = searchParams.get("expiresBefore") ?? undefined;

  const { data, isLoading } = usePromotions({ page, limit, q: q || undefined, merchant, expiresBefore } as any);

  const handlePrev = () => {
    if (page <= 1) return;
    const params = new URLSearchParams(Object.fromEntries(searchParams.entries()));
    params.set("page", String(page - 1));
    router.replace(`/promotions?${params.toString()}`);
  };

  const handleNext = () => {
    const params = new URLSearchParams(Object.fromEntries(searchParams.entries()));
    params.set("page", String(page + 1));
    router.replace(`/promotions?${params.toString()}`);
  };

  const items = data?.items ?? [];
  const currentPage = data?.page ?? page;
  const currentLimit = data?.limit ?? limit;
  const total = data?.total ?? 0;

  const promotionsForUi: PromotionWithFavorite[] = (items as any[]).map((p) => {
    const expiresAt = new Date(p.expiresAt);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    const daysUntilExpiry = p.daysUntilExpiry ?? Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    return {
      ...p,
      isFavorite: Boolean(p.isFavorite),
      daysUntilExpiry,
    } as PromotionWithFavorite;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <FilterBar initial={{ q: q || undefined, merchant, expiresBefore }} />
      <PromotionsList promotions={promotionsForUi} isLoading={isLoading} />

      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          disabled={currentPage <= 1}
          onClick={handlePrev}
        >
          {t("pagination.prev")}
        </button>

        <span>
          {t("pagination.page", { page: `${currentPage}` })}
        </span>

        <button
          className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          disabled={currentPage * currentLimit >= total}
          onClick={handleNext}
        >
          {t("pagination.next")}
        </button>
      </div>
    </main>
  );
}
