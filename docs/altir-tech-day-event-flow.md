# Altir Tech Day — Event Flow Overview
**For manager review / approval**

---

## What Is This?

An internal hackathon where Altir employees form two-person teams, build an AI-powered product in 3 hours, and present it for judging. A custom web platform — **Tech Day Command Center** — runs the entire event: team registration, idea submission, API key distribution, live scoring, and winner announcement.

---

## Event Details

| | |
|---|---|
| **Date** | Friday, 22 May 2026 |
| **Venue** | Office |
| **Team size** | 2 employees per team |
| **AI API budget** | USD $15–20 per team |
| **AI providers** | Claude or OpenAI (recommend: **Claude** for breadth + cost efficiency) |

---

## Day-of Timeline

| Time | Phase | What Happens |
|------|-------|--------------|
| Before 12:00 PM | **Team Formation** | Employees log in, form two-person teams, choose a team name. Platform prevents duplicates and enforces one team per person. |
| **12:00 PM** | **Team Lock** | Teams are locked. Changes require admin override. |
| 12:00–1:30 PM | **Idea Submission** | Each team submits an idea title and short description. Platform unlocks their AI API key only after submission. |
| **1:00 PM** | **Keys Reveal** | API keys revealed; 30-min env setup window before build opens. |
| **1:30 PM** | **Build Starts** | 4-hour build window opens. Teams build using any stack. Live leaderboard goes live on the office TV and web. |
| **5:30 PM** | **Submissions Due** | Teams submit GitHub repo, demo video link, and presentation link before the deadline. |
| **5:30 PM onwards** | **Presentations & Judging** | Each team presents. Judges score independently on: Innovation, Business Usefulness, Execution, Demo Quality, Presentation Clarity. No fixed end time. |
| **After demos** | **Winner Announcement** | Final scores (judge scores + event milestone points) aggregated and published. Timing based on judge review & leadership availability. |

---

## Platform: Tech Day Command Center

A purpose-built web app managing every aspect of the event in one place.

| Feature | Details |
|---------|---------|
| Participant portal | Login, team creation, idea submission, workspace, submission form |
| Admin console | Manage employees, teams, API keys, scoring criteria, announcements |
| Judge console | Score teams per criterion; scores averaged automatically |
| Live leaderboard | Real-time event points visible to all participants |
| TV display mode | Cycles countdown, leaderboard, team progress, and announcements |
| Public gallery | All submissions visible after deadline (repo, demo, presentation) |

---

## Team Tools & Tech Stack

Teams can use **any technology stack and development environment** of their choice, including:

- **IDEs & editors:** Claude Code, Cursor, VS Code, JetBrains, etc.
- **Platforms:** Replit, Lovable, GitHub, local development
- **AI assistants:** Claude, OpenAI Codex, ChatGPT, Copilot, etc.
- **Any web/mobile framework, database, or tool**

Platform places no restrictions on tech choices.

---

## Idea Submission

Teams choose one of two paths:

1. **Idea bank** — Browse pre-curated list of starter ideas (helps teams commit quickly)
2. **Custom idea** — Submit their own idea title + short description

Teams submit idea before **2:30 PM build start**. After submission, their AI API key unlocks.

---

## Scoring Model

### Final Ranking Formula

**Final Score = (Event Milestone Points × Weight₁) + (Judge Score × Weight₂)**

Both weights are configurable by admin without code changes.

---

### Event Milestone Points (Auto-awarded)

Admins define point values for:
- Idea submission completed
- Cross-functional team composition (different departments/roles)
- Early submission (before deadline)
- Demo quality bonus
- Tech stack diversity bonus
- Other admin-defined milestones

Points awarded automatically when teams meet criteria. **Transparent breakdown** shown to participants.

---

### Judge Scoring

**Judges score per criterion (each out of configurable max points):**
- **Innovation** — Novel approach, creative solution, unique angle
- **Business Usefulness** — Real-world value, solves a genuine problem
- **Execution** — Completeness, code quality, polish
- **Demo Quality** — Clear walkthrough, features work, handles edge cases
- **Presentation Clarity** — Communication, storytelling, time management

Each team scored by **all judges independently**. System averages judge scores per team. Admins can override or edit scores with audit notes.

---

### Visibility

- Participants see **live event leaderboard** (milestone points) during build
- Judge scores revealed **after submission deadline and judging complete**
- **Final rank published** after leadership review

---

## Key Roles

| Role | Responsibility |
|------|----------------|
| Participants | Form teams, submit ideas, build, present |
| Admins | Run the platform, manage API keys, handle edge cases |
| Judges | Score teams during the presentation hour |
| Public / TV | View live progress and final results |

---

## Approval Needed

- [ ] Confirm event date: **Friday, 22 May 2026**
- [ ] Approve AI API key budget: **USD $15–20 per team**
- [ ] Confirm API provider preference: **Claude** (recommended) or OpenAI
- [ ] Confirm office venue availability: **2:30–6:30 PM block**
- [ ] Identify and confirm **judges** ahead of time

---

*Prepared by: Akhilesh · 13 May 2026*
