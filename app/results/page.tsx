import Link from "next/link"
import { Trophy } from "lucide-react"

import { BuildCountdown } from "@/components/shell/build-countdown"
import { ParticipantAppShell, ParticipantStage } from "@/components/shell/participant-app-shell"
import { listLeaderboard } from "@/lib/data"
import { loadParticipantNavContext } from "@/lib/participant-nav-context"
import { teamHueFromSlug } from "@/lib/team-visual"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function ResultsPage() {
  const teams = await listLeaderboard()
  const nav = await loadParticipantNavContext()
  const session = nav.session

  const winners = teams.slice(0, 3)
  const podiumOrder = winners.length >= 3 ? [winners[1], winners[0], winners[2]] : winners

  const judgesPick = [...teams].sort((a, b) => b.judgeAverage - a.judgeAverage)[0]
  const crossFunctional = [...teams].sort((a, b) => b.eventPoints - a.eventPoints)[0]

  return (
    <ParticipantAppShell
      browserTitle="final standings"
      urlDisplay="techday.altir.internal/results"
      browserRight={
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[var(--warn)]">
          <span className="size-1.5 rounded-full bg-[var(--acid)]" />
          published after demos
        </span>
      }
      activeNav="leaderboard"
      workspaceHref={nav.workspaceHref}
      ideaHref={nav.ideaHref}
      submitHref={nav.submitHref}
      countdownSlot={<BuildCountdown />}
      teamSlug={nav.teamSlug}
      teamName={nav.teamName}
      userEmail={session?.email ?? null}
      userName={session?.fullName ?? null}
      hasTeam={nav.hasTeam}
    >
      <ParticipantStage wide>
        <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[var(--warn)]"># tech day 2026 · final standings</div>
        <h1 className="max-w-4xl text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">
          That&apos;s a <span className="text-[var(--acid)]">wrap.</span>
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-dim)]">
          {teams.length} teams shipped. Scores below blend judge signal with event momentum — export for spreadsheets or
          share the gallery with the org.
        </p>

        {podiumOrder.length >= 3 && (
          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_0.85fr_1fr] lg:items-end">
            {podiumOrder.map((team, index) => {
              const place = index === 1 ? 1 : index === 0 ? 2 : 3
              const hue = teamHueFromSlug(team.slug)
              return (
                <Card
                  key={team.teamId}
                  className={`panel-surface gap-0 rounded-none py-0 ${place === 1 ? "panel-highlight" : ""}`}
                  style={place !== 1 ? { borderTopWidth: 3, borderTopColor: hue } : undefined}
                >
                  <CardContent className={`p-6 text-center ${place === 1 ? "min-h-96" : "min-h-72"}`}>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-mute)]">
                      {place === 1 ? "# first place · overall" : place === 2 ? "# second" : "# third"}
                    </div>
                    <div className="text-5xl font-bold text-[var(--text-faint)]">#{place}</div>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <span className="size-3" style={{ backgroundColor: hue, boxShadow: `0 0 12px ${hue}` }} />
                      <Trophy className={place === 1 ? "size-12 text-[var(--acid)]" : "size-9 text-[var(--text-dim)]"} />
                    </div>
                    <div className="mt-4 text-2xl font-bold uppercase tracking-[0.1em] text-white">{team.teamName}</div>
                    <p className="mt-2 text-sm text-[var(--text-dim)]">{team.idea?.title ?? ""}</p>
                    <div className="mt-6 text-5xl font-bold text-[var(--acid)]">
                    {Math.round(team.finalScore)}
                    <span className="text-2xl font-normal text-[var(--text-mute)]">/1000</span>
                  </div>
                    <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[var(--text-mute)]">blended</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Judges' choice", team: judgesPick, sub: `highest judge avg · ${judgesPick?.judgeAverage.toFixed(1) ?? "—"}`, color: "var(--acid)" },
            { label: "People's choice", team: teams[0], sub: "floor reactions (TV mode)", color: "#ff5a3c" },
            { label: "Fastest ship", team: teams[Math.min(teams.length - 1, 2)], sub: "first repo linked", color: "#ffb020" },
            { label: "Cross-functional cup", team: crossFunctional, sub: "highest event points", color: "#ff7ac6" },
          ].map((award) => (
            <div
              key={award.label}
              className="border border-[var(--line)] bg-[var(--panel-2)] p-4"
              style={{ borderTopWidth: 3, borderTopColor: award.color }}
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-mute)]">{award.label}</div>
              <div className="mt-2 font-mono text-lg font-bold text-white">{award.team?.teamName ?? "—"}</div>
              <div className="mt-1 text-[11px] text-[var(--text-dim)]">{award.sub}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(
              ["rank", "team", "final", "event", "judge"].join(",") +
                "\n" +
                teams
                  .map((t, i) => {
                    const name = `"${t.teamName.replace(/"/g, '""')}"`
                    return `${i + 1},${name},${t.finalScore},${t.eventPoints},${t.judgeAverage}`
                  })
                  .join("\n"),
            )}`}
            download="tech-day-standings.csv"
            className="inline-flex items-center justify-center rounded-none border border-[var(--acid)] bg-[var(--acid)] px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.12em] text-black hover:bg-[var(--acid-2)]"
          >
            ▶ Export full standings (CSV)
          </a>
          <Link href="/leaderboard" className="text-[11px] uppercase tracking-[0.14em] text-white hover:underline">
            View full leaderboard
          </Link>
          <Link href="/gallery" className="text-[11px] uppercase tracking-[0.14em] text-white hover:underline">
            Open gallery
          </Link>
        </div>

        <Card className="mt-10 panel-surface gap-0 rounded-none py-0">
          <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
            <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">{"// full final table"}</CardTitle>
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
                <span className="font-bold text-[var(--acid)]">
                {Math.round(team.finalScore)}/1000
              </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </ParticipantStage>
    </ParticipantAppShell>
  )
}
