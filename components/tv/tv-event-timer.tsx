"use client"

import { useEffect, useState } from "react"

import { TECH_DAY_BUILD_START_MS } from "@/lib/tech-day-schedule"

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function formatRemaining(totalMs: number) {
  const totalSec = Math.max(0, Math.floor(totalMs / 1000))
  const days = Math.floor(totalSec / 86400)
  const h = Math.floor((totalSec % 86400) / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (days > 0) {
    return `${days}d ${pad2(h)}:${pad2(m)}:${pad2(s)}`
  }
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`
}

function formatElapsed(totalMs: number) {
  const totalSec = Math.floor(totalMs / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const hStr = h >= 100 ? String(h) : pad2(h)
  return `${hStr}:${pad2(m)}:${pad2(s)}`
}

export function TvEventTimer() {
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(0)

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true)
      setNow(Date.now())
    })
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const beforeStart = mounted ? now < TECH_DAY_BUILD_START_MS : true
  const remainingMs = TECH_DAY_BUILD_START_MS - now
  const elapsedMs = now - TECH_DAY_BUILD_START_MS

  const display = !mounted ? "– – : – – : – –" : beforeStart ? formatRemaining(remainingMs) : formatElapsed(elapsedMs)

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border border-[var(--line)] bg-[var(--panel-2)] px-6 py-5">
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-mute)]">
          {beforeStart ? "until build starts" : "build elapsed"}
        </div>
        <div className="mt-1 font-mono text-4xl font-bold tabular-nums tracking-tight text-[var(--acid)] sm:text-5xl md:text-6xl">{display}</div>
      </div>
      <div className="text-right text-[10px] uppercase tracking-[0.18em] text-[var(--text-dim)]">
        <div className="text-[var(--text-mute)]">build opens (IST)</div>
        <div className="mt-1 font-mono text-xs text-white">2026-05-22 · 14:30</div>
      </div>
    </div>
  )
}
