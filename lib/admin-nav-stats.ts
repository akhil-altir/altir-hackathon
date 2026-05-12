import { db } from "@/lib/db";

export type AdminNavStats = {
  teamCount: number;
  keyCount: number;
  ideaBankActive: number;
  ideaBankTotal: number;
  judgeCount: number;
};

export async function getAdminNavStats(): Promise<AdminNavStats> {
  const [teamCount, keyCount, ideaBankTotal, ideaBankActive, judgeCount] = await Promise.all([
    db.team.count(),
    db.apiKey.count(),
    db.ideaBankEntry.count(),
    db.ideaBankEntry.count({ where: { isActive: true } }),
    db.user.count({ where: { isJudge: true, isActive: true } }),
  ]);

  return { teamCount, keyCount, ideaBankTotal, ideaBankActive, judgeCount };
}
