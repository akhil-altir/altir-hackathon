import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"

import { logoutAction } from "@/app/login/actions"
import { teamHueFromSlug } from "@/lib/team-visual"
import { cn } from "@/lib/utils"

export type ParticipantNavKey = "workspace" | "idea" | "submit" | "gallery" | "leaderboard" | "handbook" | "none"

type ParticipantAppShellProps = {
  children: ReactNode
  browserTitle: string
  /** Shown in faux URL bar, e.g. techday.altir.internal/teams/foo */
  urlDisplay: string
  /** Right side of browser strip (e.g. conn ok, live) */
  browserRight?: React.ReactNode
  /** When false, only the browser strip is shown (login / marketing). */
  showTopbar?: boolean
  activeNav?: ParticipantNavKey
  workspaceHref: string
  ideaHref: string
  submitHref: string
  phase: string
  countdown: string
  teamSlug?: string | null
  teamName?: string | null
  userEmail?: string | null
  userName?: string | null
  /** When false, Idea and Submit nav entries are shown disabled (e.g. on /teams/new before a team exists). */
  hasTeam?: boolean
  /** Onboarding strip + resume banner (participant team routes). */
  lead?: ReactNode
}

function BrowserStrip({
  title,
  urlDisplay,
  right,
}: {
  title: string
  urlDisplay: string
  right?: React.ReactNode
}) {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-[var(--line)] bg-black/90 px-4 text-[11px] text-[var(--text-dim)]">
      <div className="flex min-w-0 items-center gap-2">
        <span className="size-2 shrink-0 rounded-full bg-red-500" />
        <span className="size-2 shrink-0 rounded-full bg-amber-400" />
        <span className="size-2 shrink-0 rounded-full bg-[var(--acid)]" />
        <span className="ml-3 truncate uppercase tracking-[0.28em] text-[var(--text-mute)]">{title}</span>
      </div>
      <div className="hidden min-w-0 max-w-[50%] truncate border border-[var(--line)] bg-[var(--panel)] px-4 py-1 text-center font-mono md:block">
        https://{urlDisplay}
      </div>
      <div className="shrink-0 text-right">{right ?? <span className="text-[var(--text-mute)]">internal</span>}</div>
    </div>
  )
}

function ParticipantTopbar({
  activeNav = "none",
  workspaceHref,
  ideaHref,
  submitHref,
  phase,
  countdown,
  teamSlug,
  teamName,
  userEmail,
  userName,
  hasTeam = true,
}: Omit<ParticipantAppShellProps, "children" | "browserTitle" | "urlDisplay" | "browserRight" | "showTopbar">) {
  const nav = [
    { key: "workspace" as const, label: "Workspace", href: workspaceHref, lock: false },
    { key: "idea" as const, label: "Idea", href: ideaHref, lock: !hasTeam },
    { key: "submit" as const, label: "Submit", href: submitHref, lock: !hasTeam },
    { key: "gallery" as const, label: "Gallery", href: "/gallery", lock: false },
    { key: "leaderboard" as const, label: "Leaderboard", href: "/leaderboard", lock: false },
    { key: "handbook" as const, label: "Handbook", href: "/handbook", lock: false },
  ] as const

  const hue = teamSlug ? teamHueFromSlug(teamSlug) : "#ff7ac6"

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-black/90 backdrop-blur">
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        {/* Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex size-8 items-center justify-center border border-[rgba(196,255,0,0.35)] bg-[rgba(196,255,0,0.08)]">
            <Image src="/logo.png" alt="Altir" width={18} height={18} className="size-5 object-contain" />
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Altir // Tech-Day-2026</div>
            <div className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-mute)]">command center</div>
          </div>
        </Link>

        {/* Nav — scrollable on small screens */}
        <nav className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
          {nav.map((item) =>
            item.lock ? (
              <span
                key={item.key}
                title="Form your team first"
                className="shrink-0 cursor-not-allowed px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-faint)] opacity-40"
              >
                {item.label}
              </span>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "shrink-0 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors duration-150",
                  activeNav === item.key
                    ? "bg-[var(--panel-3)] text-white"
                    : "text-[var(--text-mute)] hover:bg-[var(--panel-2)] hover:text-white",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* Right — countdown, team pill, logout */}
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--warn)] sm:flex">
            <span className="size-1.5 rounded-full bg-[var(--warn)]" style={{ boxShadow: "0 0 6px var(--warn)" }} />
            <span className="hidden md:inline">{phase}</span>
            <span className="text-white">{countdown}</span>
          </div>
          {teamName ? (
            <div className="hidden items-center gap-1.5 border border-[var(--line-2)] bg-[var(--panel-2)] px-2 py-1 sm:flex">
              <span className="size-2.5 shrink-0" style={{ backgroundColor: hue, boxShadow: `0 0 8px ${hue}` }} />
              <span className="max-w-[110px] truncate font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                {teamName}
              </span>
            </div>
          ) : null}
          {userName ? (
            <form action={logoutAction} className="shrink-0">
              <button type="submit" className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-mute)] transition hover:text-white">
                logout
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export function ParticipantAppShell({
  children,
  browserTitle,
  urlDisplay,
  browserRight,
  showTopbar = true,
  activeNav = "none",
  workspaceHref,
  ideaHref,
  submitHref,
  phase,
  countdown,
  teamSlug,
  teamName,
  userEmail,
  userName,
  hasTeam = true,
  lead,
}: ParticipantAppShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div className="grid-overlay pointer-events-none absolute inset-0" />
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <BrowserStrip title={browserTitle} urlDisplay={urlDisplay} right={browserRight} />
        {showTopbar ? (
          <ParticipantTopbar
            activeNav={activeNav}
            workspaceHref={workspaceHref}
            ideaHref={ideaHref}
            submitHref={submitHref}
            phase={phase}
            countdown={countdown}
            teamSlug={teamSlug}
            teamName={teamName}
            userEmail={userEmail}
            userName={userName}
            hasTeam={hasTeam}
          />
        ) : null}
        {lead ? <div className="mx-auto w-full max-w-[1680px] px-4 pt-3 lg:px-8">{lead}</div> : null}
        {children}
      </div>
    </main>
  )
}

export function ParticipantStage({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={cn("mx-auto w-full flex-1 px-4 py-6 lg:px-8", wide ? "max-w-[1680px]" : "max-w-[1440px]")}>{children}</div>
  )
}
