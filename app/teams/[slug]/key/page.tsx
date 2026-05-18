import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowRight, KeyRound } from "lucide-react"

import { ApiKeyField } from "@/components/ui/copy-button"

import { ParticipantOnboardingStrip } from "@/components/team/participant-onboarding-strip"
import { BuildCountdown } from "@/components/shell/build-countdown"
import { ParticipantAppShell, ParticipantStage } from "@/components/shell/participant-app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getTeamWorkspace } from "@/lib/data"
import { getTeamOnboardingState } from "@/lib/participant-onboarding"
import { loadParticipantNavContext } from "@/lib/participant-nav-context"
import { getSession } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function KeyRevealPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await getSession()
  if (!session) redirect("/login")

  const team = await getTeamWorkspace(slug)
  if (!team) notFound()

  if (!team.members.some((m) => m.id === session.userId)) notFound()

  const onboarding = getTeamOnboardingState(team)
  const nav = await loadParticipantNavContext()

  return (
    <ParticipantAppShell
      lead={<ParticipantOnboardingStrip teamSlug={team.slug} state={onboarding} />}
      browserTitle="api key"
      urlDisplay={`techday.altir.internal/teams/${team.slug}/key`}
      browserRight={<span className="text-[var(--acid)]">14:30 sharp</span>}
      activeNav="workspace"
      workspaceHref={nav.workspaceHref}
      ideaHref={nav.ideaHref}
      submitHref={nav.submitHref}
      countdownSlot={<BuildCountdown />}
      teamSlug={team.slug}
      teamName={team.name}
      userEmail={session?.email ?? null}
      userName={session?.fullName ?? null}
      hasTeam={nav.hasTeam}
    >
      <ParticipantStage>
        <div className="grid min-h-[70vh] place-items-center">
          <Card
            className="panel-surface max-w-4xl gap-0 rounded-none py-0"
            style={{ boxShadow: "inset 0 0 0 1px rgba(196, 255, 0, 0.42), 0 0 28px rgba(196, 255, 0, 0.16)" }}
          >
            <CardContent className="p-8 text-center md:p-14">
              <KeyRound className={`mx-auto size-14 ${team.apiKey?.value ? "text-[var(--acid)]" : "text-[var(--text-mute)]"}`} />

              {team.apiKey?.value ? (
                <>
                  <div className="mt-6 text-[11px] uppercase tracking-[0.26em] text-[var(--acid)]"># key revealed / {team.apiKey.provider}</div>
                  <h1 className="mt-4 text-4xl font-bold leading-none tracking-[-0.05em] text-white md:text-6xl">
                    Your key is live. Three hours. Go.
                  </h1>
                  <div className="mx-auto mt-7 max-w-xl">
                    <ApiKeyField value={team.apiKey.value} />
                  </div>
                  <p className="mt-4 text-xs text-[var(--text-dim)]">Budget capped for event use. Do not paste in public repos.</p>
                </>
              ) : team.apiKey ? (
                <>
                  <div className="mt-6 text-[11px] uppercase tracking-[0.26em] text-[var(--text-mute)]"># key assigned / locked</div>
                  <h1 className="mt-4 text-4xl font-bold leading-none tracking-[-0.05em] text-white md:text-5xl">Key not yet visible.</h1>
                  <p className="mx-auto mt-4 max-w-md text-sm text-[var(--text-dim)]">
                    {!team.currentIdea
                      ? "Submit an idea first, then wait for the release window."
                      : "Idea submitted. Waiting for the admin-configured release time."}
                  </p>
                </>
              ) : (
                <>
                  <div className="mt-6 text-[11px] uppercase tracking-[0.26em] text-[var(--text-mute)]"># no key assigned</div>
                  <h1 className="mt-4 text-4xl font-bold leading-none tracking-[-0.05em] text-white md:text-5xl">No API key assigned yet.</h1>
                  <p className="mx-auto mt-4 max-w-md text-sm text-[var(--text-dim)]">
                    An admin will assign a key to your team. Check back soon.
                  </p>
                </>
              )}

              <Button asChild className="mt-7 rounded-none font-mono uppercase tracking-[0.12em]">
                <Link href={`/teams/${team.slug}`}>
                  Back to workspace <ArrowRight />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </ParticipantStage>
    </ParticipantAppShell>
  )
}
