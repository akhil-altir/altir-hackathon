import { getUserTeam } from "@/lib/data"
import type { SessionPayload } from "@/lib/session"
import { getSession } from "@/lib/session"

export type ParticipantNavContext = {
  session: SessionPayload | null
  workspaceHref: string
  ideaHref: string
  submitHref: string
  hasTeam: boolean
  teamSlug: string | null
  teamName: string | null
}

/**
 * Resolves primary nav targets for the participant chrome. When unauthenticated,
 * workspace/idea/submit point at /login so the bar stays consistent on public pages.
 */
export async function loadParticipantNavContext(): Promise<ParticipantNavContext> {
  const session = await getSession()
  if (!session) {
    return {
      session: null,
      workspaceHref: "/login",
      ideaHref: "/login",
      submitHref: "/login",
      hasTeam: false,
      teamSlug: null,
      teamName: null,
    }
  }

  const team = await getUserTeam(session.userId)
  if (!team) {
    return {
      session,
      workspaceHref: "/teams/new",
      ideaHref: "/teams/new",
      submitHref: "/teams/new",
      hasTeam: false,
      teamSlug: null,
      teamName: null,
    }
  }

  const base = `/teams/${team.slug}`
  return {
    session,
    workspaceHref: base,
    ideaHref: `${base}/idea`,
    submitHref: `${base}/submit`,
    hasTeam: true,
    teamSlug: team.slug,
    teamName: team.name,
  }
}
