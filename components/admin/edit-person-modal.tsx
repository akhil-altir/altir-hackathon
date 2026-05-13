"use client"

import { useRef, useState, useTransition } from "react"

import { updateUserDetails } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"

interface User {
  id: string
  fullName: string
  email: string
  title: string | null
  employeeId: string | null
  reportingManager: string | null
  primaryAssignment: string | null
  secondaryAssignment: string | null
  isActive: boolean
  isEligible: boolean
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string
  name: string
  defaultValue?: string | null
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)]">
        {label}
        {required && <span className="ml-1 text-[var(--acid)]">*</span>}
      </label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        className="w-full border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm text-white placeholder:text-[var(--text-faint)] focus:border-[var(--acid)] focus:outline-none"
      />
    </div>
  )
}

function Toggle({
  label,
  name,
  defaultChecked,
}: {
  label: string
  name: string
  defaultChecked: boolean
}) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div className="flex items-center justify-between border border-[var(--line)] px-3 py-2">
      <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)]">{label}</span>
      <input type="hidden" name={name} value={checked ? "true" : "false"} />
      <button
        type="button"
        onClick={() => setChecked((v) => !v)}
        className={`h-5 w-9 rounded-full transition-colors ${checked ? "bg-[var(--acid)]" : "bg-[var(--line)]"} relative`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  )
}

export function EditPersonButton({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        await updateUserDetails(formData)
        setOpen(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save")
      }
    })
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="w-16 rounded-none font-mono text-[10px] uppercase tracking-[0.12em]"
      >
        edit
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg border border-[var(--line)] bg-[var(--panel)] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--acid)]">// edit person</p>
                <p className="mt-0.5 text-sm font-bold text-white">{user.fullName}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[var(--text-mute)] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form ref={formRef} action={handleSubmit} className="max-h-[70vh] overflow-y-auto p-5">
              <input type="hidden" name="userId" value={user.id} />

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Full Name" name="fullName" defaultValue={user.fullName} required />
                  <Field label="Email" name="email" defaultValue={user.email} type="email" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Employee ID" name="employeeId" defaultValue={user.employeeId} placeholder="EMP001" />
                  <Field label="Title" name="title" defaultValue={user.title} placeholder="Software Engineer" />
                </div>

                <Field
                  label="Reporting Manager"
                  name="reportingManager"
                  defaultValue={user.reportingManager}
                  placeholder="Manager Name"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Primary Assignment"
                    name="primaryAssignment"
                    defaultValue={user.primaryAssignment}
                    placeholder="Engineering"
                  />
                  <Field
                    label="Secondary Assignment"
                    name="secondaryAssignment"
                    defaultValue={user.secondaryAssignment}
                    placeholder="Design"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)]">
                    New Password
                    <span className="ml-2 text-[var(--text-faint)] normal-case tracking-normal">
                      (leave blank to keep current)
                    </span>
                  </label>
                  <input
                    name="password"
                    type="text"
                    placeholder="leave blank to keep current"
                    className="w-full border border-[var(--line)] bg-[var(--bg)] px-3 py-2 font-mono text-sm text-white placeholder:text-[var(--text-faint)] focus:border-[var(--acid)] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Toggle label="Active" name="isActive" defaultChecked={user.isActive} />
                  <Toggle label="Eligible" name="isEligible" defaultChecked={user.isEligible} />
                </div>

                {error && (
                  <p className="border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
                )}
              </div>

              <div className="mt-5 flex justify-end gap-3 border-t border-[var(--line)] pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="rounded-none font-mono uppercase tracking-[0.12em]"
                >
                  cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending}
                  className="rounded-none font-mono uppercase tracking-[0.12em]"
                >
                  {isPending ? "saving…" : "save changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
