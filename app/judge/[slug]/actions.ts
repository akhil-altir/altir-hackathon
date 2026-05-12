"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function submitJudgeScoresAction(formData: FormData) {
  const session = await getSession();
  if (!session) { redirect("/login"); }
  if (!session.isJudge && !session.isAdmin) { redirect("/login"); }

  const teamSlug = (formData.get("teamSlug") as string)?.trim();

  const team = await db.team.findUnique({ where: { slug: teamSlug } });
  if (!team) { redirect("/judge"); }

  const organizerNote = ((formData.get("organizerNote") as string) ?? "").trim() || null;

  const criteria = await db.scoreCriterion.findMany({
    where: { category: "JUDGE", isActive: true },
    orderBy: [{ sortOrder: "asc" }],
  });

  for (const criterion of criteria) {
    const rawScore = formData.get(`score_${criterion.id}`);
    if (rawScore === null || rawScore === "") continue;

    const score = Number(rawScore);
    if (Number.isNaN(score) || score < 0 || score > (criterion.maxScore ?? 10)) continue;

    await db.judgeScore.upsert({
      where: {
        judgeId_teamId_criterionId: {
          judgeId: session.userId,
          teamId: team.id,
          criterionId: criterion.id,
        },
      },
      update: {
        score,
        note: organizerNote,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
      create: {
        judgeId: session.userId,
        enteredById: session.userId,
        teamId: team.id,
        criterionId: criterion.id,
        score,
        note: organizerNote,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });
  }

  revalidatePath(`/judge/${teamSlug}`);
  revalidatePath("/judge");
  revalidatePath("/leaderboard");
  revalidatePath("/results");
  redirect("/judge");
}
