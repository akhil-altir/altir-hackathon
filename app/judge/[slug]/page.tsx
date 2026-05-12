import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { submitJudgeScoresAction } from "./actions"
import { getJudgeWorkspace, getTeamWorkspace } from "@/lib/data"
import { db } from "@/lib/db"
import { getSession } from "@/lib/session"
import { JudgeAppShell, JudgeStage, type JudgeQueueTeam } from "@/components/shell/judge-app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function JudgeTeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await getSession()
  if (!session) redirect("/login")
  if (!session.isJudge && !session.isAdmin) redirect("/login")

  const team = await getTeamWorkspace(slug)
  if (!team) notFound()

  const criteria = await db.scoreCriterion.findMany({
    where: { category: "JUDGE", isActive: true },
    orderBy: [{ sortOrder: "asc" }],
  })

  const existingScores = await db.judgeScore.findMany({
    where: { judgeId: session.userId, teamId: team.id },
  })
  const scoreMap = new Map(existingScores.map((s) => [s.criterionId, s.score]))

  const judgeTeams = await getJudgeWorkspace(session.userId)

  const queue: JudgeQueueTeam[] = judgeTeams.map((t) => {
    const scored = t.existingScores.length
    const total = t.criteria.length
    const complete = total > 0 && scored >= total
    return { slug: t.slug, name: t.name, complete, scored, total }
  })

  const submittedCount = queue.filter((q) => q.complete).length
  const draftsCount = queue.filter((q) => q.scored > 0 && !q.complete).length
  const remainingCount = queue.filter((q) => !q.complete).length

  const entered = criteria
    .map((c) => scoreMap.get(c.id))
    .filter((n): n is number => typeof n === "number" && !Number.isNaN(n))
  const avg =
    entered.length > 0 ? (entered.reduce((a, b) => a + b, 0) / entered.length).toFixed(1) : "—"

  const idx = judgeTeams.findIndex((t) => t.slug === slug)
  const pos = idx >= 0 ? idx + 1 : 0

  const dept = team.members.map((m) => m.primaryAssignment ?? "—").join(" x ")

  return (
    <JudgeAppShell
      browserTitle={`judge / ${team.name}`}
      urlDisplay={`techday.altir.internal/judge/${team.slug}`}
      signedInAs={session.email}
      queueCount={queue.length}
      draftsCount={draftsCount}
      submittedCount={submittedCount}
      remainingCount={remainingCount}
      activeSlug={team.slug}
      queue={queue}
    >
      <JudgeStage>
        <div className="mb-4 lg:hidden">
          <Link href="/judge" className="text-[11px] uppercase tracking-[0.14em] text-[var(--acid)] hover:underline">
            ← full queue
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            <Card
              className="panel-surface gap-0 rounded-none py-0"
              style={{ boxShadow: "inset 0 0 0 1px rgba(244,114,182,0.35)" }}
            >
              <CardHeader className="min-h-11 border-b border-pink-400/30 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-pink-200">
                    <span className="size-2 bg-pink-400" />
                    {team.name}
                  </CardTitle>
                  <span className="font-mono text-[10px] text-[var(--text-mute)]">
                    {pos} of {queue.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-mute)]">{dept}</div>
                <div className="text-xs text-[var(--text-dim)]">{team.members.map((m) => m.fullName).join(" · ")}</div>
                {team.currentIdea && (
                  <>
                    <h2 className="text-xl font-bold text-white">{team.currentIdea.title}</h2>
                    <p className="text-sm leading-6 text-[var(--text-dim)]">{team.currentIdea.summary}</p>
                  </>
                )}
                <div className="flex flex-wrap gap-3 text-[11px]">
                  {team.submission?.repoUrl && (
                    <a href={team.submission.repoUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--acid)] hover:underline">
                      GitHub repo →
                    </a>
                  )}
                  {team.submission?.demoUrl && (
                    <a href={team.submission.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--acid)] hover:underline">
                      Demo →
                    </a>
                  )}
                  {team.submission?.presentationUrl && (
                    <a href={team.submission.presentationUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--acid)] hover:underline">
                      Deck →
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 font-mono text-[10px] uppercase text-[var(--text-mute)]">
                  <Link href={idx > 0 ? `/judge/${judgeTeams[idx - 1]!.slug}` : "#"} className={idx > 0 ? "hover:text-white" : "pointer-events-none opacity-30"}>
                    ← prev
                  </Link>
                  <Link
                    href={idx >= 0 && idx < judgeTeams.length - 1 ? `/judge/${judgeTeams[idx + 1]!.slug}` : "#"}
                    className={idx >= 0 && idx < judgeTeams.length - 1 ? "hover:text-white" : "pointer-events-none opacity-30"}
                  >
                    next →
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="panel-surface panel-highlight gap-0 rounded-none py-0">
              <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">
                    {"// "}your scores · 0-{criteria[0]?.maxScore ?? 100} per criterion
                  </CardTitle>
                  <span className="text-[10px] uppercase text-[var(--text-mute)]">● draft · autosaved</span>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <form action={submitJudgeScoresAction} className="space-y-6">
                  <input type="hidden" name="teamSlug" value={team.slug} />

                  {criteria.map((criterion) => (
                    <div key={criterion.id}>
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-bold text-white">{criterion.label}</span>
                        <span className="text-xs text-[var(--text-mute)]">max {criterion.maxScore ?? 10}</span>
                      </div>
                      {criterion.description && <p className="mb-2 text-xs text-[var(--text-dim)]">{criterion.description}</p>}
                      <input
                        name={`score_${criterion.id}`}
                        type="number"
                        min={0}
                        max={criterion.maxScore ?? 10}
                        defaultValue={scoreMap.get(criterion.id) ?? ""}
                        placeholder={`0-${criterion.maxScore ?? 10}`}
                        className="h-11 w-full rounded-none border border-[var(--line)] bg-black px-4 font-mono text-sm text-white outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
                      />
                      <div className="mt-2 flex justify-between font-mono text-[10px] uppercase text-[var(--text-mute)]">
                        <span>0 weak</span>
                        <span>50 solid</span>
                        <span>{criterion.maxScore ?? 10} best</span>
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" className="rounded-none bg-[var(--acid)] font-mono text-black uppercase tracking-[0.12em] hover:bg-[var(--acid-2)]">
                      ▶ Submit final score
                    </Button>
                    <Button asChild variant="outline" className="rounded-none font-mono uppercase tracking-[0.12em]">
                      <Link href="/judge">Save draft / queue</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card className="panel-surface gap-0 rounded-none py-0">
              <CardContent className="p-6 text-center">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">composite (entered)</div>
                <div className="acid-text-shadow mt-2 text-5xl font-bold text-[var(--acid)]">{avg}</div>
                <p className="mt-2 text-[11px] text-[var(--text-dim)]">avg of {criteria.length} criteria · weight 1.0</p>
                <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-4 text-left text-[11px] text-[var(--text-dim)]">
                  <div>Team event pts: {team.pointBreakdown.reduce((s, a) => s + a.points, 0)}</div>
                  <div>Judge rows saved: {entered.length} / {criteria.length}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="panel-surface gap-0 rounded-none py-0">
              <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
                <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">rules</CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-[11px] leading-6 text-[var(--text-dim)]">
                <ul className="list-disc space-y-2 pl-4">
                  <li>Score every team you watch live.</li>
                  <li>Use the full range; tie-breakers lean on demo clarity.</li>
                  <li>Submit locks the row — use queue to revisit if allowed.</li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </JudgeStage>
    </JudgeAppShell>
  )
}
