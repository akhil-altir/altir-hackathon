"use client";

import { useState } from "react";

import { toggleEventScore, updateEventCriterion } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Field, RoleLikeToggle, TextareaField } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

export type EventCriterionVM = {
  id: string;
  key: string;
  label: string;
  description: string | null;
  pointsValue: number | null;
  sortOrder: number;
  isActive: boolean;
  updatedAt: string;
};

type EventCriterionCardProps = {
  criterion: EventCriterionVM;
};

export function EventCriterionCard({ criterion }: EventCriterionCardProps) {
  const [editing, setEditing] = useState(false);
  const pts = criterion.pointsValue ?? 0;
  const prefix = `ec-${criterion.id}`;

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
                  {pts} pts · this rule only
                </span>
              </div>
              {criterion.description ? (
                <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-[var(--text-dim)]">{criterion.description}</p>
              ) : (
                <p className="mt-2 text-xs italic text-[var(--text-faint)]">No description</p>
              )}
              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
                key · {criterion.key} · order {criterion.sortOrder}
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
            <form action={updateEventCriterion} className="space-y-3">
              <input type="hidden" name="criterionId" value={criterion.id} />
              <Field label="label" name="label" defaultValue={criterion.label} inputId={`${prefix}-label`} />
              <TextareaField
                label="description"
                name="description"
                rows={3}
                defaultValue={criterion.description ?? ""}
                placeholder="What triggers this award"
                required={false}
                inputId={`${prefix}-desc`}
              />
              <Field
                label="points (this milestone)"
                name="pointsValue"
                type="number"
                defaultValue={String(criterion.pointsValue ?? 0)}
                inputId={`${prefix}-pts`}
              />
              <Field label="sort order" name="sortOrder" type="number" defaultValue={String(criterion.sortOrder)} inputId={`${prefix}-ord`} />
              <p className="text-[10px] text-[var(--text-mute)]">
                Allowed 0–999. Leaderboard normalizes earned event points against the sum of active rules (not forced to 400).
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
        <div className="flex shrink-0 flex-col items-end gap-2 lg:pt-1">
          <RoleLikeToggle action={toggleEventScore} idName="criterionId" idValue={criterion.id} enabled={criterion.isActive} />
        </div>
      </div>
    </div>
  );
}
