import { db } from "@/lib/db"
import { TechDayScreen } from "@/components/flow/tech-day-flow"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const teamsFormed = await db.team.count()
  return <TechDayScreen screen="lockscreen" teamsFormed={teamsFormed} />
}
