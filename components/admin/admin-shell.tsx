import Link from "next/link";
import type { ReactNode } from "react";

import { AdminTopbarNav } from "@/components/admin/admin-nav";
import { logoutAction } from "@/app/login/actions";
import type { AdminNavStats } from "@/lib/admin-nav-stats";

export function AdminShell({ navStats, children }: { navStats: AdminNavStats; children: ReactNode }) {
  return (
    <main className="relative min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="grid-overlay pointer-events-none absolute inset-0" />
      <div className="scanlines pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Browser chrome strip */}
        <div className="flex h-9 shrink-0 items-center gap-3 border-b border-[var(--line)] bg-[#060606] px-4 text-[10px] text-[var(--text-mute)]">
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-[#333]" />
            <span className="size-2 rounded-full bg-[#333]" />
            <span className="size-2 rounded-full bg-[#333]" />
          </div>
          <div className="mx-auto hidden max-w-sm flex-1 items-center justify-center gap-2 border border-[var(--line)] bg-[var(--panel)] px-3 py-0.5 text-center md:flex">
            <span style={{ color: '#ff2bd6' }}>⌧</span>
            <span className="text-[var(--text-mute)]">https://</span>
            <span className="text-[var(--text-dim)]">techday.altir.internal/admin</span>
          </div>
          <span className="ml-auto" style={{ color: '#ff2bd6' }}>● admin session</span>
        </div>

        {/* Admin topbar */}
        <header className="sticky top-0 z-30 shrink-0 border-b border-[var(--line)] bg-black/90 backdrop-blur">
          <div className="flex h-14 items-center gap-5 px-4 lg:px-6">
            {/* Brand */}
            <Link href="/admin/overview" className="flex shrink-0 items-center gap-2.5">
              <span
                className="grid size-[22px] place-items-center text-[13px] font-black text-black"
                style={{ background: '#ff2bd6', boxShadow: '0 0 14px rgba(255,43,214,0.45)' }}
              >
                A
              </span>
              <span className="hidden font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-white sm:block">
                Admin · Command
              </span>
              <span className="hidden text-[11px] text-[var(--text-mute)] lg:block">// root.altir@techday</span>
            </Link>

            {/* Nav */}
            <AdminTopbarNav stats={navStats} />

            {/* Right */}
            <div className="ml-auto flex shrink-0 items-center gap-3 text-[10px]">
              <span
                className="hidden items-center gap-1.5 border px-2 py-1 font-bold uppercase tracking-[0.12em] sm:flex"
                style={{ color: '#ff2bd6', borderColor: 'rgba(255,43,214,0.4)', background: 'rgba(255,43,214,0.06)' }}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: '#ff2bd6', boxShadow: '0 0 6px rgba(255,43,214,0.6)' }}
                />
                Role · Admin
              </span>
              <Link href="/" className="text-[var(--text-mute)] hover:text-white uppercase tracking-[0.1em]">
                ← flow
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="text-[var(--text-mute)] hover:text-white uppercase tracking-[0.1em]">
                  logout
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-x-auto">
          <div className="mx-auto max-w-[1680px] space-y-6 px-4 py-6 lg:px-6">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
