import Link from "next/link"
import { redirect } from "next/navigation"

import { getJudgeWorkspace } from "@/lib/data"
import { getSession } from "@/lib/session"
import { JudgeAppShell, JudgeStage, type JudgeQueueTeam } from "@/components/shell/judge-app-shell"

export const dynamic = "force-dynamic"

export default async function JudgeLandingPage() {
  const session = await getSession()
  if (!session) redirect("/login")
  if (!session.isJudge && !session.isAdmin) redirect("/login")

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

  return (
    <JudgeAppShell
      browserTitle="judge console"
      urlDisplay="techday.altir.internal/judge"
      signedInAs={session.email}
      queueCount={queue.length}
      draftsCount={draftsCount}
      submittedCount={submittedCount}
      remainingCount={remainingCount}
      queue={queue}
    >
      <JudgeStage>
        <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[var(--acid)]"># judging / demo queue</div>
        <h1 className="text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">Score each team.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--text-dim)]">
          Pick a team from the rail (desktop) or the cards below. Drafts save per criterion until you submit.
        </p>

        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {judgeTeams.map((t) => {
            const scored = t.existingScores.length
            const total = t.criteria.length
            const complete = total > 0 && scored >= total

            return (
              <Link
                key={t.id}
                href={`/judge/${t.slug}`}
                className={`block border p-4 transition hover:border-[var(--acid)]/60 ${
                  complete ? "border-[var(--acid)]/40 bg-[var(--acid)]/5" : "border-[var(--line)] bg-[var(--panel-2)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold tracking-[0.08em] text-white">{t.name}</span>
                  <span
                    className={`inline-flex rounded-sm border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
                      complete
                        ? "border-[var(--acid)]/40 bg-[var(--acid)]/10 text-[var(--acid)]"
                        : "border-[var(--line-2)] bg-white/5 text-[var(--text-dim)]"
                    }`}
                  >
                    {complete ? "scored" : `${scored}/${total}`}
                  </span>
                </div>
                {t.currentIdea && <p className="mt-2 text-sm text-[var(--text-dim)]">{t.currentIdea.title}</p>}
                <div className="mt-2 text-xs text-[var(--text-mute)]">{t.members.join(" · ")}</div>
              </Link>
            )
          })}
        </div>
      </JudgeStage>
    </JudgeAppShell>
  )
}
