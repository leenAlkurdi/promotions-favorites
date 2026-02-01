"use client";
import { useTranslation } from 'next-i18next';

export default function FavoritesPage() {
  const { t } = useTranslation();
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">{t ? t('section.favoritesTitle') : 'Your Favorites'}</h1>
      <p className="mt-4 text-sm text-textSecondary">{t ? t('favorites.empty.body') : 'Save promotions you like to find them here.'}</p>
    </main>
  );
}
