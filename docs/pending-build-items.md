# Altir Tech Day Command Center - Pending Build Items

Last updated: 2026-05-12

## 1) Critical Gaps (Must Build First)

### Authentication and Access Control
- Implement real login validation using employee roster credentials:
  - `userId = email`
  - `password = email local-part` (example: `agupta@altir.co` -> `agupta`)
- Add session management (cookie-based auth).
- Protect routes by role:
  - Participant-only: team/workspace/submission routes
  - Judge-only: judging routes
  - Admin-only: `/admin` and admin mutations
- Block direct URL access without required role.

### Security Hardening
- Hash passwords at rest (do not store plaintext credentials in DB).
- Add CSRF protection for all mutation forms.
- Add server-side validation and sanitization for all form inputs.
- Add basic audit logs for sensitive actions:
  - Role changes
  - API key creation/assignment
  - Score rule changes

### Postgres Portability
- Make Prisma datasource provider configurable for SQLite/Postgres environments.
- Validate migrations and seeds against Postgres.
- Ensure datetime handling and constraints behave the same in Postgres.
- Add production-ready `.env` examples for Postgres (local + cloud).

## 2) Core Feature Completion

### Team and Idea Workflow (Currently Mostly UI Flow)
- Persist team formation from UI (`/teams/new`) to DB.
- Enforce team rules:
  - Exactly 2 members
  - Team lock deadline
- Persist idea selection/submission and mark current idea per team.
- Enforce key unlock dependency (idea must be submitted before key reveal logic).

### Workspace and Submission Workflow
- Connect workspace widgets to live DB state:
  - Team status
  - Key status
  - Submission readiness
  - Event points
- Persist submission form fields:
  - Repo URL
  - Demo URL
  - Presentation URL / assets
- Enforce submission deadline behavior and final status transition.

### Judging and Results
- Persist judge scoring from `/judge/quotebot` (and all teams).
- Enforce one score per judge/team/criterion.
- Compute aggregate scoreboard from:
  - Event points
  - Judge scores
- Populate results and leaderboard from computed values (not static mock data).

## 3) Admin Surface Completion

### Changes-1 Requirements (Partially Built, Not Fully Enforced)
- Admin should mark/unmark users as Admin.
- Judges should have similar login flow and constrained experience.
- Admin should add API keys and assign keys to teams.
- Admin should define event score rules used in calculations.

### Remaining Admin Work
- Enforce admin auth check on all admin server actions.
- Add action feedback UI (success/error states after submit).
- Add safe validation:
  - Prevent duplicate labels/invalid score keys
  - Prevent conflicting team key assignment
- Add optional revoke/unassign key actions with status history.

## 4) Deployment Readiness (Azure + Anywhere)

### Runtime and Infrastructure
- Add deployment docs for:
  - Local Docker run
  - Azure App Service or Azure Container Apps
- Add startup/migration strategy:
  - Run migrations on deploy
  - Seed strategy per environment
- Add secret management guidance:
  - DB URL
  - Session secret
  - API keys

### Production Config
- Add health endpoint and readiness checks.
- Add error logging/monitoring integration plan.
- Add backup/restore expectations for Postgres.

## 5) Quality and Testing

### Automated Tests
- Add unit tests for:
  - Auth helpers
  - Role guards
  - Score calculations
- Add integration tests for:
  - Login flow
  - Team lock flow
  - Admin mutations
  - Judge scoring
- Add end-to-end flow test:
  - Login -> team -> idea -> key -> submission -> judging -> results

### Manual QA Checklist
- Verify all designed screens and transitions match intended flow.
- Verify mobile + desktop behavior.
- Verify route protection and unauthorized redirects.
- Verify admin changes are reflected in live participant/judge views.

## 6) Nice-to-Have (After Core Stabilization)

- Real-time updates (leaderboard/feed) via polling or websockets.
- Better input UX (inline validation messages and optimistic updates).
- CSV export for final scores and judging breakdown.
- Announcement composer for admins and live broadcast panel.

## 7) Suggested Build Order

1. Auth + role-based route protection.
2. Postgres-ready Prisma configuration and migration verification.
3. Persisted team/idea/submission workflows.
4. Judge scoring persistence + score computation engine.
5. Admin hardening + action feedback.
6. Azure deployment pipeline and production ops docs.
7. Automated tests and regression checklist.
