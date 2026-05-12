import Link from "next/link"
import { Star } from "lucide-react"

import { listLeaderboard } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

const PALETTE = ["#c4ff00", "#ff7ac6", "#00d4ff", "#ffb020", "#9d6dff", "#00ff9d", "#ff5a3c", "#6ee7ff"]

export default async function LeaderboardPage() {
  const teams = await listLeaderboard()

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div className="grid-overlay absolute inset-0" />
      <div className="scanlines absolute inset-0" />
      <div className="relative z-10">
        <div className="flex h-11 items-center justify-between border-b border-[var(--line)] bg-black/90 px-4 text-[11px] text-[var(--text-dim)]">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-red-500" />
            <span className="size-2 rounded-full bg-amber-400" />
            <span className="size-2 rounded-full bg-[var(--acid)]" />
            <span className="ml-3 uppercase tracking-[0.28em] text-[var(--text-mute)]">live leaderboard</span>
          </div>
          <div className="flex gap-3">
            <Link href="/tv" className="text-[var(--acid)] hover:underline">TV mode</Link>
            <Link href="/results" className="text-[var(--text-dim)] hover:underline">Results</Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 lg:px-8">
          <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[var(--acid)]">
            live / {teams.length} teams
          </div>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">Live energy board.</h1>

          <Card className="mt-8 panel-surface gap-0 rounded-none py-0">
            <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
              <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">
                {"// leaderboard"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {teams.map((team, index) => (
                <div key={team.teamId} className="grid grid-cols-[52px_1fr_auto] items-center gap-4 border-b border-[var(--line)] p-4 last:border-0">
                  <div className="text-2xl font-bold text-[var(--text-faint)]">#{index + 1}</div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="size-3" style={{ backgroundColor: PALETTE[index % PALETTE.length] }} />
                      <span className="font-bold text-white">{team.teamName}</span>
                      {index < 3 && <Star className="size-4 text-[var(--acid)]" />}
                    </div>
                    <div className="mt-1 text-xs text-[var(--text-dim)]">
                      {team.idea?.title ?? "Idea pending"} · {team.members.map((m) => m.fullName).join(" / ")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[var(--acid)]">{team.finalScore.toFixed(1)}</div>
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
        </div>
      </div>
    </main>
  )
}
