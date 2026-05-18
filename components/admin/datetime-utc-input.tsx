"use client"

import { useState } from "react"

function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function DateTimeUtcInput({
  name,
  defaultValue,
  className,
}: {
  name: string
  defaultValue: Date | null
  className?: string
}) {
  const [utcIso, setUtcIso] = useState(defaultValue?.toISOString() ?? "")
  const [display, setDisplay] = useState(defaultValue ? toLocalInputValue(defaultValue) : "")

  return (
    <>
      <input type="hidden" name={name} value={utcIso} />
      <input
        type="datetime-local"
        value={display}
        className={className}
        onChange={(e) => {
          setDisplay(e.target.value)
          setUtcIso(e.target.value ? new Date(e.target.value).toISOString() : "")
        }}
      />
    </>
  )
}
