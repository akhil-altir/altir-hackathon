# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Altir Tech Day Command Center** — A Next.js 15 application that manages and coordinates an internal hackathon (Altir Tech Day). The system handles team formation, idea submissions, judging, scoring, and leaderboard tracking. It includes role-based access (participants, judges, admins) and real-time event timeline coordination.

**Event Date:** May 22, 2026  
**Tech Stack:** Next.js 15, React 19, TypeScript 6, Prisma 6, SQLite/PostgreSQL, Tailwind CSS 4, Radix UI  

---

## Tech Stack & Architecture

### Frontend
- **Next.js 15** (App Router, Server Components, Server Actions)
- **React 19** with TypeScript
- **Styling:** Tailwind CSS v4 with PostCSS, class-variance-authority (CVA), clsx, tailwind-merge
- **UI Components:** Radix UI v1.4.3, Lucide React icons
- **Font:** JetBrains Mono (via Google Fonts)

### Backend
- **Server Runtime:** Node.js with Next.js server functions and middleware
- **Database:** Prisma ORM v6 with SQLite (dev) or PostgreSQL (staging/production)
- **Authentication:** Custom session-based auth using HTTP-only cookies (`altir_session`)
- **Password Format:** `emailprefix_EMPLOYEEID` (e.g., `psharma_ATI042`)

### Database Schema (Prisma Models)
Core entities:
- **User** — employees with roles (isAdmin, isJudge, reportingManager, primaryAssignment)
- **Team** — hackathon teams with status (FORMED, LOCKED), members, and ideas
- **TeamMember** — team membership with captain designation
- **Idea** — team submissions with bank category linkage and pivot tracking
- **IdeaBankEntry** — pre-seeded idea prompts with category and difficulty hints
- **Submission** — final project deliverables (repoUrl, demoUrl, presentationUrl, stackTags)
- **ScoreCriterion** — judging criteria with point values and categories
- **JudgeScore** — individual judge scores per team/criterion
- **EventPointAward** — bonus points for milestones (team_formed, cross_assignment, demo_uploaded, etc.)
- **ApiKey** — provider API keys assigned to teams with reveal/revoke timelines
- **Announcement** — pinned/broadcast messages to participants
- **TimelineItem** — event schedule (public/private, sortable)
- **AppSetting** — key-value store for runtime config

### Role-Based Access
- **Public Paths:** `/`, `/login`, `/gallery`, `/leaderboard`, `/tv`, `/results`
- **Participant:** `/teams/*` (team workspace)
- **Judge:** `/judge` (scoring interface)
- **Admin:** `/admin/*` (management dashboard)
- **Middleware:** `middleware.ts` enforces role routing; redirects missing session to `/login`

---

## Directory Structure

```
app/                          # Next.js app directory
├── layout.tsx               # Root layout with JetBrains Mono font
├── page.tsx                 # Home/lockscreen view (idea bank reveal timeline)
├── globals.css              # Global Tailwind + CSS variables
├── login/                   # Auth: login-form, actions, page
├── teams/
│   ├── new/                 # Team creation (form, actions)
│   └── [slug]/              # Team workspace
│       ├── page.tsx         # Team overview
│       ├── idea/            # Idea submission
│       ├── submit/          # Final submission (repo, demo, deck)
│       ├── key/             # API key reveal
│       └── locked/          # Post-lock view
├── judge/                   # Judge scoring interface
├── admin/                   # Admin dashboard
│   ├── overview/            # Event metrics
│   ├── teams/               # Team management
│   ├── people/              # User management
│   ├── ideas/               # Idea bank CRUD
│   ├── scoring/             # Score criteria + results
│   ├── keys/                # API key assignments
│   ├── audit/               # Audit log
│   └── broadcast/           # Announcements
├── gallery/                 # Public idea gallery (post-submission)
├── leaderboard/             # Public leaderboard
├── results/                 # Final results/winners
├── tv/                      # Public TV display (event updates)
└── handbook/                # Event handbook/rules

lib/                          # Shared utilities (imported via @/)
├── db.ts                    # Prisma client singleton
├── session.ts               # createSession, destroySession, getSession (cookie-based)
├── data.ts                  # authenticateUser, getTeamWorkspace, getUserTeam, etc.
├── idea-bank-public.ts      # listPublicIdeaBankEntries
├── participant-onboarding.ts # getParticipantResumeHref
├── tech-day-schedule.ts     # IDEA_BANK_REVEAL_MS, TEAM_LOCK_TIME, etc.
└── [other utilities]

components/                   # React components
├── shell/                   # ParticipantAppShell, AdminShell, etc.
├── flow/                    # TechDayScreen (state machine for UI flows)
└── [feature components]

prisma/
├── schema.prisma            # Database schema
└── seed.ts                  # Database seeding with employee roster + timeline

scripts/
└── sync-schema-provider.mjs # Rewrites prisma/schema.prisma datasource based on DATABASE_PROVIDER env

middleware.ts               # Route protection and role enforcement
postcss.config.mjs          # Tailwind CSS + PostCSS config
tsconfig.json               # Strict TypeScript, path alias @/* → ./
eslint.config.mjs           # Next.js core-web-vitals + typescript
```

---

## Build, Dev & Deployment Commands

### Development
```bash
# Install dependencies
npm install

# Dev server (with Prisma schema sync)
npm run dev
# Runs: predev script syncs provider → next dev on localhost:3000

# Type check
npm run typecheck

# Lint
npm run lint
```

### Database
```bash
# Sync schema provider + generate Prisma client
npx prisma generate

# Push schema changes to database
npm run db:push
# Runs: predev script syncs provider → prisma db push

# Seed database with employees, ideas, timeline, admins, judges
npm run db:seed

# Prisma Studio (visual DB inspector)
npx prisma studio
```

### Build & Production
```bash
# Build (with schema sync + Prisma generation)
npm run build

# Start production server
npm start
```

### Railway Deployment Rules (CRITICAL)

**Production = Railway.** Deploy guide at `docs/deployment-guide.md`.

**NEVER on redeploy:**
- ❌ Run `prisma db push` automatically (schema changes are manual)
- ❌ Run `prisma migrate deploy` automatically
- ❌ Run `prisma db seed` automatically
- ❌ Truncate / wipe any production table
- ❌ Add destructive Prisma commands to `startCommand` in `railway.toml`

**Production `startCommand`:** `npm start` only. Nothing else.

**Schema + seed changes are manual, explicit, user-initiated:**
1. Schema push: `railway ssh "cd /app && npx prisma db push"` — only after user approval
2. Seed: `railway ssh "cd /app && npx tsx prisma/seed.ts"` — only after user approval (seed deletes all rows then recreates)
3. Migrations: prefer `prisma migrate deploy` over `db push` for prod schema changes (run manually)

**Rationale:** Seed wipes all tables. Auto-running on redeploy destroys live event data. Schema push can silently drop columns with `--accept-data-loss`. All DB writes against prod require explicit user authorization per command.

### Testing
```bash
# Run end-to-end tests (Playwright)
npm run test:e2e

# Run tests in headed mode (visible browser)
npm run test:e2e:headed
```

---

## Environment Configuration

### Database Provider Selection
The **`sync-schema-provider.mjs`** script automatically rewrites `prisma/schema.prisma` based on `DATABASE_PROVIDER` env var before dev/build:
- `DATABASE_PROVIDER=sqlite` → SQLite (default, no setup needed)
- `DATABASE_PROVIDER=postgresql` → PostgreSQL

### Environment Files
```
.env                 # Local overrides (gitignored)
.env.development     # Loaded by npm run dev (SQLite)
.env.staging         # Manual load for Railway staging (PostgreSQL)
.env.production      # Loaded by Railway production (PostgreSQL)
.env.example         # Template with all required vars
```

### Required Variables
```
DATABASE_URL="..."           # Connection string (auto-populated by Railway)
DATABASE_PROVIDER="sqlite"   # sqlite | postgresql (default: sqlite)
```

---

## Key Architectural Patterns

### 1. **Next.js Server Actions**
- Forms use `"use server"` functions for mutations (loginAction, logoutAction)
- Located in `actions.ts` files alongside routes
- Automatically handle redirects and state updates
- Example: `app/login/actions.ts`, `app/teams/new/actions.ts`, `app/admin/actions.ts`

### 2. **Session-Based Authentication**
- HTTP-only cookie: `altir_session` (JSON-serialized)
- Session object: `{ userId, email, fullName, isAdmin, isJudge, primaryAssignment }`
- Functions: `createSession()`, `destroySession()`, `getSession()`
- Located in `lib/session.ts`

### 3. **Middleware & Role Routing**
- `middleware.ts` protects routes based on role
- Public paths bypass auth checks
- Admin/judge paths verified before allowing access
- Redirects unauthenticated users to `/login`

### 4. **Prisma ORM with Multi-Provider Support**
- Schema supports SQLite and PostgreSQL via provider field
- `sync-schema-provider.mjs` rewrites provider before each dev/build
- Generated client in `@prisma/client`
- Singleton pattern: `lib/db.ts` exports shared `db` instance

### 5. **React Server Components (RSC)**
- All pages render on server by default
- Client interactivity via `"use client"` boundary (forms, state)
- Metadata set in root layout
- `revalidate` used for ISR (incremental static regeneration)

### 6. **Event Timeline Coordination**
- Schedule constants in `lib/tech-day-schedule.ts`:
  - `IDEA_BANK_REVEAL_MS` — when idea bank becomes public
  - `TEAM_LOCK_TIME` — when team roster locks
  - `API_KEY_RELEASE_TIME` — when API keys visible
  - `SUBMISSION_DEADLINE` — when submissions close
- Conditionally render UI and enable features based on current time
- TimelineItem model tracks event order (sortable, isPublic)

### 7. **Component State Machines**
- `TechDayScreen` component (in `components/flow/tech-day-flow.tsx`) implements conditional UI states
- Displays different flows based on event progress and user role
- Example: home page shows lockscreen, then idea bank, then results based on timeline

### 8. **Scoring & Point System**
- ScoreCriterion: judging rubric with point values and categories
- JudgeScore: individual scores (unique constraint: [judgeId, teamId, criterionId])
- EventPointAward: milestone bonuses (team_formed, cross_assignment, demo_uploaded, etc.)
- Points weighted via EVENT_POINT_WEIGHTS in seed

### 9. **Idea Bank & Pivoting**
- IdeaBankEntry: pre-seeded idea prompts curated by admins
- Idea model links team submission to bank entry
- pivotReason field tracks team pivots/modifications
- Category filtering and public gallery display

---

## Notes for Contributors

- **TypeScript Strict Mode:** Enabled. Avoid `any` types.
- **Path Aliases:** `@/*` resolves to project root (configured in tsconfig.json)
- **CSS Variables:** Tailwind CSS v4 custom properties for theming (--text-mute, --acid, --warn, --line, etc.)
- **Revalidation:** Pages use `export const revalidate = 60` for ISR caching
- **Dates:** All timestamps stored as UTC (DateTime in Prisma schema)
- **Unique Constraints:** Prisma enforces composite uniqueness (e.g., [teamId, userId] for TeamMember, [judgeId, teamId, criterionId] for JudgeScore)
- **Soft Deletes:** Not used; models use onDelete: Cascade or SetNull based on relationships
- **API Routes:** No traditional /api routes in this codebase; mutations use server actions instead

---

## Deployment (Railway)

The `.env.staging` and `.env.production` files configure Railway deployments:
- **Staging:** Manual load, PostgreSQL, test environment
- **Production:** Automatic load, PostgreSQL, live event
- `sync-schema-provider.mjs` ensures provider matches DATABASE_URL at build time
- Migrations run automatically on deploy

