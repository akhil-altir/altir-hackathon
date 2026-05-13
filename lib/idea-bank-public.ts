import { db } from "@/lib/db"

export type PublicIdeaEntry = {
  id: string
  title: string
  problemStatement: string
  stackHint: string | null
  category: string | null
}

export async function listPublicIdeaBankEntries(): Promise<PublicIdeaEntry[]> {
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
