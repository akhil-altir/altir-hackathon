import {
  createIdeaBankEntry,
  deleteIdeaBankEntry,
  setIdeaBankVisible,
  toggleIdeaBankEntry,
  updateIdeaBankEntry,
} from "@/app/admin/actions";
import { getIdeaBankVisible } from "@/lib/app-settings";
import { listAllIdeaBankEntriesForAdmin } from "@/lib/idea-bank";
import { Button } from "@/components/ui/button";
import {
  Field,
  Panel,
  RoleLikeToggle,
  TextareaField,
} from "@/components/admin/admin-ui";

export default async function AdminIdeasPage() {
  const [ideaBankEntries, ideaBankVisible] = await Promise.all([
    listAllIdeaBankEntriesForAdmin(),
    getIdeaBankVisible(),
  ]);
  const ideaBankActiveCount = ideaBankEntries.filter((e) => e.isActive).length;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--acid)]">{"//"} ideas</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">Idea bank</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-dim)]">
          Only <strong className="text-white">active</strong> entries appear on the team idea page. Use expand to edit in place.
        </p>
      </header>

      <div className={`flex items-center justify-between gap-4 border px-5 py-4 ${ideaBankVisible ? "border-[var(--line)]" : "border-[var(--warn)]/40 bg-[var(--warn)]/5"}`}>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white">Idea bank visibility</p>
          <p className="mt-1 text-[11px] text-[var(--text-mute)]">
            {ideaBankVisible
              ? "Participants can browse the idea bank."
              : "Idea bank is hidden — participants see a placeholder."}
          </p>
        </div>
        <form action={setIdeaBankVisible}>
          <input type="hidden" name="visible" value={ideaBankVisible ? "false" : "true"} />
          <Button
            type="submit"
            variant="outline"
            className={`rounded-none font-mono text-[10px] uppercase tracking-[0.14em] ${!ideaBankVisible ? "border-[var(--warn)]/60 text-[var(--warn)] hover:bg-[var(--warn)]/10" : ""}`}
          >
            {ideaBankVisible ? "Hide from participants" : "Reveal to participants"}
          </Button>
        </form>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel title={"// idea bank · publish entries"} right={`${ideaBankActiveCount} live / ${ideaBankEntries.length} total`}>
          <form action={createIdeaBankEntry} className="grid gap-3 p-5">
            <Field label="title" name="title" placeholder="Internal docs answer bot" />
            <TextareaField label="problem statement" name="problemStatement" rows={3} placeholder="What pain exists today?" />
            <TextareaField label="description" name="description" rows={4} placeholder="What participants should build in ~3h." />
            <TextareaField label="expected outcome" name="expectedOutcome" rows={3} placeholder="What done looks like for the demo." />
            <Field label="stack / timebox hint" name="stackHint" placeholder="~3h · Next.js + OpenAI" />
            <Field label="category tag" name="category" placeholder="ENG · OPS · DESIGN · BIZ" />
            <Field label="sort order" name="sortOrder" type="number" defaultValue="0" />
            <Button className="rounded-none font-mono text-[10px] uppercase">add bank entry</Button>
          </form>
        </Panel>

        <Panel title={"// idea bank · registry"} right="teams see active only">
          <div className="max-h-[720px] divide-y divide-[var(--line)] overflow-auto terminal-scrollbar">
            {ideaBankEntries.length === 0 ? (
              <p className="p-5 text-sm text-[var(--text-mute)]">No entries yet. Create one on the left.</p>
            ) : (
              ideaBankEntries.map((entry) => (
                <details key={entry.id} className="group px-4 py-3">
                  <summary className="cursor-pointer list-none py-2 font-mono text-xs text-white marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span>
                        <span className={entry.isActive ? "text-[var(--acid)]" : "text-[var(--text-mute)]"}>●</span> {entry.title}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
                        {entry.category ?? "uncat"} · order {entry.sortOrder}
                      </span>
                    </span>
                  </summary>
                  <div className="mt-3 space-y-3 border border-[var(--line)] bg-black/40 p-4">
                    <form action={updateIdeaBankEntry} className="grid gap-3">
                      <input type="hidden" name="id" value={entry.id} />
                      <Field label="title" name="title" defaultValue={entry.title} />
                      <TextareaField label="problem statement" name="problemStatement" rows={3} defaultValue={entry.problemStatement} />
                      <TextareaField label="description" name="description" rows={4} defaultValue={entry.description} />
                      <TextareaField label="expected outcome" name="expectedOutcome" rows={3} defaultValue={entry.expectedOutcome} />
                      <Field label="stack hint" name="stackHint" defaultValue={entry.stackHint ?? ""} />
                      <Field label="category" name="category" defaultValue={entry.category ?? ""} />
                      <Field label="sort order" name="sortOrder" type="number" defaultValue={String(entry.sortOrder)} />
                      <Button type="submit" variant="outline" className="rounded-none font-mono text-[10px] uppercase">
                        save changes
                      </Button>
                    </form>
                    <div className="flex flex-wrap gap-2 border-t border-[var(--line)] pt-3">
                      <RoleLikeToggle action={toggleIdeaBankEntry} idName="id" idValue={entry.id} enabled={entry.isActive} />
                      <form action={deleteIdeaBankEntry}>
                        <input type="hidden" name="id" value={entry.id} />
                        <Button
                          type="submit"
                          variant="outline"
                          className="rounded-none border-red-500/40 font-mono text-[10px] uppercase text-red-300 hover:bg-red-500/10"
                        >
                          delete
                        </Button>
                      </form>
                    </div>
                  </div>
                </details>
              ))
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
