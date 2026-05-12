"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { TeamOnboardingState } from "@/lib/participant-onboarding"
import { getOnboardingStepStatuses, shouldShowOnboardingBanner } from "@/lib/participant-onboarding"
import { cn } from "@/lib/utils"

export function ParticipantOnboardingStrip({ teamSlug, state }: { teamSlug: string; state: TeamOnboardingState }) {
  const pathname = usePathname() ?? ""
  const steps = getOnboardingStepStatuses(state)
  const showBanner = shouldShowOnboardingBanner(teamSlug, pathname, state)

  return (
    <div className="space-y-3">
      <div className="border border-[var(--line)] bg-black/45">
        <div className="border-b border-[var(--line)] px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-mute)]">Onboarding</p>
        </div>
        <div className="grid divide-y divide-[var(--line)] sm:grid-cols-7 sm:divide-x sm:divide-y-0">
          {steps.map((s) => (
            <div
              key={s.id}
              className={cn(
                "px-2 py-3 text-center",
                s.tone === "complete" && "bg-[var(--acid)]/6",
                s.tone === "current" && "bg-[var(--warn)]/10 ring-1 ring-inset ring-amber-400/35",
                s.tone === "upcoming" && "opacity-70",
              )}
            >
              <div className="text-[9px] font-bold uppercase leading-tight tracking-[0.08em] text-[var(--text-mute)]">
                {s.label}
              </div>
              <div
                className={cn(
                  "mt-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em]",
                  s.tone === "complete" && "text-[var(--acid)]",
                  s.tone === "current" && "text-amber-200",
                  s.tone === "upcoming" && "text-[var(--text-faint)]",
                )}
              >
                {s.tone === "complete" ? "done" : s.tone === "current" ? "now" : "—"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showBanner ? (
        <div className="flex flex-col gap-3 border border-amber-400/45 bg-amber-400/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">Continue onboarding</p>
            <p className="mt-1 text-sm font-semibold text-white">{state.bannerTitle}</p>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[var(--text-dim)]">{state.bannerBody}</p>
          </div>
          <Link
            href={state.nextHref}
            className="shrink-0 border border-amber-400/50 bg-black/40 px-4 py-2 text-center font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-amber-100 transition hover:border-[var(--acid)]/50 hover:text-[var(--acid)]"
          >
            {state.nextLabel} →
          </Link>
        </div>
      ) : null}
    </div>
  )
}
