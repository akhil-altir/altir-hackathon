import { db } from "@/lib/db";

/** Active EVENT criteria: points granted for each key (0 if missing or inactive). */
export async function getActiveEventPointsByKeys(keys: readonly string[]): Promise<Record<string, number>> {
  if (keys.length === 0) {
    return {};
  }
  const rows = await db.scoreCriterion.findMany({
    where: { category: "EVENT", key: { in: [...keys] } },
    select: { key: true, pointsValue: true, isActive: true },
  });
  const result: Record<string, number> = {};
  for (const k of keys) {
    const row = rows.find((r) => r.key === k);
    result[k] = row?.isActive ? (row.pointsValue ?? 0) : 0;
  }
  return result;
}
