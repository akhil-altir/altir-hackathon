import Link from "next/link"
import { redirect } from "next/navigation"

import { logoutAction } from "@/app/login/actions"
import { getJudgeWorkspace } from "@/lib/data"
import { getSession } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function JudgeLandingPage() {
  const session = await getSession()
  if (!session) redirect("/login")
  if (!session.isJudge && !session.isAdmin) redirect("/login")

  const teams = await getJudgeWorkspace(session.userId)

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
            <span className="ml-3 uppercase tracking-[0.28em] text-[var(--text-mute)]">judge console</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{session.fullName}</span>
            <form action={logoutAction}>
              <button className="text-[var(--text-mute)] transition hover:text-white">logout</button>
            </form>
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8">
          <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[var(--acid)]">judging / demo queue</div>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">Score each team.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--text-dim)]">
            Click a team to score them. You can save drafts and come back.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => {
              const scored = team.existingScores.length
              const total = team.criteria.length
              const complete = scored >= total

              return (
                <Link key={team.id} href={`/judge/${team.slug}`}
                  className={`block border p-4 transition hover:border-[var(--acid)]/60 ${complete ? "border-[var(--acid)]/40 bg-[var(--acid)]/5" : "border-[var(--line)] bg-[var(--panel-2)]"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold tracking-[0.08em] text-white">{team.name}</span>
                    <span className={`inline-flex rounded-sm border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
                      complete
                        ? "border-[var(--acid)]/40 bg-[var(--acid)]/10 text-[var(--acid)]"
                        : "border-[var(--line-2)] bg-white/5 text-[var(--text-dim)]"
                    }`}>
                      {complete ? "scored" : `${scored}/${total}`}
                    </span>
                  </div>
                  {team.currentIdea && (
                    <p className="mt-2 text-sm text-[var(--text-dim)]">{team.currentIdea.title}</p>
                  )}
                  <div className="mt-2 text-xs text-[var(--text-mute)]">
                    {team.members.join(" / ")}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
