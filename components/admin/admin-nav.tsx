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
  { href: "/admin/overview", label: "Console", end: true },
  { href: "/admin/teams",    label: "Teams",    badge: (s) => String(s.teamCount) },
  { href: "/admin/keys",     label: "Keys",     badge: (s) => String(s.keyCount) },
  { href: "/admin/scoring",  label: "Scoring" },
  { href: "/admin/ideas",    label: "Ideas",    badge: (s) => `${s.ideaBankActive}/${s.ideaBankTotal}` },
  { href: "/admin/broadcast",label: "Broadcast" },
  { href: "/admin/people",   label: "People",   badge: (s) => `${s.judgeCount}j` },
  { href: "/admin/audit",    label: "Audit" },
];

/** Horizontal topbar nav — used in the new admin shell */
export function AdminTopbarNav({ stats }: { stats: AdminNavStats }) {
  const pathname = usePathname();

  return (
    <nav className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
      {NAV.map((item) => {
        const active = item.end
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const badge = item.badge?.(stats);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            className={cn(
              "flex shrink-0 items-center gap-1.5 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors duration-150",
              active
                ? "bg-[var(--panel-3)] text-white"
                : "text-[var(--text-mute)] hover:bg-[var(--panel-2)] hover:text-white",
            )}
          >
            {item.label}
            {badge != null ? (
              <span
                className={cn(
                  "text-[9px] font-bold",
                  active ? "text-[var(--acid)]" : "text-[var(--text-faint)]",
                )}
              >
                · {badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

/** Legacy vertical nav — kept for reference, unused in new shell */
export function AdminNav({ stats }: { stats: AdminNavStats }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 border border-[var(--line)] bg-black/30 p-2">
      {NAV.map((item) => {
        const active = item.end
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const badge = item.badge?.(stats);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            className={cn(
              "flex items-center justify-between gap-2 rounded-none px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-150",
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

/** Horizontal strip on small viewports */
export function AdminMobileNav({ stats }: { stats: AdminNavStats }) {
  const pathname = usePathname();

  return (
    <nav className="-mx-1 flex gap-1 overflow-x-auto border-b border-[var(--line)] bg-black/50 px-1 pb-3 pt-1 lg:hidden">
      {NAV.map((item) => {
        const active = item.end
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const badge = item.badge?.(stats);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            className={cn(
              "shrink-0 whitespace-nowrap border px-2.5 py-2 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors duration-150",
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
