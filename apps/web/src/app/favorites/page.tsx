"use client";
import { useMemo, useState } from "react";
import FavoritesList from "@/features/favorites/components/FavoritesList";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useTranslation } from "next-i18next";

type TabKey = "active" | "expired";

export default function FavoritesPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabKey>("active");

  const { active, expired, aggregates, isLoading, isFetchingNextPage, hasNextPage, loadMore } = useFavorites(9);

  const displayed = useMemo(() => (tab === "active" ? active : expired), [tab, active, expired]);

  const totalRewardsDisplay = useMemo(
    () => aggregates.totalPotentialRewards.toLocaleString(),
    [aggregates.totalPotentialRewards]
  );

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "active", label: t ? t("favorites.tabs.active", "Active") : "Active", count: active.length },
    { key: "expired", label: t ? t("favorites.tabs.expired", "Expired") : "Expired", count: expired.length },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex flex-col gap-2">


        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-textSecondary">Total favorites</p>
            <p className="mt-1 text-2xl font-semibold">{aggregates.totalFavorites}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-textSecondary">Total potential rewards</p>
            <p className="mt-1 text-2xl font-semibold">{totalRewardsDisplay}</p>
          </div>
        </div>
      </header>

      <section className="mt-8">
        <div className="flex flex-wrap items-center gap-3">
          {tabs.map((tabItem) => (
            <button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                tab === tabItem.key ? "border-primary bg-primary text-white" : "border-gray-200 bg-white text-textPrimary"
              }`}
            >
              <span>{tabItem.label}</span>
              <span className="rounded-full bg-black/5 px-2 py-1 text-xs text-textSecondary">{tabItem.count}</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <FavoritesList favorites={displayed} isLoading={isLoading} />
        </div>

        {hasNextPage && (
          <div className="mt-6 flex justify-center">
            <button
              className="rounded-full bg-black text-white px-5 py-2 text-sm font-medium shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => loadMore()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
