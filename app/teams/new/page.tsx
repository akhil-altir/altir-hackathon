import { redirect } from "next/navigation"

import { logoutAction } from "@/app/login/actions"
import { TeamFormClient } from "./team-form"
import { getAvailableEmployees, getUserTeam } from "@/lib/data"
import { getSession } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function NewTeamPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const existingTeam = await getUserTeam(session.userId)
  if (existingTeam) redirect(`/teams/${existingTeam.slug}`)

  const availableEmployees = await getAvailableEmployees()
  // Filter out the current user from the partner list
  const partners = availableEmployees.filter((e) => e.id !== session.userId)

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
            <span className="ml-3 uppercase tracking-[0.28em] text-[var(--text-mute)]">form a team</span>
          </div>
          <div className="hidden rounded border border-[var(--line)] bg-[var(--panel)] px-4 py-1 md:block">
            techday.altir.internal/teams/new
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[var(--text-dim)]">{session.fullName}</span>
            <form action={logoutAction}>
              <button className="text-[var(--text-mute)] transition hover:text-white">logout</button>
            </form>
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8">
          <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[var(--acid)]">
            step 01 / form a team
          </div>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">
            Pick yourself + one partner.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--text-dim)]">
            Teams are exactly 2 people. Cross-department pairs unlock bonus event points.
            Changes lock at 1:00 PM on event day.
          </p>

          <TeamFormClient
            currentUser={{ id: session.userId, fullName: session.fullName, primaryAssignment: session.primaryAssignment }}
            partners={partners}
          />
        </div>
      </div>
    </main>
  )
}
