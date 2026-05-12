import {
  assignApiKey,
  createApiKey,
  revokeApiKey,
} from "@/app/admin/actions";
import { listLeaderboard } from "@/lib/data";
import { db } from "@/lib/db";
import { maskSecret } from "@/lib/admin-display";
import { Button } from "@/components/ui/button";
import {
  Field,
  Metric,
  Panel,
  SelectField,
  formatDateInput,
} from "@/components/admin/admin-ui";

export default async function AdminKeysPage() {
  const [leaderboard, apiKeys, teamCount] = await Promise.all([
    listLeaderboard(),
    db.apiKey.findMany({
      include: { assignedTeam: true },
      orderBy: [{ label: "asc" }],
    }),
    db.team.count(),
  ]);

  const liveKeys = apiKeys.filter((k) => k.status === "ASSIGNED").length;
  const spareKeys = apiKeys.filter((k) => k.status === "AVAILABLE").length;
  const revokedKeys = apiKeys.filter((k) => k.status === "REVOKED").length;
  const teamsWithLiveKey = apiKeys.filter((k) => k.status === "ASSIGNED" && k.assignedTeamId).length;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--acid)]">{"//"} keys</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">API key pool</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-dim)]">Add one key at a time, assign per row, revoke when needed.</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title={"// add a key · one at a time"} right="pool">
          <form action={createApiKey} className="grid gap-4 p-5 md:grid-cols-2">
            <Field label="provider" name="provider" defaultValue="OpenAI" />
            <Field label="label" name="label" placeholder="OPENAI-ALTIR-013" />
            <Field label="secret" name="secret" type="password" placeholder="sk-proj-..." className="md:col-span-2" />
            <Field label="model / notes" name="notes" placeholder="gpt-4o" className="md:col-span-2" />
            <SelectField
              label="assign to team"
              name="assignedTeamId"
              options={leaderboard.map((t) => ({ label: t.teamName, value: t.teamId }))}
            />
            <Field label="visible from" name="visibleFrom" type="datetime-local" />
            <Button className="rounded-none font-mono uppercase tracking-[0.12em] md:col-span-2">Add key</Button>
          </form>
        </Panel>

        <Panel title={"// key pool · summary"} right={`${apiKeys.length} total`}>
          <div className="grid gap-3 p-5 sm:grid-cols-3">
            <Metric label="live" value={String(liveKeys)} accent />
            <Metric label="spare" value={String(spareKeys)} />
            <Metric label="revoked" value={String(revokedKeys)} />
          </div>
          <p className="border-t border-[var(--line)] px-5 py-4 text-xs text-[var(--text-dim)]">
            {teamsWithLiveKey} of {teamCount} teams have an assigned key. Policy: visible from the scheduled time once an idea exists; revoke moves the key
            out of rotation.
          </p>
        </Panel>

        <Panel title={"// key registry · assign per row"} right={`${apiKeys.length} rows`} className="xl:col-span-2">
          <div className="divide-y divide-[var(--line)]">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:flex-wrap lg:items-end">
                <div className="min-w-0 flex-1 lg:basis-[280px]">
                  <p className="font-mono text-xs text-[var(--acid)]">{maskSecret(apiKey.secret)}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)]">
                    {apiKey.label} · {apiKey.provider}
                    {apiKey.notes ? ` · ${apiKey.notes}` : ""}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
                    status {apiKey.status}
                    {apiKey.assignedTeam ? ` → ${apiKey.assignedTeam.name}` : ""}
                  </p>
                </div>
                <form action={assignApiKey} className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end lg:gap-4">
                  <input type="hidden" name="apiKeyId" value={apiKey.id} />
                  <div className="min-w-[160px] flex-1 sm:max-w-[200px]">
                    <SelectField
                      label="assign"
                      name="assignedTeamId"
                      defaultValue={apiKey.assignedTeamId ?? ""}
                      options={leaderboard.map((t) => ({ label: t.teamName, value: t.teamId }))}
                    />
                  </div>
                  <div className="min-w-[180px] flex-1 sm:max-w-[220px]">
                    <Field label="visible from" name="visibleFrom" type="datetime-local" defaultValue={formatDateInput(apiKey.visibleFrom)} />
                  </div>
                  <Button variant="outline" className="rounded-none font-mono text-[10px] uppercase">
                    save row
                  </Button>
                </form>
                <form action={revokeApiKey} className="flex items-end">
                  <input type="hidden" name="apiKeyId" value={apiKey.id} />
                  <Button
                    type="submit"
                    variant="outline"
                    className="rounded-none border-red-500/40 font-mono text-[10px] uppercase text-red-300 hover:bg-red-500/10"
                  >
                    revoke
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
