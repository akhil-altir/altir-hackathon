"use client"

import Link from "next/link"
import { useActionState, useState } from "react"

import { createTeamAction } from "./actions"
import { Button } from "@/components/ui/button"
import { EVENT_POINT_WEIGHTS, EVENT_TEAM_FORMATION_MAX } from "@/lib/event-point-weights"

type FormationPreview = {
  completeTeam: number
  crossAssignment: number
  formedBeforeLock: number
  maxIfAllApply: number
}

type Partner = {
  id: string
  email: string
  fullName: string
  title: string | null
  primaryAssignment: string | null
  secondaryAssignment: string | null
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function TeamFormClient({
  currentUser,
  partners,
  formationPreview,
}: {
  currentUser: { id: string; fullName: string; primaryAssignment: string | null }
  partners: Partner[]
  formationPreview?: FormationPreview
}) {
  const [state, formAction, pending] = useActionState(createTeamAction, null)
  const [selectedPartner, setSelectedPartner] = useState<string>("")
  const [search, setSearch] = useState("")
  const [teamName, setTeamName] = useState("")

  const fp =
    formationPreview ??
    ({
      completeTeam: EVENT_POINT_WEIGHTS.team_formed,
      crossAssignment: EVENT_POINT_WEIGHTS.cross_assignment,
      formedBeforeLock: EVENT_POINT_WEIGHTS.formed_before_lock,
      maxIfAllApply: EVENT_TEAM_FORMATION_MAX,
    } satisfies FormationPreview)

  const filtered = search
    ? partners.filter(
        (p) =>
          p.fullName.toLowerCase().includes(search.toLowerCase()) ||
          p.primaryAssignment?.toLowerCase().includes(search.toLowerCase()) ||
          p.email.toLowerCase().includes(search.toLowerCase()),
      )
    : partners

  const partner = partners.find((x) => x.id === selectedPartner)
  const displayName = teamName.trim() || "YOUR TEAM"
  const nameOk = teamName.trim().length >= 2

  return (
    <form action={formAction} className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">team name</label>
          <div className="relative flex h-14 items-center gap-3 border border-[var(--acid)]/50 bg-black px-4">
            <span className="text-[var(--acid)]">▶</span>
            <input
              name="teamName"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value.toUpperCase())}
              placeholder="QUOTEBOT"
              className="h-full min-w-0 flex-1 border-0 bg-transparent text-2xl font-bold tracking-[0.06em] text-white outline-none placeholder:text-[var(--text-faint)]"
            />
            {nameOk ? (
              <span className="shrink-0 rounded-sm border border-[var(--acid)]/40 bg-[var(--acid)]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                available
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-[11px] text-[var(--text-mute)]">
            3-24 chars · letters, numbers, dashes · public on the TV display
          </p>
        </div>

        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">
            search teammates ({partners.length} available)
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, dept, or email..."
            className="h-11 w-full rounded-none border border-[var(--line)] bg-black px-4 font-mono text-sm text-white outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
          />
        </div>

        <input type="hidden" name="partnerId" value={selectedPartner} />

        <div>
          <div className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">your teammate</div>
          <div className="grid max-h-[400px] gap-2 overflow-auto terminal-scrollbar md:grid-cols-2">
            {filtered.map((person) => (
              <button
                key={person.id}
                type="button"
                onClick={() => setSelectedPartner(person.id)}
                className={`flex items-center gap-3 border p-3 text-left transition hover:border-[var(--acid)]/60 ${
                  selectedPartner === person.id
                    ? "border-[var(--acid)]/60 bg-[var(--acid)]/10"
                    : "border-[var(--line)] bg-[var(--panel-2)]"
                }`}
              >
                <span
                  className="grid size-9 place-items-center border text-xs font-bold text-black"
                  style={{
                    backgroundColor: selectedPartner === person.id ? "#ff7ac6" : "var(--line-3)",
                    borderColor: selectedPartner === person.id ? "#ff7ac6" : "var(--line-3)",
                  }}
                >
                  {initials(person.fullName)}
                </span>
                <span>
                  <span className="block text-sm font-bold text-white">{person.fullName}</span>
                  <span className="text-xs text-[var(--text-dim)]">
                    {person.primaryAssignment ?? "Unassigned"} · {person.title ?? "—"}
                  </span>
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-2 p-4 text-center text-sm text-[var(--text-mute)]">
                No available teammates match your search.
              </div>
            )}
          </div>
          <p className="mt-3 text-[11px] text-[var(--text-mute)]">
            {partners.length} employees available · already-paired teammates are hidden
          </p>
        </div>
      </div>

      <div className="preview-brackets panel-highlight self-start border border-[var(--line)] bg-[var(--panel)] p-5">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">team preview</div>

        <div className="mt-4 flex items-center gap-3">
          <span className="size-5 bg-pink-400 shadow-[0_0_18px_rgba(244,114,182,0.65)]" />
          <span className="text-3xl font-bold tracking-[0.08em] text-white">{displayName}</span>
        </div>
        <div className="mt-1 text-[11px] text-[var(--text-mute)]">auto-assigned color · hues rotate per team</div>

        <div className="my-5 border-t border-[var(--line)]" />

        <div className="flex items-center gap-3 border-b border-[var(--line)] py-3">
          <span className="grid size-9 place-items-center bg-[var(--acid)] text-xs font-bold text-black">{initials(currentUser.fullName)}</span>
          <div>
            <div className="font-bold text-white">
              {currentUser.fullName} <span className="ml-2 text-[10px] text-[var(--acid)]">YOU</span>
            </div>
            <div className="text-xs text-[var(--text-dim)]">{currentUser.primaryAssignment ?? "Unassigned"}</div>
          </div>
        </div>

        {partner ? (
          <div className="flex items-center gap-3 py-3">
            <span
              className="grid size-9 place-items-center text-xs font-bold text-black"
              style={{
                backgroundColor: "#ff7ac6",
                borderColor: "#ff7ac6",
                boxShadow: "0 0 18px rgba(244,114,182,0.65)",
              }}
            >
              {initials(partner.fullName)}
            </span>
            <div>
              <div className="font-bold text-white">{partner.fullName}</div>
              <div className="text-xs text-[var(--text-dim)]">
                {partner.primaryAssignment ?? "Unassigned"} · {partner.title ?? "—"}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-sm text-[var(--text-mute)]">Select a teammate →</div>
        )}

        <div className="mt-4 border border-[var(--line)] bg-[var(--panel-2)] p-4">
          <div className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">event points you&apos;ll earn</div>
          {[
            ["Complete team", `+${fp.completeTeam}`],
            ["Different primary assignments", `+${fp.crossAssignment}`],
            ["Formed before lock", `+${fp.formedBeforeLock}`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-1 text-xs">
              <span className="text-[var(--text-dim)]">{label}</span>
              <span className="font-bold text-[var(--acid)]">{value}</span>
            </div>
          ))}
          <div className="mt-3 flex justify-between border-t border-[var(--line)] pt-3">
            <span className="text-xs uppercase text-[var(--text-dim)]">max if all apply</span>
            <span className="text-2xl font-bold text-[var(--acid)]">{fp.maxIfAllApply} pts</span>
          </div>
        </div>

        {state?.error && (
          <div className="mt-4 border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">{state.error}</div>
        )}

        <Button
          type="submit"
          disabled={pending || !selectedPartner || !nameOk}
          className="mt-5 w-full rounded-none bg-[var(--acid)] font-mono text-black uppercase tracking-[0.12em] hover:bg-[var(--acid-2)]"
        >
          {pending ? "Creating team..." : "▶ Lock it in"}
        </Button>
        <div className="mt-3 text-center">
          <Link href="/" className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-mute)] hover:text-white">
            Cancel
          </Link>
        </div>
      </div>
    </form>
  )
}
