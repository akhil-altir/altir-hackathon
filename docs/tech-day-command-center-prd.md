# Product Requirements Document: Tech Day Command Center

## Problem Statement

Altir is running an internal Tech Day hackathon on Friday, 22 May 2026 at the office. The event needs to feel energetic and organized while staying simple enough to run in a short window: team formation before the event, coding from 2:30 PM to 5:30 PM, and presentations from 5:30 PM to 6:30 PM.

Today, team formation, API key distribution, idea collection, submission tracking, scoring, and judge evaluation could easily become scattered across chat messages, spreadsheets, manual reminders, and ad hoc links. That creates friction for participants and operational load for admins.

The product should be an internal platform that acts as the event command center: employees form teams, teams submit ideas, API keys unlock at the right time, admins control the event, judges score teams, and everyone can follow progress through live leaderboards and TV-friendly views.

## Solution

Build a web platform called **Tech Day Command Center** for Altir's internal hackathon.

The platform will support individual participant login, quick two-person team formation, milestone-based event points, configurable scoring criteria, preloaded API key assignment, idea submission, GitHub/demo/presentation submissions, admin controls, judge scoring, and public live views for the office TV.

Teams may use any technology stack they want. The platform will not restrict what they build with. It will only collect their chosen stack as metadata and optionally provide setup guides or starter tracks.

The MVP should optimize for two goals:

1. **Smooth operations**: team formation, login, submissions, admin controls, API key release, and judge scoring work reliably.
2. **High event energy**: live points, leaderboards, visible team progress, countdowns, and TV displays make the event feel active and fun.

## Event Details

- Company: Altir
- Event: Tech Day internal hackathon
- Event date: Friday, 22 May 2026
- Venue: Office
- Build time: 2:30 PM to 5:30 PM
- Presentation time: 5:30 PM to 6:30 PM
- Team size: 2 members per team
- Team lock time: 1:00 PM, with admin override
- API key budget: 1 key per team, estimated USD 25-30 per key
- API key release: event start, after idea submission

## User Roles

### Participant

An employee who can log in, create or join a two-person team, submit ideas, view team progress, see public leaderboards, and access the assigned API key after eligibility rules are satisfied.

### Team

A two-person group with a shared workspace. Both members log in individually but see the same team details, submissions, assigned API key, event points, judge score summary, and final ranking.

### Admin

An event organizer who can upload employees, configure event settings, manage teams, preload API keys, assign or replace keys, configure scoring, publish announcements, manage idea banks, update timelines, monitor submissions, and override judge scores when needed.

### Judge

A reviewer who logs in separately and scores each team using configured judging criteria. Judges can see team submissions and presentation details needed for evaluation.

### Public Viewer

Anyone viewing the shared event pages or office TV display. Public views can show teams, ideas, scores, progress, countdowns, and leaderboards, but must never expose API keys or passwords.

## User Stories

1. As an admin, I want to upload or enter the employee list, so that participants can select from approved employees during team formation.
2. As an admin, I want each employee record to include name, email, department, and role, so that scoring can reward cross-functional teams.
3. As a participant, I want to log in using my own email and password, so that the platform knows who I am.
4. As a participant, I want to create a team quickly, so that I can register without admin help.
5. As a participant, I want to choose a team name, so that our team has an identity during the event.
6. As a participant, I want to select myself and one partner from available employees, so that I can form a two-person team.
7. As a participant, I want unavailable employees to disappear from the team creation dropdown, so that people are not accidentally placed on multiple teams.
8. As a participant, I want to see my department and role before confirming the team, so that I understand how scoring may work.
9. As a participant, I want the team to form immediately after submission, so that registration is fast.
10. As a participant, I want both team members to access the same team workspace, so that either member can update submissions.
11. As a participant, I want to leave or disband a team before 1:00 PM, so that we can correct team choices.
12. As a participant, I want team changes to be locked after 1:00 PM, so that the event can be prepared cleanly.
13. As an admin, I want to override the 1:00 PM team lock, so that I can handle real-world exceptions.
14. As an admin, I want to edit, split, merge, or delete teams, so that mistakes can be fixed.
15. As an admin, I want incomplete teams to be visible separately, so that I can help resolve them before the event.
16. As a team member, I want to see event guidelines in my dashboard, so that I know what to do next.
17. As a team member, I want to see the event timeline, so that I know the build and presentation schedule.
18. As a team member, I want to browse a bank of suggested ideas, so that we can pick something achievable in 2.5-3 hours.
19. As a team member, I want to submit a custom idea, so that we are not limited to the idea bank.
20. As a team member, I want to submit an idea title and short description before seeing the API key, so that the team commits to a direction first.
21. As a team member, I want to edit or change our idea later, so that we can pivot during the hackathon.
22. As a team member, I want the current idea to be visible publicly, so that other people know what we are building.
23. As an admin, I want to see idea history, so that I can understand pivots if needed.
24. As an admin, I want to preload API keys into the database, so that keys are ready before the event.
25. As an admin, I want each complete team to receive one assigned API key, so that usage is controlled by team.
26. As a team member, I want the API key to stay hidden until the release time, so that nobody starts early.
27. As a team member, I want to see the API key after our idea is submitted and the release time has arrived, so that we can start building.
28. As an admin, I want to configure the API key release time, so that I can control when keys become visible.
29. As an admin, I want to reveal, revoke, or replace a team's API key, so that I can handle exceptions.
30. As a public viewer, I must never see API keys, so that sensitive credentials remain protected.
31. As a team member, I want to submit our GitHub repository link, so that judges and admins can review our work.
32. As a team member, I want to submit a demo video link or upload reference, so that our demo can be captured.
33. As a team member, I want to submit a presentation link or upload reference, so that our final presentation is easy to access.
34. As a team member, I want to tag our technology stack, so that others can see what we used.
35. As a team member, I want the platform to accept any technology stack, so that our creativity is not constrained.
36. As an admin, I want to configure milestone scoring criteria, so that the event points can be adjusted without code changes.
37. As an admin, I want to add new event point criteria, so that we can evolve the game mechanics.
38. As an admin, I want to disable criteria, so that unused scoring rules do not affect the leaderboard.
39. As an admin, I want to manually award or deduct event points, so that special cases can be handled.
40. As a participant, I want to see why we received each event point award, so that the scoring feels transparent.
41. As a participant, I want to see a live event leaderboard, so that the event feels competitive and energetic.
42. As a participant, I want cross-functional teams to receive bonus points, so that employees are encouraged to collaborate across departments.
43. As an admin, I want department and role combinations to drive diversity scoring, so that the system can reward team composition automatically.
44. As a judge, I want to log in with my own account, so that my scores are tracked separately.
45. As a judge, I want to see each team's idea, repo, demo, presentation, and stack, so that I can score fairly.
46. As a judge, I want to enter scores by criterion, so that judging is structured.
47. As a judge, I want to save draft scores, so that I can complete scoring during presentations.
48. As an admin, I want to see which judges have scored which teams, so that I can manage completion.
49. As an admin, I want to enter scores on behalf of a judge, so that scoring can continue if a judge has trouble logging in.
50. As an admin, I want to override judge scores with an audit note, so that corrections are transparent.
51. As a participant, I want final ranking to use a weighted mix of judge scores and event points, so that both quality and momentum matter.
52. As an admin, I want judge score weight and event point weight to be configurable, so that we can choose the final ranking formula.
53. As a public viewer, I want to see a live event points leaderboard, so that I can follow team momentum.
54. As a public viewer, I want to see final winners after judging, so that the event ends clearly.
55. As an admin, I want a TV display mode, so that the office screen can show countdowns, leaderboards, team progress, and announcements.
56. As a public viewer, I want the TV display to show the start and end time, so that everyone can track the event schedule.
57. As a team member, I want to view all final team submissions after the submission deadline, so that I can easily explore what everyone built.
58. As a team member, I want a clean submissions gallery with repo, demo video, presentation, stack, idea, and team details, so that post-event browsing is simple.
59. As a team member, I want submissions to be searchable or filterable by team, department, idea, or stack, so that I can find relevant projects quickly.
60. As an admin, I want to control when the all-submissions gallery becomes visible, so that teams cannot browse incomplete submissions too early.
61. As a judge, I want one page that lists all submitted repos, demos, presentations, and ideas, so that judging review is easier.
62. As an admin, I want to update handbook content and setup guides, so that teams can get help without asking repeatedly.
63. As a team member, I want setup guides for common tools such as Claude Code and API key usage, so that I can start quickly if I need guidance.
64. As an admin, I want all sensitive actions to be auditable, so that key changes and score overrides are accountable.
65. As an admin, I want a simple Replit-friendly deployment path, so that the platform can be built and run quickly.

## Functional Requirements

### Authentication

- The platform must support individual login for participants, admins, and judges.
- Two team members must use separate accounts but share the same team workspace.
- Role-based access control must determine which pages and actions are available.
- Public views must not require login unless admins choose to protect them.

### Employee Management

- Admins can create, edit, import, and deactivate employees.
- Employee fields should include name, email, department, role, and eligibility status.
- Employees already assigned to a complete team must not appear as selectable members for new teams.

### Team Formation

- Teams must contain exactly two members for the event.
- Participants can create a team by choosing team name, member 1, and member 2.
- Team creation is immediate.
- Team edits are allowed until 1:00 PM on 22 May 2026.
- After 1:00 PM, team changes require admin override.
- Incomplete/disbanded teams should release both employees back into the available pool before lock time.

### Idea Submission

- Teams can select an idea from the idea bank or submit a custom idea.
- Teams must submit an idea title and short description before accessing their API key.
- Teams can edit or replace their idea after initial submission.
- Current team ideas are visible publicly unless admins disable this.

### API Key Management

- Admins preload API keys into the database.
- Each locked complete team receives one key.
- Keys remain hidden until the configured release time.
- A team can see its key only after submitting an idea and after the release time has arrived.
- Admins can reveal, revoke, replace, or reassign keys.
- API keys must never appear in public leaderboards, TV mode, or public team pages.

### Event Point Scoring

- Event points are automatic milestone points used for energy and progress.
- Admins can configure point criteria, values, activation status, and manual adjustments.
- Suggested default criteria:
  - Complete team formed: 10 points
  - Different departments: 5 points
  - Very different functions: 10 points
  - Team formed before lock time: 5 points
  - Idea submitted: 10 points
  - Idea selected from idea bank: 3 points
  - Custom idea submitted: 5 points
  - GitHub repo submitted: 10 points
  - Repo has README/setup notes: 5 points
  - Demo video submitted: 15 points
  - Presentation uploaded/submitted: 10 points
  - Final submission completed before deadline: 10 points
  - Submitted before 5:15 PM: 5 points
  - Submitted before 5:00 PM: 10 points instead of the 5:15 PM bonus
- The system should show an explainable score breakdown per team.

### Judge Scoring

- Judges log in individually.
- Admins configure judging criteria and max points.
- Judges score teams independently.
- The system averages judge scores per team.
- Admins can enter or edit scores on behalf of judges with audit notes.
- Suggested judge criteria:
  - Innovation
  - Business usefulness
  - Execution
  - Demo quality
  - Presentation clarity

### Final Ranking

- Final ranking uses a weighted mix of judge score and event points.
- Default weighting:
  - Judge score: 60%
  - Event points: 40%
- Both score layers must be normalized to 100 before final score calculation.
- Admins can configure the weights, with the recommended event point range between 35% and 40%.
- Public display should distinguish live event points from final ranking.

### Team Workspace

- Team members can see:
  - Team name and members
  - Event timeline
  - Handbook and setup guides
  - Idea submission
  - API key status and key when unlocked
  - GitHub repo submission
  - Demo video submission
  - Presentation submission
  - Event points breakdown
  - Judge score summary when published

### Submission Gallery

- After the configured submission deadline or an admin-published release action, teams can view all final submissions in a clean gallery.
- The gallery should include team name, team members, departments, idea title and description, stack tags, GitHub repo link, demo video link, presentation link, and final submission status.
- The gallery should be easy to scan and should support search or filters by team, department, stack, idea, and submission status.
- Judges can use the same gallery as a review surface during or after presentations.
- Admins can choose whether the gallery is hidden until the deadline, published manually, or visible with partial/in-progress status during the event.
- API keys, passwords, admin notes, and private audit details must never appear in the gallery.

### Admin Console

- Admins can manage:
  - Event date, timeline, lock time, release time, and deadline settings
  - Employees and roles
  - Teams and team overrides
  - API key pool and assignments
  - Idea bank
  - Handbook/setup guide content
  - Event scoring criteria
  - Judge criteria and judge accounts
  - Score overrides
  - Announcements
  - Submission gallery visibility and release timing
  - Public/TV display settings

### Public and TV Views

- Public views can show all teams, team members, departments, idea titles, stack tags, event points, submission status, and leaderboards.
- After the submission deadline, public or logged-in team views can show the full submissions gallery with repo, demo, and presentation links.
- TV mode should be readable from a distance and cycle through:
  - Countdown to event start/end
  - Live event leaderboard
  - Team progress board
  - Current announcements
  - Presentation schedule
  - Final winners when published

## Non-Functional Requirements

- The platform should be simple enough to build and deploy on Replit.
- The UI should be polished, energetic, and clear for a live internal event.
- Sensitive fields such as API keys and passwords must be protected.
- Admin actions that affect keys or scores should be auditable.
- The app should handle a small internal hackathon scale comfortably.
- The product should work well on laptops and office TV screens.
- The system should avoid hardcoding scoring rules where admin configurability is expected.

## Implementation Decisions

- Build as a web application suitable for Replit.
- Use individual user accounts for participants, admins, and judges.
- Model team membership separately from user accounts so both members share a team workspace.
- Store employees as event-eligible people with department and role metadata.
- Store event settings in configurable records rather than hardcoded constants.
- Store scoring criteria as configurable database records.
- Store score events or score ledger entries so point breakdowns are explainable.
- Store judging criteria separately from event point criteria.
- Store judge submissions per judge and team.
- Store admin score overrides with actor, timestamp, and reason.
- Store API keys encrypted or otherwise protected at rest where feasible.
- Separate public display data from private team/admin data so sensitive fields are never exposed accidentally.
- Treat the all-submissions gallery as a published read model that excludes sensitive fields by design.

## Suggested Data Entities

- User
- Employee
- Team
- TeamMember
- Idea
- IdeaBankItem
- ApiKey
- EventSettings
- EventPointCriterion
- EventPointAward
- JudgeCriterion
- JudgeScore
- Submission
- Announcement
- AuditLog

## Testing Decisions

- Tests should focus on external behavior and business rules rather than UI implementation details.
- Team formation tests should verify employee availability, duplicate prevention, team lock behavior, and admin override behavior.
- API key tests should verify idea gating, release-time gating, team-only visibility, and public-view redaction.
- Scoring tests should verify configurable criteria, cross-functional bonuses, milestone awards, manual adjustments, and score breakdowns.
- Judge scoring tests should verify per-judge scores, averaging, admin entry on behalf of judges, and audit notes.
- Final ranking tests should verify score normalization and configurable judge/event weighting.
- Access-control tests should verify participant, judge, admin, and public permissions.

## Out of Scope for MVP

- Automatic API key generation from provider APIs.
- Hard restrictions on participant technology stack.
- Advanced collaboration scoring between teams.
- Payment or budget tracking beyond key count/cost notes.
- Deep GitHub integration beyond accepting repo links.
- Automated code quality checks.
- Automated video hosting or transcoding.
- Email invitation and OTP flows unless Replit implementation makes them trivial.
- Multi-event support beyond keeping settings flexible enough for reuse.

## Open Questions

- Should public pages be accessible only inside the company network, or should they be public URLs with obscurity/login protection?
- Should API keys be encrypted at rest using application-level encryption, database encryption, or a Replit secret-based approach?
- Should final judge scores be visible immediately or only after admins publish winners?
- Should the idea bank be preloaded manually or generated/imported from a document?
- Should participants be allowed to upload files directly, or should they submit links only for the MVP?

## MVP Build Sequence

1. Authentication and role-based access.
2. Employee upload and team formation.
3. Team workspace with idea submission.
4. API key preload, assignment, and gated reveal.
5. Configurable event point scoring and live leaderboard.
6. Admin console for teams, settings, scoring, and keys.
7. All-submissions gallery for post-deadline browsing and judging review.
8. Judge login and judge scoring.
9. Weighted final ranking.
10. TV display mode.
11. Handbook, setup guides, and idea bank polish.

## Further Notes

The product should feel like a live event surface, not a static admin form. The participant experience should be fast and upbeat. The admin experience should be calm, transparent, and forgiving. The scoring system should create momentum without making operational points feel more important than the quality of the final build.
