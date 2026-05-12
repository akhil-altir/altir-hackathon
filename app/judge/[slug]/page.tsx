import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { logoutAction } from "@/app/login/actions"
import { submitJudgeScoresAction } from "./actions"
import { getTeamWorkspace } from "@/lib/data"
import { db } from "@/lib/db"
import { getSession } from "@/lib/session"
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
            <span className="ml-3 uppercase tracking-[0.28em] text-[var(--text-mute)]">judge / {team.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{session.fullName}</span>
            <form action={logoutAction}>
              <button className="text-[var(--text-mute)] transition hover:text-white">logout</button>
            </form>
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8">
          <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[var(--acid)]">judging / score</div>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-white md:text-5xl">
            Score {team.name}.
          </h1>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.6fr_1fr]">
            {/* Team info */}
            <Card className="panel-surface gap-0 self-start rounded-none py-0">
              <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
                <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">{"// "}team details</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div>
                  <div className="text-xs text-[var(--text-mute)]">Members</div>
                  <div className="mt-1 text-sm text-white">{team.members.map((m) => m.fullName).join(" / ")}</div>
                </div>
                {team.currentIdea && (
                  <div>
                    <div className="text-xs text-[var(--text-mute)]">Idea</div>
                    <div className="mt-1 text-lg font-bold text-white">{team.currentIdea.title}</div>
                    <div className="mt-1 text-sm text-[var(--text-dim)]">{team.currentIdea.summary}</div>
                  </div>
                )}
                {team.submission && (
                  <div className="space-y-2">
                    {team.submission.repoUrl && (
                      <a href={team.submission.repoUrl} target="_blank" rel="noopener noreferrer"
                        className="block text-xs text-[var(--acid)] hover:underline">Repo →</a>
                    )}
                    {team.submission.demoUrl && (
                      <a href={team.submission.demoUrl} target="_blank" rel="noopener noreferrer"
                        className="block text-xs text-[var(--acid)] hover:underline">Demo →</a>
                    )}
                    {team.submission.presentationUrl && (
                      <a href={team.submission.presentationUrl} target="_blank" rel="noopener noreferrer"
                        className="block text-xs text-[var(--acid)] hover:underline">Presentation →</a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scoring form */}
            <Card className="panel-surface gap-0 rounded-none py-0"
              style={{ boxShadow: "inset 0 0 0 1px rgba(196, 255, 0, 0.42), 0 0 28px rgba(196, 255, 0, 0.16)" }}>
              <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
                <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">{"// "}scoring</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <form action={submitJudgeScoresAction} className="space-y-5">
                  <input type="hidden" name="teamSlug" value={team.slug} />

                  {criteria.map((criterion) => (
                    <div key={criterion.id}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{criterion.label}</span>
                        <span className="text-xs text-[var(--text-mute)]">max {criterion.maxScore ?? 10}</span>
                      </div>
                      {criterion.description && (
                        <p className="mb-2 text-xs text-[var(--text-dim)]">{criterion.description}</p>
                      )}
                      <input
                        name={`score_${criterion.id}`}
                        type="number"
                        min={0}
                        max={criterion.maxScore ?? 10}
                        defaultValue={scoreMap.get(criterion.id) ?? ""}
                        placeholder={`0-${criterion.maxScore ?? 10}`}
                        className="h-11 w-full rounded-none border border-[var(--line)] bg-black px-4 font-mono text-sm text-white outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
                      />
                    </div>
                  ))}

                  <div className="flex gap-3">
                    <Button type="submit" className="rounded-none font-mono uppercase tracking-[0.12em]">
                      Save scores
                    </Button>
                    <Button asChild variant="outline" className="rounded-none font-mono uppercase tracking-[0.12em]">
                      <Link href="/judge">Back to queue</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
