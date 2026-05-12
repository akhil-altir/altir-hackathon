import Link from "next/link";
import type { ReactNode } from "react";

import { updateUserRole } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.14em] transition-colors duration-150",
        active ? "border-[var(--acid)] text-[var(--acid)]" : "border-[var(--line)] text-[var(--text-mute)] hover:border-[var(--text-mute)]",
      )}
    >
      {label}
    </Link>
  );
}

export function MetricPill({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn("border border-[var(--line)] bg-black/40 px-3 py-2", accent && "border-[var(--acid)]/40")}>
      <div className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-mute)]">{label}</div>
      <div className={cn("mt-1 truncate font-mono text-sm font-bold", accent ? "text-[var(--acid)]" : "text-white")}>{value}</div>
    </div>
  );
}

export function Panel({ title, right, children, className }: { title: string; right?: string; children: ReactNode; className?: string }) {
  return (
    <Card className={cn("panel-surface gap-0 rounded-none py-0", className)}>
      <CardHeader className="border-b border-[var(--line)] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xs uppercase tracking-[0.22em] text-[var(--text-dim)]">{title}</CardTitle>
          {right && <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-mute)]">{right}</span>}
        </div>
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}

export function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="panel-surface p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">{label}</div>
      <div className={cn("mt-2 text-3xl font-bold", accent ? "text-[var(--acid)]" : "text-white")}>{value}</div>
    </div>
  );
}

export function RoleToggle({ userId, role, enabled }: { userId: string; role: "admin" | "judge"; enabled: boolean }) {
  return (
    <form action={updateUserRole}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="enabled" value={enabled ? "false" : "true"} />
      <Button variant={enabled ? "default" : "outline"} size="sm" className="w-28 rounded-none font-mono uppercase tracking-[0.12em]">
        {enabled ? role : `make ${role}`}
      </Button>
    </form>
  );
}

export function RoleLikeToggle({
  action,
  idName,
  idValue,
  enabled,
}: {
  action: (formData: FormData) => Promise<void>;
  idName: string;
  idValue: string;
  enabled: boolean;
}) {
  return (
    <form action={action}>
      <input type="hidden" name={idName} value={idValue} />
      <input type="hidden" name="enabled" value={enabled ? "false" : "true"} />
      <Button variant={enabled ? "outline" : "default"} size="sm" className="rounded-none font-mono uppercase tracking-[0.12em]">
        {enabled ? "Disable" : "Enable"}
      </Button>
    </form>
  );
}

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  className,
  inputId,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  inputId?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">{label}</span>
      <input
        id={inputId}
        className="h-11 w-full rounded-none border border-[var(--line)] bg-black px-3 font-mono text-sm text-white outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </label>
  );
}

export function TextareaField({
  label,
  name,
  rows = 4,
  defaultValue,
  placeholder,
  className,
  required = true,
  inputId,
}: {
  label: string;
  name: string;
  rows?: number;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  inputId?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">{label}</span>
      <textarea
        id={inputId}
        name={name}
        required={required}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-none border border-[var(--line)] bg-black px-3 py-2 font-mono text-sm text-white outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
      />
    </label>
  );
}

export function SelectField({
  label,
  name,
  options,
  defaultValue = "",
}: {
  label: string;
  name: string;
  options: Array<{ label: string; value: string }>;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">{label}</span>
      <select
        className="h-11 w-full rounded-none border border-[var(--line)] bg-black px-3 font-mono text-sm text-white outline-none transition focus:border-[var(--acid)]"
        name={name}
        defaultValue={defaultValue}
      >
        <option value="">spare pool</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function formatDateInput(date: Date | null) {
  if (!date) {
    return "";
  }
  return date.toISOString().slice(0, 16);
}
