"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function createTeamAction(_prevState: { error: string } | null, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  const teamName = (formData.get("teamName") as string)?.trim();
  const partnerId = (formData.get("partnerId") as string)?.trim();

  if (!teamName || teamName.length < 2) {
    return { error: "Team name must be at least 2 characters." };
  }

  if (!partnerId) {
    return { error: "Select a teammate." };
  }

  if (partnerId === session.userId) {
    return { error: "You cannot pair with yourself." };
  }

  // Check if either user is already on a team
  const existingMembership = await db.teamMember.findFirst({
    where: { userId: { in: [session.userId, partnerId] } },
  });

  if (existingMembership) {
    return { error: "One or both members are already on a team." };
  }

  // Check team name uniqueness
  const slug = slugify(teamName);
  const existingTeam = await db.team.findFirst({
    where: { OR: [{ slug }, { name: teamName }] },
  });

  if (existingTeam) {
    return { error: "Team name is already taken." };
  }

  const team = await db.team.create({
    data: {
      slug,
      name: teamName,
      status: "FORMED",
      memberships: {
        create: [
          { userId: session.userId, isCaptain: true },
          { userId: partnerId, isCaptain: false },
        ],
      },
    },
  });

  // Award event points
  const partner = await db.user.findUnique({
    where: { id: partnerId },
    select: { primaryAssignment: true },
  });

  const pendingAwards: Array<{ key: string; reason: string }> = [{ key: "team_formed", reason: "Team formed with two confirmed members." }];

  if (partner && session.primaryAssignment !== partner.primaryAssignment) {
    pendingAwards.push({
      key: "cross_assignment",
      reason: `Different primary assignments: ${session.primaryAssignment ?? "none"} and ${partner.primaryAssignment ?? "none"}.`,
    });
  }

  // Check if formed before lock (12 PM IST on May 22 = 6:30 AM UTC)
  const TEAM_LOCK = new Date("2026-05-22T06:30:00.000Z");
  if (new Date() < TEAM_LOCK) {
    pendingAwards.push({ key: "formed_before_lock", reason: "Team formed before the lock deadline." });
  }

  const criteria = await db.scoreCriterion.findMany({
    where: { category: "EVENT", key: { in: pendingAwards.map((p) => p.key) } },
    select: { id: true, key: true, pointsValue: true },
  });
  const criterionByKey = new Map(criteria.map((c) => [c.key, c]));

  await db.eventPointAward.createMany({
    data: pendingAwards.map((award) => {
      const row = criterionByKey.get(award.key);
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

  revalidatePath("/leaderboard");
  revalidatePath("/gallery");
  redirect(`/teams/${team.slug}/locked`);
}
