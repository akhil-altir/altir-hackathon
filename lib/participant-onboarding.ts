export type TeamWorkspaceData = NonNullable<
  Awaited<ReturnType<typeof import("@/lib/data").getTeamWorkspace>>
>

export const PARTICIPANT_ONBOARDING_STEPS = [
  { id: "TEAM_FORMATION", label: "Team formation" },
  { id: "TEAM_LOCKED", label: "Team locked" },
  { id: "IDEA_SELECTION", label: "Idea selection" },
  { id: "KEY_REVEAL", label: "Key reveal" },
  { id: "BUILD", label: "Build" },
  { id: "SUBMIT", label: "Submit" },
  { id: "JUDGE_SCORE", label: "Judge / score" },
] as const

export type OnboardingBlocking =
  | "NO_IDEA"
  | "WAITING_KEY"
  | "BUILD"
  | "FINALIZE_SUBMIT"
  | "DONE"

export type TeamOnboardingState = {
  blocking: OnboardingBlocking
  /** 0–6 index of the step that needs attention (or last step when DONE). */
  currentStepIndex: number
  /** Primary CTA to move the flow forward. */
  nextHref: string
  nextLabel: string
  bannerTitle: string
  bannerBody: string
  /** True once handoff to judging is complete. */
  isFlowComplete: boolean
}

function teamBase(slug: string) {
  return `/teams/${slug}`
}

/**
 * Where to send a participant after login (or when they hit /teams/new but already have a team).
 */
export function getParticipantResumeHref(team: TeamWorkspaceData): string {
  const slug = team.slug
  const base = teamBase(slug)
  if (!team.currentIdea) return `${base}/locked`
  if (!team.apiKey?.value) return `${base}/key`
  const st = team.submission?.status
  if (!team.submission || st === "IN_PROGRESS") return base
  if (st === "SUBMITTED") return `${base}/submit`
  return base
}

export function getTeamOnboardingState(team: TeamWorkspaceData): TeamOnboardingState {
  const slug = team.slug
  const base = teamBase(slug)

  if (!team.currentIdea) {
    return {
      blocking: "NO_IDEA",
      currentStepIndex: 1,
      nextHref: `${base}/idea`,
      nextLabel: "Choose idea",
      bannerTitle: "Team is live — pick what you are building next.",
      bannerBody: "You are on the roster. Open the idea bank or submit a custom idea to unlock your API key path.",
      isFlowComplete: false,
    }
  }

  if (!team.apiKey?.value) {
    return {
      blocking: "WAITING_KEY",
      currentStepIndex: 3,
      nextHref: `${base}/key`,
      nextLabel: "Key reveal",
      bannerTitle: "Idea recorded — continue to key reveal.",
      bannerBody: "Your key may be time-gated. Open the key page to see status and copy it when it goes live.",
      isFlowComplete: false,
    }
  }

  const st = team.submission?.status
  const isBuildPhase =
    !team.submission || st === "IN_PROGRESS" || st === "IDEA_SUBMITTED" || st === "BUILDING"

  if (isBuildPhase) {
    return {
      blocking: "BUILD",
      currentStepIndex: 4,
      nextHref: base,
      nextLabel: "Open workspace",
      bannerTitle: "API key is live — build window open.",
      bannerBody: "Ship in the workspace, then complete the submission checklist when you are ready.",
      isFlowComplete: false,
    }
  }

  if (st === "SUBMITTED") {
    return {
      blocking: "FINALIZE_SUBMIT",
      currentStepIndex: 5,
      nextHref: `${base}/submit`,
      nextLabel: "Finish submission",
      bannerTitle: "Repo linked — finish the submission package.",
      bannerBody: "Add your demo link and remaining fields so the team can be queued for judging.",
      isFlowComplete: false,
    }
  }

  return {
    blocking: "DONE",
    currentStepIndex: 6,
    nextHref: "/leaderboard",
    nextLabel: "Leaderboard",
    bannerTitle: "Submission locked in.",
    bannerBody: "Judges are scoring. Follow the leaderboard and gallery for updates.",
    isFlowComplete: true,
  }
}

/** Paths that are valid for the current blocking step (no nag banner). */
export function onboardingPathAllowed(teamSlug: string, pathname: string, state: TeamOnboardingState): boolean {
  const base = teamBase(teamSlug)
  switch (state.blocking) {
    case "NO_IDEA":
      return pathname === `${base}/locked` || pathname.startsWith(`${base}/idea`)
    case "WAITING_KEY":
      return pathname.startsWith(`${base}/key`) || pathname.startsWith(`${base}/idea`) || pathname === `${base}/locked`
    case "BUILD":
      return pathname === base || pathname.startsWith(`${base}/submit`)
    case "FINALIZE_SUBMIT":
      return pathname.startsWith(`${base}/submit`)
    case "DONE":
      return true
    default:
      return true
  }
}

export function shouldShowOnboardingBanner(teamSlug: string, pathname: string, state: TeamOnboardingState): boolean {
  if (state.isFlowComplete) return false
  return !onboardingPathAllowed(teamSlug, pathname, state)
}

export function getOnboardingStepStatuses(state: TeamOnboardingState): Array<{
  id: (typeof PARTICIPANT_ONBOARDING_STEPS)[number]["id"]
  label: string
  tone: "complete" | "current" | "upcoming"
}> {
  const idx = state.currentStepIndex
  return PARTICIPANT_ONBOARDING_STEPS.map((step, i) => {
    let tone: "complete" | "current" | "upcoming"
    if (state.isFlowComplete) {
      tone = "complete"
    } else if (i < idx) {
      tone = "complete"
    } else if (i === idx) {
      tone = "current"
    } else {
      tone = "upcoming"
    }
    return { ...step, tone }
  })
}
