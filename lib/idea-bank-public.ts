import { db } from "@/lib/db"
import { getIdeaBankVisible } from "@/lib/app-settings"

export type PublicIdeaEntry = {
  id: string
  title: string
  problemStatement: string
  stackHint: string | null
  category: string | null
}

export async function listPublicIdeaBankEntries(): Promise<PublicIdeaEntry[]> {
  const visible = await getIdeaBankVisible();
  if (!visible) return [];
  return db.ideaBankEntry.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    select: {
      id: true,
      title: true,
      problemStatement: true,
      stackHint: true,
      category: true,
    },
  })
}
