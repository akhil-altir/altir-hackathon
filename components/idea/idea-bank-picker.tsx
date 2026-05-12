"use client";

import { useEffect, useMemo, useState } from "react";

import { submitIdeaAction } from "@/app/teams/[slug]/idea/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SerializableIdeaBankEntry = {
  id: string;
  title: string;
  problemStatement: string;
  description: string;
  expectedOutcome: string;
  stackHint: string | null;
  category: string | null;
  sortOrder: number;
};

type Props = {
  teamSlug: string;
  entries: SerializableIdeaBankEntry[];
  currentBankEntryId: string | null;
};

export function IdeaBankPicker({ teamSlug, entries, currentBankEntryId }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("ALL");
  const [detailId, setDetailId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const row of entries) {
      if (row.category?.trim()) {
        set.add(row.category.trim());
      }
    }
    return ["ALL", ...[...set].sort((a, b) => a.localeCompare(b))];
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((row) => {
      if (category !== "ALL" && (row.category?.trim() ?? "") !== category) {
        return false;
      }
      if (!q) {
        return true;
      }
      const blob = [row.title, row.problemStatement, row.description, row.expectedOutcome, row.stackHint ?? ""]
        .join("\n")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [entries, query, category]);

  const detail = detailId ? entries.find((e) => e.id === detailId) ?? null : null;

  useEffect(() => {
    if (!detailId) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDetailId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detailId]);

  if (entries.length === 0) {
    return (
      <div className="border border-[var(--line)] bg-[var(--panel-2)] p-6 text-sm text-[var(--text-dim)]">
        No curated ideas yet. Admins can publish entries under{" "}
        <span className="font-mono text-[var(--acid)]">/admin/ideas</span>.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="block min-w-[200px] flex-1">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Title, problem, description…"
            className="h-11 w-full rounded-none border border-[var(--line)] bg-black px-3 font-mono text-sm text-white outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setCategory(tag)}
              className={cn(
                "rounded-sm border px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition",
                tag === category
                  ? "border-[var(--warn)]/50 bg-[var(--warn)]/15 text-[var(--warn)]"
                  : "border-[var(--line)] text-[var(--text-mute)] hover:border-[var(--text-mute)]",
              )}
            >
              {tag}
              {tag === "ALL" ? ` · ${entries.length}` : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((row) => {
          const selected = currentBankEntryId === row.id;
          return (
            <button
              key={row.id}
              type="button"
              onClick={() => setDetailId(row.id)}
              className={cn(
                "border p-4 text-left transition hover:border-[var(--acid)]/40",
                selected ? "border-[var(--acid)]/50 bg-[var(--acid)]/10" : "border-[var(--line)] bg-[var(--panel-2)]",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-sm border border-[var(--line-2)] px-1.5 py-0.5 font-mono text-[9px] uppercase text-[var(--text-mute)]">
                  {row.category ?? "general"}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--text-faint)]">view</span>
              </div>
              <div className="mt-3 font-bold leading-snug text-white">{row.title}</div>
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--text-dim)]">{row.problemStatement}</p>
              {row.stackHint ? (
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-mute)]">{row.stackHint}</div>
              ) : null}
              {selected ? (
                <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">● current team pick</div>
              ) : null}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-[var(--text-mute)]">No ideas match your search.</p>
      ) : null}

      {detail ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close idea detail"
            onClick={() => setDetailId(null)}
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[var(--line)] bg-[#070707] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] sm:rounded-t-sm sm:border-b-0">
            <div className="sticky top-0 flex items-center justify-between border-b border-[var(--line)] bg-[#070707] px-4 py-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">idea bank</p>
                <h2 className="text-lg font-bold text-white">{detail.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailId(null)}
                className="border border-[var(--line)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)] hover:border-[var(--acid)] hover:text-white"
              >
                close
              </button>
            </div>
            <div className="space-y-5 px-4 py-5 text-sm leading-relaxed text-[var(--text-dim)]">
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--acid)]">problem</h3>
                <p className="mt-2 whitespace-pre-wrap text-[var(--text)]">{detail.problemStatement}</p>
              </section>
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--acid)]">description</h3>
                <p className="mt-2 whitespace-pre-wrap text-[var(--text)]">{detail.description}</p>
              </section>
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--acid)]">expected outcome</h3>
                <p className="mt-2 whitespace-pre-wrap text-[var(--text)]">{detail.expectedOutcome}</p>
              </section>
              {detail.stackHint ? (
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-mute)]">stack / timebox</h3>
                  <p className="mt-2 font-mono text-xs text-[var(--text)]">{detail.stackHint}</p>
                </section>
              ) : null}
            </div>
            <div className="sticky bottom-0 border-t border-[var(--line)] bg-[#070707] px-4 py-4">
              <form action={submitIdeaAction} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input type="hidden" name="teamSlug" value={teamSlug} />
                <input type="hidden" name="ideaBankEntryId" value={detail.id} />
                <Button
                  type="submit"
                  className="flex-1 rounded-none bg-[var(--acid)] font-mono text-black uppercase tracking-[0.12em] hover:bg-[var(--acid-2)]"
                >
                  Select this idea
                </Button>
              </form>
              <p className="mt-2 text-center text-[10px] text-[var(--text-mute)]">
                Submits as idea bank pick · you can switch later by submitting again
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
