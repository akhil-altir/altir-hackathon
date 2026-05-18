import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Copy, GitBranch, KeyRound, MonitorPlay, Upload } from "lucide-react"

import { ParticipantOnboardingStrip } from "@/components/team/participant-onboarding-strip"
import { getTeamWorkspace } from "@/lib/data"
import { getActiveEventPointsByKeys } from "@/lib/event-score-display"
import { getTeamOnboardingState } from "@/lib/participant-onboarding"
import { loadParticipantNavContext } from "@/lib/participant-nav-context"
import { getSession } from "@/lib/session"
import { BuildCountdown } from "@/components/shell/build-countdown"
import { ParticipantAppShell, ParticipantStage } from "@/components/shell/participant-app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function TeamWorkspacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await getSession()
  if (!session) redirect("/login")

  const team = await getTeamWorkspace(slug)
  if (!team) notFound()

  const isMember = team.members.some((m) => m.id === session.userId)
  if (!isMember) notFound()

  if (!team.currentIdea) {
    redirect(`/teams/${slug}/locked`)
  }

  const nav = await loadParticipantNavContext()
  const eventPoints = team.pointBreakdown.reduce((s, a) => s + (a.criterion?.pointsValue ?? a.points), 0)
  const onboarding = getTeamOnboardingState(team)
  const earlyPts = (await getActiveEventPointsByKeys(["before_515"])).before_515

  return (
    <ParticipantAppShell
      lead={<ParticipantOnboardingStrip teamSlug={team.slug} state={onboarding} />}
      browserTitle="team workspace"
      urlDisplay={`techday.altir.internal/teams/${team.slug}`}
      browserRight={<span className="text-[var(--acid)]">team ready</span>}
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
        <div className="grid gap-5 lg:grid-cols-[230px_1fr]">
          {/* Sidebar */}
          <div className="panel-surface self-start p-3">
            <div className="mb-2 px-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">workspace</div>
            {[
              { label: "▸ Dashboard", href: `/teams/${team.slug}`, active: true, right: null },
              { label: "  Idea", href: `/teams/${team.slug}/idea`, active: false, right: null },
              { label: "  API key", href: `/teams/${team.slug}/key`, active: false, right: team.apiKey?.status === "ASSIGNED" ? "◆" : null },
              { label: "  Submissions", href: `/teams/${team.slug}/submit`, active: false, right: `${[team.submission?.repoUrl, team.submission?.demoUrl, team.submission?.presentationUrl].filter(Boolean).length}/3` },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between rounded-[2px] px-2 py-2 font-mono text-[11px] transition-colors ${
                  item.active
                    ? "bg-[var(--panel-3)] font-bold text-white"
                    : "text-[var(--text-dim)] hover:bg-[var(--panel-2)] hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                {item.right && (
                  <span className={item.right === "◆" ? "text-[var(--acid)]" : "text-[var(--text-mute)]"} style={{ fontSize: 10 }}>
                    {item.right}
                  </span>
                )}
              </Link>
            ))}

            <div className="mt-1 flex items-center justify-between rounded-[2px] px-2 py-2 font-mono text-[11px] text-[var(--text-dim)]">
              <span>  Event points</span>
              <span className="text-[10px] font-bold text-[var(--acid)]">{eventPoints}</span>
            </div>
            <div className="flex items-center justify-between rounded-[2px] px-2 py-2 font-mono text-[11px] text-[var(--text-dim)]">
              <span>  Judge score</span>
              <span className="text-[10px] text-[var(--text-mute)]">
                {team.judgeSummary.length > 0
                  ? `${(team.judgeSummary.reduce((s, j) => s + j.total, 0) / team.judgeSummary.length).toFixed(1)} avg`
                  : "—"}
              </span>
            </div>

            <div className="my-3 border-t border-[var(--line)]" />
            <div className="mb-2 px-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">teammates</div>
            <div className="space-y-1">
              {team.members.map((m) => (
                <div key={m.id} className="flex items-center gap-2 px-2 py-1.5">
                  <span className="grid size-6 shrink-0 place-items-center bg-[var(--acid)] font-mono text-[9px] font-bold text-black">
                    {m.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                  <span className="truncate font-mono text-[11px] text-white">{m.fullName.split(" ")[0]}</span>
                  <span className="ml-auto shrink-0 text-[9px] text-[var(--acid)]">●</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Card
              className="panel-surface gap-0 rounded-none py-0"
              style={{ boxShadow: "inset 0 0 0 1px rgba(196, 255, 0, 0.42), 0 0 28px rgba(196, 255, 0, 0.16)" }}
            >
              <CardContent className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--warn)]"># current step / build</div>
                  <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-white">
                    {team.currentIdea ? (
                      <>Idea locked. API key released. <span className="text-[var(--acid)]">Ship something.</span></>
                    ) : (
                      <>Team formed. <span className="text-[var(--acid)]">Submit an idea to unlock your key.</span></>
                    )}
                  </h1>
                  <p className="mt-2 text-sm text-[var(--text-dim)]">
                    Add your GitHub repo before 17:00 to keep the +{earlyPts} early-submit bonus in play.
                  </p>
                </div>
                <div className="min-w-48 text-left md:text-right">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-mute)]">event points</div>
                  <div className="text-5xl font-bold tracking-[-0.05em] text-[var(--acid)]">{eventPoints}</div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
              <Card className="panel-surface gap-0 rounded-none py-0">
                <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">{"// "}idea</CardTitle>
                    <Button asChild variant="ghost" size="sm" className="rounded-none font-mono text-xs uppercase tracking-[0.12em]">
                      <Link href={`/teams/${team.slug}/idea`}>{team.currentIdea ? "edit" : "submit"}</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  {team.currentIdea ? (
                    <>
                      <div className="text-xl font-bold text-white">{team.currentIdea.title}</div>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-dim)]">{team.currentIdea.summary}</p>
                      {team.currentIdea.stackSummary && (
                        <div className="mt-3 text-xs text-[var(--text-mute)]">Stack: {team.currentIdea.stackSummary}</div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-[var(--text-mute)]">No idea submitted yet. Submit one to unlock your API key.</p>
                  )}
                </CardContent>
              </Card>

              <Card
                className="panel-surface gap-0 rounded-none py-0"
                style={team.apiKey?.value ? { boxShadow: "inset 0 0 0 1px rgba(196, 255, 0, 0.42), 0 0 28px rgba(196, 255, 0, 0.16)" } : undefined}
              >
                <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">{"// "}api key</CardTitle>
                    <span className={`text-xs ${team.apiKey?.value ? "text-[var(--acid)]" : "text-[var(--text-mute)]"}`}>
                      {team.apiKey?.value ? "live" : team.apiKey ? "locked" : "not assigned"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  {team.apiKey?.value ? (
                    <>
                      <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-mute)]">
                        {team.apiKey.provider} / {team.apiKey.label}
                      </div>
                      <div className="mt-3 flex items-center justify-between border border-[var(--acid)]/40 bg-black p-3 font-mono text-xs text-[var(--acid)]">
                        <span>{team.apiKey.value}</span>
                        <Copy className="size-4" />
                      </div>
                      <p className="mt-3 text-xs leading-5 text-[var(--text-dim)]">
                        Budget capped for event use. Do not paste in public repos.
                      </p>
                    </>
                  ) : team.apiKey ? (
                    <div className="space-y-2">
                      <KeyRound className="size-8 text-[var(--text-mute)]" />
                      <p className="text-sm text-[var(--text-dim)]">Key assigned but not yet visible. Submit an idea and wait for the release window.</p>
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--text-mute)]">No API key assigned to this team yet. An admin will assign one.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Link href={`/teams/${team.slug}/submit`} className="block border border-[var(--line)] bg-[var(--panel-2)] p-4 transition hover:border-[var(--acid)]/60">
                <GitBranch className="mb-4 text-[var(--acid)]" />
                <div className="font-bold text-white">Submission</div>
                <div className="mt-1 text-xs text-[var(--text-dim)]">
                  {team.submission ? `Status: ${team.submission.status.toLowerCase()}` : "Not started"}
                </div>
              </Link>
              <Link href="/leaderboard" className="block border border-[var(--line)] bg-[var(--panel-2)] p-4 transition hover:border-[var(--acid)]/60">
                <MonitorPlay className="mb-4 text-[var(--acid)]" />
                <div className="font-bold text-white">Leaderboard</div>
                <div className="mt-1 text-xs text-[var(--text-dim)]">Live scoreboard</div>
              </Link>
              <Link href="/gallery" className="block border border-[var(--line)] bg-[var(--panel-2)] p-4 transition hover:border-[var(--acid)]/60">
                <Upload className="mb-4 text-[var(--acid)]" />
                <div className="font-bold text-white">Gallery</div>
                <div className="mt-1 text-xs text-[var(--text-dim)]">All team submissions</div>
              </Link>
            </div>

            {team.pointBreakdown.length > 0 && (
              <Card className="panel-surface gap-0 rounded-none py-0">
                <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
                  <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">{"// "}event points breakdown</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  {team.pointBreakdown.map((award) => {
                    const pts = award.criterion?.pointsValue ?? award.points
                    return (
                      <div key={award.id} className="flex justify-between border-b border-[var(--line)] py-2 last:border-0">
                        <span className="text-xs text-[var(--text-dim)]">{award.reason}</span>
                        <span className="font-bold text-[var(--acid)]">+{pts}</span>
                      </div>
                    )
                  })}
                  <div className="mt-3 flex justify-between border-t border-[var(--line)] pt-3">
                    <span className="text-xs uppercase text-[var(--text-dim)]">total</span>
                    <span className="text-2xl font-bold text-[var(--acid)]">{eventPoints} pts</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </ParticipantStage>
    </ParticipantAppShell>
  )
}
