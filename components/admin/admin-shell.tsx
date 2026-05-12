import Link from "next/link";
import type { ReactNode } from "react";

import { AdminMobileNav, AdminNav } from "@/components/admin/admin-nav";
import { logoutAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import type { AdminNavStats } from "@/lib/admin-nav-stats";

export function AdminShell({ navStats, children }: { navStats: AdminNavStats; children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-x-auto overflow-y-auto bg-[var(--bg)] text-[var(--text)]">
      <div className="grid-overlay pointer-events-none absolute inset-0" />
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1680px] flex-col gap-6 px-4 py-6 lg:flex-row lg:gap-8">
        <aside className="flex w-full shrink-0 flex-col gap-4 lg:sticky lg:top-6 lg:w-56 lg:self-start">
          <div className="panel-surface border border-[var(--line)]">
            <div className="flex h-9 items-center gap-2 border-b border-[var(--line)] bg-black/60 px-3 text-[9px] uppercase tracking-[0.16em] text-[var(--text-mute)]">
              <span className="size-1.5 rounded-full bg-[#333]" />
              <span className="size-1.5 rounded-full bg-[#333]" />
              <span className="size-1.5 rounded-full bg-[#333]" />
              <span className="ml-2 truncate font-mono text-[var(--text-dim)]">techday.altir.internal</span>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--acid)]">admin</p>
              <p className="mt-1 font-mono text-xs font-bold text-white">command</p>
              <p className="mt-2 text-[10px] text-[var(--text-mute)]">conn ok</p>
            </div>
          </div>

          <AdminNav stats={navStats} />

          <div className="flex flex-col gap-2">
            <Button asChild variant="outline" className="w-full rounded-none font-mono text-[10px] uppercase tracking-[0.12em]">
              <Link href="/">← flow</Link>
            </Button>
            <form action={logoutAction}>
              <Button variant="outline" className="w-full rounded-none font-mono text-[10px] uppercase tracking-[0.12em]">
                Logout
              </Button>
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-x-auto lg:min-h-0">
          <AdminMobileNav stats={navStats} />
          <div className="min-w-0 flex-1 space-y-6 pb-2 transition-opacity duration-200">{children}</div>
        </div>
      </div>
    </main>
  );
}
