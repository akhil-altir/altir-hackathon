"use client"

import { useActionState, useState } from "react"

import { createTeamAction } from "./actions"
import { Button } from "@/components/ui/button"

type Partner = {
  id: string
  email: string
  fullName: string
  title: string | null
  primaryAssignment: string | null
  secondaryAssignment: string | null
}

export function TeamFormClient({
  currentUser,
  partners,
}: {
  currentUser: { id: string; fullName: string; primaryAssignment: string | null }
  partners: Partner[]
}) {
  const [state, formAction, pending] = useActionState(createTeamAction, null)
  const [selectedPartner, setSelectedPartner] = useState<string>("")
  const [search, setSearch] = useState("")

  const filtered = search
    ? partners.filter(
        (p) =>
          p.fullName.toLowerCase().includes(search.toLowerCase()) ||
          p.primaryAssignment?.toLowerCase().includes(search.toLowerCase()) ||
          p.email.toLowerCase().includes(search.toLowerCase()),
      )
    : partners

  return (
    <form action={formAction} className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">
            team name
          </label>
          <input
            name="teamName"
            required
            placeholder="e.g. QUOTEBOT"
            className="h-14 w-full rounded-none border border-[var(--acid)]/50 bg-black px-4 text-2xl font-bold tracking-[0.06em] text-white outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
          />
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
                {person.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
              <span>
                <span className="block text-sm font-bold text-white">{person.fullName}</span>
                <span className="text-xs text-[var(--text-dim)]">
                  {person.primaryAssignment ?? "Unassigned"} / {person.title ?? ""}
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
      </div>

      <div className="self-start border border-[var(--line)] bg-[var(--panel)] p-5"
        style={{ boxShadow: "inset 0 0 0 1px rgba(196, 255, 0, 0.42), 0 0 28px rgba(196, 255, 0, 0.16)" }}>
        <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">team preview</div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3 border-b border-[var(--line)] pb-3">
            <span className="grid size-9 place-items-center bg-[var(--acid)] text-xs font-bold text-black">
              {currentUser.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </span>
            <div>
              <div className="font-bold text-white">
                {currentUser.fullName} <span className="ml-2 text-[10px] text-[var(--acid)]">YOU</span>
              </div>
              <div className="text-xs text-[var(--text-dim)]">{currentUser.primaryAssignment ?? "Unassigned"}</div>
            </div>
          </div>

          {selectedPartner ? (
            (() => {
              const p = partners.find((x) => x.id === selectedPartner)
              if (!p) return null
              return (
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center bg-pink-400 text-xs font-bold text-black"
                    style={{ boxShadow: "0 0 18px rgba(244,114,182,0.65)" }}>
                    {p.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                  <div>
                    <div className="font-bold text-white">{p.fullName}</div>
                    <div className="text-xs text-[var(--text-dim)]">{p.primaryAssignment ?? "Unassigned"}</div>
                  </div>
                </div>
              )
            })()
          ) : (
            <div className="py-3 text-center text-sm text-[var(--text-mute)]">Select a teammate →</div>
          )}
        </div>

        {state?.error && (
          <div className="mt-4 border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {state.error}
          </div>
        )}

        <Button
          type="submit"
          disabled={pending || !selectedPartner}
          className="mt-6 w-full rounded-none font-mono uppercase tracking-[0.12em]"
        >
          {pending ? "Creating team..." : "Lock it in"}
        </Button>
      </div>
    </form>
  )
}
