import { createEventScore, resetScoreWeights } from "@/app/admin/actions";
import { EventCriterionCard } from "@/components/admin/event-criterion-card";
import { JudgeCriterionCard } from "@/components/admin/judge-criterion-card";
import { db } from "@/lib/db";
import { BLEND_EVENT_CAP, BLEND_JUDGE_CAP, BLEND_TOTAL } from "@/lib/scoring-blend";
import { Button } from "@/components/ui/button";
import { Field, Panel } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

export default async function AdminScoringPage() {
  const [eventCriteria, judgeCriteria] = await Promise.all([
    db.scoreCriterion.findMany({
      where: { category: "EVENT" },
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
    }),
    db.scoreCriterion.findMany({
      where: { category: "JUDGE" },
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
    }),
  ]);

  const activeEventRules = eventCriteria.filter((c) => c.isActive);
  const activeJudgeRules = judgeCriteria.filter((c) => c.isActive);
  const eventMaxPts = activeEventRules.reduce((s, c) => s + (c.pointsValue ?? 0), 0);
  const judgeMaxPts = activeJudgeRules.reduce((s, c) => s + (c.maxScore ?? 0), 0);
  const eventSumMatchesLadder = eventMaxPts === BLEND_EVENT_CAP;

  const eventPct = Math.round((BLEND_EVENT_CAP / BLEND_TOTAL) * 100);
  const judgePct = Math.round((BLEND_JUDGE_CAP / BLEND_TOTAL) * 100);

  return (
    <div className="min-w-0 space-y-5">
      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--acid)]">{"//"} scoring</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">How the score is built.</h1>
          <p className="mt-1 text-sm text-[var(--text-mute)]">
            {BLEND_TOTAL}-pt ladder · event {BLEND_EVENT_CAP} + judge {BLEND_JUDGE_CAP}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{ color: "#ff2bd6", borderColor: "rgba(255,43,214,0.4)", background: "rgba(255,43,214,0.06)" }}
          >
            LIVE · FORMULA
          </span>
          <form action={resetScoreWeights}>
            <Button type="submit" variant="outline" size="sm" className="rounded-none font-mono text-[10px] uppercase">
              ↺ reset legacy keys
            </Button>
          </form>
        </div>
      </header>

      {/* 3-column grid */}
      <div className="grid min-w-0 gap-4 xl:grid-cols-[1fr_1.25fr_288px]">

        {/* ── COL 1: JUDGE CRITERIA ── */}
        <Panel title="01 · judge criteria" right={`${activeJudgeRules.length} active`}>
          <div className="space-y-2 border-b border-[var(--line)] bg-black/30 px-5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--warn)]">read this · max scores</p>
            <p className="text-[11px] leading-relaxed text-[var(--text-dim)]">
              Each criterion is its own row — the number is the cap{" "}
              <em>for that line</em> only. Raising one row does{" "}
              <span className="text-white">not</span> auto-lower another.
            </p>
          </div>
          <div className="max-h-[min(70vh,600px)] overflow-y-auto overflow-x-hidden terminal-scrollbar">
            {judgeCriteria.map((criterion) => (
              <JudgeCriterionCard
                key={`${criterion.id}-${criterion.updatedAt.toISOString()}`}
                criterion={{
                  id: criterion.id,
                  key: criterion.key,
                  label: criterion.label,
                  description: criterion.description,
                  maxScore: criterion.maxScore,
                  sortOrder: criterion.sortOrder,
                  isActive: criterion.isActive,
                  updatedAt: criterion.updatedAt.toISOString(),
                }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-[var(--line)] bg-[var(--panel-2)] px-5 py-3">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)]">judge max total</span>
            <span
              className="font-mono text-base font-bold text-[var(--acid)]"
              style={{ textShadow: "0 0 10px var(--acid-glow)" }}
            >
              {judgeMaxPts} pts ✓
            </span>
          </div>
        </Panel>

        {/* ── COL 2: EVENT POINT RULES ── */}
        <Panel title="02 · event point rules" right={`${activeEventRules.length} active`}>
          {/* Column headers */}
          <div
            className="grid border-b border-[var(--line)] px-4 py-2 text-[9px] uppercase tracking-[0.14em] text-[var(--text-mute)]"
            style={{ gridTemplateColumns: "1fr auto auto" }}
          >
            <span>RULE</span>
            <span className="pr-16">POINTS</span>
            <span>STATE</span>
          </div>
          <div className="max-h-[min(70vh,520px)] overflow-y-auto overflow-x-hidden terminal-scrollbar">
            {eventCriteria.map((criterion) => (
              <EventCriterionCard
                key={`${criterion.id}-${criterion.updatedAt.toISOString()}`}
                criterion={{
                  id: criterion.id,
                  key: criterion.key,
                  label: criterion.label,
                  description: criterion.description,
                  pointsValue: criterion.pointsValue,
                  sortOrder: criterion.sortOrder,
                  isActive: criterion.isActive,
                  updatedAt: criterion.updatedAt.toISOString(),
                }}
              />
            ))}
          </div>
          {/* Footer: max + add rule */}
          <div className="border-t border-[var(--line)] bg-[var(--panel-2)]">
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)]">max event pts</span>
              <span
                className={cn("font-mono text-base font-bold", eventSumMatchesLadder ? "text-[var(--acid)]" : "text-[var(--warn)]")}
                style={eventSumMatchesLadder ? { textShadow: "0 0 10px var(--acid-glow)" } : undefined}
              >
                {eventMaxPts} pts{!eventSumMatchesLadder && ` (≠ ${BLEND_EVENT_CAP} ladder)`}
              </span>
            </div>
            <details className="border-t border-[var(--line)]">
              <summary className="cursor-pointer select-none px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)] hover:text-white">
                ＋ add / upsert rule
              </summary>
              <form action={createEventScore} className="grid gap-3 p-5 md:grid-cols-2">
                <Field label="label" name="label" placeholder="Early demo rehearsal" />
                <Field label="key" name="key" placeholder="early_demo_rehearsal" />
                <Field label="points" name="pointsValue" type="number" defaultValue="50" />
                <Field label="sort order" name="sortOrder" type="number" defaultValue="99" />
                <Field label="description" name="description" placeholder="Reason text shown in admin." className="md:col-span-2" />
                <Button className="rounded-none font-mono text-[10px] uppercase md:col-span-2">save event rule</Button>
              </form>
            </details>
          </div>
        </Panel>

        {/* ── COL 3: BLEND + FORMULA ── */}
        <div className="space-y-4">
          {/* Blend formula visual */}
          <Panel title="03 · blend formula">
            <div className="space-y-4 p-5">
              <div className="flex justify-between text-[10px] uppercase tracking-[0.14em] text-[var(--text-mute)]">
                <span>EVENT {eventPct}%</span>
                <span>JUDGE {judgePct}%</span>
              </div>
              <div className="relative flex h-3.5 overflow-hidden border border-[var(--line-2)]">
                <div
                  style={{
                    width: `${eventPct}%`,
                    background: "var(--acid)",
                    boxShadow: "0 0 12px var(--acid-glow)",
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    background: "#ff7ac6",
                    boxShadow: "0 0 12px rgba(255,122,198,0.5)",
                  }}
                />
              </div>
              <div className="flex justify-between font-mono text-sm font-bold">
                <span className="text-[var(--acid)]" style={{ textShadow: "0 0 8px var(--acid-glow)" }}>
                  {BLEND_EVENT_CAP} pts
                </span>
                <span style={{ color: "#ff7ac6", textShadow: "0 0 8px rgba(255,122,198,0.5)" }}>
                  {BLEND_JUDGE_CAP} pts
                </span>
              </div>

              <div className="border-t border-[var(--line)] pt-3 space-y-2 text-[11px]">
                {[
                  ["event pillar", `${BLEND_EVENT_CAP} pts`, "var(--acid)"],
                  ["judge pillar", `${BLEND_JUDGE_CAP} pts`, "#ff7ac6"],
                  ["ladder total", `${BLEND_TOTAL} pts`, "white"],
                ].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <span className="text-[var(--text-mute)]">{k}</span>
                    <span className="font-mono font-bold" style={{ color: c }}>{v}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--line)] pt-3 space-y-2 text-[11px]">
                {[
                  ["tie-break 1", "higher judge avg", "text-white"],
                  ["tie-break 2", "earliest submit", "text-white"],
                  ["judge drafts", "excluded", "text-[var(--warn)]"],
                  ["cap per rule", "no cap", "text-white"],
                ].map(([k, v, cls]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <span className="text-[var(--text-mute)]">{k}</span>
                    <span className={cls}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          {/* Formula explanation */}
          <Panel title="// how it works">
            <div className="space-y-3 p-5 text-[11px] text-[var(--text-dim)]">
              <p>
                <span className="text-[var(--acid)]">① Event</span> — sum active milestone awards (active cap{" "}
                <span className="font-mono text-white">{eventMaxPts} pts</span>), normalize 0–100, scale to{" "}
                <span className="font-mono text-white">{BLEND_EVENT_CAP}</span>.
              </p>
              <p>
                <span className="text-[var(--acid)]">② Judge</span> — average raw judge totals across criteria (cap{" "}
                <span className="font-mono text-white">{judgeMaxPts} pts</span>), normalize 0–100, scale to{" "}
                <span className="font-mono text-white">{BLEND_JUDGE_CAP}</span>.
              </p>
              <p className="border border-[var(--line)] bg-black/50 px-3 py-2 font-mono text-[10px] text-white leading-relaxed">
                total = norm_event × {BLEND_EVENT_CAP}
                <br />
                {'      '}+ norm_judge × {BLEND_JUDGE_CAP}
                <br />
                {'      '}→ 0…{BLEND_TOTAL}
              </p>
              <p className="text-[10px] text-[var(--text-faint)]">
                Normalization uses the sum of active rule caps — not fixed to the pillar label. Round numbers give cleaner raw totals.
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
