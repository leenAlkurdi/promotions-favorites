"use client";
import Image from "next/image";
import { Heart, Clock } from "lucide-react";
import { CardActionHandlers, CardItem } from "./Card.types";

type Props = {
    item: CardItem;
} & CardActionHandlers;

export default function Card({ item, onToggleFavorite, onSelect, isUpdating = false }: Props) {
    const isFavorite = Boolean(item.isFavorite);
    const showExpiryBadge = typeof item.daysUntilExpiry === "number" && item.daysUntilExpiry <= 7;
    const formattedExpiry = item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : undefined;
    const daysLeft = typeof item.daysUntilExpiry === "number" ? Math.max(item.daysUntilExpiry, 0) : undefined;
    const expiryProgress = daysLeft !== undefined ? Math.min(100, Math.max(0, 100 - (daysLeft / 30) * 100)) : undefined;

    return (
        <article
            className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col cursor-pointer transition hover:shadow-md"
            role="button"
            tabIndex={0}
            onClick={() => onSelect?.(item)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect?.(item);
                }
            }}
        >
            <div className="h-44 w-full relative bg-gray-100">
                {item.thumbnailUrl ? (
                    <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-sm text-textSecondary">
                        No image
                    </div>
                )}

                {onToggleFavorite && (
                    <button
                        aria-pressed={isFavorite}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(item.id, !isFavorite);
                        }}
                        disabled={isUpdating}
                        className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                    >
                        <Heart
                            className={`h-5 w-5 ${isFavorite ? "fill-red-500 stroke-red-500" : "stroke-gray-400"} transition-colors duration-150`}
                        />
                    </button>
                )}

                {showExpiryBadge && typeof item.daysUntilExpiry === "number" && (
                    <div className="absolute left-3 top-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.daysUntilExpiry < 0 ? "Ended" : `Ends in ${item.daysUntilExpiry} days`}
                    </div>
                )}
            </div>

            <div className="p-3 flex flex-col gap-2 flex-1">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                    {item.subtitle && <p className="text-xs text-textSecondary">{item.subtitle}</p>}
                </div>

                {item.rewardAmount !== undefined && item.rewardCurrency && (
                    <div className="text-sm font-semibold text-primary">{item.rewardAmount} {item.rewardCurrency}</div>
                )}

                <div className="mt-auto flex items-center justify-between text-xs text-textSecondary">
                    {formattedExpiry && <span>Expires on {formattedExpiry}</span>}
                    {daysLeft !== undefined && (
                        <span className="font-medium text-gray-700">{daysLeft}d left</span>
                    )}
                </div>

                {expiryProgress !== undefined && (
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden" aria-label="Time until expiry">
                        <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${expiryProgress}%` }}
                        />
                    </div>
                )}
            </div>
        </article>
    );
}
