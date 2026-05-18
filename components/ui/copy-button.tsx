"use client"

import { useState } from "react"
import { Check, Copy, Eye, EyeOff } from "lucide-react"

export function PasswordInput({ name, placeholder, autoComplete }: { name: string; placeholder?: string; autoComplete?: string }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <input
        name={name}
        type={visible ? "text" : "password"}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="h-11 w-full rounded-none border border-[var(--line)] bg-black px-4 pr-11 font-mono text-sm text-white outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--text-mute)] transition-colors hover:text-[var(--acid)]"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button onClick={handleCopy} className="cursor-pointer text-[var(--acid)] transition-opacity hover:opacity-70" aria-label="Copy to clipboard">
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </button>
  )
}

export function ApiKeyField({ value }: { value: string }) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const masked = value.slice(0, 4) + "•".repeat(Math.max(0, value.length - 4))

  async function handleCopy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mt-3 flex items-center justify-between border border-[var(--acid)]/40 bg-black p-3 font-mono text-xs text-[var(--acid)]">
      <span className="min-w-0 flex-1 truncate select-all">{visible ? value : masked}</span>
      <div className="ml-3 flex shrink-0 items-center gap-2">
        <button
          onClick={() => setVisible((v) => !v)}
          className="cursor-pointer text-[var(--acid)] transition-opacity hover:opacity-70"
          aria-label={visible ? "Hide key" : "Show key"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
        <button
          onClick={handleCopy}
          className="cursor-pointer text-[var(--acid)] transition-opacity hover:opacity-70"
          aria-label="Copy to clipboard"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
    </div>
  )
}
