# Technical Test Notes

## Timeline & Effort (Thu evening → Mon morning, ~23h)
- Discovery & Setup — 2h: repo/workspace, tooling (lint/test/format), domain sketch, shared contracts.
- Backend Slice — 6h: entities, migrations, DTO validation, services/controllers, seeds, unit/e2e tests, error codes.
- Frontend Slice — 9h: pages/components, React Query flows, i18n/RTL, accessibility passes, Jest/RTL + Playwright smoke.
- Polish & Hardening — 4h: responsive tweaks, loading/error states, logging/trace IDs, perf (pagination bounds/caching), empty/edge flows.
- Docs & Demo — 2h: README/notes/runbook, verification, handoff checklist.

## Architecture Overview (narrative)
- Monorepo: `apps/api` (NestJS + TypeORM) and `apps/web` (Next.js App Router), shared contracts in `packages/shared` (types/enums/constants).
- API: Modules for promotions, favorites, audit-events; DTO validation via class-validator; global pipes/filters/interceptors for validation, response shape, trace IDs; persistence via TypeORM with indices on frequent filters.
- Web: Next.js app using React Query, Axios client, i18next (en/ar + RTL), Tailwind styling; feature folders for promotions/favorites; shared UI components (Card/List/Navbar); ToastProvider for user feedback.
- Docs: Swagger available at `/api/docs` when API is running.

## Major Decisions & Trade-offs
- Shared contracts package to keep FE/BE types and error codes aligned.
- Cursor-based favorites pagination to reduce offset-cost and support stable ordering by expiry/id.
- Optimistic favorite/unfavorite mutations with toast + rollback on error to keep UI snappy.
- SQLite default for simplicity; Postgres-ready via env config and TypeORM.
- Jest/RTL for component tests; Playwright for e2e with mocked API routes for deterministic runs.

## Known Gaps / Next Steps
- UI polish: tighten spacing/typography, refine empty/error states, consider a11y-first components for dialogs/dropdowns.
- Filtering: debounce/filter UX on mobile, add richer facets; improve validation/empty copy.
- Realtime: optional SSE/Socket.IO to sync favorites/promotions; surface trace-id toasts for support.
- Observability: add client metrics/logs; expose backend trace-id in UI messages.
- Performance: image optimizations, cache headers, and query prefetch for common routes.
- Screenshots/video: capture and store flows under docs/media (paths below) for handoff completeness.

## Assumptions
- Mock auth guard is acceptable for the exercise; no real auth/session implemented.
- Data model kept minimal (promotions, favorites, audit events) with SQLite default; Postgres optional via env if needed.
- API base URL expected at `http://localhost:3001/api` in local runs; web app reads it from `NEXT_PUBLIC_API_URL`.
- E2E tests stub/mimic API responses (Playwright routes) for deterministic runs; real backend can replace stubs when available.
- Seed data provides ≥10 promotions for local/demo usage; cursors/pagination bounds enforced server-side.

## Key Flows Demonstration
Screenshots for primary flows (stored under `docs/media`):

---

### 1. Promotions List Page
Main page displaying promotions with search and filter controls.  
![Promotions List](./docs/media/01-promotions-list.png)

---

### 2. Filtering by Expiry Date
Filtering promotions using expiry date criteria.  
![Filtering by Expiry](./docs/media/02-filtering-by-expiry-date.png)

---

### 3. Filtering by Merchant
Narrowing promotions by merchant selection.  
![Filtering by Merchant](./docs/media/03-filtering-by-merchant.png)

---

### 4. Favorite / Unfavorite Flow
Toggling favorite status with optimistic UI and toast feedback.  
![Favorite Flow](./docs/media/04-favorite-toggle-flow.png)

---

### 5. Pagination / Load More
Loading additional promotions via pagination.  
![Pagination](./docs/media/05-pagination-load-more.png)

---

### 6. Empty State
Empty state when no promotions match the applied filters.  
![Empty State](./docs/media/06-empty-state-no-results.png)

---

### 7. Favorites List Page
Viewing the list of saved favorite promotions.  
![Favorites List](./docs/media/07-favorites-list-page.png)

---

### 8. Promotion Detail Page
Detailed view of a single promotion.  
![Promotion Detail](./docs/media/08-promotion-detail-page.png)

---

### 9. Search Promotions
Searching promotions using keywords.  
![Search](./docs/media/09-search-promotions.png)

---

### 10. Loading Skeletons
Skeleton loaders displayed during data fetching.  
![Loading Skeletons](./docs/media/10-loading-skeletons.png)

## How to Run (summary)
- Install: `npm install`
- API: `npm run start:dev --workspace api`
- Web: `npm run dev --workspace web`
- Tests (web): `npm run test --workspace web`
- Tests (api): `npm run test --workspace api`, `npm run test:e2e --workspace api`
