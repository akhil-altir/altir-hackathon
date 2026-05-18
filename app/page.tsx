import { db } from "@/lib/db"
import { listPublicIdeaBankEntries } from "@/lib/idea-bank-public"
import { getIdeaBankVisible } from "@/lib/app-settings"
import { IDEA_BANK_REVEAL_MS } from "@/lib/tech-day-schedule"
import { TechDayScreen } from "@/components/flow/tech-day-flow"

export const revalidate = 60

export default async function HomePage() {
  const [teamsFormed, allEntries, ideaBankVisible] = await Promise.all([
    db.team.count(),
    listPublicIdeaBankEntries(),
    getIdeaBankVisible(),
  ])

  // eslint-disable-next-line
  const timeRevealed = Date.now() >= IDEA_BANK_REVEAL_MS
  const revealed = timeRevealed && ideaBankVisible

  const categoryCounts = allEntries.reduce<Record<string, number>>((acc, e) => {
    const cat = e.category ?? "OTHER"
    acc[cat] = (acc[cat] ?? 0) + 1
    return acc
  }, {})

  return (
    <TechDayScreen
      screen="lockscreen"
      teamsFormed={teamsFormed}
      ideaBankRevealed={revealed}
      ideas={revealed ? allEntries : []}
      ideaBankTotal={allEntries.length}
      ideaBankCategoryCounts={revealed ? {} : categoryCounts}
    />
  )
}
