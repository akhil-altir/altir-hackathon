"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function submitProjectAction(formData: FormData) {
  const session = await getSession();
  if (!session) { redirect("/login"); }

  const teamSlug = (formData.get("teamSlug") as string)?.trim();
  const repoUrl = (formData.get("repoUrl") as string)?.trim() || null;
  const demoUrl = (formData.get("demoUrl") as string)?.trim() || null;
  const presentationUrl = (formData.get("presentationUrl") as string)?.trim() || null;
  const buildSummary = (formData.get("buildSummary") as string)?.trim() || null;
  const stackTags = (formData.get("stackTags") as string)?.trim() || "";

  const team = await db.team.findUnique({
    where: { slug: teamSlug },
    include: { memberships: true, submission: true, ideas: { where: { isCurrent: true }, take: 1 } },
  });

  if (!team) { redirect("/teams/new"); }

  const isMember = team.memberships.some((m) => m.userId === session.userId);
  if (!isMember && !session.isAdmin) { redirect(`/teams/${teamSlug}`); }

  const status = repoUrl && demoUrl ? "READY_FOR_JUDGING" : repoUrl ? "SUBMITTED" : "IN_PROGRESS";

  if (team.submission) {
    await db.submission.update({
      where: { id: team.submission.id },
      data: { repoUrl, demoUrl, presentationUrl, buildSummary, stackTags, status, submittedAt: new Date() },
    });
  } else {
    await db.submission.create({
      data: { teamId: team.id, repoUrl, demoUrl, presentationUrl, buildSummary, stackTags, status, submittedAt: new Date() },
    });
  }

  // Award points for new milestones
  const existingAwardKeys = new Set(
    (await db.eventPointAward.findMany({ where: { teamId: team.id }, select: { reason: true } }))
      .map((a) => a.reason),
  );

  const newAwards: Array<{ key: string; reason: string }> = [];

  if (repoUrl && !existingAwardKeys.has("GitHub repository linked.")) {
    newAwards.push({ key: "repo_submitted", reason: "GitHub repository linked." });
  }
  if (demoUrl && !existingAwardKeys.has("Demo video attached.")) {
    newAwards.push({ key: "demo_uploaded", reason: "Demo video attached." });
  }
  if (presentationUrl && !existingAwardKeys.has("Presentation deck shared.")) {
    newAwards.push({ key: "deck_uploaded", reason: "Presentation deck shared." });
  }

  if (newAwards.length > 0) {
    const criteria = await db.scoreCriterion.findMany({
      where: { category: "EVENT", key: { in: newAwards.map((a) => a.key) } },
      select: { id: true, key: true, pointsValue: true },
    });
    const criterionMap = new Map(criteria.map((c) => [c.key, c]));

    await db.eventPointAward.createMany({
      data: newAwards.map((award) => {
        const row = criterionMap.get(award.key);
        return {
          teamId: team.id,
          criterionId: row?.id ?? null,
          grantedById: session.userId,
          points: row?.pointsValue ?? 0,
          source: "SYSTEM" as const,
          reason: award.reason,
        };
      }),
    });
  }

  revalidatePath(`/teams/${teamSlug}`);
  revalidatePath("/leaderboard");
  revalidatePath("/gallery");
  redirect(`/teams/${teamSlug}`);
}
