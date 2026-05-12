import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { getJudgeWorkspace, getTeamWorkspace } from "@/lib/data"
import { db } from "@/lib/db"
import { getSession } from "@/lib/session"
import { JudgeScoringPanel } from "@/components/judge/judge-scoring-panel"
import { JudgeAppShell, JudgeStage, type JudgeQueueTeam } from "@/components/shell/judge-app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

function formatJudgeBadge(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "JUDGE"
  if (parts.length === 1) return parts[0]!.toUpperCase()
  const first = parts[0]!
  const last = parts[parts.length - 1]!
  return `${first.toUpperCase()} ${last[0]!.toUpperCase()}.`
}

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
  const initialScores = Object.fromEntries(scoreMap) as Record<string, number>
  const initialNote = existingScores.map((s) => s.note?.trim()).find(Boolean) ?? ""

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

  const idx = judgeTeams.findIndex((t) => t.slug === slug)
  const pos = idx >= 0 ? idx + 1 : 0

  const dept = team.members.map((m) => m.primaryAssignment ?? "—").join(" x ")

  const judgeCriteria = criteria.map((c) => ({
    id: c.id,
    label: c.label,
    description: c.description,
    maxScore: c.maxScore ?? 10,
  }))

  const teamEventPts = team.pointBreakdown.reduce((s, a) => s + a.points, 0)

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

        <JudgeScoringPanel
          teamSlug={team.slug}
          criteria={judgeCriteria}
          initialScores={initialScores}
          initialNote={initialNote}
          teamEventPts={teamEventPts}
          judgeDisplay={formatJudgeBadge(session.fullName)}
        >
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
        </JudgeScoringPanel>
      </JudgeStage>
    </JudgeAppShell>
  )
}
