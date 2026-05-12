import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { teamHueFromSlug } from "@/lib/team-visual"

function TeamConfettiGlyphField() {
  const glyphs = ["#", "+", "x", "<>", "*", "/", "\\"]
  const colors = ["#c4ff00", "#ff7ac6", "#00d4ff", "#ffb020", "#9d6dff", "#00ff9d", "#ff5a3c"]

  return (
    <div className="pointer-events-none absolute inset-0 opacity-80">
      {glyphs.map((glyph, index) => (
        <span
          key={`${glyph}-${index}`}
          className="absolute text-lg font-bold"
          style={{
            left: `${8 + index * 13}%`,
            top: `${8 + (index % 3) * 18}%`,
            color: colors[index % colors.length],
            textShadow: "0 0 14px currentColor",
          }}
        >
          {glyph}
        </span>
      ))}
    </div>
  )
}

type TeamLockedCelebrationProps = {
  teamName: string
  teamSlug: string
  lockedAtLabel: string
}

export function TeamLockedCelebration({ teamName, teamSlug, lockedAtLabel }: TeamLockedCelebrationProps) {
  const hue = teamHueFromSlug(teamSlug)
  const displayName = teamName.toUpperCase()

  return (
    <>
      <Card
        className="panel-surface relative overflow-hidden rounded-none border-[var(--line)]"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(196, 255, 0, 0.22), 0 0 32px rgba(244, 114, 182, 0.08)",
        }}
      >
        <TeamConfettiGlyphField />
        <CardContent className="relative p-8 md:p-12">
          <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--acid)]"># team locked / {lockedAtLabel}</div>
          <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-[0.95] tracking-[-0.05em] text-white md:text-7xl">
            <span
              className="drop-shadow-[0_0_24px_rgba(244,114,182,0.45)]"
              style={{ color: hue, textShadow: `0 0 28px ${hue}66` }}
            >
              {displayName}
            </span>{" "}
            is in the room.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[var(--text-dim)]">
            Both members are on the roster and your workspace is live. Next up: pick or submit an idea before the API key
            reveals at the scheduled time.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              asChild
              className="rounded-none border border-[var(--acid)]/50 bg-[var(--acid)]/15 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--acid)] hover:bg-[var(--acid)]/25"
            >
              <Link href={`/teams/${teamSlug}/idea`}>
                Choose your idea <ArrowRight className="ml-1 inline size-3" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-none border-[var(--line)] font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)] hover:border-[var(--acid)]/40 hover:text-white"
            >
              <Link href="/handbook">Hack handbook</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
