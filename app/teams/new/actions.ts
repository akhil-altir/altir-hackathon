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

  const pointAwards: Array<{ key: string; points: number; reason: string }> = [
    { key: "team_formed", points: 10, reason: "Team formed with two confirmed members." },
  ];

  if (partner && session.primaryAssignment !== partner.primaryAssignment) {
    pointAwards.push({
      key: "cross_assignment",
      points: 5,
      reason: `Different primary assignments: ${session.primaryAssignment ?? "none"} and ${partner.primaryAssignment ?? "none"}.`,
    });
  }

  // Check if formed before lock (1 PM IST on May 22 = 7:30 AM UTC)
  const TEAM_LOCK = new Date("2026-05-22T07:30:00.000Z");
  if (new Date() < TEAM_LOCK) {
    pointAwards.push({ key: "formed_before_lock", points: 5, reason: "Team formed before the lock deadline." });
  }

  // Look up criterion IDs
  const criteria = await db.scoreCriterion.findMany({
    where: { key: { in: pointAwards.map((p) => p.key) } },
    select: { id: true, key: true },
  });
  const criterionMap = new Map(criteria.map((c) => [c.key, c.id]));

  await db.eventPointAward.createMany({
    data: pointAwards.map((award) => ({
      teamId: team.id,
      criterionId: criterionMap.get(award.key) ?? null,
      grantedById: session.userId,
      points: award.points,
      source: "SYSTEM",
      reason: award.reason,
    })),
  });

  revalidatePath("/leaderboard");
  revalidatePath("/gallery");
  redirect(`/teams/${team.slug}`);
}
