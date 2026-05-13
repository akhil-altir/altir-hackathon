import { db } from "@/lib/db";
import { Panel } from "@/components/admin/admin-ui";

export default async function AdminAuditPage() {
  const announcements = await db.announcement.findMany({
    orderBy: [{ publishedAt: "desc" }],
    take: 24,
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--acid)]">{"//"} audit</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">Announcement log</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-dim)]">Recent publishes (newest first).</p>
      </header>

      <Panel title={"// history"} right={`${announcements.length} shown`}>
        <div className="divide-y divide-[var(--line)]">
          {announcements.map((item) => (
            <div key={item.id} className="px-5 py-4">
              <p className="text-sm font-bold text-white">{item.title}</p>
              <p className="mt-1 text-xs text-[var(--text-dim)]">{item.message}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
                {item.publishedAt.toISOString().slice(0, 16).replace("T", " ")} UTC
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
