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
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-black/88 backdrop-blur">
      <div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex size-9 items-center justify-center border border-[rgba(196,255,0,0.35)] bg-[rgba(196,255,0,0.1)]">
            <Image src="/logo.png" alt="Altir" width={22} height={22} className="size-6 object-contain" />
          </div>
          <div className="leading-tight">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white">Altir // Tech-Day-2026</div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-mute)]">command center</div>
          </div>
        </Link>

        <nav className="order-3 flex w-full flex-wrap items-center gap-1 lg:order-none lg:w-auto lg:flex-nowrap lg:justify-center">
          {nav.map((item) =>
            item.lock ? (
              <span
                key={item.key}
                title="Form your team first"
                className="cursor-not-allowed rounded-[2px] border border-transparent px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)] opacity-50 sm:px-3"
              >
                {item.label}
              </span>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "rounded-[2px] border px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-dim)] transition sm:px-3",
                  activeNav === item.key
                    ? "border-white/80 bg-[var(--panel-3)] text-white"
                    : "border-transparent hover:border-[var(--line)] hover:bg-[var(--panel-2)] hover:text-white",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--warn)] sm:text-[11px]">
            <span className="size-1.5 shrink-0 rounded-full bg-[var(--warn)] shadow-[0_0_8px_var(--warn)]" />
            <span className="hidden sm:inline">{phase}</span>
            <span className="text-white">ends in {countdown}</span>
          </div>
          {teamName ? (
            <div className="flex items-center gap-2 border border-[var(--line-2)] bg-[var(--panel-2)] px-2 py-1">
              <span className="size-3 shrink-0 shadow-[0_0_10px_currentColor]" style={{ backgroundColor: hue }} />
              <span className="max-w-[120px] truncate font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white sm:max-w-[160px]">
                {teamName}
              </span>
            </div>
          ) : null}
          <div className="hidden text-[10px] uppercase tracking-[0.14em] text-[var(--text-mute)] md:block">
            you · {userEmail ?? "—"}
          </div>
          {userName ? (
            <form action={logoutAction} className="shrink-0">
              <button type="submit" className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-mute)] transition hover:text-white">
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
