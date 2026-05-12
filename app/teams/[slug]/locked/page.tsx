import { notFound, redirect } from "next/navigation"

import { TeamLockedCelebration } from "@/components/team/team-locked-celebration"
import { ParticipantOnboardingStrip } from "@/components/team/participant-onboarding-strip"
import { ParticipantAppShell, ParticipantStage } from "@/components/shell/participant-app-shell"
import { getTeamWorkspace } from "@/lib/data"
import { getTeamOnboardingState } from "@/lib/participant-onboarding"
import { loadParticipantNavContext } from "@/lib/participant-nav-context"
import { getSession } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function TeamLockedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await getSession()
  if (!session) redirect("/login")

  const team = await getTeamWorkspace(slug)
  if (!team) notFound()

  const isMember = team.members.some((m) => m.id === session.userId)
  if (!isMember) notFound()

  if (team.currentIdea) {
    redirect(`/teams/${slug}`)
  }

  const nav = await loadParticipantNavContext()
  const onboarding = getTeamOnboardingState(team)
  const lockedAtLabel = new Date().toLocaleTimeString(undefined, {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <ParticipantAppShell
      lead={<ParticipantOnboardingStrip teamSlug={team.slug} state={onboarding} />}
      browserTitle="team locked"
      urlDisplay={`techday.altir.internal/teams/${team.slug}`}
      browserRight={<span className="text-[var(--acid)]">team ready</span>}
      activeNav="workspace"
      workspaceHref={nav.workspaceHref}
      ideaHref={nav.ideaHref}
      submitHref={nav.submitHref}
      phase="BUILD OPENS"
      countdown="01:34:00"
      teamSlug={team.slug}
      teamName={team.name}
      userEmail={session.email}
      userName={session.fullName}
      hasTeam
    >
      <ParticipantStage>
        <TeamLockedCelebration teamName={team.name} teamSlug={team.slug} lockedAtLabel={lockedAtLabel} />
      </ParticipantStage>
    </ParticipantAppShell>
  )
}
