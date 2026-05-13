"use client"

import { useRef, useState, useTransition } from "react"

import { createUser, deleteUser, updateUserDetails } from "@/app/admin/actions"
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
        className={`relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-[var(--acid)]" : "bg-[var(--line)]"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  )
}

function PersonForm({
  user,
  onClose,
}: {
  user?: User
  onClose: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const isEdit = !!user

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        if (isEdit) {
          await updateUserDetails(formData)
        } else {
          await createUser(formData)
        }
        onClose()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save")
      }
    })
  }

  return (
    <form action={handleSubmit} className="max-h-[70vh] overflow-y-auto p-5">
      {isEdit && <input type="hidden" name="userId" value={user.id} />}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full Name" name="fullName" defaultValue={user?.fullName} required />
          <Field label="Email" name="email" defaultValue={user?.email} type="email" required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Employee ID" name="employeeId" defaultValue={user?.employeeId} placeholder="EMP001" />
          <Field label="Title" name="title" defaultValue={user?.title} placeholder="Software Engineer" />
        </div>

        <Field
          label="Reporting Manager"
          name="reportingManager"
          defaultValue={user?.reportingManager}
          placeholder="Manager Name"
        />

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Primary Assignment"
            name="primaryAssignment"
            defaultValue={user?.primaryAssignment}
            placeholder="Engineering"
          />
          <Field
            label="Secondary Assignment"
            name="secondaryAssignment"
            defaultValue={user?.secondaryAssignment}
            placeholder="Design"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)]">
            {isEdit ? "New Password" : "Password"}
            {!isEdit && <span className="ml-1 text-[var(--acid)]">*</span>}
            {isEdit && (
              <span className="ml-2 normal-case tracking-normal text-[var(--text-faint)]">
                (leave blank to keep current)
              </span>
            )}
          </label>
          <input
            name="password"
            type="text"
            required={!isEdit}
            placeholder={isEdit ? "leave blank to keep current" : "password"}
            className="w-full border border-[var(--line)] bg-[var(--bg)] px-3 py-2 font-mono text-sm text-white placeholder:text-[var(--text-faint)] focus:border-[var(--acid)] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {isEdit && <Toggle label="Active" name="isActive" defaultChecked={user.isActive} />}
          <Toggle label="Eligible" name="isEligible" defaultChecked={user?.isEligible ?? true} />
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
          onClick={onClose}
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
          {isPending ? "saving…" : isEdit ? "save changes" : "create person"}
        </Button>
      </div>
    </form>
  )
}

export function EditPersonButton({ user }: { user: User }) {
  const [open, setOpen] = useState(false)

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
            <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--acid)]">// edit person</p>
                <p className="mt-0.5 text-sm font-bold text-white">{user.fullName}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-[var(--text-mute)] hover:text-white">
                ✕
              </button>
            </div>
            <PersonForm user={user} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}

export function DeletePersonButton({ user }: { user: User }) {
  const [confirm, setConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        await deleteUser(formData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Delete failed")
        setConfirm(false)
      }
    })
  }

  if (confirm) {
    return (
      <div className="flex flex-col items-end gap-1">
        <form action={handleDelete} className="flex gap-1">
          <input type="hidden" name="userId" value={user.id} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setConfirm(false)}
            className="rounded-none font-mono text-[10px] uppercase tracking-[0.12em]"
          >
            cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="rounded-none bg-red-600 font-mono text-[10px] uppercase tracking-[0.12em] hover:bg-red-700"
          >
            {isPending ? "…" : "confirm"}
          </Button>
        </form>
        {error && <p className="max-w-[200px] text-right text-[10px] text-red-400">{error}</p>}
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setConfirm(true)}
      className="w-16 rounded-none border-red-500/30 font-mono text-[10px] uppercase tracking-[0.12em] text-red-400 hover:border-red-500 hover:text-red-300"
    >
      delete
    </Button>
  )
}

export function AddPersonButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        className="rounded-none font-mono text-[10px] uppercase tracking-[0.12em]"
      >
        + add person
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg border border-[var(--line)] bg-[var(--panel)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--acid)]">// add person</p>
              <button type="button" onClick={() => setOpen(false)} className="text-[var(--text-mute)] hover:text-white">
                ✕
              </button>
            </div>
            <PersonForm onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
