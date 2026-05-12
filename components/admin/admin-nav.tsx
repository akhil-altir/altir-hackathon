"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { AdminNavStats } from "@/lib/admin-nav-stats";
import { cn } from "@/lib/utils";

const NAV: Array<{
  href: string;
  label: string;
  end?: boolean;
  badge?: (s: AdminNavStats) => string;
}> = [
  { href: "/admin/overview", label: "Overview", end: true },
  { href: "/admin/teams", label: "Teams", badge: (s) => String(s.teamCount) },
  { href: "/admin/keys", label: "API keys", badge: (s) => String(s.keyCount) },
  { href: "/admin/scoring", label: "Scoring" },
  { href: "/admin/ideas", label: "Idea bank", badge: (s) => `${s.ideaBankActive}/${s.ideaBankTotal}` },
  { href: "/admin/broadcast", label: "Broadcast" },
  { href: "/admin/people", label: "People" },
  { href: "/admin/audit", label: "Audit" },
];

export function AdminNav({ stats }: { stats: AdminNavStats }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 border border-[var(--line)] bg-black/30 p-2">
      {NAV.map((item) => {
        const active = item.end ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const badge = item.badge?.(stats);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            className={cn(
              "flex items-center justify-between gap-2 rounded-sm px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-150",
              active
                ? "bg-[var(--acid)]/15 text-[var(--acid)] ring-1 ring-[var(--acid)]/35"
                : "text-[var(--text-dim)] hover:bg-white/[0.04] hover:text-white",
            )}
          >
            <span>{item.label}</span>
            {badge != null ? <span className="text-[10px] text-[var(--text-mute)]">{badge}</span> : null}
          </Link>
        );
      })}
      <div className="border-t border-[var(--line)] px-2 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
        judges · {stats.judgeCount}
      </div>
    </nav>
  );
}

/** Horizontal strip on small viewports so routes are obvious without hunting the sidebar. */
export function AdminMobileNav({ stats }: { stats: AdminNavStats }) {
  const pathname = usePathname();

  return (
    <nav className="-mx-1 flex gap-1 overflow-x-auto border-b border-[var(--line)] bg-black/50 px-1 pb-3 pt-1 lg:hidden">
      {NAV.map((item) => {
        const active = item.end ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const badge = item.badge?.(stats);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            className={cn(
              "shrink-0 whitespace-nowrap rounded-sm border px-2.5 py-2 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors duration-150",
              active
                ? "border-[var(--acid)]/60 bg-[var(--acid)]/10 text-[var(--acid)]"
                : "border-[var(--line)] text-[var(--text-mute)] hover:border-[var(--text-mute)]",
            )}
          >
            {item.label}
            {badge != null ? ` ${badge}` : ""}
          </Link>
        );
      })}
    </nav>
  );
}
