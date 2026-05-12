import Link from "next/link"
import { notFound } from "next/navigation"

import { submitIdeaAction } from "./actions"
import { getTeamWorkspace } from "@/lib/data"
import { loadParticipantNavContext } from "@/lib/participant-nav-context"
import { getSession } from "@/lib/session"
import { ParticipantAppShell, ParticipantStage } from "@/components/shell/participant-app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

const PLACEHOLDER_IDEAS = [
  { dept: "Design", title: "Slide composer from raw meeting transcripts", hint: "~3h · Next.js + Whisper" },
  { dept: "Ops", title: "Customer onboarding checklist generator", hint: "~3h · Python + OpenAI" },
  { dept: "Eng", title: "Internal docs answer bot", hint: "~3h · Next.js + pgvector" },
  { dept: "Biz", title: "Deal desk objection simulator", hint: "~2h · OpenAI API" },
]

export default async function IdeaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await getSession()
  const team = await getTeamWorkspace(slug)
  if (!team) notFound()
  const nav = await loadParticipantNavContext()

  return (
    <ParticipantAppShell
      browserTitle="idea bank + custom"
      urlDisplay={`techday.altir.internal/teams/${team.slug}/idea`}
      browserRight={<span className="text-[var(--acid)]">conn ok</span>}
      activeNav="idea"
      workspaceHref={nav.workspaceHref}
      ideaHref={nav.ideaHref}
      submitHref={nav.submitHref}
      phase="KEY UNLOCKS IN"
      countdown="01:21:10"
      teamSlug={team.slug}
      teamName={team.name}
      userEmail={session?.email ?? null}
      userName={session?.fullName ?? null}
      hasTeam={nav.hasTeam}
    >
      <ParticipantStage wide>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--warn)]"># step 02 / pick or submit</div>
          <span className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--acid)]/35 bg-[var(--acid)]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
            <span className="size-1.5 rounded-full bg-[var(--acid)]" />
            idea required for key
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-[-0.04em] text-white md:text-5xl">What are you building?</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-dim)]">
          Browse the bank (admin-seeded ideas ship here later) or write your own. Submitting an idea gates the API key path.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {["ALL", "OPS", "BIZ", "DESIGN", "ENG"].map((tag, i) => (
                <span
                  key={tag}
                  className={`rounded-sm border px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] ${
                    i === 0 ? "border-[var(--warn)]/50 bg-[var(--warn)]/15 text-[var(--warn)]" : "border-[var(--line)] text-[var(--text-mute)]"
                  }`}
                >
                  {tag}
                  {i === 0 ? " · 18" : ""}
                </span>
              ))}
              <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-mute)] sm:inline">
                sort: hottest
              </span>
            </div>

            <Card className="panel-surface gap-0 rounded-none py-0">
              <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
                <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">{"// "}idea bank (preview)</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 p-4 md:grid-cols-2">
                {PLACEHOLDER_IDEAS.map((row, index) => (
                  <div
                    key={row.title}
                    className={`border p-4 text-left ${index === 0 ? "border-[var(--acid)]/50 bg-[var(--acid)]/10" : "border-[var(--line)] bg-[var(--panel-2)]"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-sm border border-[var(--line-2)] px-1.5 py-0.5 font-mono text-[9px] uppercase text-[var(--text-mute)]">
                        {row.dept}
                      </span>
                      <span className="flex gap-0.5">
                        {Array.from({ length: 8 }).map((_, d) => (
                          <span key={d} className="size-1 rounded-full bg-[var(--line-3)]" />
                        ))}
                      </span>
                    </div>
                    <div className="mt-3 font-bold leading-snug text-white">{row.title}</div>
                    <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-mute)]">{row.hint}</div>
                    {index === 0 ? (
                      <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">● selected +3 pts</div>
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="panel-surface panel-highlight gap-0 self-start rounded-none py-0">
            <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
              <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">{"// "}or write your own</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {team.currentIdea ? (
                <div className="mb-4 rounded border border-[var(--line)] bg-black/40 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">current selection</div>
                  <div className="mt-2 text-lg font-bold text-white">{team.currentIdea.title}</div>
                  <p className="mt-2 text-sm text-[var(--text-dim)]">{team.currentIdea.summary}</p>
                </div>
              ) : null}

              <form action={submitIdeaAction} className="space-y-4">
                <input type="hidden" name="teamSlug" value={team.slug} />
                <input type="hidden" name="sourceType" value="CUSTOM" />

                <label className="block">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">
                    title — short, what it does in 6 words
                  </span>
                  <input
                    name="title"
                    required
                    defaultValue={team.currentIdea?.title ?? ""}
                    placeholder="e.g. AI Slide Composer"
                    className="h-11 w-full rounded-none border border-[var(--line)] bg-black px-4 font-mono text-sm text-white outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">
                    description — problem, audience, ship in 3 hours
                  </span>
                  <textarea
                    name="summary"
                    required
                    rows={5}
                    defaultValue={team.currentIdea?.summary ?? ""}
                    placeholder="Describe what it does, who it helps, and why it matters..."
                    className="w-full rounded-none border border-[var(--line)] bg-black px-4 py-3 font-mono text-sm text-white outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">suggested stack (optional)</span>
                  <input
                    name="stackSummary"
                    defaultValue={team.currentIdea?.stackSummary ?? ""}
                    placeholder="Next.js, OpenAI, Prisma, Tailwind"
                    className="h-11 w-full rounded-none border border-[var(--line)] bg-black px-4 font-mono text-sm text-white outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
                  />
                </label>

                <p className="text-[11px] text-[var(--text-mute)]">custom idea = +5 pts on top of submission (when bank ships)</p>

                <Button
                  type="submit"
                  className="w-full rounded-none bg-[var(--acid)] font-mono text-black uppercase tracking-[0.12em] hover:bg-[var(--acid-2)]"
                >
                  ▶ Submit idea &amp; unlock key path
                </Button>
                <p className="text-center text-[10px] text-[var(--text-mute)]">you can change this later · first submission gates the key</p>

                <Button asChild variant="outline" className="w-full rounded-none font-mono uppercase tracking-[0.12em]">
                  <Link href={`/teams/${team.slug}`}>Back to workspace</Link>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </ParticipantStage>
    </ParticipantAppShell>
  )
}
