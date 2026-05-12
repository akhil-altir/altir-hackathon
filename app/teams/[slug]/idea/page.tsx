import { notFound } from "next/navigation"
import Link from "next/link"

import { submitIdeaAction } from "./actions"
import { getTeamWorkspace } from "@/lib/data"
import { getSession } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function IdeaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await getSession()
  const team = await getTeamWorkspace(slug)
  if (!team) notFound()

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
            <span className="ml-3 uppercase tracking-[0.28em] text-[var(--text-mute)]">idea submission</span>
          </div>
          <div className="min-w-20 text-right">{session?.fullName ?? ""}</div>
        </div>

        <div className="mx-auto w-full max-w-4xl px-4 py-8 lg:px-8">
          <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[var(--acid)]">
            step 02 / idea / team {team.name}
          </div>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-white md:text-5xl">
            {team.currentIdea ? "Update your idea." : "Submit your idea."}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-dim)]">
            Describe what your team will build. You can update this later, but submitting an idea is required to unlock
            your API key.
          </p>

          <Card className="mt-8 panel-surface gap-0 rounded-none py-0"
            style={{ boxShadow: "inset 0 0 0 1px rgba(196, 255, 0, 0.42), 0 0 28px rgba(196, 255, 0, 0.16)" }}>
            <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
              <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">{"// "}idea details</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <form action={submitIdeaAction} className="space-y-4">
                <input type="hidden" name="teamSlug" value={team.slug} />

                <label className="block">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">title</span>
                  <input
                    name="title"
                    required
                    defaultValue={team.currentIdea?.title ?? ""}
                    placeholder="e.g. AI Slide Composer"
                    className="h-11 w-full rounded-none border border-[var(--line)] bg-black px-4 font-mono text-sm text-white outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">summary</span>
                  <textarea
                    name="summary"
                    required
                    rows={4}
                    defaultValue={team.currentIdea?.summary ?? ""}
                    placeholder="Describe what it does, who it helps, and why it matters..."
                    className="w-full rounded-none border border-[var(--line)] bg-black px-4 py-3 font-mono text-sm text-white outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">tech stack (optional)</span>
                  <input
                    name="stackSummary"
                    defaultValue={team.currentIdea?.stackSummary ?? ""}
                    placeholder="e.g. Next.js, OpenAI, Prisma, Tailwind"
                    className="h-11 w-full rounded-none border border-[var(--line)] bg-black px-4 font-mono text-sm text-white outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
                  />
                </label>

                <input type="hidden" name="sourceType" value="CUSTOM" />

                <div className="flex gap-3">
                  <Button type="submit" className="rounded-none font-mono uppercase tracking-[0.12em]">
                    {team.currentIdea ? "Update idea" : "Submit idea"}
                  </Button>
                  <Button asChild variant="outline" className="rounded-none font-mono uppercase tracking-[0.12em]">
                    <Link href={`/teams/${team.slug}`}>Back to workspace</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
