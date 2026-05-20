"use client"

import { useState } from "react"
import { Check, Copy, Eye, EyeOff } from "lucide-react"

import { updateApiKeyDetails } from "@/app/admin/actions"

type AdminApiKeySecretCellProps = {
  apiKeyId: string
  label: string
  secret: string
  notes: string | null
  isRevoked: boolean
}

export function AdminApiKeySecretCell({ apiKeyId, label, secret, notes, isRevoked }: AdminApiKeySecretCellProps) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [editing, setEditing] = useState(false)

  const masked = secret.slice(0, 4) + "•".repeat(Math.max(0, secret.length - 4))

  async function handleCopy() {
    await navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span
          className="min-w-0 flex-1 truncate font-mono text-xs"
          style={{ color: isRevoked ? "var(--text-mute)" : "white", textDecoration: isRevoked ? "line-through" : "none" }}
        >
          {visible ? secret : masked}
        </span>
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="text-[var(--text-mute)] hover:text-white"
          aria-label={visible ? "Hide key" : "Show key"}
        >
          {visible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="text-[var(--text-mute)] hover:text-white"
          aria-label="Copy key"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="h-6 border border-[var(--line)] px-2 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-mute)] hover:border-[var(--text-mute)] hover:text-white"
        >
          {editing ? "close" : "edit"}
        </button>
      </div>

      {editing && (
        <form action={updateApiKeyDetails} className="grid gap-1.5">
          <input type="hidden" name="apiKeyId" value={apiKeyId} />
          <input
            name="label"
            required
            defaultValue={label}
            placeholder="label"
            className="h-7 w-full rounded-none border border-[var(--line)] bg-black px-2 font-mono text-[10px] text-white outline-none focus:border-[var(--acid)]"
          />
          <input
            name="secret"
            required
            defaultValue={secret}
            placeholder="secret"
            className="h-7 w-full rounded-none border border-[var(--line)] bg-black px-2 font-mono text-[10px] text-white outline-none focus:border-[var(--acid)]"
          />
          <input
            name="notes"
            defaultValue={notes ?? ""}
            placeholder="notes / model"
            className="h-7 w-full rounded-none border border-[var(--line)] bg-black px-2 font-mono text-[10px] text-white outline-none focus:border-[var(--acid)]"
          />
          <div>
            <button
              type="submit"
              className="h-7 border border-[var(--line)] px-2.5 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-mute)] hover:border-[var(--text-mute)] hover:text-white"
            >
              save key
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
