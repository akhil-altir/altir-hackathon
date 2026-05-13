# Altir Tech Day Command Center

Internal hackathon management platform for Altir Tech Day (May 22, 2026). Handles team formation, idea submissions, judging, scoring, and leaderboard tracking.

**Stack:** Next.js 15 · React 19 · TypeScript · Prisma 6 · Tailwind CSS v4 · SQLite (dev) / PostgreSQL (prod)

---

## Prerequisites

- Node.js 20+
- npm 11+

---

## Local Development (SQLite)

No database setup needed — SQLite runs as a local file.

```bash
# 1. Install dependencies
npm install

# 2. Set up env
cp .env.example .env
# Default .env uses SQLite — no changes needed

# 3. Push schema + seed data
npm run db:push
npm run db:seed

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

### Default credentials (after seed)

Passwords follow the format `emailprefix_EMPLOYEEID` (e.g., `psharma_ATI042`).

Admin accounts are seeded via `prisma/seed.ts`. Check the seed file for admin emails.

### Useful dev commands

```bash
npm run typecheck       # TypeScript check
npm run lint            # ESLint
npx prisma studio       # Visual DB browser
npm run db:seed         # Re-seed (resets data)
npm run test:e2e        # Playwright e2e tests
npm run test:e2e:headed # Playwright with visible browser
```

---

## Production / Staging (PostgreSQL on Railway)

The `scripts/sync-schema-provider.mjs` script auto-rewrites `prisma/schema.prisma` based on `DATABASE_PROVIDER` before every build or dev start.

### Environment variables

```bash
DATABASE_PROVIDER="postgresql"
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/altir_tech_day?schema=public"
```

Railway injects `DATABASE_URL` automatically via the Postgres plugin. Set `DATABASE_PROVIDER=postgresql` in Railway project variables.

### Build & deploy

Railway uses `railway.toml` and `nixpacks.toml` automatically. On each deploy it runs:

```
npm run build
→ node scripts/sync-schema-provider.mjs && npx prisma generate && next build

# Start command (in railway.toml):
node scripts/sync-schema-provider.mjs && npx prisma db push --accept-data-loss && npm start
```

To deploy manually:

```bash
# Ensure env vars are set, then:
npm run build
npm start
```

### Switching between SQLite and PostgreSQL locally

```bash
# In .env:
DATABASE_PROVIDER="postgresql"
DATABASE_URL="postgresql://..."

npm run db:push   # syncs schema + applies to Postgres
npm run db:seed   # optional: re-seed data
```

---

## Project Structure

```
app/          Next.js App Router pages + server actions
components/   React components (shell, flow, feature UI)
lib/          Shared utilities (auth, db, session, schedule constants)
prisma/       Schema + seed
scripts/      sync-schema-provider.mjs (provider rewrite)
middleware.ts Role-based route protection
```

See `CLAUDE.md` for full architecture details.
