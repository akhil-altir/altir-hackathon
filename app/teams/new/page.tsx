import { redirect } from "next/navigation"

import { TeamFormClient } from "./team-form"
import { BuildCountdown } from "@/components/shell/build-countdown"
import { ParticipantAppShell, ParticipantStage } from "@/components/shell/participant-app-shell"
import { getAvailableEmployees, getTeamWorkspace, getUserTeam } from "@/lib/data"
import { getActiveEventPointsByKeys } from "@/lib/event-score-display"
import { getParticipantResumeHref } from "@/lib/participant-onboarding"
import { loadParticipantNavContext } from "@/lib/participant-nav-context"
import { getSession } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function NewTeamPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const existingTeam = await getUserTeam(session.userId)
  if (existingTeam) {
    const workspace = await getTeamWorkspace(existingTeam.slug)
    if (workspace) redirect(getParticipantResumeHref(workspace))
    redirect(`/teams/${existingTeam.slug}`)
  }

  const availableEmployees = await getAvailableEmployees()
  const partners = availableEmployees.filter((e) => e.id !== session.userId)
  const nav = await loadParticipantNavContext()

  const formationKeys = ["team_formed", "cross_assignment", "formed_before_lock"] as const
  const formationPts = await getActiveEventPointsByKeys(formationKeys)
  const formationPreview = {
    completeTeam: formationPts.team_formed,
    crossAssignment: formationPts.cross_assignment,
    formedBeforeLock: formationPts.formed_before_lock,
    maxIfAllApply: formationPts.team_formed + formationPts.cross_assignment + formationPts.formed_before_lock,
  }

  return (
    <ParticipantAppShell
      browserTitle="form a team"
      urlDisplay="techday.altir.internal/teams/new"
      browserRight={<span className="text-[var(--acid)]">team lock</span>}
      activeNav="workspace"
      workspaceHref={nav.workspaceHref}
      ideaHref={nav.ideaHref}
      submitHref={nav.submitHref}
      countdownSlot={<BuildCountdown />}
      teamSlug={null}
      teamName={null}
      userEmail={session.email}
      userName={session.fullName}
      hasTeam={false}
    >
      <ParticipantStage>
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--warn)]"># step 01 / form a team</div>
          <span className="inline-flex items-center gap-1.5 border border-amber-400/35 bg-amber-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200">
            <span className="size-1.5 rounded-full bg-amber-300" />
            team lock 13:00 · in 42 min
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">Pick yourself + one partner.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--text-dim)]">
          Teams are exactly 2 people. Cross-department pairs unlock bonus event points. You can leave or edit until 13:00
          — after that, only an admin can override.
        </p>

        <TeamFormClient
          currentUser={{ id: session.userId, fullName: session.fullName, primaryAssignment: session.primaryAssignment }}
          partners={partners}
          formationPreview={formationPreview}
        />
      </ParticipantStage>
    </ParticipantAppShell>
  )
}
