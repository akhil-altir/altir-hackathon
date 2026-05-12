import Link from "next/link"
import { Star } from "lucide-react"

import { ParticipantAppShell, ParticipantStage } from "@/components/shell/participant-app-shell"
import { listLeaderboard } from "@/lib/data"
import { loadParticipantNavContext } from "@/lib/participant-nav-context"
import { teamHueFromSlug } from "@/lib/team-visual"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function LeaderboardPage() {
  const teams = await listLeaderboard()
  const nav = await loadParticipantNavContext()
  const session = nav.session

  return (
    <ParticipantAppShell
      browserTitle="live leaderboard"
      urlDisplay="techday.altir.internal/leaderboard"
      browserRight={
        <span className="flex gap-3">
          <Link href="/tv" className="text-[var(--acid)] hover:underline">
            TV
          </Link>
          <Link href="/results" className="hover:underline">
            Results
          </Link>
        </span>
      }
      activeNav="leaderboard"
      workspaceHref={nav.workspaceHref}
      ideaHref={nav.ideaHref}
      submitHref={nav.submitHref}
      phase="DEMOS SOON"
      countdown="00:47:03"
      teamSlug={nav.teamSlug}
      teamName={nav.teamName}
      userEmail={session?.email ?? null}
      userName={session?.fullName ?? null}
      hasTeam={nav.hasTeam}
    >
      <ParticipantStage wide>
        <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[var(--acid)]"># live / {teams.length} teams</div>
        <h1 className="text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">Live energy board.</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--text-dim)]">Blended score updates as judges file and event points land.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="panel-surface gap-0 rounded-none py-0">
            <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
              <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">{"// leaderboard"}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {teams.map((team, index) => (
                <div key={team.teamId} className="grid grid-cols-[52px_1fr_auto] items-center gap-4 border-b border-[var(--line)] p-4 last:border-0">
                  <div className="text-2xl font-bold text-[var(--text-faint)]">#{index + 1}</div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="size-3 shadow-[0_0_10px_currentColor]" style={{ backgroundColor: teamHueFromSlug(team.slug) }} />
                      <span className="font-bold text-white">{team.teamName}</span>
                      {index < 3 && <Star className="size-4 text-[var(--acid)]" />}
                    </div>
                    <div className="mt-1 text-xs text-[var(--text-dim)]">
                      {team.idea?.title ?? "Idea pending"} · {team.members.map((m) => m.fullName).join(" · ")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[var(--acid)]">
                      {Math.round(team.finalScore)}
                      <span className="text-lg font-normal text-[var(--text-mute)]">/1000</span>
                    </div>
                    <div className="text-xs text-[var(--text-mute)]">
                      event {team.eventPoints} · judge {team.judgeAverage.toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
              {teams.length === 0 && (
                <div className="p-8 text-center text-sm text-[var(--text-mute)]">No teams yet. Form a team to appear here.</div>
              )}
            </CardContent>
          </Card>

          <Card className="panel-surface gap-0 self-start rounded-none py-0">
            <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
              <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">{"// room feed"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {[
                "Final pushes landing in the submission window",
                "Judges syncing scores after each demo block",
                "TV mode mirroring this board for the floor",
              ].map((item, index) => (
                <div key={item} className="border border-[var(--line)] bg-black p-3">
                  <div className="text-[10px] uppercase text-[var(--text-mute)]">ops feed · {index + 1}</div>
                  <div className="mt-1 text-sm text-white">{item}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </ParticipantStage>
    </ParticipantAppShell>
  )
}
