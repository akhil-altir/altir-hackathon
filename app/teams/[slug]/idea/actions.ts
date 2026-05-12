"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function submitIdeaAction(formData: FormData) {
  const session = await getSession();
  if (!session) { redirect("/login"); }

  const teamSlug = (formData.get("teamSlug") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const summary = (formData.get("summary") as string)?.trim();
  const stackSummary = (formData.get("stackSummary") as string)?.trim() || null;
  const sourceType = (formData.get("sourceType") as string)?.trim() || "CUSTOM";

  if (!title || !summary || !teamSlug) {
    redirect(`/teams/${teamSlug ?? "new"}`);
  }

  const team = await db.team.findUnique({
    where: { slug: teamSlug },
    include: { memberships: true, ideas: { where: { isCurrent: true } } },
  });

  if (!team) { redirect("/teams/new"); }

  const isMember = team.memberships.some((m) => m.userId === session.userId);
  if (!isMember && !session.isAdmin) { redirect(`/teams/${teamSlug}`); }

  // Mark old ideas as not current
  await db.idea.updateMany({
    where: { teamId: team.id, isCurrent: true },
    data: { isCurrent: false },
  });

  await db.idea.create({
    data: {
      teamId: team.id,
      submittedById: session.userId,
      title,
      summary,
      sourceType,
      stackSummary,
      isCurrent: true,
      isPublic: true,
    },
  });

  // Award idea_submitted points if first idea
  if (team.ideas.length === 0) {
    const criterion = await db.scoreCriterion.findUnique({ where: { key: "idea_submitted" } });
    await db.eventPointAward.create({
      data: {
        teamId: team.id,
        criterionId: criterion?.id ?? null,
        grantedById: session.userId,
        points: 10,
        source: "SYSTEM",
        reason: "Idea submitted before build start.",
      },
    });
  }

  revalidatePath(`/teams/${teamSlug}`);
  revalidatePath(`/teams/${teamSlug}/idea`);
  revalidatePath("/leaderboard");
  redirect(`/teams/${teamSlug}`);
}
