"use client";

import { useState } from "react";

import { toggleEventScore, updateJudgeCriterion } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Field, RoleLikeToggle, TextareaField } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

export type JudgeCriterionVM = {
  id: string;
  key: string;
  label: string;
  description: string | null;
  maxScore: number | null;
  sortOrder: number;
  isActive: boolean;
  updatedAt: string;
};

type JudgeCriterionCardProps = {
  criterion: JudgeCriterionVM;
};

export function JudgeCriterionCard({ criterion }: JudgeCriterionCardProps) {
  const [editing, setEditing] = useState(false);

  const max = criterion.maxScore ?? 0;
  const prefix = `jc-${criterion.id}`;

  return (
    <div className="border-b border-[var(--line)] p-4 last:border-b-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          {!editing ? (
            <div>
              <div className="flex flex-wrap items-center gap-2 gap-y-1">
                <p className="text-sm font-bold text-white">{criterion.label}</p>
                <span
                  className={cn(
                    "border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]",
                    criterion.isActive ? "border-[var(--acid)]/40 text-[var(--acid)]" : "border-[var(--line)] text-[var(--text-mute)]",
                  )}
                >
                  max {max} pts · this row only
                </span>
              </div>
              {criterion.description ? (
                <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-[var(--text-dim)]">{criterion.description}</p>
              ) : (
                <p className="mt-2 text-xs italic text-[var(--text-faint)]">No description</p>
              )}
              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
                slug · {criterion.key} · order {criterion.sortOrder}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 rounded-none font-mono text-[10px] uppercase tracking-[0.12em]"
                onClick={() => setEditing(true)}
              >
                edit
              </Button>
            </div>
          ) : (
            <form action={updateJudgeCriterion} className="space-y-3">
              <input type="hidden" name="criterionId" value={criterion.id} />
              <Field label="label" name="label" defaultValue={criterion.label} inputId={`${prefix}-label`} />
              <TextareaField
                label="description"
                name="description"
                rows={3}
                defaultValue={criterion.description ?? ""}
                placeholder="What judges evaluate"
                required={false}
                inputId={`${prefix}-desc`}
              />
              <Field
                label="max score (this row only, per judge)"
                name="maxScore"
                type="number"
                defaultValue={String(criterion.maxScore ?? 10)}
                inputId={`${prefix}-max`}
              />
              <p className="text-[10px] text-[var(--text-mute)]">
                Allowed 1–999. After save, leaderboard uses the new sum of active caps for normalization.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button type="submit" size="sm" className="rounded-none font-mono text-[10px] uppercase">
                  save
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-none font-mono text-[10px] uppercase text-[var(--text-mute)] hover:text-white"
                  onClick={() => setEditing(false)}
                >
                  cancel
                </Button>
              </div>
            </form>
          )}
        </div>
        <div className="shrink-0 lg:pt-1">
          <RoleLikeToggle action={toggleEventScore} idName="criterionId" idValue={criterion.id} enabled={criterion.isActive} />
        </div>
      </div>
    </div>
  );
}
