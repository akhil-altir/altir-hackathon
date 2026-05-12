import Image from "next/image"

import { ParticipantAppShell, ParticipantStage } from "@/components/shell/participant-app-shell"
import { listLeaderboard, getTimelineAndAnnouncements } from "@/lib/data"
import { teamHueFromSlug } from "@/lib/team-visual"

export const dynamic = "force-dynamic"

export default async function TVPage() {
  const teams = await listLeaderboard()
  const { announcements } = await getTimelineAndAnnouncements()

  return (
    <ParticipantAppShell
      browserTitle="tv mode / office display"
      urlDisplay="techday.altir.internal/tv"
      showTopbar={false}
      workspaceHref="/leaderboard"
      ideaHref="/gallery"
      submitHref="/results"
      phase="LIVE"
      countdown="--:--:--"
      browserRight={<span className="text-[var(--acid)]">1920 × 1080</span>}
    >
      <ParticipantStage wide>
        <div className="grid min-h-[calc(100vh-80px)] gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="flex flex-col justify-between border border-[var(--line)] bg-black/60 p-8">
            <div className="flex items-center justify-between">
              <Image src="/logo.png" alt="Altir" width={64} height={64} />
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-mute)]">altir tech day</div>
                <div className="text-4xl font-bold text-[var(--acid)]">{teams.length} teams</div>
              </div>
            </div>
            <h1 className="mt-12 text-7xl font-bold leading-none tracking-[-0.06em] text-white xl:text-8xl">Altir Tech Day is live.</h1>
            <div className="mt-8 grid gap-3">
              {teams.slice(0, 6).map((team, index) => (
                <div key={team.teamId} className="grid grid-cols-[70px_1fr_auto] items-center border border-[var(--line)] bg-[var(--panel-2)] p-4">
                  <div className="text-4xl font-bold text-[var(--text-faint)]">{index + 1}</div>
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="size-3 shrink-0 shadow-[0_0_12px_currentColor]" style={{ backgroundColor: teamHueFromSlug(team.slug) }} />
                    <div className="min-w-0">
                      <div className="truncate text-2xl font-bold tracking-[0.1em] text-white">{team.teamName}</div>
                      <div className="truncate text-sm text-[var(--text-dim)]">{team.idea?.title ?? "Idea pending"}</div>
                    </div>
                  </div>
                  <div className="text-5xl font-bold text-[var(--acid)]">{team.finalScore.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </section>
          <aside className="space-y-5">
            <div className="border border-[var(--line)] bg-[var(--panel-2)] p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">teams</div>
              <div className="mt-2 text-3xl font-bold text-[var(--acid)]">{teams.length}</div>
            </div>
            <div className="border border-[var(--line)] bg-[var(--panel-2)] p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">submitted</div>
              <div className="mt-2 text-3xl font-bold text-white">
                {teams.filter((t) => ["SUBMITTED", "READY_FOR_JUDGING"].includes(t.submissionStatus)).length} / {teams.length}
              </div>
            </div>
            {announcements.slice(0, 3).map((a) => (
              <div key={a.id} className="border border-[var(--line)] bg-[var(--panel-2)] p-5">
                <div className="text-xs font-bold text-[var(--acid)]">{a.title}</div>
                <div className="mt-2 text-sm leading-6 text-[var(--text-dim)]">{a.message}</div>
              </div>
            ))}
          </aside>
        </div>
      </ParticipantStage>
    </ParticipantAppShell>
  )
}
