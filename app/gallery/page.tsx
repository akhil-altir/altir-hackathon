import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { ParticipantAppShell, ParticipantStage } from "@/components/shell/participant-app-shell"
import { listLeaderboard } from "@/lib/data"
import { loadParticipantNavContext } from "@/lib/participant-nav-context"
import { teamHueFromSlug } from "@/lib/team-visual"

export const dynamic = "force-dynamic"

type Search = { q?: string; dept?: string; sort?: string }

function deptLabel(team: { members: Array<{ primaryAssignment: string | null }> }) {
  const a = team.members[0]?.primaryAssignment
  const b = team.members[1]?.primaryAssignment
  if (a && b && a !== b) return `${a} x ${b}`
  return a ?? b ?? "MIXED"
}

export default async function GalleryPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams
  const q = (sp.q ?? "").trim().toLowerCase()
  const dept = (sp.dept ?? "all").toLowerCase()
  const sort = sp.sort ?? "newest"

  const teams = await listLeaderboard()
  const nav = await loadParticipantNavContext()
  const session = nav.session

  let rows = teams.map((t) => ({
    ...t,
    hue: teamHueFromSlug(t.slug),
    dept: deptLabel(t),
  }))

  if (q) {
    rows = rows.filter(
      (t) =>
        t.teamName.toLowerCase().includes(q) ||
        (t.idea?.title ?? "").toLowerCase().includes(q) ||
        (t.idea?.stackSummary ?? "").toLowerCase().includes(q) ||
        t.members.some((m) => m.fullName.toLowerCase().includes(q)),
    )
  }

  if (dept !== "all") {
    rows = rows.filter((t) => t.dept.toLowerCase().includes(dept))
  }

  if (sort === "score") {
    rows = [...rows].sort((a, b) => b.finalScore - a.finalScore)
  }

  const submitted = teams.filter((t) => t.submissionStatus === "READY_FOR_JUDGING" || t.submissionStatus === "SUBMITTED").length

  return (
    <ParticipantAppShell
      browserTitle="public submission gallery"
      urlDisplay="techday.altir.internal/gallery"
      browserRight={
        <span className="font-mono text-[10px] text-[var(--acid)]">
          {submitted} / {teams.length} submitted
        </span>
      }
      activeNav="gallery"
      workspaceHref={nav.workspaceHref}
      ideaHref={nav.ideaHref}
      submitHref={nav.submitHref}
      phase="GALLERY LIVE"
      countdown="00:11:20"
      teamSlug={nav.teamSlug}
      teamName={nav.teamName}
      userEmail={session?.email ?? null}
      userName={session?.fullName ?? null}
      hasTeam={nav.hasTeam}
    >
      <ParticipantStage wide>
        <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--acid)]"># /gallery · published floor</div>
            <h1 className="mt-2 text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">
              {teams.length} teams. Shipped builds on display.
            </h1>
          </div>
          <form className="flex w-full max-w-xl flex-wrap items-center gap-2 md:justify-end" method="get">
            <input
              name="q"
              defaultValue={sp.q}
              placeholder="search teams, stack, ideas"
              className="min-w-[160px] flex-1 rounded-none border border-[var(--line)] bg-black px-3 py-2 font-mono text-[11px] text-white outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
            />
            <select
              name="dept"
              defaultValue={sp.dept ?? "all"}
              className="rounded-none border border-[var(--line)] bg-[var(--panel-2)] px-2 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]"
            >
              <option value="all">dept — all</option>
              <option value="eng">eng</option>
              <option value="ops">ops</option>
              <option value="biz">biz</option>
              <option value="design">design</option>
            </select>
            <select
              name="sort"
              defaultValue={sp.sort ?? "newest"}
              className="rounded-none border border-[var(--acid)]/50 bg-[var(--acid)]/15 px-2 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--acid)]"
            >
              <option value="newest">sort: newest</option>
              <option value="score">sort: score</option>
            </select>
            <button
              type="submit"
              className="rounded-none border border-[var(--line)] bg-[var(--panel-3)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white hover:border-[var(--acid)]"
            >
              apply
            </button>
          </form>
        </div>

        <p className="mt-2 max-w-3xl text-sm text-[var(--text-dim)]">
          API keys, audit notes, and judge drafts stay private. Public viewers see this same gallery.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((team) => (
            <article
              key={team.teamId}
              className="gallery-card-accent flex flex-col p-5"
              style={{ borderTopColor: team.hue }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="size-3 shrink-0 shadow-[0_0_12px_currentColor]" style={{ backgroundColor: team.hue }} />
                  <span className="truncate font-mono text-sm font-bold uppercase tracking-[0.12em] text-white">{team.teamName}</span>
                </div>
                <span className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-[var(--text-mute)]">{team.dept}</span>
              </div>
              <h2 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-white">{team.idea?.title ?? "Idea pending"}</h2>
              {team.idea?.stackSummary ? (
                <div className="mt-3 flex flex-wrap gap-1">
                  {team.idea.stackSummary.split(",").map((tag) => (
                    <span
                      key={tag}
                      className="border border-[var(--line-2)] bg-black/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--text-dim)]"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--line)] pt-4">
                {team.submission?.repoUrl ? (
                  <a
                    href={team.submission.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 border border-[var(--line)] py-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-dim)] hover:border-[var(--acid)] hover:text-white"
                  >
                    repo <ArrowUpRight className="size-3" />
                  </a>
                ) : (
                  <span className="flex items-center justify-center border border-[var(--line)] py-2 font-mono text-[9px] uppercase text-[var(--text-faint)]">
                    repo
                  </span>
                )}
                {team.submission?.demoUrl ? (
                  <a
                    href={team.submission.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 border border-[var(--line)] py-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-dim)] hover:border-[var(--acid)] hover:text-white"
                  >
                    demo <ArrowUpRight className="size-3" />
                  </a>
                ) : (
                  <span className="flex items-center justify-center border border-[var(--line)] py-2 font-mono text-[9px] uppercase text-[var(--text-faint)]">
                    demo
                  </span>
                )}
                {team.submission?.presentationUrl ? (
                  <a
                    href={team.submission.presentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 border border-[var(--line)] py-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-dim)] hover:border-[var(--acid)] hover:text-white"
                  >
                    deck <ArrowUpRight className="size-3" />
                  </a>
                ) : (
                  <span className="flex items-center justify-center border border-[var(--line)] py-2 font-mono text-[9px] uppercase text-[var(--text-faint)]">
                    deck
                  </span>
                )}
              </div>
              <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.12em] text-[var(--text-mute)]">
                <span className="truncate">{team.members.map((m) => m.fullName).join(" · ")}</span>
                <span className="shrink-0 text-[var(--text-dim)]">live</span>
              </div>
            </article>
          ))}
        </div>

        {rows.length === 0 ? (
          <p className="mt-10 text-center text-sm text-[var(--text-mute)]">No teams match these filters.</p>
        ) : (
          <p className="mt-6 text-right text-[10px] uppercase tracking-[0.14em] text-[var(--text-mute)]">
            showing {rows.length} of {teams.length} — refine with search
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4 border-t border-[var(--line)] pt-6">
          <Link href="/leaderboard" className="text-[11px] uppercase tracking-[0.14em] text-[var(--acid)] hover:underline">
            Open live leaderboard
          </Link>
        </div>
      </ParticipantStage>
    </ParticipantAppShell>
  )
}
