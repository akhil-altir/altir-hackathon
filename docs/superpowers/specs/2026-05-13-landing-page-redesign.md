# Landing Page Redesign — Tech Day 2026

**Date:** 2026-05-13  
**Status:** Approved for implementation  
**Branch:** feat/design-align-command-center

---

## Goal

Expand the existing lockscreen landing page (`app/page.tsx`) from a pure countdown view into an informational pre-event hub. Participants should understand the process, scoring criteria, and idea options before they walk in the door.

---

## Page Sections (in order)

### 1. Hero
**Source:** Hardcoded  
Keep existing copy and layout. No changes.

- Headline: "Three hours. Two people. One idea you ship."
- Subheading: existing paragraph
- CTAs: "Sign in to claim your spot" → `/login`, "Preview the floor" → `/gallery`

---

### 2. How It Works — 3-Step Rail
**Source:** Hardcoded  

Horizontal three-step flow. Each step has a number, title, and 1–2 sentence description.

| Step | Title | Description |
|------|-------|-------------|
| 01 | Form your team | Pair with someone from a different department. Exactly 2 people per team. Lock in before 1:00 PM — late formation forfeits bonuses. |
| 02 | Pick an idea | Browse the idea bank or bring your own. Ideas drop May 20. Keys revealed at 2:00 PM for setup — build window opens 2:30 PM. |
| 03 | Build and ship | Three hours (2:30–5:30 PM). Use any tools and host anywhere. Submit repo, demo video, and deck before 5:00 PM. Present live to judges from 5:30 PM. |

---

### 3. Idea Bank Preview
**Source:** Live DB + reveal gate  

**Before May 20, 6:00 PM IST (`IDEA_BANK_REVEAL_MS` constant):**
- Section heading: "Idea Bank"
- Show category tag counts only: `ENG` · `OPS` · `DESIGN` · `BIZ` (derived from DB)
- Copy: "N ideas locked. Full briefs drop May 20 at 6 PM IST."
- Secondary countdown to reveal date

**After `IDEA_BANK_REVEAL_MS`:**
- Show active idea bank entries as cards: title, problem statement snippet, stack hint, category tag
- Max 6 cards visible
- CTA: "Sign in to browse all" → `/login`

**Data:**
- New public query: `listPublicIdeaBankEntries()` in `lib/idea-bank-public.ts` — filters `isActive: true`, returns `{ id, title, problemStatement, stackHint, category }`. No auth required.
- New constant in `lib/tech-day-schedule.ts`: `IDEA_BANK_REVEAL_MS = Date.parse("2026-05-20T18:00:00+05:30")`
- Page-level: `export const revalidate = 60` — auto-switches within 60s of reveal time, zero deploy needed

---

### 4. Scoring Criteria
**Source:** Hardcoded (no exact point values shown — TBD)

Two pillars displayed as a visual split, not a point table.

**60% — Judge Score**  
Assessed live during demos. Criteria labels:
- Innovation & originality
- Technical execution
- Demo quality & polish
- Real-world feasibility
- Cross-department impact

**40% — Participation & Milestones**  
Earned throughout the day:
- Team formed
- Cross-functional pairing (bonus)
- Formed before 1:00 PM lock (bonus)
- Idea submitted
- Repo submitted
- Demo video uploaded
- Deck uploaded
- Submitted before 5:15 PM early window (bonus)

Footer line (italic): *"Exact point breakdown will be revealed closer to the event."*

No numbers shown anywhere in this section.

---

### 5. Day Timeline
**Source:** Hardcoded — `LOCKSCREEN_AGENDA_IST` array (already exists in `tech-day-flow.tsx`)

Promote to a named, visually distinct section. No structural changes to the data. Times render in viewer's local timezone (existing behavior).

Updated agenda — keys reveal at 2:00 PM for setup, build window opens 2:30 PM:

| Time (IST) | Event |
|------------|-------|
| 12:00 PM | Doors open / check-in |
| 1:00 PM | Team formation locks |
| 2:00 PM | Keys reveal + environment setup |
| 2:30 PM | Build starts |
| 5:00 PM | Submission deadline window |
| 5:30 PM | Demos + judging |
| 6:30 PM | Winners + drinks |

---

### 6. FAQ / Rules
**Source:** Hardcoded  

4 inline rules. Link to full handbook at bottom.

1. Teams are exactly 2 people.
2. Use any idea bank prompt or bring your own — both are welcome.
3. Use any tools you want — Cursor, Claude Code, Codex, Replit, Lovable, or anything else.
4. Host anywhere — Vercel, Cloudflare, Railway, Render, Supabase, Neon, or your own infra.
5. Final demo must be presented live (no video-only submissions).
6. API keys are one per team, revealed at 2:00 PM for setup. Keep them out of public repos.

CTA: "Full rules and tooling guide → Handbook" (links to `/handbook`)

---

### 7. CTA Footer
**Source:** Hardcoded  

Full-width strip.

- Heading: "Ready to build?"
- Subtext: "Sign in with your Altir email to form a team and claim your spot."
- Button: "Sign in to get started" → `/login`

---

## Constants to Update

| File | Constant | Change |
|------|----------|--------|
| `lib/tech-day-schedule.ts` | `TECH_DAY_BUILD_START_MS` | Keep at `14:30` IST (build start, unchanged) |
| `lib/tech-day-schedule.ts` | `IDEA_BANK_REVEAL_MS` | Add new: `2026-05-20T18:00:00+05:30` |
| `components/flow/tech-day-flow.tsx` | `LOCKSCREEN_AGENDA_IST` | Add new 14:00 entry "Keys reveal + setup"; keep 14:30 "Build starts" |

---

## New Files

| File | Purpose |
|------|---------|
| `lib/idea-bank-public.ts` | Public (no-auth) query for active idea bank entries |

---

## Modified Files

| File | Change |
|------|--------|
| `app/page.tsx` | Add `export const revalidate = 60`, render new landing sections |
| `components/landing/how-it-works.tsx` | New component — 3-step rail |
| `components/landing/idea-bank-preview.tsx` | New component — gated reveal, DB-fed |
| `components/landing/scoring-criteria.tsx` | New component — 60/40 split, no point values |
| `components/landing/day-timeline.tsx` | New component — existing agenda data, promoted |
| `components/landing/faq-rules.tsx` | New component — 4 rules + handbook link |
| `components/landing/cta-footer.tsx` | New component — sign-in strip |
| `lib/tech-day-schedule.ts` | Add `IDEA_BANK_REVEAL_MS`, update `TECH_DAY_BUILD_START_MS` |

---

## Out of Scope

- No new routes
- No auth changes
- No changes to scoring engine or DB schema
- No mobile-specific layout overhaul (responsive within existing grid patterns)
- Exact scoring weights remain TBD — landing page shows criteria labels only
