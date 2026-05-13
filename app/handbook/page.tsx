import { readFile } from "fs/promises"
import path from "node:path"

import { BuildCountdown } from "@/components/shell/build-countdown"
import { ParticipantAppShell, ParticipantStage } from "@/components/shell/participant-app-shell"
import { loadParticipantNavContext } from "@/lib/participant-nav-context"

export const dynamic = "force-dynamic"

export default async function HandbookPage() {
  const nav = await loadParticipantNavContext()
  const filePath = path.join(process.cwd(), "docs", "hackathon-builder-handbook.md")
  let body = ""
  try {
    body = await readFile(filePath, "utf8")
  } catch {
    body = "Handbook file not found in docs/hackathon-builder-handbook.md"
  }

  const session = nav.session

  return (
    <ParticipantAppShell
      browserTitle="handbook"
      urlDisplay="techday.altir.internal/handbook"
      browserRight={<span className="text-[var(--acid)]">reference</span>}
      activeNav="handbook"
      workspaceHref={nav.workspaceHref}
      ideaHref={nav.ideaHref}
      submitHref={nav.submitHref}
      countdownSlot={<BuildCountdown />}
      teamSlug={nav.teamSlug}
      teamName={nav.teamName}
      userEmail={session?.email ?? null}
      userName={session?.fullName ?? null}
      hasTeam={nav.hasTeam}
    >
      <ParticipantStage wide>
        <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[var(--warn)]"># /handbook · builder notes</div>
        <h1 className="text-4xl font-bold tracking-[-0.04em] text-white md:text-5xl">Tech Day handbook.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-dim)]">
          Same content as the repo doc — optimized for quick reads between builds.
        </p>
        <div className="mt-8 border border-[var(--line)] bg-[var(--panel)] p-6">
          <pre className="m-0 max-h-[min(70vh,900px)] overflow-auto whitespace-pre-wrap font-mono text-[12px] leading-6 text-[var(--text-dim)] terminal-scrollbar">
            {body}
          </pre>
        </div>
      </ParticipantStage>
    </ParticipantAppShell>
  )
}
