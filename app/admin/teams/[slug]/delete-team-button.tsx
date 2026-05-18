"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { deleteTeam } from "@/app/admin/actions"

export function DeleteTeamButton({ teamId, teamName }: { teamId: string; teamName: string }) {
  const [confirmed, setConfirmed] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  function handleFirstClick() {
    setConfirmed(true)
  }

  function handleCancel() {
    setConfirmed(false)
  }

  function handleConfirm() {
    startTransition(async () => {
      const fd = new FormData()
      fd.set("teamId", teamId)
      await deleteTeam(fd)
      router.push("/admin/teams")
    })
  }

  if (!confirmed) {
    return (
      <button
        type="button"
        onClick={handleFirstClick}
        className="border border-red-700/50 bg-red-950/40 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-red-400 transition hover:border-red-500 hover:text-red-300"
      >
        Delete team
      </button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-[11px] text-red-300">
        Delete &ldquo;{teamName}&rdquo;? This cannot be undone.
      </span>
      <button
        type="button"
        onClick={handleConfirm}
        disabled={isPending}
        className="border border-red-500 bg-red-900/60 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-red-200 transition hover:bg-red-800/60 disabled:opacity-50"
      >
        {isPending ? "Deleting…" : "Yes, delete"}
      </button>
      <button
        type="button"
        onClick={handleCancel}
        disabled={isPending}
        className="border border-[var(--line)] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-dim)] transition hover:border-white/30 hover:text-white disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  )
}
