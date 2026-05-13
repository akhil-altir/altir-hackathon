"use client"

import { useEffect, useMemo, useState } from "react"

import { TECH_DAY_BUILD_END_MS, TECH_DAY_BUILD_START_MS } from "@/lib/tech-day-schedule"

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function formatHms(ms: number): string {
  const totalSec = Math.floor(Math.max(0, ms) / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`
}

function formatDhm(ms: number): string {
  const totalSec = Math.floor(Math.max(0, ms) / 1000)
  const d = Math.floor(totalSec / 86400)
  const h = Math.floor((totalSec % 86400) / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  if (d > 0) return `${d}d ${pad2(h)}h ${pad2(m)}m`
  return `${pad2(h)}h ${pad2(m)}m`
}

const ONE_DAY_MS = 86_400_000

export function BuildCountdown() {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const eventDateLabel = useMemo(() => {
    return new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }).format(new Date(TECH_DAY_BUILD_START_MS))
  }, [])

  if (now === null) {
    return (
      <>
        <span className="hidden md:inline">22 MAY · 14:30 IST</span>
        <span className="text-white">--d --h --m</span>
      </>
    )
  }

  const msUntilStart = TECH_DAY_BUILD_START_MS - now
  const msUntilEnd = TECH_DAY_BUILD_END_MS - now

  if (now < TECH_DAY_BUILD_START_MS) {
    if (msUntilStart >= ONE_DAY_MS) {
      return (
        <>
          <span className="hidden md:inline">{eventDateLabel} IST</span>
          <span className="text-white">{formatDhm(msUntilStart)}</span>
        </>
      )
    }
    return (
      <>
        <span className="hidden md:inline">BUILD OPENS IN</span>
        <span className="text-white">{formatHms(msUntilStart)}</span>
      </>
    )
  }

  if (now < TECH_DAY_BUILD_END_MS) {
    return (
      <>
        <span className="hidden md:inline">BUILD ENDS IN</span>
        <span className="text-white">{formatHms(msUntilEnd)}</span>
      </>
    )
  }

  return (
    <>
      <span className="hidden md:inline">SUBMISSIONS CLOSED</span>
      <span className="text-white">00:00:00</span>
    </>
  )
}
