import Image from "next/image"
import { redirect } from "next/navigation"

import { LoginForm } from "./login-form"
import { getSeedLoginHints } from "@/lib/data"
import { getSession } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function LoginPage() {
  const session = await getSession()

  if (session) {
    redirect(session.isAdmin ? "/admin" : session.isJudge ? "/judge" : "/teams/new")
  }

  const hints = await getSeedLoginHints(6)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div className="grid-overlay absolute inset-0" />
      <div className="scanlines absolute inset-0" />
      <div className="relative z-10">
        <div className="flex h-11 items-center justify-between border-b border-[var(--line)] bg-black/90 px-4 text-[11px] text-[var(--text-dim)]">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-red-500" />
            <span className="size-2 rounded-full bg-amber-400" />
            <span className="size-2 rounded-full bg-[var(--acid)]" />
            <span className="ml-3 uppercase tracking-[0.28em] text-[var(--text-mute)]">sign in</span>
          </div>
          <div className="hidden rounded border border-[var(--line)] bg-[var(--panel)] px-4 py-1 md:block">
            techday.altir.internal/auth
          </div>
          <div className="min-w-20 text-right">internal</div>
        </div>

        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 lg:px-8">
          <div className="grid min-h-[calc(100vh-92px)] border border-[var(--line)] bg-black/35 lg:grid-cols-2">
            <section className="flex flex-col justify-between border-b border-[var(--line)] p-8 lg:border-b-0 lg:border-r lg:p-14">
              <Image src="/logo.png" alt="Altir" width={68} height={68} className="rounded-sm" />
              <div className="my-14 space-y-4 text-sm leading-7 text-[var(--text-dim)]">
                <div>
                  <span className="text-[var(--acid)]">$</span> altir-techday --version
                  <div className="pl-4 text-[var(--text-mute)]">v1.0.0 // command-center // 22-may-2026</div>
                </div>
                <div>
                  <span className="text-[var(--acid)]">$</span> whoami
                  <div className="pl-4 text-[var(--text-mute)]">not authenticated / roster login required</div>
                </div>
                <div>
                  <span className="text-[var(--acid)]">$</span> auth login --employee
                  <div className="pl-4 text-[var(--text-mute)]">allowed roles: participant, judge, admin</div>
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-mute)]">
                Employee IDs come from the imported Excel roster. Password is the local part of the email.
              </p>
            </section>

            <section className="flex items-center p-8 lg:p-14">
              <div className="w-full max-w-md">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--acid)]"># /auth/sign-in</div>
                <h1 className="mt-3 text-5xl font-bold tracking-[-0.04em] text-white">Welcome back.</h1>
                <p className="mt-3 text-sm leading-6 text-[var(--text-dim)]">
                  Use your Altir email. Password is the part before the @.
                </p>

                <LoginForm />

                {hints.length > 0 && (
                  <div className="mt-6 border border-[var(--line)] bg-[var(--panel-2)] p-4">
                    <div className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">
                      quick login hints
                    </div>
                    <div className="space-y-2">
                      {hints.map((hint) => (
                        <div key={hint.id} className="flex items-center justify-between text-xs">
                          <span className="text-[var(--text-dim)]">{hint.fullName}</span>
                          <span className="font-mono text-[var(--acid)]">{hint.email}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
