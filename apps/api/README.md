## API (NestJS)

Backend for Promotions/Favorites. NestJS + TypeORM + shared contracts with the web app. Uses SQLite by default (switchable to PostgreSQL).

### Prerequisites
- Node 20+
- npm workspaces (run commands from repo root unless noted)
- SQLite (default) or PostgreSQL

### Environment
Copy `.env.example` to `.env` and adjust:

```
PORT=3001
DB_DATABASE=./src/database/sqlite.db
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=postgres
# DB_DATABASE=promotions
```

### Install
From repo root:

```

```

### Run
- Dev: `npm run start:dev --workspace api`
- Prod build + start: `npm run build --workspace api && npm run start:prod --workspace api`

### Tests
- Unit: `npm run test --workspace api`
- E2E: `npm run test:e2e --workspace api`
- Coverage: `npm run test:cov --workspace api`

### Database
- Generate migration: `npm run migration:generate --workspace api --name=my-migration`
- Run migrations: `npm run migration:run --workspace api`
- Revert last migration: `npm run migration:revert --workspace api`
- Seed demo data (>=10 promotions): `npm run seed --workspace api`

### API Docs
- Swagger: http://localhost:3001/api/docs

### Logging & Trace IDs
- Requests tagged with `x-trace-id` header; echoed in responses.
- Errors include `traceId` and shared `errorCode` contract.

### Validation & Security
- Global ValidationPipe (whitelist, forbidNonWhitelisted, transform).
- DTOs use `class-validator` for params/query/body.
- Pagination bounds enforced server-side with shared constants.

### Architecture Snapshot
- Modules: promotions, favorites, audit-events, common (filters/interceptors/guards).
- Shared contracts: types/enums/constants from `packages/shared` for FE/BE parity.
- Persistence: TypeORM entities with indices on frequent filters (expiresAt, merchant, title, favorites user/promotion, audit timestamps).

### Useful Scripts
- Lint: `npm run lint --workspace api`
- Format (if configured at root): `npm run format`

### Troubleshooting
- Ensure DB file path exists for SQLite; for Postgres set host/port/user/pass in `.env`.
- If migrations fail, drop the DB file (dev) and re-run `migration:run` then `seed`.
- Generate migration: `npm run migration:generate --workspace api --name=my-migration`
