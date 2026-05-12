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

  return (
    <div className="min-w-0 space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--acid)]">{"//"} scoring</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">How the final score is built</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-dim)]">
          Leaderboard uses a fixed <span className="font-mono text-white">{BLEND_TOTAL}</span>-point ladder:{" "}
          <span className="font-mono text-[var(--acid)]">{BLEND_EVENT_CAP}</span> from event milestones and{" "}
          <span className="font-mono text-[var(--acid)]">{BLEND_JUDGE_CAP}</span> from judge averages (each pillar normalized to
          0–100 against its active rule caps, then scaled).
        </p>
      </header>

      <div className="grid min-w-0 gap-6 lg:grid-cols-1 xl:grid-cols-2">
        <Panel title={"// how scoring works"} right="live formula">
          <div className="space-y-4 p-5 text-sm text-[var(--text-dim)]">
            <p>
              <span className="text-[var(--acid)]">① Judge signal</span> — for each team we average total raw judge points across
              judges who scored, compare to the active judge cap ({judgeMaxPts} pts across criteria), normalize to 0–100, then
              allocate <span className="font-mono text-white">{BLEND_JUDGE_CAP}</span> points on the ladder.
            </p>
            <p>
              <span className="text-[var(--acid)]">② Event activities</span> — sum automatic milestone awards (max {eventMaxPts}{" "}
              pts with current rules), normalize to 0–100, then allocate{" "}
              <span className="font-mono text-white">{BLEND_EVENT_CAP}</span> points.
            </p>
            <p className="border border-[var(--line)] bg-black/50 p-3 font-mono text-xs text-white">
              total = (norm_event × {BLEND_EVENT_CAP}) / 100 + (norm_judge × {BLEND_JUDGE_CAP}) / 100 → 0…{BLEND_TOTAL}
            </p>
            <p className="text-[11px] text-[var(--text-mute)]">
              Legacy weight sliders are deprecated; the product ladder is fixed at {BLEND_EVENT_CAP}/{BLEND_JUDGE_CAP}. Use the
              button below only if you need to clear old stored values (optional).
            </p>
            <form action={resetScoreWeights} className="border-t border-[var(--line)] pt-4">
              <Button type="submit" variant="outline" className="rounded-none font-mono text-[10px] uppercase">
                reset legacy weight keys (40/60)
              </Button>
            </form>
          </div>
        </Panel>

        <Panel title={"// judge criteria"} right={`${activeJudgeRules.length} active`}>
          <div className="space-y-3 border-b border-[var(--line)] bg-black/30 p-4 text-sm leading-relaxed text-[var(--text-dim)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--warn)]">read this · max scores</p>
            <p>
              Each criterion is <span className="text-white">its own row</span>. The number you set is only the cap{" "}
              <em>for that line</em> on the judge sheet (e.g. Innovation 0–100). Other criteria keep their own caps until you edit
              them.
            </p>
            <p className="mt-2">
              The <span className="font-mono text-[var(--acid)]">{judgeMaxPts} pt</span> figure above is the{" "}
              <span className="text-white">sum of all active rows</span>. If you raise one row to 100, that sum goes up — it does{" "}
              <span className="text-white">not</span> silently lower another row&apos;s max (no auto-balancing). If another field
              looked different after refresh, it was already that value in the database; only the <em>total</em> changes.
            </p>
            <p className="mt-2 text-xs text-[var(--text-mute)]">
              Formula: team raw judge average ÷ {judgeMaxPts} (sum of caps) → 0–1 → ×100 for the judge pillar → ×{BLEND_JUDGE_CAP}{" "}
              toward the /{BLEND_TOTAL} score.
            </p>
          </div>
          <div className="max-h-[min(70vh,720px)] overflow-y-auto overflow-x-hidden terminal-scrollbar">
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
        </Panel>

        <Panel title={"// event point rules"} right={`${activeEventRules.length} active`} className="min-w-0 xl:col-span-2">
          <div className="grid gap-6 p-5 lg:grid-cols-[1fr_min(360px,100%)]">
            <div className="min-w-0 space-y-3">
              <div className="space-y-2 rounded-none border border-[var(--line)] bg-black/30 p-4 text-sm text-[var(--text-dim)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--warn)]">edit milestones</p>
                <p>
                  Each row is <span className="text-white">one automatic award</span>. Use <span className="font-mono text-white">edit</span>{" "}
                  to change label, description, points, or sort order. Toggle <span className="text-white">active</span> to exclude a
                  rule from totals and new awards.
                </p>
                <p
                  className={cn(
                    "text-xs",
                    eventSumMatchesLadder ? "text-[var(--text-mute)]" : "border border-amber-500/35 bg-amber-500/10 px-2 py-1.5 text-amber-100",
                  )}
                >
                  Active rules total <span className="font-mono text-white">{eventMaxPts}</span> pts
                  {eventSumMatchesLadder ? (
                    <> — matches the {BLEND_EVENT_CAP}pt event pillar (nice round ladder alignment).</>
                  ) : (
                    <>
                      {" "}
                      — not equal to the {BLEND_EVENT_CAP}pt event pillar label; scoring still works (normalization uses this sum as
                      the max). Set round numbers (e.g. 40 / 50 / 80) if you want cleaner raw totals.
                    </>
                  )}
                </p>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">all rules</p>
              <div className="max-h-[min(70vh,560px)] overflow-y-auto overflow-x-hidden border border-[var(--line)] terminal-scrollbar">
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
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">add / upsert rule</p>
              <form action={createEventScore} className="mt-3 grid gap-3">
                <Field label="label" name="label" placeholder="Early demo rehearsal" />
                <Field label="key" name="key" placeholder="early_demo_rehearsal" />
                <Field label="points" name="pointsValue" type="number" defaultValue="50" />
                <Field label="sort order" name="sortOrder" type="number" defaultValue="99" />
                <Field label="description" name="description" placeholder="Reason text shown in admin." />
                <Button className="rounded-none font-mono text-[10px] uppercase">save event rule</Button>
              </form>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
