import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, KeyRound } from "lucide-react"

import { getTeamWorkspace } from "@/lib/data"
import { getSession } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function KeyRevealPage({ params }: { params: Promise<{ slug: string }> }) {
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
            <span className="ml-3 uppercase tracking-[0.28em] text-[var(--text-mute)]">api key</span>
          </div>
          <div className="min-w-20 text-right">{session?.fullName ?? ""}</div>
        </div>

        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 lg:px-8">
          <div className="grid min-h-[70vh] place-items-center">
            <Card className="panel-surface max-w-4xl gap-0 rounded-none py-0"
              style={{ boxShadow: "inset 0 0 0 1px rgba(196, 255, 0, 0.42), 0 0 28px rgba(196, 255, 0, 0.16)" }}>
              <CardContent className="p-8 text-center md:p-14">
                <KeyRound className={`mx-auto size-14 ${team.apiKey?.value ? "text-[var(--acid)]" : "text-[var(--text-mute)]"}`} />

                {team.apiKey?.value ? (
                  <>
                    <div className="mt-6 text-[11px] uppercase tracking-[0.26em] text-[var(--acid)]">
                      # key revealed / {team.apiKey.provider}
                    </div>
                    <h1 className="mt-4 text-4xl font-bold leading-none tracking-[-0.05em] text-white md:text-6xl">
                      Your key is live. Go build.
                    </h1>
                    <div className="mx-auto mt-7 max-w-xl border border-[var(--acid)]/40 bg-black p-4 text-left font-mono text-sm text-[var(--acid)]">
                      {team.apiKey.value}
                    </div>
                    <p className="mt-4 text-xs text-[var(--text-dim)]">
                      Budget capped for event use. Do not paste in public repos.
                    </p>
                  </>
                ) : team.apiKey ? (
                  <>
                    <div className="mt-6 text-[11px] uppercase tracking-[0.26em] text-[var(--text-mute)]">
                      # key assigned / locked
                    </div>
                    <h1 className="mt-4 text-4xl font-bold leading-none tracking-[-0.05em] text-white md:text-5xl">
                      Key not yet visible.
                    </h1>
                    <p className="mx-auto mt-4 max-w-md text-sm text-[var(--text-dim)]">
                      {!team.currentIdea
                        ? "Submit an idea first, then wait for the release window."
                        : "Idea submitted. Waiting for the admin-configured release time."}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mt-6 text-[11px] uppercase tracking-[0.26em] text-[var(--text-mute)]">
                      # no key assigned
                    </div>
                    <h1 className="mt-4 text-4xl font-bold leading-none tracking-[-0.05em] text-white md:text-5xl">
                      No API key assigned yet.
                    </h1>
                    <p className="mx-auto mt-4 max-w-md text-sm text-[var(--text-dim)]">
                      An admin will assign a key to your team. Check back soon.
                    </p>
                  </>
                )}

                <Button asChild className="mt-7 rounded-none font-mono uppercase tracking-[0.12em]">
                  <Link href={`/teams/${team.slug}`}>Back to workspace <ArrowRight /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
