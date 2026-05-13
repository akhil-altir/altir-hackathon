"use client"

import { useEffect, useState } from "react"

import { TECH_DAY_BUILD_END_MS, TECH_DAY_BUILD_START_MS } from "@/lib/tech-day-schedule"

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function formatMs(ms: number): string {
  const totalSec = Math.floor(Math.max(0, ms) / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`
}

export function BuildCountdown() {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  if (now === null) {
    return (
      <>
        <span className="hidden md:inline">BUILD</span>
        <span className="text-white">--:--:--</span>
      </>
    )
  }

  let phase: string
  let countdown: string

  if (now < TECH_DAY_BUILD_START_MS) {
    phase = "BUILD OPENS IN"
    countdown = formatMs(TECH_DAY_BUILD_START_MS - now)
  } else if (now < TECH_DAY_BUILD_END_MS) {
    phase = "BUILD ENDS IN"
    countdown = formatMs(TECH_DAY_BUILD_END_MS - now)
  } else {
    phase = "SUBMISSIONS CLOSED"
    countdown = "00:00:00"
  }

  return (
    <>
      <span className="hidden md:inline">{phase}</span>
      <span className="text-white">{countdown}</span>
    </>
  )
}
