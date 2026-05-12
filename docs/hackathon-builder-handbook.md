# Altir Tech Day Builder Handbook

This handbook helps teams get productive quickly during Tech Day. Use any stack you want. These tools and workflows are optional launchpads, not restrictions

Last link check: 12 May 2026

## Quick Links

| Tool | Best for | Link |
| --- | --- | --- |
| Claude Code | Terminal-based agentic coding, repo edits, debugging, code review | [code.claude.com/docs](https://code.claude.com/docs/en) |
| OpenAI Codex CLI | Terminal-based coding agent from OpenAI | [OpenAI Codex CLI Help](https://help.openai.com/en/articles/11096431-openai-codex-cli-getting-started) and [GitHub repo](https://github.com/openai/codex) |
| Cursor | AI-first code editor with agent mode and project rules | [cursor.com](https://cursor.com) and [Cursor installation docs](https://docs.cursor.com/en/get-started/installation) |
| Replit | Build, host, and deploy apps in the browser | [replit.com](https://replit.com) and [Replit Agent docs](https://docs.replit.com/core-concepts/agent/) |
| Lovable | Prompt-to-app prototyping and UI generation | [lovable.dev](https://lovable.dev) |

## Recommended Team Workflow

1. **Pick a small problem.** Choose something demoable in 2.5-3 hours.
2. **Write a one-paragraph idea.** Include user, pain point, solution, and expected demo.
3. **Create the repo or Replit app.** Do this before writing too much code.
4. **Add a tiny README.** Include what it does, how to run it, and what is incomplete.
5. **Use an agent for planning first.** Ask it to create milestones before it writes code.
6. **Build one vertical slice.** Login, upload, AI call, or dashboard: one end-to-end flow beats five half-built screens.
7. **Commit or checkpoint often.** Make it easy to roll back bad agent changes.
8. **Record a short demo.** A working two-minute walkthrough is better than a complex unfinished pitch.

## Universal Agent Best Practices

Use this pattern with Claude Code, Codex, Cursor, Replit Agent, or any other coding agent:

```text
We are building [product] for [user].
Goal for this session: [one concrete milestone].
Constraints: [time, stack, API key, deployment target].
Please first inspect the current files, then propose a short plan.
Do not implement until I approve the plan.
After changes, run the smallest relevant verification.
Summarize changed files and remaining risks.
```

Good agent usage:

- Ask for one milestone at a time.
- Keep prompts specific and testable.
- Tell the agent what “done” means.
- Ask it to inspect existing files before coding.
- Ask for verification commands.
- Review diffs before accepting major changes.
- Keep secrets in environment variables or Replit Secrets.

Avoid:

- “Build the whole app” with no scope.
- Pasting API keys into chat, GitHub, frontend code, screenshots, or README files.
- Letting the agent rewrite the whole project without checkpoints.
- Debugging for 30 minutes without asking it to simplify and reproduce the issue.
- Adding too many dependencies unless they clearly save time.

## Claude Code

Claude Code is an agentic coding tool that can read your codebase, edit files, run commands, and work through development tasks in terminal, IDE, desktop, and browser surfaces. Official docs: [Claude Code overview](https://code.claude.com/docs/en).

### Install

Follow the current official setup page: [Claude Code setup](https://code.claude.com/docs/en/setup).

Common install paths from the official docs:

```bash
# macOS, Linux, WSL
curl -fsSL https://claude.ai/install.sh | bash

# Verify
claude --version
claude doctor
```

On Windows, use the official PowerShell/CMD instructions from the setup page. Claude Code requires a supported Claude/Anthropic account. The free Claude.ai plan may not include Claude Code access.

### Useful Claude Code Commands

Official command reference: [Claude Code commands](https://code.claude.com/docs/en/commands) and [slash commands](https://docs.claude.com/en/docs/claude-code/slash-commands).

- `/init`: create a `CLAUDE.md` project guide.
- `/clear`: reset context between unrelated tasks.
- `/compact`: summarize a long session while keeping key context.
- `/permissions`: manage what Claude can do automatically.
- `/review`: ask for code review.
- `/agents`: manage custom subagents.
- `/rewind`: return to an earlier checkpoint.
- `/doctor`: check installation health.

### Claude Code Best Practices

Official best practices: [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices).

Recommended for Tech Day:

- Start with: “Explore first, then plan, then code.”
- Give Claude a way to verify work, such as `npm test`, `npm run build`, or a manual browser checklist.
- Keep a short `CLAUDE.md` with app goal, stack, commands, and coding rules.
- Use `/clear` when switching from planning to debugging to deployment.
- Use `/rewind` if the agent takes the app in the wrong direction.
- Ask Claude to create a “demo path” early, then improve it.

## OpenAI Codex CLI

Codex CLI is OpenAI’s coding agent that runs locally in your terminal. Official docs: [OpenAI Codex CLI getting started](https://help.openai.com/en/articles/11096431-openai-codex-cli-getting-started). Official repo: [github.com/openai/codex](https://github.com/openai/codex).

### Install

```bash
npm install -g @openai/codex

# Or, if you use Homebrew
brew install --cask codex

# Start
codex
```

The official GitHub repo also lists install options and release binaries. Codex supports local approval modes so you can control whether it only suggests, edits files, or works more autonomously.

### Authentication

Codex can use API-key based setup or the current sign-in flow. See [Codex CLI and Sign in with ChatGPT](https://help.openai.com/en/articles/11381614).

For Tech Day:

- Use the API key only as instructed by the event platform.
- Put keys in environment variables or Replit Secrets.
- Never commit keys to GitHub.
- If a key leaks, tell an admin immediately so it can be revoked/replaced.

### AGENTS.md

Codex reads `AGENTS.md` files as repository instructions. Official Codex AGENTS.md behavior is described in the OpenAI Codex repo docs and base instructions: [AGENTS.md spec reference](https://github.com/openai/codex/blob/main/codex-rs/protocol/src/prompts/base_instructions/default.md).

Suggested `AGENTS.md` for a hackathon repo:

```md
# Project Instructions

We are building a 3-hour hackathon demo.

## Goal
Describe the product and final demo path in 3-5 lines.

## Stack
List frontend, backend, database, AI provider, and deployment target.

## Commands
- Install:
- Run locally:
- Test:
- Build:

## Rules
- Keep changes small and demo-focused.
- Do not commit secrets.
- Prefer simple, working flows over broad unfinished features.
- After edits, summarize changed files and verification.
```

## Cursor

Cursor is an AI-first code editor. It is useful if your team wants a familiar editor with chat, inline edits, agent workflows, and project rules.

### Install

Follow the official installation page: [Cursor installation docs](https://docs.cursor.com/en/get-started/installation).

Typical setup:

1. Go to [cursor.com](https://cursor.com).
2. Download and install Cursor.
3. Open the project folder.
4. Configure shortcuts, theme, and terminal preferences.
5. Use Chat, Agent, or inline edit for focused changes.

### Cursor Rules

Official docs: [Cursor rules](https://docs.cursor.com/context/rules).

Use rules to give Cursor reusable project context:

- Project rules live in `.cursor/rules`.
- User rules apply globally.
- `AGENTS.md` is also supported as a simple markdown instruction file.
- Prefer focused, actionable rules.
- Split large rules into smaller files.
- Include concrete examples.

Suggested Cursor rule topics:

- UI style and component patterns.
- API response conventions.
- Database schema rules.
- Testing expectations.
- Demo-first hackathon constraints.

## Replit

Replit is recommended if your team wants the fastest browser-based build and deployment path. Official site: [replit.com](https://replit.com). Replit Agent docs: [Replit Agent](https://docs.replit.com/core-concepts/agent/).

### Best Use During Tech Day

- Start with Replit Agent in planning mode.
- Ask it to create a minimal full-stack app first.
- Use Replit Secrets for API keys.
- Keep the app deployable from the beginning.
- Ask Agent to test the app before each demo milestone.
- Use Replit’s rollback/checkpoint features if an edit breaks the app.

Suggested first Replit prompt:

```text
Build a small hackathon MVP for [idea].
Use a simple full-stack web app.
Main demo path:
1. [Step one]
2. [Step two]
3. [Step three]

Use environment variables for API keys.
Create a README with run instructions.
Before coding, propose the app structure and data model.
```

## Lovable

Lovable is useful for quickly generating app prototypes, UI flows, and web app starting points from natural language. Official site: [lovable.dev](https://lovable.dev).

### Best Use During Tech Day

- Use Lovable when speed and UI polish matter.
- Start with a clear product brief and target user.
- Ask for one complete workflow, not a giant app.
- Export or connect to GitHub if your team wants to continue coding elsewhere.
- Review generated code before adding secrets or production data.

Suggested Lovable prompt:

```text
Create a polished MVP web app for [target user].
The app solves [problem].
The main workflow is:
1. [User action]
2. [AI/system action]
3. [Output/result]

Keep the design clean and demo-ready.
Include empty states, loading states, and a final success state.
```

## Best Agent Skills To Use

These are “skills” as reusable agent behaviors. You can ask any coding agent to act in these roles, or create formal Claude Code Skills / Cursor rules / slash commands for them.

### 1. Product Scoper

Use when the idea is still fuzzy.

Prompt:

```text
Act as a product scoper. Reduce this idea to a 3-hour MVP.
Give me the user, problem, core workflow, must-have features, nice-to-have features, and demo script.
```

### 2. UX Flow Designer

Use before building screens.

```text
Act as a UX flow designer. Create the simplest screen flow for this app.
Include empty, loading, success, and error states.
Prioritize a smooth demo path.
```

### 3. Database Designer

Use before adding data.

```text
Act as a database designer. Propose the smallest schema for this MVP.
Include tables/collections, fields, relationships, and sample data.
Avoid over-engineering.
```

### 4. API Integrator

Use when calling OpenAI, Anthropic, or another API.

```text
Act as an API integration engineer. Show how to call this API safely using environment variables.
Include request shape, response handling, error states, and rate-limit considerations.
Do not expose secrets in frontend code.
```

### 5. Debugger

Use when stuck.

```text
Act as a systematic debugger.
First reproduce the issue.
Then list likely causes.
Then inspect the smallest relevant files.
Then propose one fix.
After fixing, run the smallest verification.
```

### 6. Code Reviewer

Use before final submission.

```text
Act as a strict code reviewer.
Look for broken flows, exposed secrets, runtime errors, missing error states, and demo risks.
Prioritize findings by severity.
```

### 7. Demo Coach

Use in the final 30 minutes.

```text
Act as a demo coach.
Create a 2-minute presentation script:
problem, solution, live demo steps, technical highlight, business impact, and closing line.
Also list what not to click during the demo.
```

### 8. README Writer

Use before submitting GitHub.

```text
Write a concise README for this hackathon project.
Include what it does, tech stack, setup, environment variables, run command, demo flow, and known limitations.
```

### 9. Security Checker

Use before pushing code.

```text
Check this repo for secret leaks, unsafe API key usage, exposed server endpoints, and risky dependencies.
Tell me what to fix before submission.
```

### 10. Deployment Assistant

Use when preparing the final app link.

```text
Act as a deployment assistant.
Inspect the app and tell me the exact deployment steps for this environment.
Include build command, start command, required secrets, and common failure checks.
```

## Recommended Project Files

Every team should try to have:

```text
README.md
AGENTS.md or CLAUDE.md
.env.example
src/
```

Recommended `.env.example`:

```bash
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
DATABASE_URL=
```

Only include variable names in `.env.example`, never real keys.

## API Key Safety

- Store keys in Replit Secrets, `.env` files, or local environment variables.
- Add `.env` to `.gitignore`.
- Never paste real keys into frontend code.
- Never commit keys to GitHub.
- Never show keys in screen recordings.
- If a key appears in a repo, demo, screenshot, or chat, ask an admin to rotate it.

Suggested `.gitignore`:

```gitignore
.env
.env.local
.env.*.local
node_modules
dist
build
```

## Final 30-Minute Checklist

- App runs from a clean start.
- Main demo path works.
- Repo link is submitted.
- README explains setup and demo flow.
- Demo video or screen recording is submitted.
- Presentation link is submitted.
- API keys are not exposed.
- Known limitations are clearly stated.
- One teammate owns the live demo.
- One teammate owns the explanation and backup plan.

## References

- [Claude Code overview](https://code.claude.com/docs/en)
- [Claude Code setup](https://code.claude.com/docs/en/setup)
- [Claude Code best practices](https://code.claude.com/docs/en/best-practices)
- [Claude Code slash commands](https://docs.claude.com/en/docs/claude-code/slash-commands)
- [Claude Code Agent Skills](https://docs.claude.com/en/docs/claude-code/skills)
- [OpenAI Codex CLI getting started](https://help.openai.com/en/articles/11096431-openai-codex-cli-getting-started)
- [OpenAI Codex GitHub repository](https://github.com/openai/codex)
- [Codex CLI and Sign in with ChatGPT](https://help.openai.com/en/articles/11381614)
- [Cursor installation](https://docs.cursor.com/en/get-started/installation)
- [Cursor rules](https://docs.cursor.com/context/rules)
- [Replit Agent docs](https://docs.replit.com/core-concepts/agent/)
- [Replit](https://replit.com)
- [Lovable](https://lovable.dev)
