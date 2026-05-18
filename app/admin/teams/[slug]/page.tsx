import { notFound } from "next/navigation";
import Link from "next/link";
import { getAvailableEmployees, getTeamWorkspace } from "@/lib/data";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { Panel } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { adminAddTeamMember, adminGrantEventPoint, adminRemoveTeamMember, adminDeleteEventPointAward } from "@/app/admin/actions";
import { DeleteTeamButton } from "./delete-team-button";

function ArtifactRow({
  label,
  url,
  empty,
}: {
  label: string;
  url: string | null | undefined;
  empty?: string;
}) {
  const val = url?.trim() || null;
  return (
    <div className="flex items-start gap-3 border-b border-[var(--line)] px-4 py-3 last:border-b-0">
      <span className="w-28 shrink-0 text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)]">
        {label}
      </span>
      {val ? (
        <a
          href={val}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 break-all font-mono text-xs text-[var(--acid)] underline underline-offset-2 hover:opacity-80"
        >
          {val}
        </a>
      ) : (
        <span className="text-xs text-[var(--text-faint)]">{empty ?? "—"}</span>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[var(--line)] px-4 py-3 last:border-b-0">
      <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)]">{label}</p>
      <div className="text-sm text-white">{children}</div>
    </div>
  );
}

export default async function AdminTeamDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getSession();
  const [team, availableEmployees, eventCriteria] = await Promise.all([
    getTeamWorkspace(slug),
    getAvailableEmployees(),
    db.scoreCriterion.findMany({ where: { category: "EVENT", isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  if (!team) notFound();

  const sub = team.submission;
  const idea = team.currentIdea;

  const statusColor: Record<string, string> = {
    SUBMITTED: "border-[var(--acid)]/50 text-[var(--acid)]",
    READY_FOR_JUDGING: "border-[var(--acid)]/50 text-[var(--acid)]",
    IN_PROGRESS: "border-yellow-500/40 text-yellow-300",
    NOT_STARTED: "border-[var(--line)] text-[var(--text-faint)]",
  };

  const subStatus = sub?.status ?? "NOT_STARTED";

  return (
    <div className="min-w-0 space-y-6">
      <header className="min-w-0">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--acid)]">
          <Link href="/admin/teams" className="hover:underline">
            {"//"} teams
          </Link>{" "}
          / {team.name}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">
          {team.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="border border-[var(--line)] bg-black/50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
            {team.status}
          </span>
          <span
            className={cn(
              "border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]",
              statusColor[subStatus] ?? "border-[var(--line)] text-[var(--text-faint)]",
            )}
          >
            sub · {subStatus.replace(/_/g, " ").toLowerCase()}
          </span>
        </div>
      </header>

      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Submission artifacts */}
        <Panel title={"// submission"} right={sub ? subStatus.replace(/_/g, " ").toLowerCase() : "none"}>
          {sub ? (
            <>
              <ArtifactRow label="repo / github" url={sub.repoUrl} empty="not submitted" />
              <ArtifactRow label="demo / video" url={sub.demoUrl} empty="not submitted" />
              <ArtifactRow label="deck / slides" url={sub.presentationUrl} empty="not submitted" />
              {sub.buildSummary ? (
                <Field label="build summary">
                  <p className="text-sm leading-relaxed text-[var(--text-dim)]">{sub.buildSummary}</p>
                </Field>
              ) : null}
              {sub.stackTags ? (
                <Field label="stack tags">
                  <div className="flex flex-wrap gap-1.5">
                    {sub.stackTags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="border border-[var(--line)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-mute)]"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </Field>
              ) : null}
              {sub.submittedAt ? (
                <Field label="submitted at">
                  <span className="font-mono text-xs text-[var(--text-dim)]">
                    {new Date(sub.submittedAt).toLocaleString()}
                  </span>
                </Field>
              ) : null}
              <Field label="readme ready">
                <span
                  className={cn(
                    "font-mono text-xs",
                    sub.repoReadmeReady ? "text-[var(--acid)]" : "text-[var(--text-faint)]",
                  )}
                >
                  {sub.repoReadmeReady ? "yes" : "no"}
                </span>
              </Field>
            </>
          ) : (
            <p className="px-4 py-6 text-sm text-[var(--text-faint)]">No submission record yet.</p>
          )}
        </Panel>

        {/* Idea */}
        <Panel title={"// idea"} right={idea ? idea.sourceType.toLowerCase() : "none"}>
          {idea ? (
            <>
              <Field label="title">
                <span className="font-semibold">{idea.title}</span>
              </Field>
              <Field label="summary">
                <p className="text-sm leading-relaxed text-[var(--text-dim)]">{idea.summary}</p>
              </Field>
              {idea.stackSummary ? (
                <Field label="stack">
                  <p className="text-sm text-[var(--text-dim)]">{idea.stackSummary}</p>
                </Field>
              ) : null}
              {idea.bankCategory ? (
                <Field label="category">
                  <span className="font-mono text-xs text-[var(--text-dim)]">{idea.bankCategory}</span>
                </Field>
              ) : null}
              {idea.pivotReason ? (
                <Field label="pivot reason">
                  <p className="text-sm text-[var(--text-dim)]">{idea.pivotReason}</p>
                </Field>
              ) : null}
            </>
          ) : (
            <p className="px-4 py-6 text-sm text-[var(--text-faint)]">No idea submitted yet.</p>
          )}
        </Panel>

        {/* Members */}
        <Panel title={"// members"} right={`${team.members.length} members`}>
          <div className="divide-y divide-[var(--line)]">
            {team.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="font-semibold text-white">{member.fullName}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-[var(--text-mute)]">{member.email}</p>
                  {member.title ? (
                    <p className="mt-0.5 text-[11px] text-[var(--text-faint)]">{member.title}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {member.primaryAssignment ? (
                    <span className="border border-[var(--line)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-mute)]">
                      {member.primaryAssignment}
                    </span>
                  ) : null}
                  <form action={adminRemoveTeamMember}>
                    <input type="hidden" name="teamId" value={team.id} />
                    <input type="hidden" name="userId" value={member.id} />
                    <button
                      type="submit"
                      className="border border-red-900/50 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-red-400 hover:border-red-500/60 hover:text-red-300 transition-colors"
                    >
                      remove
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Scores */}
        <Panel title={"// scores"}>
          <div className="divide-y divide-[var(--line)]">
            {team.pointBreakdown.length > 0 ? (
              team.pointBreakdown.map((award) => (
                <div key={award.id} className="flex items-center justify-between gap-3 px-4 py-2">
                  <span className="min-w-0 truncate text-xs text-[var(--text-dim)]">
                    {award.criterion?.label ?? award.reason}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--acid)]">
                      +{award.criterion?.pointsValue ?? award.points}
                    </span>
                    <form action={adminDeleteEventPointAward}>
                      <input type="hidden" name="awardId" value={award.id} />
                      <button
                        type="submit"
                        className="border border-red-900/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-red-400 hover:border-red-500/60 hover:text-red-300 transition-colors"
                      >
                        ×
                      </button>
                    </form>
                  </div>
                </div>
              ))
            ) : (
              <p className="px-4 py-6 text-sm text-[var(--text-faint)]">No event points awarded.</p>
            )}
          </div>
          {team.judgeSummary.length > 0 ? (
            <>
              <div className="border-t border-[var(--line)] px-4 pb-1 pt-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)]">judge totals</p>
              </div>
              {team.judgeSummary.map((j) => (
                <div key={j.judgeId} className="flex items-center justify-between px-4 py-2">
                  <span className="text-xs text-[var(--text-dim)]">{j.judgeName}</span>
                  <span className="font-mono text-xs text-white">{j.total}</span>
                </div>
              ))}
            </>
          ) : null}
        </Panel>
      </div>

      {/* Add member */}
      <Panel title={"// add member"} right="admin override">
        <form action={adminAddTeamMember} className="flex flex-wrap items-end gap-3 px-4 py-4">
          <input type="hidden" name="teamId" value={team.id} />
          <div className="flex-1 min-w-[200px]">
            <label className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)]">employee</label>
            <select
              name="userId"
              required
              className="h-10 w-full rounded-none border border-[var(--line)] bg-black px-2 font-mono text-xs text-white"
            >
              <option value="">— select —</option>
              {availableEmployees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.fullName} · {e.primaryAssignment ?? "unassigned"}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="outline" className="h-10 rounded-none font-mono text-[10px] uppercase tracking-[0.12em]">
            Add to team
          </Button>
        </form>
        {availableEmployees.length === 0 && (
          <p className="px-4 pb-4 text-xs text-[var(--text-faint)]">All employees are already on teams.</p>
        )}
      </Panel>

      {/* Grant event point */}
      <Panel title={"// grant event point"} right="admin override">
        <form action={adminGrantEventPoint} className="flex flex-wrap items-end gap-3 px-4 py-4">
          <input type="hidden" name="teamId" value={team.id} />
          <input type="hidden" name="adminId" value={session?.userId ?? ""} />
          <div className="flex-1 min-w-[200px]">
            <label className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)]">criterion</label>
            <select
              name="criterionKey"
              required
              className="h-10 w-full rounded-none border border-[var(--line)] bg-black px-2 font-mono text-xs text-white"
            >
              <option value="">— select —</option>
              {eventCriteria.map((c) => (
                <option key={c.id} value={c.key}>
                  {c.label} · +{c.pointsValue} pts
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="outline" className="h-10 rounded-none font-mono text-[10px] uppercase tracking-[0.12em]">
            Grant points
          </Button>
        </form>
      </Panel>

      {/* Danger zone */}
      <Panel title={"// danger zone"} right="irreversible" className="border-red-900/40">
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-sm font-semibold text-red-400">Delete team</p>
            <p className="mt-0.5 text-xs text-[var(--text-dim)]">
              Removes team, all members, idea, scores, and submission. Frees the assigned API key.
              Members can form a new team.
            </p>
          </div>
          <DeleteTeamButton teamId={team.id} teamName={team.name} />
        </div>
      </Panel>
    </div>
  );
}
