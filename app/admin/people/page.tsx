import { db } from "@/lib/db";
import { Panel, RoleToggle } from "@/components/admin/admin-ui";
import { AddPersonButton, DeletePersonButton, EditPersonButton } from "@/components/admin/edit-person-modal";

export default async function AdminPeoplePage() {
  const users = await db.user.findMany({
    orderBy: [{ fullName: "asc" }],
  });

  const activeCount = users.filter((u) => u.isActive).length;

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--acid)]">{"//"} people</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">Privileges</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-dim)]">Edit details, set roles, manage access.</p>
        </div>
        <div className="mt-2 shrink-0">
          <AddPersonButton />
        </div>
      </header>

      <Panel title={"// employees"} right={`${activeCount} active · ${users.length} total`}>
        <div className="max-h-[min(70vh,720px)] divide-y divide-[var(--line)] overflow-auto terminal-scrollbar">
          {users.map((user) => (
            <div
              key={user.id}
              className={`grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto_auto_auto_auto] md:items-center ${!user.isActive ? "opacity-40" : ""}`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">{user.fullName}</p>
                  {!user.isActive && (
                    <span className="border border-[var(--line)] px-1.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
                      inactive
                    </span>
                  )}
                  {!user.isEligible && (
                    <span className="border border-orange-400/30 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-orange-400">
                      ineligible
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-mute)]">{user.email}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
                  {user.primaryAssignment ?? "Unassigned"}{user.title ? ` · ${user.title}` : ""}
                </p>
              </div>
              <EditPersonButton user={user} />
              <DeletePersonButton user={user} />
              <RoleToggle userId={user.id} role="admin" enabled={user.isAdmin} />
              <RoleToggle userId={user.id} role="judge" enabled={user.isJudge} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
