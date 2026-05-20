import {
  assignApiKey,
  createApiKey,
  revokeApiKey,
} from "@/app/admin/actions";
import { listLeaderboard } from "@/lib/data";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Field,
  Panel,
  SelectField,
} from "@/components/admin/admin-ui";
import { DateTimeUtcInput } from "@/components/admin/datetime-utc-input";
import { AdminApiKeySecretCell } from "@/components/admin/api-key-secret-cell";
import { TECH_DAY_KEYS_REVEAL_MS } from "@/lib/tech-day-schedule";
import { cn } from "@/lib/utils";

export default async function AdminKeysPage() {
  const [leaderboard, apiKeys, teamCount] = await Promise.all([
    listLeaderboard(),
    db.apiKey.findMany({
      include: { assignedTeam: true },
      orderBy: [{ label: "asc" }],
    }),
    db.team.count(),
  ]);

  const liveKeys   = apiKeys.filter((k) => k.status === "ASSIGNED").length;
  const spareKeys  = apiKeys.filter((k) => k.status === "AVAILABLE").length;
  const revokedKeys = apiKeys.filter((k) => k.status === "REVOKED").length;
  const teamsWithLiveKey = apiKeys.filter((k) => k.status === "ASSIGNED" && k.assignedTeamId).length;

  const statusColor = (s: string) =>
    s === "ASSIGNED"  ? "var(--acid)"   :
    s === "REVOKED"   ? "var(--danger)" :
    s === "AVAILABLE" ? "var(--warn)"   : "var(--text-mute)";

  return (
    <div className="space-y-5">
      {/* Header */}
      <header>
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--acid)]">{"//"} keys</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">API key pool.</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {[
            { label: `${apiKeys.length} total`, cls: "border-[var(--acid)]/40 text-[var(--acid)]" },
            { label: `${liveKeys} assigned`, cls: "border-[var(--acid)]/40 text-[var(--acid)]" },
            { label: `${teamsWithLiveKey} / ${teamCount} teams`, cls: "border-[var(--line)] text-[var(--text-dim)]" },
            ...(spareKeys > 0  ? [{ label: `${spareKeys} spare`, cls: "border-[var(--warn)]/40 text-[var(--warn)]" }] : []),
            ...(revokedKeys > 0 ? [{ label: `${revokedKeys} revoked`, cls: "border-red-500/40 text-red-400" }] : []),
          ].map(({ label, cls }) => (
            <span key={label} className={cn("border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em]", cls)}>
              {label}
            </span>
          ))}
        </div>
      </header>

      {/* Add key + policy side by side */}
      <div className="grid gap-4 xl:grid-cols-[1fr_288px]">
        <Panel title={"// add a key · one at a time"} right="pool">
          <form action={createApiKey} className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="provider" name="provider" defaultValue="OpenAI" />
            <Field label="label" name="label" placeholder="OPENAI-ALTIR-013" />
            <Field label="secret" name="secret" type="password" placeholder="sk-proj-..." className="sm:col-span-2" />
            <Field label="model / notes" name="notes" placeholder="gpt-4o" className="sm:col-span-2 lg:col-span-2" />
            <SelectField
              label="assign to team"
              name="assignedTeamId"
              options={leaderboard.map((t) => ({ label: t.teamName, value: t.teamId }))}
            />
            <DateTimeUtcInput
              name="visibleFrom"
              defaultValue={new Date(TECH_DAY_KEYS_REVEAL_MS)}
              className="h-9 w-full rounded-none border border-[var(--line)] bg-black px-2 font-mono text-[10px] text-white outline-none focus:border-[var(--acid)]"
            />
            <Button className="rounded-none font-mono uppercase tracking-[0.12em] sm:col-span-2 lg:col-span-4">
              ＋ add key
            </Button>
          </form>
        </Panel>

        <Panel title={"// rotation policy"}>
          <div className="space-y-0 divide-y divide-[var(--line)] px-5 py-0">
            {[
              ["on rate-limit", "auto-rotate", "text-[var(--acid)]"],
              ["on leak",       "revoke + alert", "text-red-400"],
              ["cool-down",     "60 s",         "text-white"],
              ["max per team",  "2 active",     "text-white"],
            ].map(([k, v, cls]) => (
              <div key={k} className="flex items-center justify-between py-3 text-[11px]">
                <span className="text-[var(--text-mute)]">{k}</span>
                <span className={cn("font-mono font-bold", cls)}>{v}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--line)] px-5 py-3 text-[10px] text-[var(--text-faint)]">
            Policy: visible from scheduled time once an idea exists. Revoke removes from rotation.
          </div>
        </Panel>
      </div>

      {/* Key registry — compact table */}
      <Panel title={"// key registry · assign per row"} right={`${apiKeys.length} rows`}>
        {/* Table column headers */}
        <div
          className="grid border-b border-[var(--line)] px-4 py-2 text-[9px] uppercase tracking-[0.14em] text-[var(--text-mute)]"
          style={{ gridTemplateColumns: "2fr 0.6fr 1fr 0.75fr 1.1fr 1.1fr 0.5fr" }}
        >
          <span>KEY</span>
          <span>PROV</span>
          <span>TEAM</span>
          <span>STATUS</span>
          <span>ASSIGN TO</span>
          <span>VISIBLE FROM</span>
          <span className="text-right">ACT</span>
        </div>

        <div className="divide-y divide-[var(--line)] overflow-x-auto">
          {apiKeys.map((apiKey) => {
            const sc = statusColor(apiKey.status);
            const isRevoked = apiKey.status === "REVOKED";
            return (
              <div
                key={apiKey.id}
                className="min-w-[860px]"
                style={{ background: isRevoked ? "rgba(255,77,77,0.04)" : "transparent" }}
              >
                {/* Info + label row */}
                <div
                  className="grid items-center gap-x-3 px-4 pt-2.5 pb-1 text-[11px]"
                  style={{ gridTemplateColumns: "2fr 0.6fr 1fr 0.75fr 1.1fr 1.1fr 0.5fr" }}
                >
                  <AdminApiKeySecretCell
                    apiKeyId={apiKey.id}
                    label={apiKey.label}
                    secret={apiKey.secret}
                    notes={apiKey.notes}
                    isRevoked={isRevoked}
                  />
                  <span className="text-[10px] text-[var(--text-mute)]">{apiKey.provider}</span>
                  <span>
                    {apiKey.assignedTeam ? (
                      <span className="font-bold text-white">{apiKey.assignedTeam.name}</span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--acid)]">＋ unassigned</span>
                    )}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.1em]"
                    style={{ color: sc }}
                  >
                    ● {apiKey.status.toLowerCase()}
                  </span>
                  {/* Assign form spans 2 cols + act col */}
                  <form
                    id={`assign-${apiKey.id}`}
                    action={assignApiKey}
                    className="contents"
                  >
                    <input type="hidden" name="apiKeyId" value={apiKey.id} />
                    <select
                      name="assignedTeamId"
                      defaultValue={apiKey.assignedTeamId ?? ""}
                      className="h-7 w-full rounded-none border border-[var(--line)] bg-black px-2 font-mono text-[10px] text-white outline-none focus:border-[var(--acid)]"
                    >
                      <option value="">spare pool</option>
                      {leaderboard.map((t) => (
                        <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
                      ))}
                    </select>
                    <DateTimeUtcInput
                      name="visibleFrom"
                      defaultValue={apiKey.visibleFrom}
                      className="h-7 w-full rounded-none border border-[var(--line)] bg-black px-2 font-mono text-[10px] text-white outline-none focus:border-[var(--acid)]"
                    />
                  </form>
                  {/* Action column: save + revoke */}
                  <div className="flex justify-end gap-1">
                    <button
                      type="submit"
                      form={`assign-${apiKey.id}`}
                      className="h-7 border border-[var(--line)] px-2.5 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-mute)] hover:border-[var(--text-mute)] hover:text-white"
                    >
                      save
                    </button>
                    <form action={revokeApiKey}>
                      <input type="hidden" name="apiKeyId" value={apiKey.id} />
                      <button
                        type="submit"
                        disabled={isRevoked}
                        className="h-7 border border-red-500/30 px-2.5 font-mono text-[9px] text-red-400 hover:border-red-500/60 disabled:opacity-30"
                      >
                        ⌫
                      </button>
                    </form>
                  </div>
                </div>

                {/* Sub-info row: label, notes, visible-from text */}
                <div className="px-4 pb-2 text-[9px] uppercase tracking-[0.12em] text-[var(--text-faint)]">
                  {[apiKey.label, apiKey.notes].filter(Boolean).join(" · ")}
                </div>
              </div>
            );
          })}

          {apiKeys.length === 0 && (
            <div className="px-4 py-10 text-center font-mono text-[11px] text-[var(--text-faint)]">
              No keys in pool — add one above.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
