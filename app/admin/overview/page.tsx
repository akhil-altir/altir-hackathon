import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MetricPill } from "@/components/admin/admin-ui";
import { getAdminOverviewMetrics } from "@/lib/admin-overview-data";
import { EVENT_PHASES } from "@/lib/event-phase";
import { BLEND_TOTAL } from "@/lib/scoring-blend";

export default async function AdminOverviewPage() {
  const m = await getAdminOverviewMetrics();

  const links = [
    { href: "/admin/teams", title: "Teams", desc: "Roster, filters, and per-team phase override." },
    { href: "/admin/keys", title: "API keys", desc: "Add keys, assign per row, revoke." },
    { href: "/admin/scoring", title: "Scoring", desc: "1000-point ladder, judge criteria, event rules." },
    { href: "/admin/ideas", title: "Idea bank", desc: "Curated ideas teams can pick from." },
    { href: "/admin/broadcast", title: "Broadcast", desc: "Announcements for TV and participants." },
    { href: "/admin/people", title: "People", desc: "Admin and judge privileges." },
    { href: "/admin/audit", title: "Audit", desc: "Recent announcement history." },
  ] as const;

  return (
    <div className="space-y-8">
      <header className="panel-surface panel-highlight p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--acid)]">{"//"} overview</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white md:text-5xl">Command center</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-dim)]">
          Each section is its own URL (see left nav). Use the cards below or the sidebar to jump anywhere.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          <MetricPill
            label="phase"
            value={EVENT_PHASES[m.currentPhaseIndex]?.label.split(" ").slice(1).join(" ") ?? "—"}
            accent
          />
          <MetricPill label="teams" value={String(m.teamCount)} />
          <MetricPill label="keys live" value={`${m.liveKeys} / ${m.keyTotal}`} />
          <MetricPill label="ideas" value={String(m.ideasLockedCount)} />
          <MetricPill label="submitted" value={`${m.submissionReadyCount} / ${m.teamCount}`} />
          <MetricPill label="judge scores" value={`${m.judgeScoreCount} / ${m.expectedJudgeCells}`} />
          <MetricPill label="evt max" value={`${m.eventMaxPts} pts`} />
          <MetricPill label="judge max" value={`${m.judgeMaxPts} pts`} />
        </div>
        <p className="mt-4 font-mono text-[11px] text-[var(--text-mute)]">
          blend ladder · {m.eventMaxPts} max event pts → 400 / {m.judgeMaxPts} max judge pts → 600 (of {BLEND_TOTAL} on leaderboard)
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            className="group panel-surface border border-[var(--line)] p-5 transition-colors duration-150 hover:border-[var(--acid)]/45"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">open</p>
            <h2 className="mt-2 text-lg font-bold text-white group-hover:text-[var(--acid)]">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-dim)]">{item.desc}</p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]">→ {item.href}</p>
          </Link>
        ))}
      </div>

      <div className="flex justify-end">
        <Button asChild variant="outline" className="rounded-none font-mono text-[10px] uppercase">
          <Link href="/admin/teams">Start with teams →</Link>
        </Button>
      </div>
    </div>
  );
}
