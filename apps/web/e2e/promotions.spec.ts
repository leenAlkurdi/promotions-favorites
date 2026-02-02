import { expect, test, type Page, type Route } from '@playwright/test';

const promotionsPayload = {
  data: {
    items: [
      {
        id: 'p1',
        title: 'Promo One',
        merchant: 'Shop A',
        rewardAmount: 10,
        rewardCurrency: 'USD',
        description: 'Desc',
        terms: 'Terms',
        thumbnailUrl: '',
        expiresAt: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
        isFavorite: false,
        daysUntilExpiry: 5,
      },
      {
        id: 'p2',
        title: 'Promo Two',
        merchant: 'Shop B',
        rewardAmount: 20,
        rewardCurrency: 'USD',
        description: 'Desc',
        terms: 'Terms',
        thumbnailUrl: '',
        expiresAt: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
        isFavorite: true,
        daysUntilExpiry: 10,
      },
    ],
    page: 1,
    limit: 9,
    total: 2,
  },
  message: 'ok',
};

const favoritesPage1 = {
  data: {
    active: [
      {
        id: 'f1',
        title: 'Fav Active 1',
        merchant: 'Store A',
        rewardAmount: 50,
        rewardCurrency: 'USD',
        description: 'Desc',
        terms: 'Terms',
        thumbnailUrl: '',
        expiresAt: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
        isFavorite: true,
        daysUntilExpiry: 3,
      },
    ],
    expired: [
      {
        id: 'f-expired',
        title: 'Fav Expired',
        merchant: 'Old Store',
        rewardAmount: 15,
        rewardCurrency: 'USD',
        description: 'Expired promotion',
        terms: 'Terms',
        thumbnailUrl: '',
        expiresAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        isFavorite: true,
        daysUntilExpiry: -2,
      },
    ],
    meta: {
      page: 1,
      limit: 9,
      totalFavorites: 2,
      totalPotentialRewards: 65,
      nextPageCursor: 'cursor-2',
    },
  },
};

const favoritesPage2 = {
  data: {
    active: [
      {
        id: 'f2',
        title: 'Fav Active 2',
        merchant: 'Store B',
        rewardAmount: 30,
        rewardCurrency: 'USD',
        description: 'Desc',
        terms: 'Terms',
        thumbnailUrl: '',
        expiresAt: new Date(Date.now() + 8 * 24 * 3600 * 1000).toISOString(),
        isFavorite: true,
        daysUntilExpiry: 8,
      },
    ],
    expired: [],
    meta: {
      page: 2,
      limit: 9,
      totalFavorites: 3,
      totalPotentialRewards: 95,
      nextPageCursor: null,
    },
  },
};

const fulfillJson = (route: Route, payload: any) =>
  route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payload) });

const setupApiMocks = async (page: Page) => {
  await page.route('**/promotions/favorites**', (route) => {
    const url = new URL(route.request().url());
    const cursor = url.searchParams.get('cursor');
    if (cursor === 'cursor-2') return fulfillJson(route, favoritesPage2);
    return fulfillJson(route, favoritesPage1);
  });

  await page.route('**/api/promotions/favorites**', (route) => {
    const url = new URL(route.request().url());
    const cursor = url.searchParams.get('cursor');
    if (cursor === 'cursor-2') return fulfillJson(route, favoritesPage2);
    return fulfillJson(route, favoritesPage1);
  });

  await page.route('**/promotions*', (route) => fulfillJson(route, promotionsPayload));
  await page.route('**/api/promotions*', (route) => fulfillJson(route, promotionsPayload));

  await page.route('**/promotions/*/favorite', (route) => {
    const id = route.request().url().split('/').slice(-2, -1)[0];
    return fulfillJson(route, { data: { id, isFavorite: true }, message: 'favorited' });
  });
  await page.route('**/api/promotions/*/favorite', (route) => {
    const id = route.request().url().split('/').slice(-2, -1)[0];
    return fulfillJson(route, { data: { id, isFavorite: false }, message: 'unfavorited' });
  });
};

test.beforeEach(async ({ page }) => {
  await setupApiMocks(page);
});

test('renders promotions and toggles favorite', async ({ page }) => {
  await page.goto('/promotions');

  await expect(page.getByText('Promo One')).toBeVisible();
  await expect(page.getByText('Promo Two')).toBeVisible();

  const search = page.getByPlaceholder('Search promotions or merchants...');
  await expect(search).toBeVisible();

  const favoriteBtn = page.getByRole('button', { name: 'Add to favorites' }).first();
  await favoriteBtn.click();

  await expect(favoriteBtn).toHaveAttribute('aria-pressed', 'true');
});

test('switches to RTL when language toggled', async ({ page }) => {
  await page.goto('/promotions');

  const langToggle = page.getByRole('button', { name: 'Language' });
  await langToggle.click();

  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('favorites page paginates and switches tabs', async ({ page }) => {
  await page.goto('/favorites');

  await expect(page.getByText('Fav Active 1')).toBeVisible();

  await page.getByRole('button', { name: 'Expired' }).click();
  await expect(page.getByText('Fav Expired')).toBeVisible();

  await page.getByRole('button', { name: 'Active' }).click();
  await expect(page.getByText('Fav Active 1')).toBeVisible();

  await page.getByRole('button', { name: 'Next' }).click();

  await expect(page.getByText('Fav Active 2')).toBeVisible();
});
