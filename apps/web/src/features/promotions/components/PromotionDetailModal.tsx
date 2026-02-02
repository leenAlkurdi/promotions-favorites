"use client";
import { X, Share2, Heart } from "lucide-react";
import { PromotionWithFavorite } from "@promotions-favorites/shared";
import { useTranslation } from "react-i18next";

type Props = {
  promotion: PromotionWithFavorite;
  onClose: () => void;
  onToggleFavorite: (id: string, nextIsFavorite: boolean) => void;
};

const daysLeft = (expiresAt?: string) => {
  if (!expiresAt) return 0;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
};

export default function PromotionDetailModal({ promotion, onClose, onToggleFavorite }: Props) {
  const { t } = useTranslation();
  const rawRemainingDays = promotion.daysUntilExpiry ?? daysLeft(promotion.expiresAt);
  const remainingDays = Math.max(rawRemainingDays, 0);
  const isExpired = rawRemainingDays < 0;
  const progress = Math.min(100, Math.max(0, 100 - (remainingDays / 30) * 100));
  const isFavorite = Boolean(promotion.isFavorite);
  const formattedExpiry = promotion.expiresAt ? new Date(promotion.expiresAt).toLocaleDateString() : undefined;

  const handleShare = () => {
    const payload = {
      title: promotion.title,
      text: promotion.description,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share(payload).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(payload.url).catch(() => {});
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div>
            <p className="text-xs uppercase text-textSecondary">{t("promotions.detail.title")}</p>
            <h2 className="text-lg font-semibold text-textPrimary">{promotion.title}</h2>
          </div>
          <button
            aria-label={t("actions.close")}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-textSecondary">{promotion.merchant}</p>
              <p className="text-2xl font-semibold text-primary">
                {promotion.rewardAmount} {promotion.rewardCurrency}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-textPrimary">
                {isExpired
                  ? t("promotions.card.expired")
                  : formattedExpiry
                    ? t("promotions.card.expiresOn", { date: formattedExpiry })
                    : t("promotions.card.expiresIn", { days: remainingDays })}
              </span>
              <button
                className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition ${
                  isFavorite ? "border-red-500 text-red-600 bg-red-50" : "border-gray-300 text-textPrimary"
                }`}
                onClick={() => onToggleFavorite(promotion.id, !isFavorite)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 stroke-red-500" : "stroke-current"}`} />
                {isFavorite ? t("promotions.card.unfavorite") : t("promotions.card.favorite")}
              </button>
              <button
                className="flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium text-textPrimary hover:border-primary"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                {t("promotions.detail.share")}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div
              className="h-2 w-full rounded-full bg-gray-100 overflow-hidden"
              aria-label={formattedExpiry ? t("promotions.detail.expiryBadge", { date: formattedExpiry }) : undefined}
            >
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-textSecondary">
              {isExpired ? t("promotions.card.expired") : t("promotions.card.expiresIn", { days: remainingDays })}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-textPrimary">{t("promotions.detail.description")}</h3>
            <p className="text-sm text-textSecondary leading-relaxed">{promotion.description}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-textPrimary">{t("promotions.detail.terms")}</h3>
            <p className="text-sm text-textSecondary leading-relaxed whitespace-pre-line">{promotion.terms}</p>
          </div>
        </div>
      </div>
    </div>
  );
}