# Railway Deployment Guide

Operational guide for deploying and updating the Altir Tech Day Command Center on Railway.

## Project Topology

- **Project**: `altir-hackathon` (id: `a6dd1b71-8dc9-4797-acd1-247d5bb13cb4`)
- **Environment**: `production`
- **Services**:
  - `altir-hackathon` — Next.js app (id: `627691c7-a470-4ad6-aaae-b01895795c6d`)
  - `Postgres-2wOz` — PostgreSQL database (id: `5626312d-d904-4932-a233-73c835a2ebc2`)
- **Public URL**: https://altir-hackathon-production.up.railway.app

## Environment Variables (app service)

| Key | Value | Purpose |
|-----|-------|---------|
| `DATABASE_PROVIDER` | `postgresql` | Read by `scripts/sync-schema-provider.mjs` to rewrite `schema.prisma` |
| `DATABASE_URL` | `${{Postgres-2wOz.DATABASE_URL}}` | Internal Railway reference to Postgres service |
| `NODE_ENV` | `production` | Standard Next.js prod mode |

Internal Postgres hostname (`postgres-2woz.railway.internal`) only resolves inside Railway's private network. Don't try to connect from local with this URL.

## Build Configuration

### `railway.toml`
```toml
[build]
builder = "nixpacks"
buildCommand = "npm run build"

[deploy]
startCommand = "npm start"
sleepApplication = true
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

`sleepApplication = true` enables serverless / scale-to-zero.

### `nixpacks.toml`
```toml
[variables]
NODE_VERSION = "20"

[phases.install]
cmds = ["npm install --include=optional"]
```

Pins Node 20 (required by `@tailwindcss/oxide`). Forces optional deps install (Linux native bindings).

### `.node-version`
```
20
```

Backup pin for tools that read `.node-version` instead of `nixpacks.toml`.

### `next.config.ts`
```ts
const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
};
```

ESLint disabled during build (faster ship, code has rule violations that don't affect runtime).

### `app/layout.tsx`
```ts
export const dynamic = "force-dynamic"
```

Forces dynamic rendering app-wide. Required — pages query DB via Prisma, can't pre-render at build time (DB unreachable from build container).

## Standard Update Flow (Code Changes Only)

```bash
# Make code changes locally
# Test locally with `npm run dev`

railway up --detach           # deploy
railway logs --build          # watch build
railway logs                  # watch runtime
```

Railway auto-builds via Nixpacks. Each deploy:
1. Copies source
2. `npm install --include=optional`
3. `npm run build` → `prebuild` (sync-schema-provider + prisma generate) → `next build`
4. On start: `npm start` (NO schema push, NO seed — pure app start)

**Critical rule:** redeploys never touch the database. Schema changes and seeding are manual, explicit, user-authorized operations.

## Schema Changes (`prisma/schema.prisma`)

**Redeploys never touch the DB.** Schema push is manual.

1. Edit `prisma/schema.prisma` locally
2. `npm run db:push` to test locally (SQLite / local Postgres)
3. Commit + `railway up --detach` (deploys code only)
4. **Manually** push schema to prod after user approval:
   ```bash
   railway ssh
   cd /app
   npx prisma db push                  # safe, non-destructive
   # or, for destructive changes:
   npx prisma db push --accept-data-loss
   ```

**Backup before destructive changes:**
```bash
railway ssh "cd /app && npx prisma db pull > /tmp/backup-schema.prisma"
```

**Prefer migrations for prod schema changes:**
```bash
# local
npx prisma migrate dev --name describe_change
git commit
railway up --detach

# prod (manual)
railway ssh "cd /app && npx prisma migrate deploy"
```

## Seeding / Data Updates

Seed wipes all rows then recreates. Do not put in startCommand.

```bash
railway ssh
# inside container:
cd /app
npx tsx prisma/seed.ts
exit
```

The `package.json` `prisma.seed` field already points to `tsx prisma/seed.ts`. `npx prisma db seed` also works but `npx tsx prisma/seed.ts` is more direct.

## Env Var Changes

```bash
# Add / update
railway variable set KEY=value

# Reference another service's var
railway variable set 'KEY=${{ServiceName.VAR}}'

# List
railway variable list

# Delete
railway variable delete KEY
```

Changing env vars triggers automatic redeploy.

## Resource Scaling (2vCPU / 2GB)

`railway scale` CLI is broken (CLI 4.27.5 bug — `Cannot query field "railwayMetal"`). Set via dashboard:

1. Railway dashboard → `altir-hackathon` service
2. Settings → Resources
3. Set vCPU = 2, Memory = 2048 MB
4. Save → triggers redeploy

## Domains

```bash
railway domain                       # generate or show
railway domain add custom.example.com   # custom domain
```

## Debugging

```bash
railway status                # current linked project/service
railway logs --build          # build logs
railway logs                  # runtime logs
railway logs --deployment <id>  # specific deployment
railway ssh                   # interactive shell in running container
railway open                  # open dashboard
railway list                  # all projects
```

## Rollback

```bash
railway down                  # remove latest deployment
# or via dashboard: pick prior deployment → Redeploy
```

## Known Gotchas

### 1. Nixpacks `COPY . /app` overwrites build-time file mutations
Nixpacks runs `COPY . /app` as final layer. Any file modified during build (e.g. `schema.prisma` rewritten by `sync-schema-provider`) gets reset. Workaround: run mutation in `startCommand` too.

### 2. `package-lock.json` cross-platform binaries
Lockfile generated on macOS lacks Linux native binaries (e.g. `@tailwindcss/oxide-linux-x64-gnu`). `npm install` (not `npm ci`) in `nixpacks.toml` re-resolves for Linux. Don't switch back to `npm ci`.

### 3. Static pre-rendering hits DB
Without `dynamic = "force-dynamic"` in `app/layout.tsx`, Next.js tries to fetch DB data at build time → `Can't reach database server`. Keep the directive.

### 4. Internal DB URL doesn't work locally
`postgres-2woz.railway.internal` resolves only inside Railway. For local connections to prod DB, use the public TCP proxy (Service → Settings → Networking → Public Networking → expose port).

### 5. Two Postgres services
Railway auto-provisioned a duplicate `Postgres` service during `railway init`. Only `Postgres-2wOz` is wired up. Delete the unused one via dashboard to avoid idle cost.

### 6. Node version mismatch
`@tailwindcss/oxide@4.3.0` requires Node ≥ 20. `sqlite3@6.0.1` requires Node ≥ 20.17. Don't downgrade `NODE_VERSION` in `nixpacks.toml`.

### 7. `node --experimental-strip-types` requires Node 22+
Container uses Node 20. `prisma.seed` field must use `tsx`, not `node --experimental-strip-types`.

## Common Commands Cheatsheet

```bash
# Deploy
railway up --detach

# View logs
railway logs --build
railway logs

# Run command in container
railway ssh "cd /app && <command>"

# Open container shell
railway ssh

# Vars
railway variable list
railway variable set KEY=value

# Link
railway link --project <id> --service <id>
```

## File Inventory

- `railway.toml` — Railway service config (build/deploy)
- `nixpacks.toml` — Nixpacks builder config (Node version, install phase)
- `.node-version` — Node version pin
- `next.config.ts` — Next.js config (ESLint disabled in builds)
- `app/layout.tsx` — Has `export const dynamic = "force-dynamic"` directive
- `scripts/sync-schema-provider.mjs` — Rewrites Prisma provider based on `DATABASE_PROVIDER`
- `package.json` — `prisma.seed` uses `tsx`
