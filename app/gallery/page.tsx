import Link from "next/link"

import { listLeaderboard } from "@/lib/data"

export const dynamic = "force-dynamic"

const PALETTE = ["#c4ff00", "#ff7ac6", "#00d4ff", "#ffb020", "#9d6dff", "#00ff9d", "#ff5a3c", "#6ee7ff"]

export default async function GalleryPage() {
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
            <span className="ml-3 uppercase tracking-[0.28em] text-[var(--text-mute)]">gallery</span>
          </div>
          <Link href="/leaderboard" className="text-[var(--acid)] hover:underline">Leaderboard</Link>
        </div>

        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 lg:px-8">
          <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[var(--acid)]">
            submissions / {teams.length} teams
          </div>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">Submission gallery.</h1>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {teams.map((team, index) => (
              <div key={team.teamId} className="border border-[var(--line)] bg-[var(--panel-2)] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="size-4" style={{ backgroundColor: PALETTE[index % PALETTE.length], boxShadow: `0 0 16px ${PALETTE[index % PALETTE.length]}` }} />
                    <span className="font-bold tracking-[0.12em] text-white">{team.teamName}</span>
                  </div>
                  <span className={`inline-flex rounded-sm border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
                    team.submissionStatus === "READY_FOR_JUDGING" || team.submissionStatus === "SUBMITTED"
                      ? "border-[var(--acid)]/40 bg-[var(--acid)]/10 text-[var(--acid)]"
                      : "border-[var(--line-2)] bg-white/5 text-[var(--text-dim)]"
                  }`}>
                    {team.submissionStatus.toLowerCase().replace(/_/g, " ")}
                  </span>
                </div>
                {team.idea && (
                  <div className="mt-4 text-lg font-bold text-white">{team.idea.title}</div>
                )}
                <div className="mt-2 text-xs text-[var(--text-dim)]">
                  {team.members.map((m) => m.fullName).join(" / ")}
                </div>
                {team.idea?.stackSummary && (
                  <div className="mt-3 text-xs text-[var(--text-mute)]">{team.idea.stackSummary}</div>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)]">score</span>
                  <span className="text-2xl font-bold text-[var(--acid)]">{team.finalScore.toFixed(1)}</span>
                </div>
              </div>
            ))}
            {teams.length === 0 && (
              <div className="col-span-full p-8 text-center text-sm text-[var(--text-mute)]">No teams yet.</div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
