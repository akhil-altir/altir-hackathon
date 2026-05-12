import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminNavStats } from "@/lib/admin-nav-stats";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const navStats = await getAdminNavStats();
  return <AdminShell navStats={navStats}>{children}</AdminShell>;
}
