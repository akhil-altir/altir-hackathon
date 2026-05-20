import Image from "next/image"

import { BuildCountdown } from "@/components/shell/build-countdown"
import { ParticipantAppShell, ParticipantStage } from "@/components/shell/participant-app-shell"
import { TvEventTimer } from "@/components/tv/tv-event-timer"
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
      countdownSlot={<BuildCountdown />}
      browserRight={<span className="text-[var(--acid)]">1920 × 1080</span>}
    >
      <ParticipantStage wide>
        <TvEventTimer />
        <div className="grid min-h-[calc(100vh-80px)] gap-4 lg:grid-cols-[1fr_200px]">
          <section className="flex flex-col justify-between border border-[var(--line)] bg-black/60 p-6">
            <div className="flex items-center justify-between">
              <Image src="/logo.png" alt="Altir" width={64} height={64} />
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-mute)]">altir tech day</div>
                <div className="text-4xl font-bold text-[var(--acid)]">{teams.length} teams</div>
              </div>
            </div>
            <h1 className="mt-12 text-7xl font-bold leading-none tracking-[-0.06em] text-white xl:text-8xl">Altir Tech Day is live.</h1>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {teams.map((team, index) => (
                <div key={team.teamId} className="flex flex-col gap-2 border border-[var(--line)] bg-[var(--panel-2)] p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[var(--text-faint)]">{index + 1}</span>
                    <span className="size-2.5 shrink-0 shadow-[0_0_10px_currentColor]" style={{ backgroundColor: teamHueFromSlug(team.slug) }} />
                    <span className="truncate text-lg font-bold tracking-[0.08em] text-white">{team.teamName}</span>
                  </div>
                  <div className="truncate text-xs text-[var(--text-dim)]">{team.idea?.title ?? "Idea pending"}</div>
                  <div className="text-3xl font-bold text-[var(--acid)]">
                    {Math.round(team.finalScore)}
                    <span className="text-base font-normal text-[var(--text-mute)]">/1000</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <aside className="space-y-3">
            <div className="border border-[var(--line)] bg-[var(--panel-2)] p-3">
              <div className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-mute)]">teams</div>
              <div className="mt-1 text-2xl font-bold text-[var(--acid)]">{teams.length}</div>
            </div>
            <div className="border border-[var(--line)] bg-[var(--panel-2)] p-3">
              <div className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-mute)]">submitted</div>
              <div className="mt-1 text-2xl font-bold text-white">
                {teams.filter((t) => ["SUBMITTED", "READY_FOR_JUDGING"].includes(t.submissionStatus)).length} / {teams.length}
              </div>
            </div>
            {announcements.slice(0, 3).map((a) => (
              <div key={a.id} className="border border-[var(--line)] bg-[var(--panel-2)] p-3">
                <div className="text-[10px] font-bold text-[var(--acid)]">{a.title}</div>
                <div className="mt-1 text-xs leading-5 text-[var(--text-dim)]">{a.message}</div>
              </div>
            ))}
          </aside>
        </div>
      </ParticipantStage>
    </ParticipantAppShell>
  )
}
