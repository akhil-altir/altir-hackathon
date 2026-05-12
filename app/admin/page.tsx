import Link from "next/link"

import { createApiKey, assignApiKey, createEventScore, toggleEventScore, updateUserRole } from "@/app/admin/actions"
import { logoutAction } from "@/app/login/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const [apiKeys, scoreCriteria, users, teams] = await Promise.all([
    db.apiKey.findMany({
      include: {
        assignedTeam: true,
      },
      orderBy: [{ label: "asc" }],
    }),
    db.scoreCriterion.findMany({
      where: {
        category: "EVENT",
      },
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
    }),
    db.user.findMany({
      where: {
        isActive: true,
      },
      orderBy: [{ fullName: "asc" }],
    }),
    db.team.findMany({
      orderBy: [{ name: "asc" }],
    }),
  ])

  const admins = users.filter((user) => user.isAdmin)
  const judges = users.filter((user) => user.isJudge)
  const assignedKeys = apiKeys.filter((apiKey) => apiKey.assignedTeamId)
  const activeScores = scoreCriteria.filter((criterion) => criterion.isActive)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] px-4 py-6 text-[var(--text)]">
      <div className="grid-overlay absolute inset-0" />
      <div className="scanlines absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-7xl space-y-6">
        <header className="panel-surface panel-highlight p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--acid)]">Changes-1 / admin command surface</p>
              <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">Run the event without touching SQL.</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-dim)]">
                Manage admin and judge privileges, create API keys, assign keys to teams, and define event score rules used by the command center.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" className="rounded-none font-mono uppercase tracking-[0.12em]">
                <Link href="/">Back to flow</Link>
              </Button>
              <form action={logoutAction}>
                <Button variant="outline" className="rounded-none font-mono uppercase tracking-[0.12em]">
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric label="admins" value={String(admins.length)} />
          <Metric label="judges" value={String(judges.length)} />
          <Metric label="assigned keys" value={`${assignedKeys.length}/${apiKeys.length}`} accent />
          <Metric label="active score rules" value={String(activeScores.length)} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Panel title="// privileges" right={`${users.length} employees`}>
            <div className="max-h-[560px] divide-y divide-[var(--line)] overflow-auto terminal-scrollbar">
              {users.map((user) => (
                <div key={user.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                  <div>
                    <p className="text-sm font-bold text-white">{user.fullName}</p>
                    <p className="text-xs text-[var(--text-mute)]">{user.email}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)]">{user.primaryAssignment ?? "Unassigned"}</p>
                  </div>
                  <RoleToggle userId={user.id} role="admin" enabled={user.isAdmin} />
                  <RoleToggle userId={user.id} role="judge" enabled={user.isJudge} />
                </div>
              ))}
            </div>
          </Panel>

          <div className="space-y-6">
            <Panel title="// add api key" right="team assignment optional">
              <form action={createApiKey} className="grid gap-4 p-5 md:grid-cols-2">
                <Field label="provider" name="provider" defaultValue="OpenAI" />
                <Field label="label" name="label" placeholder="OPENAI-ALTIR-013" />
                <Field label="secret" name="secret" type="password" placeholder="sk-proj-..." className="md:col-span-2" />
                <SelectField label="assign to team" name="assignedTeamId" options={teams.map((team) => ({ label: team.name, value: team.id }))} />
                <Field label="visible from" name="visibleFrom" type="datetime-local" />
                <Button className="rounded-none font-mono uppercase tracking-[0.12em] md:col-span-2">Create key</Button>
              </form>
            </Panel>

            <Panel title="// define event score" right="used for event points">
              <form action={createEventScore} className="grid gap-4 p-5 md:grid-cols-2">
                <Field label="label" name="label" placeholder="Early demo rehearsal" />
                <Field label="key" name="key" placeholder="early_demo_rehearsal" />
                <Field label="points" name="pointsValue" type="number" defaultValue="5" />
                <Field label="sort order" name="sortOrder" type="number" defaultValue="99" />
                <Field label="description" name="description" placeholder="Team rehearsed before demo queue started." className="md:col-span-2" />
                <Button className="rounded-none font-mono uppercase tracking-[0.12em] md:col-span-2">Save score rule</Button>
              </form>
            </Panel>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Panel title="// api key assignments" right={`${apiKeys.length} loaded`}>
            <div className="divide-y divide-[var(--line)]">
              {apiKeys.map((apiKey) => (
                <form key={apiKey.id} action={assignApiKey} className="grid gap-4 px-5 py-4 lg:grid-cols-[1fr_220px_190px_auto] lg:items-end">
                  <input type="hidden" name="apiKeyId" value={apiKey.id} />
                  <div>
                    <p className="text-sm font-bold text-white">{apiKey.label}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-mute)]">{apiKey.provider}</p>
                    <p className="mt-2 max-w-lg truncate font-mono text-xs text-[var(--text-faint)]">{apiKey.secret}</p>
                  </div>
                  <SelectField
                    label="team"
                    name="assignedTeamId"
                    defaultValue={apiKey.assignedTeamId ?? ""}
                    options={teams.map((team) => ({ label: team.name, value: team.id }))}
                  />
                  <Field label="visible from" name="visibleFrom" type="datetime-local" defaultValue={formatDateInput(apiKey.visibleFrom)} />
                  <Button variant="outline" className="rounded-none font-mono uppercase tracking-[0.12em]">Update</Button>
                </form>
              ))}
            </div>
          </Panel>

          <Panel title="// event score definitions" right={`${activeScores.length} active`}>
            <div className="divide-y divide-[var(--line)]">
              {scoreCriteria.map((criterion) => (
                <div key={criterion.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-white">{criterion.label}</p>
                      <span className={cn("border px-2 py-1 text-[10px] uppercase tracking-[0.16em]", criterion.isActive ? "border-[var(--acid)]/40 text-[var(--acid)]" : "border-[var(--line)] text-[var(--text-mute)]")}>
                        {criterion.isActive ? "active" : "off"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--text-dim)]">{criterion.description}</p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
                      {criterion.key} / order {criterion.sortOrder}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-[var(--acid)]">{criterion.pointsValue ?? 0}</span>
                    <RoleLikeToggle action={toggleEventScore} idName="criterionId" idValue={criterion.id} enabled={criterion.isActive} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>
    </main>
  )
}

function Panel({ title, right, children }: { title: string; right?: string; children: React.ReactNode }) {
  return (
    <Card className="panel-surface gap-0 rounded-none py-0">
      <CardHeader className="border-b border-[var(--line)] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xs uppercase tracking-[0.22em] text-[var(--text-dim)]">{title}</CardTitle>
          {right && <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-mute)]">{right}</span>}
        </div>
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  )
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="panel-surface p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">{label}</div>
      <div className={cn("mt-2 text-3xl font-bold", accent ? "text-[var(--acid)]" : "text-white")}>{value}</div>
    </div>
  )
}

function RoleToggle({ userId, role, enabled }: { userId: string; role: "admin" | "judge"; enabled: boolean }) {
  return (
    <form action={updateUserRole}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="enabled" value={enabled ? "false" : "true"} />
      <Button
        variant={enabled ? "default" : "outline"}
        size="sm"
        className="w-28 rounded-none font-mono uppercase tracking-[0.12em]"
      >
        {enabled ? role : `make ${role}`}
      </Button>
    </form>
  )
}

function RoleLikeToggle({
  action,
  idName,
  idValue,
  enabled,
}: {
  action: (formData: FormData) => Promise<void>
  idName: string
  idValue: string
  enabled: boolean
}) {
  return (
    <form action={action}>
      <input type="hidden" name={idName} value={idValue} />
      <input type="hidden" name="enabled" value={enabled ? "false" : "true"} />
      <Button variant={enabled ? "outline" : "default"} size="sm" className="rounded-none font-mono uppercase tracking-[0.12em]">
        {enabled ? "Disable" : "Enable"}
      </Button>
    </form>
  )
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  className,
}: {
  label: string
  name: string
  type?: string
  defaultValue?: string
  placeholder?: string
  className?: string
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">{label}</span>
      <input
        className="h-11 w-full rounded-none border border-[var(--line)] bg-black px-3 font-mono text-sm text-white outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </label>
  )
}

function SelectField({
  label,
  name,
  options,
  defaultValue = "",
}: {
  label: string
  name: string
  options: Array<{ label: string; value: string }>
  defaultValue?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">{label}</span>
      <select
        className="h-11 w-full rounded-none border border-[var(--line)] bg-black px-3 font-mono text-sm text-white outline-none transition focus:border-[var(--acid)]"
        name={name}
        defaultValue={defaultValue}
      >
        <option value="">Unassigned</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function formatDateInput(date: Date | null) {
  if (!date) {
    return ""
  }

  return date.toISOString().slice(0, 16)
}
