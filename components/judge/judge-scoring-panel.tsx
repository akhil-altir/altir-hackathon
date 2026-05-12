"use client"

import Link from "next/link"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react"

import { submitJudgeScoresAction } from "@/app/judge/[slug]/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type JudgeCriterion = {
  id: string
  label: string
  description: string | null
  maxScore: number
}

type DraftPayload = {
  v: 1
  savedAt: number
  scores: Record<string, number>
  note: string
}

const draftKey = (teamSlug: string) => `altir-judge-draft:${teamSlug}`

function loadDraft(teamSlug: string): DraftPayload | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(draftKey(teamSlug))
    if (!raw) return null
    const p = JSON.parse(raw) as DraftPayload
    if (p?.v !== 1 || typeof p.savedAt !== "number" || typeof p.scores !== "object") return null
    return p
  } catch {
    return null
  }
}

function saveDraft(teamSlug: string, payload: DraftPayload) {
  try {
    localStorage.setItem(draftKey(teamSlug), JSON.stringify(payload))
  } catch {
    /* ignore quota */
  }
}

type Props = {
  teamSlug: string
  criteria: JudgeCriterion[]
  initialScores: Record<string, number>
  initialNote: string
  teamEventPts: number
  judgeDisplay: string
  children: ReactNode
}

const submitBtnClass =
  "h-12 w-full rounded-none bg-[var(--acid)] font-mono text-sm font-bold text-black uppercase tracking-[0.12em] hover:bg-[var(--acid-2)]"

export function JudgeScoringPanel({
  teamSlug,
  criteria,
  initialScores,
  initialNote,
  teamEventPts,
  judgeDisplay,
  children,
}: Props) {
  const initialTouched = useMemo(() => {
    const t: Record<string, boolean> = {}
    for (const id of Object.keys(initialScores)) t[id] = true
    return t
  }, [initialScores])

  const [values, setValues] = useState<Record<string, number>>(() => {
    const v: Record<string, number> = {}
    for (const c of criteria) {
      v[c.id] = initialScores[c.id] ?? 0
    }
    return v
  })

  const [touched, setTouched] = useState<Record<string, boolean>>(initialTouched)
  const [note, setNote] = useState(initialNote)
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null)
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useLayoutEffect(() => {
    const draft = loadDraft(teamSlug)
    if (!draft) return
    queueMicrotask(() => {
      setValues((prev) => {
        const next = { ...prev }
        for (const [id, n] of Object.entries(draft.scores)) {
          if (typeof n === "number" && !Number.isNaN(n) && id in next) {
            const c = criteria.find((x) => x.id === id)
            if (c) next[id] = Math.min(c.maxScore, Math.max(0, n))
          }
        }
        return next
      })
      setTouched((prev) => {
        const next = { ...prev }
        for (const id of Object.keys(draft.scores)) {
          if (criteria.some((c) => c.id === id)) next[id] = true
        }
        return next
      })
      if (draft.note) setNote(draft.note)
      setDraftSavedAt(new Date(draft.savedAt))
    })
  }, [teamSlug, criteria])

  const persistDraft = useCallback(() => {
    const scores: Record<string, number> = {}
    for (const c of criteria) {
      if (touched[c.id]) scores[c.id] = values[c.id] ?? 0
    }
    const savedAt = Date.now()
    saveDraft(teamSlug, { v: 1, savedAt, scores, note })
    setDraftSavedAt(new Date(savedAt))
  }, [criteria, note, teamSlug, touched, values])

  useEffect(() => {
    if (draftTimer.current) clearTimeout(draftTimer.current)
    draftTimer.current = setTimeout(() => {
      persistDraft()
      draftTimer.current = null
    }, 650)
    return () => {
      if (draftTimer.current) clearTimeout(draftTimer.current)
    }
  }, [values, note, touched, persistDraft])

  const includedIds = useMemo(
    () => criteria.filter((c) => touched[c.id] || initialScores[c.id] !== undefined).map((c) => c.id),
    [criteria, initialScores, touched],
  )

  const composite =
    includedIds.length > 0
      ? (includedIds.reduce((s, id) => s + (values[id] ?? 0), 0) / includedIds.length).toFixed(1)
      : "—"

  const maxRef = criteria[0]?.maxScore ?? 100
  const draftLabel =
    draftSavedAt != null
      ? `draft · autosaved ${draftSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
      : "draft · autosaved"

  return (
    <form
      id="judge-score-form"
      action={submitJudgeScoresAction}
      onSubmit={() => {
        try {
          localStorage.removeItem(draftKey(teamSlug))
        } catch {
          /* ignore */
        }
      }}
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]"
    >
      <input type="hidden" name="teamSlug" value={teamSlug} />

      <div className="space-y-6">
        {children}

        <Card className="panel-surface panel-highlight gap-0 rounded-none py-0">
          <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">
                {"// "}your scores · 0-{maxRef} per criterion
              </CardTitle>
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--warn)]">{draftLabel}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-5">
            {criteria.map((criterion) => {
              const max = criterion.maxScore
              const val = values[criterion.id] ?? 0
              const frac = max > 0 ? val / max : 0
              const mid = Math.round(max / 2)
              const showHidden = touched[criterion.id] || initialScores[criterion.id] !== undefined

              return (
                <div key={criterion.id} className="border-b border-[var(--line)] pb-8 last:border-0 last:pb-0">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold uppercase tracking-[0.06em] text-white">{criterion.label}</div>
                      {criterion.description && (
                        <p className="mt-1 text-xs leading-relaxed text-[var(--text-dim)]">{criterion.description}</p>
                      )}
                    </div>
                    <output
                      className="acid-text-shadow shrink-0 text-4xl font-bold tabular-nums text-[var(--acid)] lg:text-5xl"
                      htmlFor={`score-${criterion.id}`}
                    >
                      {showHidden ? val : "—"}
                    </output>
                  </div>

                  <input
                    id={`score-${criterion.id}`}
                    type="range"
                    min={0}
                    max={max}
                    step={1}
                    value={val}
                    onChange={(e) => {
                      const n = Number(e.target.value)
                      setValues((prev) => ({ ...prev, [criterion.id]: n }))
                      setTouched((prev) => ({ ...prev, [criterion.id]: true }))
                    }}
                    className="judge-range h-10 w-full cursor-pointer"
                    style={{ "--val": String(frac) } as CSSProperties}
                    aria-valuemin={0}
                    aria-valuemax={max}
                    aria-valuenow={val}
                    aria-label={`Score for ${criterion.label}`}
                  />

                  {showHidden && <input type="hidden" name={`score_${criterion.id}`} value={String(val)} />}

                  <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-mute)]">
                    <span>0 weak</span>
                    <span>{mid} solid</span>
                    <span>{max} best in show</span>
                  </div>
                </div>
              )
            })}

            <div>
              <label htmlFor="judge-organizer-note" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-mute)]">
                notes to organizers
              </label>
              <textarea
                id="judge-organizer-note"
                name="organizerNote"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder="Optional feedback for organizers (not shown to teams)."
                className="mt-2 w-full resize-y rounded-none border border-[var(--line)] bg-black px-3 py-2 text-sm text-white outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
              />
            </div>

            <div className="flex flex-wrap gap-3 lg:hidden">
              <Button type="submit" className={cn(submitBtnClass)}>
                ▶ Submit final score
              </Button>
              <Button asChild variant="outline" className="rounded-none font-mono uppercase tracking-[0.12em]">
                <Link href="/judge">Queue</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-4">
        <Card className="panel-surface gap-0 rounded-none py-0">
          <CardContent className="p-6 text-center">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">your composite</div>
            <div className="acid-text-shadow mt-2 text-5xl font-bold tabular-nums text-[var(--acid)]">{composite}</div>
            <p className="mt-2 text-[11px] text-[var(--text-dim)]">
              avg of {includedIds.length} / {criteria.length} criteria entered · weight 1.0
            </p>
            <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-4 text-left text-[11px] text-[var(--text-dim)]">
              <div className="flex justify-between gap-2">
                <span className="text-[var(--text-mute)]">Other judges</span>
                <span className="font-mono text-[var(--text-mute)]">—</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>Team event pts</span>
                <span className="font-mono text-[var(--acid)]">{teamEventPts}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[var(--text-mute)]">Projected blend</span>
                <span className="font-mono text-[var(--text-mute)]">—</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="hidden space-y-3 lg:block">
          <button type="submit" className={submitBtnClass}>
            ▶ Submit final score
          </button>
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-mute)]">
            <Link href="/judge" className="hover:text-[var(--acid)]">
              Save draft / queue
            </Link>
            <span className="mx-2 text-[var(--line-2)]">·</span>
            <span className="opacity-50">Flag for admin</span>
          </p>
        </div>

        <Card className="panel-surface gap-0 rounded-none py-0">
          <CardHeader className="min-h-11 border-b border-[var(--line)] px-4 py-3">
            <CardTitle className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-dim)]">rules</CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-[11px] leading-6 text-[var(--text-dim)]">
            <ul className="list-disc space-y-2 pl-4">
              <li>Score every team you watch live.</li>
              <li>Use the full range; tie-breakers lean on demo clarity.</li>
              <li>Submit locks the row — use queue to revisit if allowed.</li>
            </ul>
          </CardContent>
        </Card>

        <p className="hidden text-center font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-faint)] lg:block">
          Judge · {judgeDisplay}
        </p>
      </aside>
    </form>
  )
}
