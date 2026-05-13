import Link from "next/link"

import { logoutAction } from "@/app/login/actions"
import { cn } from "@/lib/utils"

export type JudgeQueueTeam = {
  slug: string
  name: string
  complete: boolean
  scored: number
  total: number
}

type JudgeAppShellProps = {
  children: React.ReactNode
  browserTitle: string
  urlDisplay: string
  signedInAs: string
  queueCount: number
  draftsCount: number
  submittedCount: number
  remainingCount: number
  activeSlug?: string
  queue: JudgeQueueTeam[]
}

function BrowserStrip({ title, urlDisplay }: { title: string; urlDisplay: string }) {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-[var(--line)] bg-black/90 px-4 text-[11px] text-[var(--text-dim)]">
      <div className="flex min-w-0 items-center gap-2">
        <span className="size-2 shrink-0 rounded-full bg-red-500" />
        <span className="size-2 shrink-0 rounded-full bg-amber-400" />
        <span className="size-2 shrink-0 rounded-full bg-pink-400" />
        <span className="ml-3 truncate uppercase tracking-[0.28em] text-[var(--text-mute)]">{title}</span>
      </div>
      <div className="hidden max-w-[55%] truncate border border-[var(--line)] bg-[var(--panel)] px-4 py-1 font-mono md:block">
        https://{urlDisplay}
      </div>
      <div className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-[var(--text-mute)]">conn ok</div>
    </div>
  )
}

export function JudgeAppShell({
  children,
  browserTitle,
  urlDisplay,
  signedInAs,
  queueCount,
  draftsCount,
  submittedCount,
  remainingCount,
  activeSlug,
  queue,
}: JudgeAppShellProps) {
  const local = signedInAs.includes("@") ? signedInAs.split("@")[0] : signedInAs

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div className="grid-overlay pointer-events-none absolute inset-0" />
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <BrowserStrip title={browserTitle} urlDisplay={urlDisplay} />
        <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-black/90 backdrop-blur">
          <div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-8">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center bg-[#ff7ac6] text-xs font-bold text-black" style={{ boxShadow: '0 0 14px rgba(255,122,198,0.45)' }}>J</span>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                Judge console <span className="text-[var(--text-mute)]">{"//"}</span>{" "}
                <span className="text-[var(--text-dim)]">signed in as {local}</span>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-dim)]">
              <Link href="/judge" className="hover:text-white">
                Queue · {queueCount}
              </Link>
              <span className="text-[var(--line-2)]">|</span>
              <span>Drafts · {draftsCount}</span>
              <span className="text-[var(--line-2)]">|</span>
              <span>Submitted · {submittedCount}</span>
              <span className="text-[var(--line-2)]">|</span>
              <Link href="/handbook" className="hover:text-white">
                Help
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <div className="border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200">
                {remainingCount} of {queueCount} teams left
              </div>
              <form action={logoutAction}>
                <button type="submit" className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-mute)] hover:text-white">
                  logout
                </button>
              </form>
            </div>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-[1680px] flex-1 gap-0 border-x border-[var(--line)] bg-[var(--bg)] lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden border-r border-[var(--line)] bg-[var(--panel)] lg:block">
            <div className="border-b border-[var(--line)] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-mute)]">
              Queue · {queueCount} teams
            </div>
            <div className="max-h-[calc(100vh-8rem)] overflow-y-auto terminal-scrollbar">
              {queue.map((t) => {
                const active = t.slug === activeSlug
                return (
                  <Link
                    key={t.slug}
                    href={`/judge/${t.slug}`}
                    className={cn(
                      "flex items-center justify-between gap-2 border-b border-[var(--line)] px-3 py-3 text-left text-[11px] transition",
                      active ? "bg-[rgba(157,109,255,0.15)] text-white" : "text-[var(--text-dim)] hover:bg-white/5",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className={cn(
                          "size-2 shrink-0",
                          t.complete ? "bg-[var(--acid)]" : t.scored > 0 ? "bg-[var(--warn)]" : "border border-[var(--line-3)] bg-transparent",
                        )}
                      />
                      <span className="truncate font-bold uppercase tracking-[0.1em]">{t.name}</span>
                    </span>
                    <span className="shrink-0 text-[10px] text-[var(--text-mute)]">{t.complete ? "✓" : "○"}</span>
                  </Link>
                )
              })}
            </div>
            <div className="border-t border-[var(--line)] p-3 text-[10px] uppercase tracking-[0.14em] text-[var(--text-mute)]">
              <div className="flex justify-between">
                <span>Submitted</span>
                <span className="text-[var(--acid)]">{submittedCount}</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span>Drafts</span>
                <span>{draftsCount}</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span>Remaining</span>
                <span>{remainingCount}</span>
              </div>
            </div>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </main>
  )
}

export function JudgeStage({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-6 lg:px-8">{children}</div>
}
