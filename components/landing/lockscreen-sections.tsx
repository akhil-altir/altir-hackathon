"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, Lock, Zap, Trophy, BookOpen } from "lucide-react"

import { IDEA_BANK_REVEAL_MS } from "@/lib/tech-day-schedule"
import type { PublicIdeaEntry } from "@/lib/idea-bank-public"

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

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-[0.26em] text-[var(--acid)]">{children}</div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">{children}</h2>
  )
}

function Divider() {
  return <div className="border-t border-[var(--line)]" />
}

// ─── HOW IT WORKS ────────────────────────────────────────────────────────────

type HowItWorksStep = {
  num: string
  label: string
  body: string
  icon: string
  deadlines: { label: string; time: string; warn?: boolean }[]
}

const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    num: "01",
    label: "Form your team",
    body: "Pair with someone from a different department. Exactly 2 people per team. Cross-dept pairs unlock bonus points.",
    icon: "⇄",
    deadlines: [
      { label: "Team lock", time: "12:00 PM · May 22", warn: true },
    ],
  },
  {
    num: "02",
    label: "Pick an idea",
    body: "Browse the idea bank or bring your own — both are welcome. Claim your API key at 1:00 PM, then use the 30-min setup window before build starts.",
    icon: "◈",
    deadlines: [
      { label: "Ideas drop", time: "6:00 PM · May 20" },
      { label: "Keys reveal", time: "1:00 PM · May 22" },
      { label: "Build starts", time: "1:30 PM · May 22", warn: true },
    ],
  },
  {
    num: "03",
    label: "Build and ship",
    body: "Four hours. Use any tools — Cursor, Claude, Codex, Replit, Lovable, anything. Host anywhere. Demo live from 5:30 PM.",
    icon: "▶",
    deadlines: [
      { label: "Submit by", time: "5:30 PM · May 22", warn: true },
      { label: "Early bonus", time: "5:00 PM · May 22" },
      { label: "Demos start", time: "5:30 PM · May 22" },
    ],
  },
]

export function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-14 lg:px-8">
      <SectionKicker># how it works</SectionKicker>
      <SectionHeading>Three steps. One ship.</SectionHeading>
      <div className="mt-8 grid gap-px border border-[var(--line)] bg-[var(--line)] lg:grid-cols-3">
        {HOW_IT_WORKS.map((step) => (
          <div
            key={step.num}
            className="group relative flex flex-col gap-4 bg-[var(--panel)] p-6 transition-colors hover:bg-[var(--panel-2)]"
          >
            <div className="flex items-start justify-between">
              <span className="text-5xl font-bold tracking-[-0.05em] text-[var(--acid)] opacity-25 group-hover:opacity-40 transition-opacity">
                {step.num}
              </span>
              <span className="text-2xl text-[var(--text-faint)]">{step.icon}</span>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">
                step {step.num}
              </div>
              <div className="mt-1 text-lg font-bold tracking-[-0.02em] text-white">
                {step.label}
              </div>
            </div>
            <p className="text-sm leading-6 text-[var(--text-dim)]">{step.body}</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-2 border-t border-[var(--line)]">
              {step.deadlines.map((d) => (
                <div
                  key={d.label}
                  className={`flex flex-col px-2.5 py-1.5 border ${
                    d.warn
                      ? "border-[var(--warn)]/40 bg-[var(--warn)]/6"
                      : "border-[var(--line-2)] bg-[var(--panel-2)]"
                  }`}
                >
                  <span className={`text-[9px] font-semibold uppercase tracking-[0.18em] ${d.warn ? "text-[var(--warn)]" : "text-[var(--text-faint)]"}`}>
                    {d.label}
                  </span>
                  <span className={`text-[11px] font-bold tabular-nums ${d.warn ? "text-white" : "text-[var(--text-dim)]"}`}>
                    {d.time}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[var(--acid)] transition-all duration-300 group-hover:w-full" />
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── IDEA BANK ───────────────────────────────────────────────────────────────

function IdeaBankCountdown() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { queueMicrotask(() => setMounted(true)) }, [])

  const remainingMs = useCountdownTo(IDEA_BANK_REVEAL_MS)
  const totalSec = Math.floor(remainingMs / 1000)
  const days = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60

  if (!mounted) return <div className="h-12" />

  if (remainingMs <= 0) {
    return (
      <div className="text-sm text-[var(--acid)]">Ideas are live ↓</div>
    )
  }

  return (
    <div className="flex items-baseline gap-1 font-bold tracking-[-0.04em] text-[var(--acid)]">
      {days > 0 && <><span className="text-3xl">{days}d</span><span className="text-[var(--text-faint)] text-xl mx-1">:</span></>}
      <span className="text-3xl">{pad2(hours)}</span>
      <span className="text-[var(--text-faint)] text-xl">:</span>
      <span className="text-3xl">{pad2(minutes)}</span>
      <span className="text-[var(--text-faint)] text-xl">:</span>
      <span className="text-3xl">{pad2(seconds)}</span>
      <span className="ml-2 text-xs font-normal text-[var(--text-mute)] uppercase tracking-[0.2em]">until reveal</span>
    </div>
  )
}

const CATEGORY_LABELS: Record<string, string> = {
  ENG: "Engineering",
  OPS: "Operations",
  DESIGN: "Design",
  BIZ: "Business",
  OTHER: "Other",
}

function IdeaBankLocked({
  total,
  categoryCounts,
}: {
  total: number
  categoryCounts: Record<string, number>
}) {
  const cats = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])

  return (
    <div className="border border-[var(--line)] bg-[var(--panel)]">
      <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3">
        <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">
          # idea bank · locked
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-mute)]">
          <Lock className="size-3" />
          {total} ideas
        </span>
      </div>
      <div className="p-6">
        <IdeaBankCountdown />
        <p className="mt-3 text-sm text-[var(--text-dim)]">
          Full briefs drop{" "}
          <span className="text-white font-medium">May 20 at 6:00 PM IST</span>.
          Category breakdown available now — form your cross-dept team before the reveal.
        </p>
        {cats.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {cats.map(([cat, count]) => (
              <div
                key={cat}
                className="border border-[var(--line-2)] bg-[var(--panel-2)] px-3 py-2 text-center"
              >
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-dim)]">
                  {cat}
                </div>
                <div className="mt-0.5 text-[11px] text-[var(--text-mute)]">
                  {CATEGORY_LABELS[cat] ?? cat}
                </div>
                <div className="mt-1 text-lg font-bold text-[var(--acid)]">{count}</div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 border-t border-[var(--line)] pt-4 text-[11px] text-[var(--text-mute)]">
          Tip: cross-department teams earn bonus points regardless of which idea you pick.
        </div>
      </div>
    </div>
  )
}

function IdeaBankRevealed({ ideas }: { ideas: PublicIdeaEntry[] }) {
  const displayed = ideas.slice(0, 6)
  return (
    <div>
      <div className="grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 xl:grid-cols-3">
        {displayed.map((idea) => (
          <div
            key={idea.id}
            className="group flex flex-col gap-3 bg-[var(--panel)] p-5 hover:bg-[var(--panel-2)] transition-colors"
          >
            {idea.category && (
              <span className="self-start border border-[var(--line-2)] bg-[var(--panel-3)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-mute)]">
                {idea.category}
              </span>
            )}
            <div className="text-sm font-bold leading-tight tracking-[-0.01em] text-white">
              {idea.title}
            </div>
            <p className="text-xs leading-5 text-[var(--text-dim)] line-clamp-3">
              {idea.problemStatement}
            </p>
            {idea.stackHint && (
              <div className="mt-auto border-t border-[var(--line)] pt-3 text-[10px] text-[var(--text-faint)] uppercase tracking-[0.16em]">
                {idea.stackHint}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-[var(--text-mute)]">
          Showing {displayed.length} of {ideas.length} active ideas. Sign in to see all and claim one.
        </p>
        <Link
          href="/login"
          className="flex items-center gap-1.5 border border-[var(--acid)]/40 bg-[var(--acid)]/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--acid)] transition hover:bg-[var(--acid)]/15"
        >
          Browse all <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  )
}

export function IdeaBankSection({
  revealed,
  ideas,
  ideaBankTotal,
  ideaBankCategoryCounts,
}: {
  revealed: boolean
  ideas: PublicIdeaEntry[]
  ideaBankTotal: number
  ideaBankCategoryCounts: Record<string, number>
}) {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-14 lg:px-8">
      <Divider />
      <div className="mt-10">
        <SectionKicker># idea bank</SectionKicker>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading>What will you build?</SectionHeading>
          {!revealed && (
            <p className="text-xs text-[var(--text-mute)] pb-1">
              Or pitch your own idea — both are equally welcome.
            </p>
          )}
        </div>
        <div className="mt-6">
          {revealed ? (
            <IdeaBankRevealed ideas={ideas} />
          ) : (
            <IdeaBankLocked total={ideaBankTotal} categoryCounts={ideaBankCategoryCounts} />
          )}
        </div>
      </div>
    </section>
  )
}

// ─── SCORING ─────────────────────────────────────────────────────────────────

const JUDGE_CRITERIA = [
  "Innovation & originality",
  "Technical execution",
  "Demo quality & polish",
  "Real-world feasibility",
  "Cross-department impact",
]

const MILESTONE_CRITERIA = [
  { label: "Team formed", bonus: false },
  { label: "Cross-functional pairing", bonus: true },
  { label: "Formed before 12:00 PM lock", bonus: true },
  { label: "Idea submitted", bonus: false },
  { label: "Repo submitted", bonus: false },
  { label: "Demo video uploaded", bonus: true },
  { label: "Deck uploaded", bonus: false },
  { label: "Submitted before 5:00 PM (early window)", bonus: true },
]

export function ScoringSection() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-14 lg:px-8">
      <Divider />
      <div className="mt-10">
        <SectionKicker># scoring</SectionKicker>
        <SectionHeading>How winners are picked.</SectionHeading>
        <div className="mt-8 grid gap-px border border-[var(--line)] bg-[var(--line)] lg:grid-cols-2">
          {/* Judge score — 60% */}
          <div className="bg-[var(--panel)] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-mute)]">pillar 01</div>
                <div className="mt-1 text-4xl font-bold tracking-[-0.05em] text-white">60<span className="text-[var(--acid)]">%</span></div>
                <div className="mt-0.5 text-base font-semibold uppercase tracking-[0.14em] text-[var(--text-dim)]">Judge Score</div>
              </div>
              <Trophy className="size-6 text-[var(--text-faint)] mt-1 shrink-0" />
            </div>
            <p className="mt-4 text-xs leading-5 text-[var(--text-mute)]">
              Assessed live during demos by a panel of judges.
            </p>
            <ul className="mt-4 space-y-2">
              {JUDGE_CRITERIA.map((c) => (
                <li key={c} className="flex items-center gap-2.5 text-sm text-[var(--text-dim)]">
                  <span className="size-1.5 shrink-0 bg-[var(--acid)]" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Participation — 40% */}
          <div className="bg-[var(--panel)] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-mute)]">pillar 02</div>
                <div className="mt-1 text-4xl font-bold tracking-[-0.05em] text-white">40<span className="text-[var(--acid)]">%</span></div>
                <div className="mt-0.5 text-base font-semibold uppercase tracking-[0.14em] text-[var(--text-dim)]">Participation & Milestones</div>
              </div>
              <Zap className="size-6 text-[var(--text-faint)] mt-1 shrink-0" />
            </div>
            <p className="mt-4 text-xs leading-5 text-[var(--text-mute)]">
              Earned automatically as your team hits milestones throughout the day.
            </p>
            <ul className="mt-4 space-y-2">
              {MILESTONE_CRITERIA.map((c) => (
                <li key={c.label} className="flex items-center justify-between gap-2.5 text-sm text-[var(--text-dim)]">
                  <span className="flex items-center gap-2.5">
                    <span className="size-1.5 shrink-0 bg-[var(--text-faint)]" />
                    {c.label}
                  </span>
                  {c.bonus && (
                    <span className="shrink-0 border border-[var(--acid)]/30 px-1.5 py-px text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--acid)]">
                      bonus
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] italic text-[var(--text-faint)]">
          Exact point breakdown will be revealed closer to the event.
        </p>
      </div>
    </section>
  )
}

// ─── DAY TIMELINE ────────────────────────────────────────────────────────────

const TIMELINE_EVENTS = [
  { time: "11:00 AM", label: "Doors open", sub: "check-in", accent: false },
  { time: "12:00 PM", label: "Team lock", sub: "formation closes", accent: false },
  { time: "1:00 PM", label: "Keys reveal", sub: "env setup starts", accent: false },
  { time: "1:30 PM", label: "Build starts", sub: "4-hour window", accent: true },
  { time: "5:00 PM", label: "Early bonus", sub: "submit early = bonus", accent: false },
  { time: "5:30 PM", label: "Submissions + Demos", sub: "live judging", accent: true },
  { time: "7:00 PM+", label: "Wrap up", sub: "TBD", accent: false },
]

export function DayTimeline() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-14 lg:px-8">
      <Divider />
      <div className="mt-10">
        <SectionKicker># schedule · may 22 · IST</SectionKicker>
        <SectionHeading>The day at a glance.</SectionHeading>
        <div className="mt-8 overflow-x-auto">
          <div className="flex min-w-[640px] items-stretch border border-[var(--line)] bg-[var(--line)] gap-px">
            {TIMELINE_EVENTS.map((ev) => (
              <div
                key={ev.time}
                className={`flex flex-1 flex-col gap-1 p-4 transition-colors ${
                  ev.accent
                    ? "bg-[var(--acid)]/8 border-t-2 border-t-[var(--acid)]"
                    : "bg-[var(--panel)] hover:bg-[var(--panel-2)]"
                }`}
              >
                <div className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${ev.accent ? "text-[var(--acid)]" : "text-[var(--text-mute)]"}`}>
                  {ev.time}
                </div>
                <div className={`text-sm font-bold tracking-[-0.01em] ${ev.accent ? "text-white" : "text-[var(--text-dim)]"}`}>
                  {ev.label}
                </div>
                <div className="text-[11px] text-[var(--text-faint)]">{ev.sub}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-[11px] text-[var(--text-mute)]">
          Times shown in IST. Sign in to see your local timezone.
        </p>
      </div>
    </section>
  )
}

// ─── FAQ / RULES ─────────────────────────────────────────────────────────────

const RULES = [
  "Teams are exactly 2 people from different departments.",
  "Use any idea from the bank, or bring your own — both are equally welcome.",
  "Use any tools you want — Cursor, Claude Code, Codex, Replit, Lovable, or anything else.",
  "Host anywhere — Vercel, Cloudflare, Railway, Render, Supabase, Neon, or your own infra.",
  "Final demo must be presented live. No video-only submissions.",
  "API keys are one per team, revealed at 2:00 PM. Keep them out of public repos and screenshots.",
]

export function FAQSection() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-14 lg:px-8">
      <Divider />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div>
          <SectionKicker># rules</SectionKicker>
          <SectionHeading>The short version.</SectionHeading>
          <p className="mt-3 text-sm leading-6 text-[var(--text-dim)]">
            Full rules, tooling guides, and agent best-practices live in the handbook.
          </p>
          <Link
            href="/handbook"
            className="mt-4 inline-flex items-center gap-1.5 border border-[var(--line-2)] bg-[var(--panel-2)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-dim)] transition hover:border-[var(--acid)]/40 hover:text-[var(--acid)]"
          >
            <BookOpen className="size-3" />
            Open Handbook
          </Link>
        </div>
        <div className="border border-[var(--line)] bg-[var(--panel)]">
          <ul className="divide-y divide-[var(--line)]">
            {RULES.map((rule, i) => (
              <li key={i} className="flex items-start gap-4 px-5 py-4">
                <span className="mt-px shrink-0 text-[11px] font-bold text-[var(--acid)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-6 text-[var(--text-dim)]">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// ─── REWARDS ─────────────────────────────────────────────────────────────────

const CONFETTI_PIECES = [
  { color: "#c4ff00", left: "8%",  top: "12%", size: 10, delay: "0s",    dur: "3.2s", rot: 25  },
  { color: "#ff7ac6", left: "18%", top: "28%", size: 7,  delay: "0.4s",  dur: "2.8s", rot: -40 },
  { color: "#00d4ff", left: "30%", top: "8%",  size: 12, delay: "0.8s",  dur: "3.6s", rot: 60  },
  { color: "#ffb020", left: "45%", top: "20%", size: 8,  delay: "0.2s",  dur: "2.5s", rot: -15 },
  { color: "#9d6dff", left: "58%", top: "10%", size: 11, delay: "1.1s",  dur: "3.1s", rot: 45  },
  { color: "#ff5a3c", left: "70%", top: "25%", size: 7,  delay: "0.6s",  dur: "2.9s", rot: -60 },
  { color: "#00ff9d", left: "82%", top: "15%", size: 9,  delay: "0.3s",  dur: "3.4s", rot: 30  },
  { color: "#c4ff00", left: "90%", top: "32%", size: 6,  delay: "0.9s",  dur: "2.7s", rot: -20 },
  { color: "#ff7ac6", left: "5%",  top: "65%", size: 8,  delay: "1.3s",  dur: "3.0s", rot: 55  },
  { color: "#ffb020", left: "25%", top: "72%", size: 10, delay: "0.7s",  dur: "3.3s", rot: -35 },
  { color: "#00d4ff", left: "50%", top: "68%", size: 7,  delay: "0.5s",  dur: "2.6s", rot: 70  },
  { color: "#9d6dff", left: "75%", top: "75%", size: 9,  delay: "1.0s",  dur: "3.5s", rot: -50 },
  { color: "#ff5a3c", left: "92%", top: "60%", size: 6,  delay: "0.1s",  dur: "2.4s", rot: 15  },
]

export function RewardsSection() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-14 lg:px-8">
      <Divider />
      <div className="mt-10">
        <SectionKicker># rewards</SectionKicker>
        <SectionHeading>What you&apos;re playing for.</SectionHeading>
        <p className="mt-3 text-sm leading-6 text-[var(--text-dim)]">
          Top 2 projects get recognised and rewarded. Details dropping soon — build something worth winning.
        </p>

        {/* Main rewards arena */}
        <div className="relative mt-8 overflow-hidden border border-[var(--line)]"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(196,255,0,0.07) 0%, rgba(0,0,0,0) 65%), linear-gradient(180deg, #060606 0%, #020202 100%)" }}
        >
          {/* Confetti pieces */}
          {CONFETTI_PIECES.map((p, i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{
                position: "absolute",
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                background: p.color,
                opacity: 0.7,
                transform: `rotate(${p.rot}deg)`,
                animation: `confetti-float ${p.dur} ${p.delay} ease-in-out infinite alternate`,
                borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "0" : "1px",
                boxShadow: `0 0 ${p.size * 2}px ${p.color}88`,
              }}
            />
          ))}

          <style>{`
            @keyframes confetti-float {
              0%   { transform: rotate(var(--rot, 0deg)) translateY(0px) scale(1); opacity: 0.6; }
              100% { transform: rotate(calc(var(--rot, 0deg) + 25deg)) translateY(-12px) scale(1.15); opacity: 0.9; }
            }
          `}</style>

          {/* Prize cards */}
          <div className="relative z-10 grid sm:grid-cols-2">
            {/* 1st place */}
            <div className="relative flex flex-col items-center gap-5 border-b border-[var(--line)] p-10 sm:border-b-0 sm:border-r">
              <div
                className="flex size-20 items-center justify-center text-5xl"
                style={{ filter: "drop-shadow(0 0 24px rgba(255,176,32,0.6))" }}
              >
                🏆
              </div>
              <div className="text-center">
                <div
                  className="text-[11px] font-bold uppercase tracking-[0.3em]"
                  style={{ color: "#ffb020" }}
                >
                  1st place
                </div>
                <div className="mt-1 text-3xl font-bold tracking-[-0.04em] text-white">
                  Best Project
                </div>
              </div>
              <div
                className="w-full border border-dashed px-5 py-3 text-center"
                style={{ borderColor: "rgba(255,176,32,0.35)", background: "rgba(255,176,32,0.06)" }}
              >
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="size-1.5 animate-pulse rounded-full"
                    style={{ background: "#ffb020" }}
                  />
                  <span
                    className="text-xs font-bold uppercase tracking-[0.22em]"
                    style={{ color: "#ffb020" }}
                  >
                    Coming soon
                  </span>
                </span>
                <p className="mt-1 text-[11px] text-[var(--text-faint)]">
                  Reward details reveal on Tech Day
                </p>
              </div>
            </div>

            {/* 2nd place */}
            <div className="relative flex flex-col items-center gap-5 p-10">
              <div
                className="flex size-20 items-center justify-center text-5xl"
                style={{ filter: "drop-shadow(0 0 24px rgba(148,163,184,0.5))" }}
              >
                🥈
              </div>
              <div className="text-center">
                <div
                  className="text-[11px] font-bold uppercase tracking-[0.3em]"
                  style={{ color: "#94a3b8" }}
                >
                  2nd place
                </div>
                <div className="mt-1 text-3xl font-bold tracking-[-0.04em] text-white">
                  Runner-up
                </div>
              </div>
              <div
                className="w-full border border-dashed px-5 py-3 text-center"
                style={{ borderColor: "rgba(148,163,184,0.3)", background: "rgba(148,163,184,0.05)" }}
              >
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="size-1.5 animate-pulse rounded-full"
                    style={{ background: "#94a3b8" }}
                  />
                  <span
                    className="text-xs font-bold uppercase tracking-[0.22em]"
                    style={{ color: "#94a3b8" }}
                  >
                    Coming soon
                  </span>
                </span>
                <p className="mt-1 text-[11px] text-[var(--text-faint)]">
                  Reward details reveal on Tech Day
                </p>
              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="relative z-10 border-t border-[var(--line)] bg-black/40 px-8 py-4 text-center">
            <p className="text-[11px] text-[var(--text-faint)]">
              Winners announced after demos wrap — timing TBD.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── CTA FOOTER ──────────────────────────────────────────────────────────────

export function CTAFooter() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 lg:px-8">
      <div className="panel-highlight border border-[var(--acid)]/30 bg-[var(--panel)] p-10 text-center">
        <div className="text-[11px] uppercase tracking-[0.26em] text-[var(--acid)]">
          # ready to build?
        </div>
        <h2 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-white md:text-5xl">
          Claim your spot.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[var(--text-dim)]">
          Sign in with your Altir email to form a team, browse the idea bank, and lock in your build.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 border border-[var(--acid)] bg-[var(--acid)] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-black transition hover:bg-[var(--acid-2)] hover:border-[var(--acid-2)]"
          >
            Sign in to get started <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 border border-[var(--line-2)] bg-[var(--panel-2)] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-dim)] transition hover:border-[var(--line-3)] hover:text-white"
          >
            Preview the floor
          </Link>
        </div>
        <p className="mt-5 text-[11px] text-[var(--text-faint)]">
          Employee login · no account creation needed
        </p>
      </div>
    </section>
  )
}
