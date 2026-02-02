## Web (Next.js)

Frontend for Promotions/Favorites using Next.js (App Router), React Query, Tailwind, and i18next (en/ar with RTL support).

### Prerequisites
- Node 20+
- npm workspaces (run commands from repo root unless noted)
- API reachable at http://localhost:3001/api by default

### Environment
Copy `.env.example` to `.env` and adjust if API URL changes:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Install
From repo root:
```
npm install
```

### Run
- Dev: `npm run dev --workspace web`
- Build: `npm run build --workspace web`
- Start (after build): `npm run start --workspace web`

### Tests
- Unit (Jest + React Testing Library): `npm run test --workspace web`
- E2E (Playwright):
  1) Install browsers once: `npx playwright install`
  2) Headed/debug: `npm run test:e2e:headed --workspace web`

### Lint & Format
- Lint: `npm run lint --workspace web`
- Format (Prettier): `npm run format --workspace web`

### i18n / RTL
- Locales in `public/locales/en` and `public/locales/ar`
- Direction handled via `DirectionProvider` and navbar language toggle

### Architecture Snapshot
- App routes: `src/app/promotions`, `src/app/favorites`
- Features: `src/features/promotions`, `src/features/favorites`
- Shared components: `src/components` (Card/List/Navbar/etc.)
- Data fetching: Axios client in `src/services/api.ts`; React Query hooks in `src/features/**/hooks`
- Toasts: `src/lib/ToastProvider.tsx`

### Troubleshooting
- Ensure API is running and `NEXT_PUBLIC_API_URL` matches it.
- If Playwright server port differs, set `baseURL` in `playwright.config.ts`.
- After adding new locale strings, restart dev server to reload resources.

