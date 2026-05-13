"use client"

import { useActionState } from "react"

import { loginAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null)

  return (
    <Card className="mt-8 panel-surface gap-0 rounded-none py-0">
      <CardContent className="p-5">
        <form action={formAction} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="psharma@altir.co"
              className="h-11 w-full rounded-none border border-[var(--line)] bg-black px-4 font-mono text-sm text-white outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">password</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="psharma"
              className="h-11 w-full rounded-none border border-[var(--line)] bg-black px-4 font-mono text-sm text-white outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
            />
          </label>

          {state?.error && (
            <div className="border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {state.error}
            </div>
          )}

          <Button
            type="submit"
            disabled={pending}
            className="w-full rounded-none font-mono uppercase tracking-[0.12em]"
          >
            {pending ? "Signing in..." : "Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
