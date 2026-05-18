import { notFound } from "next/navigation";
import Link from "next/link";
import { getTeamWorkspace } from "@/lib/data";
import { Panel } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";
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
  const team = await getTeamWorkspace(slug);

  if (!team) {
    notFound();
  }

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
              <div key={member.id} className="flex items-start justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="font-semibold text-white">{member.fullName}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-[var(--text-mute)]">{member.email}</p>
                  {member.title ? (
                    <p className="mt-0.5 text-[11px] text-[var(--text-faint)]">{member.title}</p>
                  ) : null}
                </div>
                <div className="shrink-0 text-right">
                  {member.primaryAssignment ? (
                    <span className="border border-[var(--line)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-mute)]">
                      {member.primaryAssignment}
                    </span>
                  ) : null}
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
                <div key={award.id} className="flex items-center justify-between px-4 py-2">
                  <span className="text-xs text-[var(--text-dim)]">
                    {award.criterion?.label ?? award.criterionId}
                  </span>
                  <span className="font-mono text-xs font-bold text-[var(--acid)]">
                    +{award.criterion?.pointsValue ?? award.points}
                  </span>
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
