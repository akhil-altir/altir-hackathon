import { CommandCenterShell } from "@/components/dashboard/command-center-shell"

type DashboardData = Awaited<ReturnType<typeof import("@/lib/data").getDashboardData>>

export function CommandCenter({ data }: { data: DashboardData }) {
  return <CommandCenterShell data={data} />
}
