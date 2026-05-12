import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { submitIdeaAction } from "./actions"
import { IdeaBankPicker } from "@/components/idea/idea-bank-picker"
import { ParticipantOnboardingStrip } from "@/components/team/participant-onboarding-strip"
import { ParticipantAppShell, ParticipantStage } from "@/components/shell/participant-app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTeamWorkspace } from "@/lib/data"
import { getTeamOnboardingState } from "@/lib/participant-onboarding"
import { listActiveIdeaBankEntries } from "@/lib/idea-bank"
import { loadParticipantNavContext } from "@/lib/participant-nav-context"
import { getSession } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function IdeaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await getSession()
  if (!session) redirect("/login")

  const team = await getTeamWorkspace(slug)
  if (!team) notFound()

  if (!team.members.some((m) => m.id === session.userId)) notFound()

  const onboarding = getTeamOnboardingState(team)
  const nav = await loadParticipantNavContext()
  const bankEntries = await listActiveIdeaBankEntries()

  const serializableBank = bankEntries.map((row) => ({
    id: row.id,
    title: row.title,
    problemStatement: row.problemStatement,
    description: row.description,
    expectedOutcome: row.expectedOutcome,
    stackHint: row.stackHint,
    category: row.category,
    sortOrder: row.sortOrder,
  }))

  const currentBankEntryId = team.currentIdea?.ideaBankEntryId ?? null

  return (
    <ParticipantAppShell
      lead={<ParticipantOnboardingStrip teamSlug={team.slug} state={onboarding} />}
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
          Browse the curated idea bank (search, filter, open any card for full detail) or write your own. Submitting an idea gates the API key path.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <Card className="panel-surface gap-0 rounded-none py-0">
              <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
                <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">
                  {"// "}idea bank
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <IdeaBankPicker teamSlug={team.slug} entries={serializableBank} currentBankEntryId={currentBankEntryId} />
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
                  <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
                    {team.currentIdea.sourceType === "BANK" ? "from idea bank" : "custom idea"}
                    {team.currentIdea.bankCategory ? ` · ${team.currentIdea.bankCategory}` : ""}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--text-dim)]">{team.currentIdea.summary}</p>
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
                    defaultValue={team.currentIdea?.sourceType === "CUSTOM" ? team.currentIdea.title : ""}
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
                    defaultValue={team.currentIdea?.sourceType === "CUSTOM" ? team.currentIdea.summary : ""}
                    placeholder="Describe what it does, who it helps, and why it matters..."
                    className="w-full rounded-none border border-[var(--line)] bg-black px-4 py-3 font-mono text-sm text-white outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">suggested stack (optional)</span>
                  <input
                    name="stackSummary"
                    defaultValue={team.currentIdea?.sourceType === "CUSTOM" ? (team.currentIdea.stackSummary ?? "") : ""}
                    placeholder="Next.js, OpenAI, Prisma, Tailwind"
                    className="h-11 w-full rounded-none border border-[var(--line)] bg-black px-4 font-mono text-sm text-white outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
                  />
                </label>

                <p className="text-[11px] text-[var(--text-mute)]">Submitting replaces your current idea and revalidates the workspace.</p>

                <Button
                  type="submit"
                  className="w-full rounded-none bg-[var(--acid)] font-mono text-black uppercase tracking-[0.12em] hover:bg-[var(--acid-2)]"
                >
                  ▶ Submit custom idea &amp; unlock key path
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
