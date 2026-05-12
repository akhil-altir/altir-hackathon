import { Trophy } from "lucide-react"

import { listLeaderboard } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function ResultsPage() {
  const teams = await listLeaderboard()
  const winners = teams.slice(0, 3)
  const podiumOrder = winners.length >= 3 ? [winners[1], winners[0], winners[2]] : winners

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
            <span className="ml-3 uppercase tracking-[0.28em] text-[var(--text-mute)]">results</span>
          </div>
          <span className="text-[var(--acid)]">final</span>
        </div>

        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 lg:px-8">
          <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[var(--acid)]">
            final standings
          </div>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">Final standings.</h1>

          {podiumOrder.length >= 3 && (
            <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.8fr_1fr] lg:items-end">
              {podiumOrder.map((team, index) => {
                const place = index === 1 ? 1 : index === 0 ? 2 : 3
                return (
                  <Card key={team.teamId} className={`panel-surface gap-0 rounded-none py-0 ${place === 1 ? "panel-highlight" : ""}`}>
                    <CardContent className={`p-6 text-center ${place === 1 ? "min-h-96" : "min-h-72"}`}>
                      <div className="text-5xl font-bold text-[var(--text-faint)]">#{place}</div>
                      <Trophy className={`mx-auto mt-5 ${place === 1 ? "size-14 text-[var(--acid)]" : "size-10 text-[var(--text-dim)]"}`} />
                      <div className="mt-6 text-3xl font-bold tracking-[0.12em] text-white">{team.teamName}</div>
                      <p className="mt-3 text-sm leading-6 text-[var(--text-dim)]">{team.idea?.title ?? ""}</p>
                      <div className="mt-6 text-5xl font-bold text-[var(--acid)]">{team.finalScore.toFixed(1)}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          <Card className="mt-5 panel-surface gap-0 rounded-none py-0">
            <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
              <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">
                {"// full final table"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {teams.map((team, index) => (
                <div key={team.teamId} className="grid grid-cols-[50px_1fr_auto] border-b border-[var(--line)] p-4 last:border-0">
                  <span className="text-[var(--text-mute)]">#{index + 1}</span>
                  <div>
                    <span className="font-bold text-white">{team.teamName}</span>
                    <span className="ml-3 text-xs text-[var(--text-dim)]">
                      event {team.eventPoints} · judge {team.judgeAverage.toFixed(1)}
                    </span>
                  </div>
                  <span className="font-bold text-[var(--acid)]">{team.finalScore.toFixed(1)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
