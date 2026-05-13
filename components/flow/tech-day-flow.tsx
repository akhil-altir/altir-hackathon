"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  ArrowRight,
  Check,
  Copy,
  FileText,
  GitBranch,
  KeyRound,
  LockKeyhole,
  MonitorPlay,
  Search,
  Star,
  Trophy,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EVENT_POINT_WEIGHTS, EVENT_SUBMISSION_MILESTONES_MAX, EVENT_TEAM_FORMATION_MAX } from "@/lib/event-point-weights"
import { TECH_DAY_BUILD_START_MS as BUILD_OPENS_AT_MS, TECH_DAY_KEYS_REVEAL_MS } from "@/lib/tech-day-schedule"
import type { PublicIdeaEntry } from "@/lib/idea-bank-public"
import { HowItWorks, IdeaBankSection, ScoringSection, DayTimeline, FAQSection, RewardsSection, CTAFooter } from "@/components/landing/lockscreen-sections"
import { cn } from "@/lib/utils"

/** Agenda wall times are IST; rendered in each viewer's local zone after hydration */
const LOCKSCREEN_AGENDA_IST = [
  { atMs: Date.parse("2026-05-22T12:00:00+05:30"), label: "Doors open / check-in", highlight: false },
  { atMs: Date.parse("2026-05-22T13:00:00+05:30"), label: "Team formation locks", highlight: false },
  { atMs: TECH_DAY_KEYS_REVEAL_MS, label: "Keys reveal + env setup", highlight: false },
  { atMs: BUILD_OPENS_AT_MS, label: "Build starts", highlight: true },
  { atMs: Date.parse("2026-05-22T17:00:00+05:30"), label: "Submission deadline window", highlight: false },
  { atMs: Date.parse("2026-05-22T17:30:00+05:30"), label: "Demos + judging", highlight: false },
  { atMs: Date.parse("2026-05-22T18:30:00+05:30"), label: "Wrap up — TBD", highlight: false },
] as const

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function useCountdownTo(targetMs: number) {
  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, targetMs - Date.now()))

  useEffect(() => {
    const tick = () => setRemainingMs(Math.max(0, targetMs - Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [targetMs])

  return remainingMs
}

type Screen =
  | "lockscreen"
  | "login"
  | "form-team"
  | "team-locked"
  | "idea-picker"
  | "workspace"
  | "key-reveal"
  | "submission"
  | "gallery"
  | "leaderboard"
  | "tv"
  | "judge"
  | "results"

type Team = {
  name: string
  idea: string
  dept: string
  score: number
  status: string
  hue: string
}

const teams: Team[] = [
  { name: "QUOTEBOT", idea: "Slide composer from meeting transcripts", dept: "Biz + Ops", score: 94, status: "submitted", hue: "#ff7ac6" },
  { name: "SIGNALFORGE", idea: "AI customer-risk radar", dept: "Eng + CS", score: 89, status: "demo-ready", hue: "#c4ff00" },
  { name: "PATCHWORK", idea: "Support ticket auto-triage", dept: "Ops + Eng", score: 86, status: "building", hue: "#00d4ff" },
  { name: "NORTHSTAR", idea: "Deal desk copilot", dept: "Sales + Eng", score: 83, status: "submitted", hue: "#ffb020" },
  { name: "BYTECLUB", idea: "Usage anomaly narrator", dept: "Data + Design", score: 78, status: "building", hue: "#9d6dff" },
  { name: "DECKMATES", idea: "Brand-safe proposal generator", dept: "Design + Biz", score: 76, status: "building", hue: "#00ff9d" },
  { name: "ROUTERUSH", idea: "Onboarding flow optimizer", dept: "Ops + Product", score: 73, status: "idea-locked", hue: "#ff5a3c" },
  { name: "CACHECATS", idea: "Internal docs answer bot", dept: "Eng + HR", score: 69, status: "building", hue: "#6ee7ff" },
]

const availablePeople = [
  { name: "Maya Reyes", dept: "Design", role: "Sr. Product Designer" },
  { name: "Jonas Tran", dept: "Eng", role: "Platform Engineer" },
  { name: "Priya Sandhu", dept: "Eng", role: "AI/ML Engineer" },
  { name: "Asha Verma", dept: "Ops", role: "Onboarding Lead", selected: true },
  { name: "Aiden Mahmoud", dept: "Biz", role: "Product Manager" },
  { name: "Yuki Ono", dept: "Design", role: "Brand Designer" },
  { name: "Sam Brennan", dept: "Ops", role: "Field Ops" },
  { name: "Lena Falk", dept: "Biz", role: "Strategy" },
]

const flow = [
  { key: "workspace", label: "Workspace", href: "/teams/quotebot" },
  { key: "idea", label: "Idea", href: "/teams/quotebot/idea" },
  { key: "submit", label: "Submit", href: "/teams/quotebot/submit" },
  { key: "gallery", label: "Gallery", href: "/gallery" },
  { key: "leaderboard", label: "Leaderboard", href: "/leaderboard" },
  { key: "handbook", label: "Handbook", href: "/handbook" },
]

export function TechDayScreen({
  screen,
  teamsFormed = 0,
  ideaBankRevealed = false,
  ideas = [],
  ideaBankTotal = 0,
  ideaBankCategoryCounts = {},
}: {
  screen: Screen
  teamsFormed?: number
  ideaBankRevealed?: boolean
  ideas?: PublicIdeaEntry[]
  ideaBankTotal?: number
  ideaBankCategoryCounts?: Record<string, number>
}) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--text)]">
      <div className="grid-overlay absolute inset-0" />
      <div className="scanlines absolute inset-0" />
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[var(--acid)]/10 blur-3xl" />
      <div className="relative z-10">
        {screen === "lockscreen" && (
          <Lockscreen
            teamsFormed={teamsFormed}
            ideaBankRevealed={ideaBankRevealed}
            ideas={ideas}
            ideaBankTotal={ideaBankTotal}
            ideaBankCategoryCounts={ideaBankCategoryCounts}
          />
        )}
        {screen === "login" && <Login />}
        {screen === "form-team" && <FormTeam />}
        {screen === "team-locked" && <TeamLocked />}
        {screen === "idea-picker" && <IdeaPicker />}
        {screen === "workspace" && <Workspace />}
        {screen === "key-reveal" && <KeyReveal />}
        {screen === "submission" && <Submission />}
        {screen === "gallery" && <Gallery />}
        {screen === "leaderboard" && <Leaderboard />}
        {screen === "tv" && <TVMode />}
        {screen === "judge" && <JudgeConsole />}
        {screen === "results" && <Results />}
      </div>
    </main>
  )
}

function BrowserChrome({
  title,
  url,
  right,
}: {
  title: string
  url: string
  right?: React.ReactNode
}) {
  return (
    <div className="flex h-11 items-center justify-between border-b border-[var(--line)] bg-black/90 px-4 text-[11px] text-[var(--text-dim)]">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-red-500" />
        <span className="size-2 rounded-full bg-amber-400" />
        <span className="size-2 rounded-full bg-[var(--acid)]" />
        <span className="ml-3 uppercase tracking-[0.28em] text-[var(--text-mute)]">{title}</span>
      </div>
      <div className="hidden rounded border border-[var(--line)] bg-[var(--panel)] px-4 py-1 md:block">{url}</div>
      <div className="min-w-20 text-right">{right ?? "internal"}</div>
    </div>
  )
}

function Topbar({
  active = "workspace",
  countdown = "02:14:08",
  phase = "BUILD ENDS",
}: {
  active?: string
  countdown?: string
  phase?: string
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-[var(--line)] bg-black/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center border border-[rgba(196,255,0,0.35)] bg-[rgba(196,255,0,0.1)]">
            <Image src="/logo.png" alt="Altir" width={22} height={22} className="size-6 object-contain" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white">Altir // Tech-Day-2026</div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-mute)]">command center</div>
          </div>
        </Link>
        <nav className="hidden flex-wrap items-center gap-1 lg:flex">
          {flow.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "rounded-[2px] border px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-dim)] transition sm:px-3",
                active === item.key ? "border-white/80 bg-[var(--panel-3)] text-white" : "border-transparent hover:border-[var(--line)] hover:bg-[var(--panel-2)] hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-xs">
          <span className="hidden text-[var(--text-mute)] sm:inline">{phase}</span>
          <span className="rounded border border-[var(--acid)]/40 bg-[var(--acid)]/10 px-3 py-1 font-bold text-[var(--acid)]">ends in {countdown}</span>
          <span className="hidden text-[var(--text-dim)] md:inline">jordan.l@altir.co</span>
        </div>
      </div>
    </div>
  )
}

function Stage({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={cn("mx-auto w-full px-4 py-6 lg:px-8", wide ? "max-w-[1920px]" : "max-w-[1440px]")}>
      {children}
    </div>
  )
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Card className={cn("panel-surface gap-0 rounded-none py-0", className)}>{children}</Card>
}

function PanelHead({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">{title}</CardTitle>
        {right && <div className="text-xs text-[var(--text-mute)]">{right}</div>}
      </div>
    </CardHeader>
  )
}

function SectionTitle({
  kicker,
  children,
  right,
}: {
  kicker: string
  children: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[var(--acid)]">{kicker}</div>
        <h1 className="max-w-3xl text-4xl font-bold leading-[0.95] tracking-[-0.04em] text-white md:text-6xl">{children}</h1>
      </div>
      {right}
    </div>
  )
}

function FlowButton({
  href,
  children,
  variant = "default",
  size = "lg",
  className,
}: {
  href: string
  children: React.ReactNode
  variant?: "default" | "ghost" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
  className?: string
}) {
  return (
    <Button asChild variant={variant} size={size} className={cn("rounded-none font-mono uppercase tracking-[0.12em]", className)}>
      <Link href={href}>{children}</Link>
    </Button>
  )
}

function Badge({ children, tone = "muted" }: { children: React.ReactNode; tone?: "acid" | "warn" | "muted" | "pink" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em]",
        tone === "acid" && "border-[var(--acid)]/40 bg-[var(--acid)]/10 text-[var(--acid)]",
        tone === "warn" && "border-amber-400/40 bg-amber-400/10 text-amber-300",
        tone === "pink" && "border-pink-400/40 bg-pink-400/10 text-pink-300",
        tone === "muted" && "border-[var(--line-2)] bg-white/5 text-[var(--text-dim)]"
      )}
    >
      {children}
    </span>
  )
}

function AvatarMark({ name, hue = "var(--acid)" }: { name: string; hue?: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)

  return (
    <span
      className="grid size-9 place-items-center border text-xs font-bold text-black"
      style={{ backgroundColor: hue, borderColor: hue, boxShadow: `0 0 18px ${hue}55` }}
    >
      {initials}
    </span>
  )
}

function ProgressBar({ value, color = "var(--acid)" }: { value: number; color?: string }) {
  return (
    <div className="h-2 overflow-hidden border border-[var(--line)] bg-black">
      <div className="h-full" style={{ width: `${value}%`, backgroundColor: color, boxShadow: `0 0 18px ${color}` }} />
    </div>
  )
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-[var(--line)] bg-[var(--panel-2)] p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">{label}</div>
      <div className={cn("mt-2 text-2xl font-bold", accent ? "acid-text-shadow text-[var(--acid)]" : "text-white")}>{value}</div>
    </div>
  )
}

function Lockscreen({
  teamsFormed = 0,
  ideaBankRevealed = false,
  ideas = [],
  ideaBankTotal = 0,
  ideaBankCategoryCounts = {},
}: {
  teamsFormed?: number
  ideaBankRevealed?: boolean
  ideas?: PublicIdeaEntry[]
  ideaBankTotal?: number
  ideaBankCategoryCounts?: Record<string, number>
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    queueMicrotask(() => setMounted(true))
  }, [])

  const remainingMs = useCountdownTo(BUILD_OPENS_AT_MS)
  const totalSec = Math.floor(remainingMs / 1000)
  const days = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60

  const rampMs = 21 * 24 * 60 * 60 * 1000
  const rampStart = BUILD_OPENS_AT_MS - rampMs
  const [rampNow, setRampNow] = useState(rampStart)
  useEffect(() => {
    const tick = () => setRampNow(Date.now())
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])
  const progressPct =
    rampNow >= BUILD_OPENS_AT_MS ? 100 : rampNow <= rampStart ? 0 : Math.min(100, ((rampNow - rampStart) / rampMs) * 100)

  const buildOpensDate = useMemo(() => new Date(BUILD_OPENS_AT_MS), [])

  const timeFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    []
  )

  const istAgendaTimeFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      }),
    []
  )

  const opensAtLine = useMemo(() => {
    if (!mounted) return null
    const full = new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(buildOpensDate)
    return full
  }, [mounted, buildOpensDate])

  const agendaTzLabel = useMemo(() => {
    if (!mounted) return "IST"
    return (
      new Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
        .formatToParts(buildOpensDate)
        .find((p) => p.type === "timeZoneName")?.value ?? "local"
    )
  }, [mounted, buildOpensDate])

  const countdownCaption =
    remainingMs <= 0
      ? mounted && opensAtLine
        ? `Build window is open · started ${opensAtLine}`
        : "Build window is open · started May 22, 2026 · 2:30 PM IST"
      : mounted && opensAtLine
        ? `Until build opens · ${opensAtLine} (your time)`
        : "Until build opens · May 22, 2026 · 2:30 PM IST — local times appear after load"

  return (
    <>
      <BrowserChrome title="lockscreen - t-minus" url="techday.altir.internal" right={<span className="text-[var(--acid)]">live</span>} />
      <Stage>
        <div className="grid min-h-[calc(100vh-92px)] gap-8 lg:grid-cols-[1.35fr_1fr]">
          <section className="flex flex-col justify-between py-6">
            <div>
              <Image src="/logo.png" alt="Altir" width={76} height={76} className="rounded-sm" />
              <div className="mt-14 text-[11px] uppercase tracking-[0.26em] text-[var(--acid)]"># 22 may 2026 / friday / hq + remote</div>
              <h1 className="mt-5 max-w-4xl text-6xl font-bold leading-[0.9] tracking-[-0.06em] text-white md:text-8xl">
                Three hours.
                <br />
                Two people.
                <br />
                <span className="acid-text-shadow text-[var(--acid)]">One idea you ship.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-[var(--text-dim)] md:text-base">
                Pair up across departments, claim an API key, and stand up something that demos in under three minutes. The platform handles teams, keys, scoring and the room.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <FlowButton href="/login">
                Sign in to claim your spot <ArrowRight />
              </FlowButton>
              <FlowButton href="/gallery" variant="outline">
                Preview the floor
              </FlowButton>
              <span className="text-[11px] text-[var(--text-mute)]">email login via employee roster</span>
            </div>
          </section>

          <aside className="flex flex-col gap-4 py-6">
            <Panel className="panel-highlight">
              <CardContent className="p-6">
                <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-mute)]">countdown to build opens</div>
                {days > 0 ? (
                  <div className="mt-4 space-y-1">
                    <div className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                      {days} day{days === 1 ? "" : "s"}
                    </div>
                    <div
                      className="flex flex-wrap items-baseline gap-2 text-5xl font-bold tracking-[-0.05em] text-[var(--acid)] md:text-6xl"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      <span>{pad2(hours)}</span>
                      <span className="text-[var(--text-faint)]">:</span>
                      <span>{pad2(minutes)}</span>
                      <span className="text-[var(--text-faint)]">:</span>
                      <span>{pad2(seconds)}</span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="mt-4 flex flex-wrap items-baseline gap-2 text-6xl font-bold tracking-[-0.05em] text-[var(--acid)] md:text-7xl"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <span>{pad2(hours)}</span>
                    <span className="text-[var(--text-faint)]">:</span>
                    <span>{pad2(minutes)}</span>
                    <span className="text-[var(--text-faint)]">:</span>
                    <span>{pad2(seconds)}</span>
                  </div>
                )}
                <div className="mt-2 text-[11px] text-[var(--text-mute)]">{countdownCaption}</div>
                <div className="mt-5">
                  <ProgressBar value={progressPct} />
                </div>
                <div className="mt-2 flex justify-between text-[10px] uppercase text-[var(--text-mute)]">
                  <span>check-in</span>
                  <span>team lock</span>
                  <span className="text-[var(--acid)]">build</span>
                  <span>demos</span>
                </div>
              </CardContent>
            </Panel>
            <Panel>
              <PanelHead title="// agenda" right={mounted ? `${agendaTzLabel} · source IST` : "IST"} />
              <CardContent className="p-4">
                {LOCKSCREEN_AGENDA_IST.map((row) => {
                  const displayTime = mounted
                    ? timeFmt.format(new Date(row.atMs))
                    : istAgendaTimeFmt.format(new Date(row.atMs))
                  return (
                    <div key={row.atMs} className="flex gap-4 border-b border-[var(--line)] py-2 last:border-0">
                      <span className="min-w-[3.25rem] text-[var(--text-mute)]">{displayTime}</span>
                      <span className={row.highlight ? "text-[var(--acid)]" : "text-[var(--text-dim)]"}>{row.label}</span>
                    </div>
                  )
                })}
              </CardContent>
            </Panel>
            <div className="grid grid-cols-2 gap-3">
              <Metric label="employees" value="24" />
              <Metric label="teams formed" value={String(teamsFormed)} accent={teamsFormed > 0} />
              <Metric label="preloaded keys" value="12" accent />
              <Metric label="judges" value="4" />
            </div>
          </aside>
        </div>
      </Stage>
      <HowItWorks />
      <IdeaBankSection
        revealed={ideaBankRevealed}
        ideas={ideas}
        ideaBankTotal={ideaBankTotal}
        ideaBankCategoryCounts={ideaBankCategoryCounts}
      />
      <ScoringSection />
      <DayTimeline />
      <RewardsSection />
      <FAQSection />
      <CTAFooter />
    </>
  )
}

function Login() {
  return (
    <>
      <BrowserChrome title="sign in" url="techday.altir.internal/auth" />
      <Stage>
        <div className="grid min-h-[calc(100vh-92px)] border border-[var(--line)] bg-black/35 lg:grid-cols-2">
          <section className="flex flex-col justify-between border-b border-[var(--line)] p-8 lg:border-b-0 lg:border-r lg:p-14">
            <Image src="/logo.png" alt="Altir" width={68} height={68} className="rounded-sm" />
            <div className="my-14 space-y-4 text-sm leading-7 text-[var(--text-dim)]">
              <TerminalLine command="altir-techday --version" output="v1.0.0 // command-center // 22-may-2026" />
              <TerminalLine command="whoami" output="not authenticated / roster login required" />
              <TerminalLine command="auth login --employee" output="allowed roles: participant, judge, admin" />
              <div className="flex items-center gap-2">
                <span className="font-bold text-[var(--acid)]">$</span>
                <span className="h-5 w-32 bg-white/10" />
              </div>
            </div>
            <p className="text-[11px] text-[var(--text-mute)]">Employee IDs come from the imported Excel roster. Password is the local part of the email.</p>
          </section>
          <section className="flex items-center p-8 lg:p-14">
            <div className="w-full max-w-md">
              <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--acid)]"># /auth/sign-in</div>
              <h1 className="mt-3 text-5xl font-bold tracking-[-0.04em] text-white">Welcome back.</h1>
              <p className="mt-3 text-sm leading-6 text-[var(--text-dim)]">Use your Altir email. Example: agupta@altir.co with password agupta.</p>
              <Panel className="mt-8">
                <CardContent className="space-y-4 p-5">
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[var(--text-mute)]">email</label>
                  <div className="border border-[var(--acid)]/40 bg-black px-4 py-3 text-sm text-white">agupta@altir.co</div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[var(--text-mute)]">password</label>
                  <div className="border border-[var(--line)] bg-black px-4 py-3 text-sm text-[var(--text-dim)]">agupta</div>
                  <FlowButton href="/teams/new" className="w-full">
                    Continue <ArrowRight />
                  </FlowButton>
                </CardContent>
              </Panel>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <Metric label="role" value="participant" accent />
                <Metric label="dept" value="design" />
                <Metric label="seat" value="14" />
              </div>
            </div>
          </section>
        </div>
      </Stage>
    </>
  )
}

function TerminalLine({ command, output }: { command: string; output: string }) {
  return (
    <div>
      <div>
        <span className="text-[var(--acid)]">$</span> {command}
      </div>
      <div className="pl-4 text-[var(--text-mute)]">{output}</div>
    </div>
  )
}

function FormTeam() {
  return (
    <>
      <BrowserChrome title="form a team" url="techday.altir.internal/teams/new" />
      <Topbar active="workspace" countdown="00:42:17" phase="TEAM LOCK" />
      <Stage>
        <SectionTitle kicker="step 01 / form a team" right={<Badge tone="warn">team lock 13:00 / in 42 min</Badge>}>
          Pick yourself + one partner.
        </SectionTitle>
        <p className="mb-6 max-w-3xl text-sm leading-6 text-[var(--text-dim)]">
          Teams are exactly 2 people. Cross-department pairs unlock bonus event points. You can edit until 13:00; after that, only an admin can override.
        </p>
        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.85fr]">
          <Panel>
            <CardContent className="p-5">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-mute)]">team name</div>
              <div className="mt-3 flex h-14 items-center gap-3 border border-[var(--acid)]/50 bg-black px-4 text-2xl font-bold tracking-[0.06em] text-white">
                <span className="text-[var(--acid)]">&gt;</span>
                QUOTEBOT
                <Badge tone="acid">available</Badge>
              </div>
              <div className="mt-6 border-y border-[var(--line)] py-4 text-center text-[var(--text-faint)]">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
              <div className="mb-3 mt-5 text-[11px] uppercase tracking-[0.22em] text-[var(--text-mute)]">your teammate</div>
              <div className="grid gap-2 md:grid-cols-2">
                {availablePeople.map((person) => (
                  <button
                    key={person.name}
                    className={cn(
                      "flex items-center gap-3 border p-3 text-left transition hover:border-[var(--acid)]/60",
                      person.selected ? "border-[var(--acid)]/60 bg-[var(--acid)]/10" : "border-[var(--line)] bg-[var(--panel-2)]"
                    )}
                  >
                    <AvatarMark name={person.name} hue={person.selected ? "#ff7ac6" : "var(--line-3)"} />
                    <span>
                      <span className="block text-sm font-bold text-white">{person.name}</span>
                      <span className="text-xs text-[var(--text-dim)]">
                        {person.dept} / {person.role}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-4 text-[11px] text-[var(--text-mute)]">17 of 24 employees available / already-paired teammates are hidden</div>
            </CardContent>
          </Panel>
          <TeamPreview />
        </div>
      </Stage>
    </>
  )
}

function TeamPreview() {
  return (
    <Panel className="self-start panel-highlight">
      <CardContent className="p-5">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-mute)]">team preview</div>
        <div className="mt-4 flex items-center gap-3">
          <span className="size-5 bg-pink-400 shadow-[0_0_18px_rgba(244,114,182,0.65)]" />
          <span className="text-3xl font-bold tracking-[0.08em] text-white">QUOTEBOT</span>
        </div>
        <div className="mt-1 text-[11px] text-[var(--text-mute)]">auto-assigned color / 08 of 12 hues remaining</div>
        <div className="my-5 border-t border-[var(--line)]" />
        {[
          { name: "Jordan Lin", detail: "Biz / Pricing Analyst", hue: "var(--acid)", you: true },
          { name: "Asha Verma", detail: "Ops / Onboarding Lead", hue: "#ff7ac6", you: false },
        ].map((member) => (
          <div key={member.name} className="flex items-center gap-3 border-t border-[var(--line)] py-3 first:border-0">
            <AvatarMark name={member.name} hue={member.hue} />
            <div>
              <div className="font-bold text-white">
                {member.name} {member.you && <span className="ml-2 text-[10px] text-[var(--acid)]">YOU</span>}
              </div>
              <div className="text-xs text-[var(--text-dim)]">{member.detail}</div>
            </div>
          </div>
        ))}
        <div className="mt-5 border border-[var(--line)] bg-[var(--panel-2)] p-4">
          <div className="mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--text-mute)]">event points you will earn</div>
          {[
            ["Complete team", `+${EVENT_POINT_WEIGHTS.team_formed}`],
            ["Different primary assignments", `+${EVENT_POINT_WEIGHTS.cross_assignment}`],
            ["Formed before lock", `+${EVENT_POINT_WEIGHTS.formed_before_lock}`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-1 text-xs">
              <span className="text-[var(--text-dim)]">{label}</span>
              <span className="font-bold text-[var(--acid)]">{value}</span>
            </div>
          ))}
          <div className="mt-3 flex justify-between border-t border-[var(--line)] pt-3">
            <span className="text-xs uppercase text-[var(--text-dim)]">max if all apply</span>
            <span className="text-2xl font-bold text-[var(--acid)]">{EVENT_TEAM_FORMATION_MAX} pts</span>
          </div>
        </div>
        <FlowButton href="/teams/quotebot/locked" className="mt-5 w-full">
          Lock it in <LockKeyhole />
        </FlowButton>
      </CardContent>
    </Panel>
  )
}

function TeamLocked() {
  return (
    <>
      <BrowserChrome title="team locked" url="techday.altir.internal/teams/quotebot" right={<span className="text-[var(--acid)]">team ready</span>} />
      <Topbar active="workspace" countdown="01:34:00" phase="BUILD OPENS" />
      <Stage>
        <Panel className="relative overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <Confetti />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--acid)]"># team locked / 12:18:42</div>
              <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-[0.95] tracking-[-0.05em] text-white md:text-7xl">
                <span className="text-pink-300 drop-shadow-[0_0_24px_rgba(244,114,182,0.45)]">QUOTEBOT</span> is in the room.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-[var(--text-dim)]">
                Both members are signed in and your workspace is live. Next up: pick or submit an idea before the API key reveals at 14:30.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <FlowButton href="/teams/quotebot">
                  Go to workspace <ArrowRight />
                </FlowButton>
                <FlowButton href="/teams/quotebot/idea" variant="outline">
                  Browse idea bank
                </FlowButton>
              </div>
            </div>
          </CardContent>
        </Panel>
        <ProgressStrip />
      </Stage>
    </>
  )
}

function Confetti() {
  const glyphs = ["#", "+", "x", "<>", "*", "/", "\\"]

  return (
    <div className="pointer-events-none absolute inset-0 opacity-80">
      {glyphs.map((glyph, index) => (
        <span
          key={`${glyph}-${index}`}
          className="absolute text-lg font-bold"
          style={{
            left: `${8 + index * 13}%`,
            top: `${8 + (index % 3) * 18}%`,
            color: ["#c4ff00", "#ff7ac6", "#00d4ff", "#ffb020", "#9d6dff", "#00ff9d", "#ff5a3c"][index],
            textShadow: "0 0 14px currentColor",
          }}
        >
          {glyph}
        </span>
      ))}
    </div>
  )
}

function ProgressStrip() {
  const steps = [
    ["01", "team", "done", `+${EVENT_TEAM_FORMATION_MAX}`],
    ["02", "idea", "next", `0/${EVENT_POINT_WEIGHTS.idea_submitted}`],
    ["03", "key", "wait", "--"],
    ["04", "build", "wait", "--"],
    ["05", "submit", "wait", `0/${EVENT_SUBMISSION_MILESTONES_MAX}`],
    ["06", "judge", "wait", "--"],
  ]

  return (
    <div className="mt-4 grid border border-[var(--line)] bg-[var(--line)] md:grid-cols-6">
      {steps.map(([num, label, status, points]) => (
        <div key={num} className={cn("bg-[var(--panel)] p-4", status !== "wait" && "bg-[var(--panel-2)]")}>
          <div className="text-[10px] text-[var(--text-mute)]">{num}</div>
          <div className={cn("mt-1 text-sm font-bold uppercase tracking-[0.18em]", status === "next" ? "text-[var(--acid)]" : "text-white")}>{label}</div>
          <div className="mt-2 text-xs text-[var(--text-mute)]">{points}</div>
        </div>
      ))}
    </div>
  )
}

function IdeaPicker() {
  const ideas = [
    ["Design", "Slide composer from raw meeting transcripts", "Drop in a call recording and get an 8-slide deck."],
    ["Ops", "Customer onboarding checklist generator", "Turn CRM notes into a launch plan with owners."],
    ["Eng", "Internal docs answer bot", "Ask questions against handbook, policies, and runbooks."],
    ["Biz", "Deal desk objection simulator", "Practice a renewal call against likely blockers."],
  ]

  return (
    <>
      <BrowserChrome title="idea bank + custom" url="techday.altir.internal/teams/quotebot/idea" />
      <Topbar active="idea" countdown="01:21:10" phase="KEY REVEAL" />
      <Stage>
        <SectionTitle kicker="step 02 / idea" right={<Badge tone="acid">+{EVENT_POINT_WEIGHTS.idea_submitted} available</Badge>}>
          Claim an idea or write your own.
        </SectionTitle>
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Panel>
            <PanelHead title="// idea bank" right={<span className="flex items-center gap-2"><Search className="size-3" /> 24 prompts</span>} />
            <CardContent className="grid gap-3 p-5 md:grid-cols-2">
              {ideas.map(([kind, title, body], index) => (
                <button key={title} className={cn("border p-4 text-left transition hover:border-[var(--acid)]/60", index === 0 ? "border-[var(--acid)]/60 bg-[var(--acid)]/10" : "border-[var(--line)] bg-[var(--panel-2)]")}>
                  <Badge tone={index === 0 ? "acid" : "muted"}>{kind}</Badge>
                  <div className="mt-3 text-lg font-bold text-white">{title}</div>
                  <p className="mt-2 text-xs leading-5 text-[var(--text-dim)]">{body}</p>
                </button>
              ))}
            </CardContent>
          </Panel>
          <Panel className="panel-highlight self-start">
            <PanelHead title="// selected idea" right={<Badge tone="pink">quotebot</Badge>} />
            <CardContent className="p-5">
              <div className="text-2xl font-bold leading-tight text-white">Slide composer from raw meeting transcripts</div>
              <p className="mt-3 text-sm leading-6 text-[var(--text-dim)]">
                Drop in a call recording and get back an 8-slide pre-sales deck with speaker notes. Connects naturally to OpenAI APIs and gives judges something obvious to evaluate.
              </p>
              <div className="mt-5 grid gap-2">
                <div className="border border-[var(--line)] bg-black p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">custom twist</div>
                  <div className="mt-2 text-sm text-white">Add brand-safe theme selection and a one-click executive summary slide.</div>
                </div>
              </div>
              <FlowButton href="/teams/quotebot/key" className="mt-5 w-full">
                Submit idea <ArrowRight />
              </FlowButton>
            </CardContent>
          </Panel>
        </div>
      </Stage>
    </>
  )
}

function Workspace() {
  return (
    <>
      <BrowserChrome title="team workspace" url="techday.altir.internal/teams/quotebot" right={<span className="text-[var(--acid)]">02:14:08 left</span>} />
      <Topbar active="workspace" countdown="02:14:08" phase="BUILD ENDS" />
      <Stage>
        <div className="grid gap-5 lg:grid-cols-[230px_1fr]">
          <Panel className="self-start">
            <CardContent className="p-4">
              <div className="mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--text-mute)]">workspace</div>
              {["Dashboard", "Idea", "API key", "Submissions", "Event points", "Judge score", "Handbook"].map((item, index) => (
                <Link key={item} href={index === 3 ? "/teams/quotebot/submit" : "#"} className={cn("flex justify-between px-3 py-2 text-xs text-[var(--text-dim)] hover:bg-white/5", index === 0 && "bg-[var(--panel-3)] font-bold text-white")}>
                  <span>{index === 0 ? "> " : ""}{item}</span>
                  <span className="text-[var(--text-mute)]">{index === 2 ? "live" : index === 3 ? "0/3" : ""}</span>
                </Link>
              ))}
              <div className="my-4 border-t border-[var(--line)]" />
              <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-[var(--text-mute)]">teammates</div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2"><AvatarMark name="Jordan Lin" /> Jordan <span className="text-[var(--acid)]">online</span></div>
                <div className="flex items-center gap-2"><AvatarMark name="Asha Verma" hue="#ff7ac6" /> Asha <span className="text-[var(--acid)]">online</span></div>
              </div>
            </CardContent>
          </Panel>
          <div className="space-y-4">
            <Panel className="panel-highlight">
              <CardContent className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--acid)]"># current step / build</div>
                  <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-white">Idea locked. API key released. <span className="text-[var(--acid)]">Ship something.</span></h1>
                  <p className="mt-2 text-sm text-[var(--text-dim)]">Add your GitHub repo before 17:00 to keep the +{EVENT_POINT_WEIGHTS.before_515} early-submit bonus in play.</p>
                </div>
                <div className="min-w-56 text-left md:text-right">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-mute)]">build window left</div>
                  <div className="text-5xl font-bold tracking-[-0.05em] text-[var(--acid)]">02:14:08</div>
                  <ProgressBar value={26} />
                </div>
              </CardContent>
            </Panel>
            <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
              <Panel>
                <PanelHead title="// idea" right={<FlowButton href="/teams/quotebot/idea" variant="ghost" size="sm">edit</FlowButton>} />
                <CardContent className="p-5">
                  <Badge tone="acid">design</Badge>
                  <div className="mt-3 text-xl font-bold text-white">Slide composer from raw meeting transcripts</div>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-dim)]">Drop in a call recording, get back an 8-slide pre-sales deck with speaker notes. Pulls from Gong or Granola exports.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge>Next.js</Badge>
                    <Badge>Whisper</Badge>
                    <Badge>OpenAI</Badge>
                  </div>
                </CardContent>
              </Panel>
              <Panel className="panel-highlight">
                <PanelHead title="// api key / unlocked 14:30" right={<span className="text-[var(--acid)]">live</span>} />
                <CardContent className="p-5">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-mute)]">your preloaded key</div>
                  <div className="mt-3 flex items-center justify-between border border-[var(--acid)]/40 bg-black p-3 text-xs text-[var(--acid)]">
                    <span>sk-td-quotebot-4f9c...92ab</span>
                    <Copy className="size-4" />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[var(--text-dim)]">Budget capped for event use. Do not paste in public repos.</p>
                </CardContent>
              </Panel>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <ActionCard icon={<GitBranch />} title="Repo" body="Not attached yet" href="/teams/quotebot/submit" />
              <ActionCard icon={<Upload />} title="Submission" body="0 of 3 assets uploaded" href="/teams/quotebot/submit" />
              <ActionCard icon={<MonitorPlay />} title="Live room" body="Leaderboard and TV mode" href="/leaderboard" />
            </div>
          </div>
        </div>
      </Stage>
    </>
  )
}

function ActionCard({ icon, title, body, href }: { icon: React.ReactNode; title: string; body: string; href: string }) {
  return (
    <Link href={href} className="block border border-[var(--line)] bg-[var(--panel-2)] p-4 transition hover:border-[var(--acid)]/60">
      <div className="mb-4 text-[var(--acid)]">{icon}</div>
      <div className="font-bold text-white">{title}</div>
      <div className="mt-1 text-xs text-[var(--text-dim)]">{body}</div>
    </Link>
  )
}

function KeyReveal() {
  return (
    <>
      <BrowserChrome title="api key reveal" url="techday.altir.internal/teams/quotebot/key" right={<span className="text-[var(--acid)]">14:30 sharp</span>} />
      <Topbar active="workspace" countdown="03:00:00" phase="BUILD STARTS" />
      <Stage>
        <div className="grid min-h-[70vh] place-items-center">
          <Panel className="panel-highlight max-w-4xl">
            <CardContent className="p-8 text-center md:p-14">
              <KeyRound className="mx-auto size-14 text-[var(--acid)]" />
              <div className="mt-6 text-[11px] uppercase tracking-[0.26em] text-[var(--acid)]"># key reveal / 14:30:00</div>
              <h1 className="mt-4 text-5xl font-bold leading-none tracking-[-0.05em] text-white md:text-7xl">Your key is live. Three hours. Go.</h1>
              <div className="mx-auto mt-7 max-w-xl border border-[var(--acid)]/40 bg-black p-4 text-left text-sm text-[var(--acid)]">sk-td-quotebot-4f9c-7a11-92ab</div>
              <FlowButton href="/teams/quotebot" className="mt-7">
                Open workspace <ArrowRight />
              </FlowButton>
            </CardContent>
          </Panel>
        </div>
      </Stage>
    </>
  )
}

function Submission() {
  return (
    <>
      <BrowserChrome title="final submission form" url="techday.altir.internal/teams/quotebot/submit" />
      <Topbar active="submit" countdown="00:18:44" phase="SUBMISSION CLOSES" />
      <Stage>
        <SectionTitle kicker="step 05 / submission" right={<Badge tone="warn">deadline 17:00</Badge>}>
          Package the demo for judges.
        </SectionTitle>
        <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <Panel>
            <PanelHead title="// final assets" right="autosaved 16:41" />
            <CardContent className="space-y-4 p-5">
              <Field label="project title" value="Quotebot: AI slide composer" />
              <Field label="github repo" value="github.com/altir/techday-quotebot" icon={<GitBranch className="size-4" />} />
              <Field label="demo url" value="https://quotebot.azurewebsites.net" />
              <div className="grid gap-3 md:grid-cols-3">
                <UploadSlot label="pitch deck" status="uploaded" />
                <UploadSlot label="demo video" status="missing" />
                <UploadSlot label="screenshots" status="uploaded" />
              </div>
              <FlowButton href="/gallery" className="w-full">
                Submit to gallery <ArrowRight />
              </FlowButton>
            </CardContent>
          </Panel>
          <Panel className="self-start">
            <PanelHead title="// public card preview" />
            <CardContent className="p-5">
              <TeamCard team={teams[0]} large />
            </CardContent>
          </Panel>
        </div>
      </Stage>
    </>
  )
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">{label}</div>
      <div className="flex items-center gap-2 border border-[var(--line)] bg-black p-3 text-sm text-white">
        {icon}
        {value}
      </div>
    </div>
  )
}

function UploadSlot({ label, status }: { label: string; status: "uploaded" | "missing" }) {
  return (
    <div className="border border-dashed border-[var(--line-2)] bg-black/60 p-4 text-center">
      {status === "uploaded" ? <Check className="mx-auto size-5 text-[var(--acid)]" /> : <Upload className="mx-auto size-5 text-[var(--text-mute)]" />}
      <div className="mt-2 text-xs font-bold uppercase text-white">{label}</div>
      <div className={cn("mt-1 text-[10px] uppercase", status === "uploaded" ? "text-[var(--acid)]" : "text-[var(--text-mute)]")}>{status}</div>
    </div>
  )
}

function Gallery() {
  return (
    <>
      <BrowserChrome title="public submission gallery" url="techday.altir.internal/gallery" />
      <Topbar active="gallery" countdown="00:11:20" phase="GALLERY LIVE" />
      <Stage>
        <SectionTitle kicker="step 05 / gallery" right={<FlowButton href="/leaderboard" variant="outline">Open live energy</FlowButton>}>
          Public submission gallery.
        </SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {teams.map((team) => (
            <TeamCard key={team.name} team={team} />
          ))}
        </div>
      </Stage>
    </>
  )
}

function TeamCard({ team, large = false }: { team: Team; large?: boolean }) {
  return (
    <div className={cn("border border-[var(--line)] bg-[var(--panel-2)] p-4", large && "p-6")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="size-4" style={{ backgroundColor: team.hue, boxShadow: `0 0 16px ${team.hue}` }} />
          <span className={cn("font-bold tracking-[0.12em] text-white", large ? "text-2xl" : "text-sm")}>{team.name}</span>
        </div>
        <Badge tone={team.status === "submitted" ? "acid" : "muted"}>{team.status}</Badge>
      </div>
      <div className={cn("mt-4 font-bold text-white", large ? "text-2xl" : "text-lg")}>{team.idea}</div>
      <div className="mt-2 text-xs text-[var(--text-dim)]">{team.dept}</div>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)]">event score</span>
        <span className="text-2xl font-bold text-[var(--acid)]">{team.score}</span>
      </div>
    </div>
  )
}

function Leaderboard() {
  return (
    <>
      <BrowserChrome title="live energy / participant view" url="techday.altir.internal/leaderboard" />
      <Topbar active="leaderboard" countdown="00:47:03" phase="DEMOS SOON" />
      <Stage>
        <SectionTitle kicker="step 05 / live ops" right={<FlowButton href="/tv" variant="outline">TV mode</FlowButton>}>
          Live energy board.
        </SectionTitle>
        <div className="grid gap-5 lg:grid-cols-[1fr_0.65fr]">
          <Panel>
            <PanelHead title="// leaderboard" right="updates every 10s" />
            <CardContent className="p-0">
              {teams.map((team, index) => (
                <div key={team.name} className="grid grid-cols-[52px_1fr_auto] items-center gap-4 border-b border-[var(--line)] p-4 last:border-0">
                  <div className="text-2xl font-bold text-[var(--text-faint)]">#{index + 1}</div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="size-3" style={{ backgroundColor: team.hue }} />
                      <span className="font-bold text-white">{team.name}</span>
                      {index < 3 && <Star className="size-4 text-[var(--acid)]" />}
                    </div>
                    <div className="mt-1 text-xs text-[var(--text-dim)]">{team.idea}</div>
                  </div>
                  <div className="text-3xl font-bold text-[var(--acid)]">{team.score}</div>
                </div>
              ))}
            </CardContent>
          </Panel>
          <Panel>
            <PanelHead title="// room feed" />
            <CardContent className="space-y-3 p-5">
              {[
                "QUOTEBOT uploaded final deck",
                "SIGNALFORGE crossed 90% demo readiness",
                "PATCHWORK attached GitHub repository",
                "NORTHSTAR judge queue unlocked",
                "DECKMATES requested projector test",
              ].map((item, index) => (
                <div key={item} className="border border-[var(--line)] bg-black p-3">
                  <div className="text-[10px] uppercase text-[var(--text-mute)]">16:{42 - index * 3}</div>
                  <div className="mt-1 text-sm text-white">{item}</div>
                </div>
              ))}
            </CardContent>
          </Panel>
        </div>
      </Stage>
    </>
  )
}

function TVMode() {
  return (
    <>
      <BrowserChrome title="tv mode / office display" url="techday.altir.internal/tv" right={<span className="text-[var(--acid)]">1920 x 1080</span>} />
      <Stage wide>
        <div className="grid min-h-[calc(100vh-80px)] gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="flex flex-col justify-between border border-[var(--line)] bg-black/60 p-8">
            <div>
              <div className="flex items-center justify-between">
                <Image src="/logo.png" alt="Altir" width={64} height={64} />
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-mute)]">demos start in</div>
                  <div className="text-6xl font-bold text-[var(--acid)]">00:47:03</div>
                </div>
              </div>
              <h1 className="mt-12 text-7xl font-bold leading-none tracking-[-0.06em] text-white xl:text-8xl">Altir Tech Day is live.</h1>
            </div>
            <div className="grid gap-3">
              {teams.slice(0, 5).map((team, index) => (
                <div key={team.name} className="grid grid-cols-[70px_1fr_auto] items-center border border-[var(--line)] bg-[var(--panel-2)] p-4">
                  <div className="text-4xl font-bold text-[var(--text-faint)]">{index + 1}</div>
                  <div>
                    <div className="text-2xl font-bold tracking-[0.1em] text-white">{team.name}</div>
                    <div className="text-sm text-[var(--text-dim)]">{team.idea}</div>
                  </div>
                  <div className="text-5xl font-bold text-[var(--acid)]">{team.score}</div>
                </div>
              ))}
            </div>
          </section>
          <aside className="space-y-5">
            <Metric label="teams locked" value="12 / 12" accent />
            <Metric label="submissions in" value="8 / 12" />
            <Metric label="repos attached" value="7 / 12" />
            <Metric label="judges online" value="4 / 4" accent />
            <Panel>
              <PanelHead title="// now" />
              <CardContent className="p-5 text-3xl font-bold leading-tight text-white">Final pushes. Rehearse the 3-minute demo. No new keys after 17:00.</CardContent>
            </Panel>
          </aside>
        </div>
      </Stage>
    </>
  )
}

function JudgeConsole() {
  return (
    <>
      <BrowserChrome title="judge scoring console" url="techday.altir.internal/judge/quotebot" />
      <Topbar active="leaderboard" countdown="00:22:00" phase="JUDGING" />
      <Stage>
        <SectionTitle kicker="step 06 / judging" right={<Badge tone="acid">judge console</Badge>}>
          Score QUOTEBOT.
        </SectionTitle>
        <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
          <Panel>
            <PanelHead title="// demo queue" />
            <CardContent className="space-y-2 p-4">
              {teams.slice(0, 6).map((team, index) => (
                <Link key={team.name} href={team.name === "QUOTEBOT" ? "/judge/quotebot" : "#"} className={cn("flex justify-between border border-[var(--line)] p-3 text-sm", index === 0 ? "border-[var(--acid)]/50 bg-[var(--acid)]/10 text-white" : "bg-[var(--panel-2)] text-[var(--text-dim)]")}>
                  <span>{team.name}</span>
                  <span>{index === 0 ? "now" : `+${index * 6}m`}</span>
                </Link>
              ))}
            </CardContent>
          </Panel>
          <Panel className="panel-highlight">
            <PanelHead title="// scoring" right="autosaves per criterion" />
            <CardContent className="p-5">
              <TeamCard team={teams[0]} large />
              <div className="mt-6 grid gap-4">
                {[
                  ["Impact", 94],
                  ["Creativity", 91],
                  ["Execution", 88],
                  ["Demo clarity", 96],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-bold text-white">{label}</span>
                      <span className="text-[var(--acid)]">{value}/100</span>
                    </div>
                    <ProgressBar value={Number(value)} />
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <Button className="rounded-none font-mono uppercase tracking-[0.12em]"><Trophy /> Save score</Button>
                <FlowButton href="/results" variant="outline"><FileText /> View results</FlowButton>
              </div>
            </CardContent>
          </Panel>
        </div>
      </Stage>
    </>
  )
}

function Results() {
  const winners = teams.slice(0, 3)

  return (
    <>
      <BrowserChrome title="winners / final standings" url="techday.altir.internal/results" right={<span className="text-[var(--acid)]">final</span>} />
      <Topbar active="leaderboard" countdown="00:00:00" phase="COMPLETE" />
      <Stage>
        <SectionTitle kicker="step 06 / results">
          Final standings.
        </SectionTitle>
        <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr_1fr] lg:items-end">
          {[winners[1], winners[0], winners[2]].map((team, index) => {
            const place = index === 1 ? 1 : index === 0 ? 2 : 3
            return (
              <Panel key={team.name} className={cn(place === 1 && "panel-highlight")}>
                <CardContent className={cn("p-6 text-center", place === 1 ? "min-h-96" : "min-h-72")}>
                  <div className="text-5xl font-bold text-[var(--text-faint)]">#{place}</div>
                  <Trophy className={cn("mx-auto mt-5", place === 1 ? "size-14 text-[var(--acid)]" : "size-10 text-[var(--text-dim)]")} />
                  <div className="mt-6 text-3xl font-bold tracking-[0.12em] text-white">{team.name}</div>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-dim)]">{team.idea}</p>
                  <div className="mt-6 text-5xl font-bold text-[var(--acid)]">{team.score}</div>
                </CardContent>
              </Panel>
            )
          })}
        </div>
        <Panel className="mt-5">
          <PanelHead title="// full final table" />
          <CardContent className="p-0">
            {teams.map((team, index) => (
              <div key={team.name} className="grid grid-cols-[50px_1fr_auto] border-b border-[var(--line)] p-4 last:border-0">
                <span className="text-[var(--text-mute)]">#{index + 1}</span>
                <span className="font-bold text-white">{team.name}</span>
                <span className="font-bold text-[var(--acid)]">{team.score}</span>
              </div>
            ))}
          </CardContent>
        </Panel>
      </Stage>
    </>
  )
}
