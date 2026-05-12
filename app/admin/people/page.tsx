import { db } from "@/lib/db";
import { Panel, RoleToggle } from "@/components/admin/admin-ui";

export default async function AdminPeoplePage() {
  const users = await db.user.findMany({
    where: { isActive: true },
    orderBy: [{ fullName: "asc" }],
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--acid)]">{"//"} people</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">Privileges</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-dim)]">Grant or revoke admin and judge roles.</p>
      </header>

      <Panel title={"// employees"} right={`${users.length} active`}>
        <div className="max-h-[min(70vh,720px)] divide-y divide-[var(--line)] overflow-auto terminal-scrollbar">
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
    </div>
  );
}
