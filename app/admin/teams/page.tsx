import Link from "next/link";
import {
  advanceEventPhase,
  setEventPhase,
  updateTeamStatus,
} from "@/app/admin/actions";
import {
  abbreviatedMemberNames,
  deptCrossLabel,
  keyStatusLabel,
  submissionArtifactCount,
} from "@/lib/admin-display";
import { listLeaderboard } from "@/lib/data";
import { db } from "@/lib/db";
import {
  defaultEventPhaseId,
  EVENT_PHASES,
  phaseState,
} from "@/lib/event-phase";
import { getAppSetting, SETTING_ADMIN_EVENT_PHASE } from "@/lib/app-settings";
import { BLEND_TOTAL } from "@/lib/scoring-blend";
import { Button } from "@/components/ui/button";
import {
  FilterChip,
  Panel,
} from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

type Search = { filter?: string };

export default async function AdminTeamsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const filter = sp.filter ?? "all";

  const [leaderboard, apiKeys, phaseIdRaw, ideaBankTeamCount, customIdeaTeamCount] = await Promise.all([
    listLeaderboard(),
    db.apiKey.findMany({ select: { id: true, status: true, assignedTeamId: true } }),
    getAppSetting(SETTING_ADMIN_EVENT_PHASE, defaultEventPhaseId()),
    db.team.count({
      where: { ideas: { some: { isCurrent: true, sourceType: "BANK" } } },
    }),
    db.team.count({
      where: { ideas: { some: { isCurrent: true, sourceType: "CUSTOM" } } },
    }),
  ]);

  const keyByTeamId = new Map(
    apiKeys.filter((k) => k.assignedTeamId).map((k) => [k.assignedTeamId as string, k]),
  );

  const filteredLeaderboard = leaderboard.filter((row) => {
    const key = keyByTeamId.get(row.teamId) ?? null;
    if (filter === "nosub") {
      const { filled } = submissionArtifactCount(row.submission);
      return filled < 3;
    }
    if (filter === "flagged") {
      return key?.status === "REVOKED";
    }
    return true;
  });

  const phaseId = EVENT_PHASES.some((p) => p.id === phaseIdRaw) ? phaseIdRaw : defaultEventPhaseId();
  const currentPhaseIndex = EVENT_PHASES.findIndex((p) => p.id === phaseId);

  return (
    <div className="min-w-0 space-y-6">
      <header className="min-w-0">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--acid)]">{"//"} teams</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">Teams & phase</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-dim)]">
          Live roster, submission health, and operational status override. Blend column is out of{" "}
          <span className="font-mono text-[var(--acid)]">{BLEND_TOTAL}</span> (400 event + 600 judge).
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="border border-[var(--line)] bg-black/50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
            idea bank picks · <span className="text-[var(--acid)]">{ideaBankTeamCount}</span>
          </span>
          <span className="border border-[var(--line)] bg-black/50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
            custom ideas · <span className="text-pink-300">{customIdeaTeamCount}</span>
          </span>
        </div>
      </header>

      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.55fr)]">
        <Panel title={"// teams · all rows"} right={`${filteredLeaderboard.length} visible`} className="min-w-0 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">filter</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip href="/admin/teams" active={filter === "all"} label="all" />
              <FilterChip href="/admin/teams?filter=flagged" active={filter === "flagged"} label="flagged" />
              <FilterChip href="/admin/teams?filter=nosub" active={filter === "nosub"} label="no-sub" />
            </div>
          </div>
          <div className="w-full overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-[1100px] border-collapse text-left text-xs">
              <thead className="border-b border-[var(--line)] bg-black/40 text-[10px] uppercase tracking-[0.14em] text-[var(--text-mute)]">
                <tr>
                  <th className="whitespace-nowrap px-3 py-2 font-medium">#</th>
                  <th className="whitespace-nowrap px-3 py-2 font-medium">team</th>
                  <th className="min-w-[180px] px-3 py-2 font-medium">members · dept</th>
                  <th className="min-w-[200px] px-3 py-2 font-medium">idea</th>
                  <th className="whitespace-nowrap px-3 py-2 font-medium">key</th>
                  <th className="whitespace-nowrap px-3 py-2 font-medium">
                    <abbr title="Submission package: repo, demo, and deck URLs filled (count / 3)">sub 3-up</abbr>
                  </th>
                  <th className="whitespace-nowrap px-3 py-2 text-right font-medium">
                    <abbr title="Raw event points earned from milestones">evt raw</abbr>
                  </th>
                  <th className="whitespace-nowrap px-3 py-2 text-right font-medium">
                    <abbr title="Judge pillar normalized 0–100 (before ×600)">judge %</abbr>
                  </th>
                  <th className="whitespace-nowrap px-3 py-2 text-right font-medium">
                    <abbr title={`Blend total of ${BLEND_TOTAL} (400 event + 600 judge)`}>/{BLEND_TOTAL}</abbr>
                  </th>
                  <th className="min-w-[140px] px-3 py-2 font-medium">phase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {filteredLeaderboard.map((row, idx) => {
                  const key = keyByTeamId.get(row.teamId) ?? null;
                  const sub = submissionArtifactCount(row.submission);
                  const keyLbl = keyStatusLabel(key);
                  const ideaLabel = row.ideaTitle?.trim() || null;
                  const source = row.ideaSourceType === "BANK" ? "bank" : row.ideaSourceType === "CUSTOM" ? "custom" : null;
                  return (
                    <tr key={row.teamId} className="text-[var(--text-dim)] hover:bg-white/[0.02]">
                      <td className="whitespace-nowrap px-3 py-3 font-mono text-[var(--text-faint)]">{String(idx + 1).padStart(2, "0")}</td>
                      <td className="whitespace-nowrap px-3 py-3 font-bold text-white">
                        <Link
                          href={`/admin/teams/${row.slug}`}
                          className="hover:text-[var(--acid)] hover:underline underline-offset-2 transition-colors"
                        >
                          {row.teamName}
                        </Link>
                      </td>
                      <td className="max-w-[220px] px-3 py-3">
                        <p className="truncate text-white">{abbreviatedMemberNames(row.members)}</p>
                        <p className="mt-0.5 truncate text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
                          {deptCrossLabel(row.members)}
                        </p>
                      </td>
                      <td className="max-w-[240px] px-3 py-3 align-top">
                        {ideaLabel ? (
                          <div className="space-y-1">
                            <p className="line-clamp-2 text-[11px] leading-snug text-white" title={ideaLabel}>
                              {ideaLabel}
                            </p>
                            {source ? (
                              <span
                                className={cn(
                                  "inline-block border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]",
                                  source === "bank"
                                    ? "border-[var(--acid)]/45 text-[var(--acid)]"
                                    : "border-pink-400/40 text-pink-200",
                                )}
                              >
                                {source}
                              </span>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-[var(--text-faint)]">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <span
                          className={cn(
                            "border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.14em]",
                            keyLbl === "live" && "border-[var(--acid)]/50 text-[var(--acid)]",
                            keyLbl === "revoked" && "border-red-500/40 text-red-300",
                            keyLbl === "spare" && "border-[var(--line)] text-[var(--text-mute)]",
                            keyLbl === "none" && "border-[var(--line)] text-[var(--text-faint)]",
                          )}
                        >
                          ● {keyLbl}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 font-mono text-white">
                        {sub.filled}/{sub.total}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-right font-mono text-white">{row.eventPoints}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-right font-mono text-white">{Math.round(row.normalizedJudge)}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-right font-mono font-bold text-[var(--acid)]">
                        {Math.round(row.finalScore)}
                      </td>
                      <td className="px-3 py-3">
                        <form action={updateTeamStatus} className="flex flex-wrap items-center gap-1">
                          <input type="hidden" name="teamId" value={row.teamId} />
                          <select
                            name="status"
                            defaultValue={row.status}
                            className="h-8 max-w-[min(130px,100%)] rounded-none border border-[var(--line)] bg-black px-1 font-mono text-[10px] text-white"
                          >
                            {["FORMED", "FORMING", "BUILDING", "SUBMITTED", "LOCKED"].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <Button size="sm" variant="outline" className="h-8 rounded-none px-2 font-mono text-[9px] uppercase">
                            set
                          </Button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title={"// event phase · override"} right="persisted" className="min-w-0 xl:max-w-none">
          <div className="space-y-3 p-4">
            {EVENT_PHASES.map((phase, i) => {
              const st = phaseState(currentPhaseIndex, i);
              return (
                <div
                  key={phase.id}
                  className={cn(
                    "flex items-center justify-between border px-3 py-2 text-[11px]",
                    st === "now" && "border-[var(--acid)]/60 bg-[var(--acid)]/5 text-white",
                    st === "done" && "border-[var(--line)] text-[var(--text-mute)] line-through decoration-[var(--text-faint)]",
                    st === "next" && "border-[var(--line)] text-[var(--acid)]",
                    st === "wait" && "border-[var(--line)] text-[var(--text-faint)]",
                  )}
                >
                  <span className="font-mono uppercase tracking-[0.12em]">{phase.label}</span>
                  <span className="text-[10px] uppercase tracking-[0.16em]">
                    {st === "done" ? "✓ done" : ""}
                    {st === "now" ? "▸ now" : ""}
                    {st === "next" ? "○ next" : ""}
                    {st === "wait" ? "○ wait" : ""}
                  </span>
                </div>
              );
            })}
            <div className="border-t border-[var(--line)] pt-4">
              <form action={advanceEventPhase} className="flex flex-col gap-2">
                <Button type="submit" className="w-full rounded-none font-mono text-[10px] uppercase tracking-[0.14em]">
                  Advance phase manually
                </Button>
              </form>
              <form action={setEventPhase} className="mt-3 grid gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">jump to phase</label>
                <div className="flex flex-wrap gap-2">
                  <select
                    name="phaseId"
                    defaultValue={phaseId}
                    className="h-10 min-w-0 flex-1 rounded-none border border-[var(--line)] bg-black px-2 font-mono text-xs text-white"
                  >
                    {EVENT_PHASES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" variant="outline" className="rounded-none font-mono text-[10px] uppercase">
                    apply
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
