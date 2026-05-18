import type { PrismaClient } from "@prisma/client";

export type SessionLike = {
  userId: string;
  primaryAssignment: string | null;
};

const TEAM_LOCK = new Date("2026-05-22T06:30:00.000Z");

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function grantPoints(
  db: PrismaClient,
  teamId: string,
  grantedById: string,
  awards: Array<{ key: string; reason: string }>,
) {
  if (awards.length === 0) return;
  const criteria = await db.scoreCriterion.findMany({
    where: { category: "EVENT", key: { in: awards.map((a) => a.key) } },
    select: { id: true, key: true, pointsValue: true },
  });
  const byKey = new Map(criteria.map((c) => [c.key, c]));
  await db.eventPointAward.createMany({
    data: awards.map((award) => {
      const row = byKey.get(award.key);
      return {
        teamId,
        criterionId: row?.id ?? null,
        grantedById,
        points: row?.pointsValue ?? 0,
        source: "SYSTEM" as const,
        reason: award.reason,
      };
    }),
  });
}

export async function createTeamCore(
  db: PrismaClient,
  session: SessionLike,
  args: { teamName: string; partnerId?: string },
  now = new Date(),
): Promise<{ error: string } | { teamSlug: string }> {
  const { teamName, partnerId } = args;

  if (!teamName || teamName.length < 2) return { error: "Team name must be at least 2 characters." };
  if (partnerId && partnerId === session.userId) return { error: "You cannot pair with yourself." };

  const userIds = partnerId ? [session.userId, partnerId] : [session.userId];
  const existingMembership = await db.teamMember.findFirst({ where: { userId: { in: userIds } } });
  if (existingMembership) return { error: "One or both members are already on a team." };

  const slug = slugify(teamName);
  const existingTeam = await db.team.findFirst({ where: { OR: [{ slug }, { name: teamName }] } });
  if (existingTeam) return { error: "Team name is already taken." };

  const team = await db.team.create({
    data: {
      slug,
      name: teamName,
      status: "FORMED",
      memberships: {
        create: partnerId
          ? [{ userId: session.userId, isCaptain: true }, { userId: partnerId, isCaptain: false }]
          : [{ userId: session.userId, isCaptain: true }],
      },
    },
  });

  const awards: Array<{ key: string; reason: string }> = [];

  if (partnerId) {
    awards.push({ key: "team_formed", reason: "Team formed with two confirmed members." });
    const partnerUser = await db.user.findUnique({ where: { id: partnerId }, select: { primaryAssignment: true } });
    if (partnerUser && session.primaryAssignment !== partnerUser.primaryAssignment) {
      awards.push({
        key: "cross_assignment",
        reason: `Different primary assignments: ${session.primaryAssignment ?? "none"} and ${partnerUser.primaryAssignment ?? "none"}.`,
      });
    }
  }

  if (now < TEAM_LOCK) {
    awards.push({ key: "formed_before_lock", reason: "Team formed before the lock deadline." });
  }

  await grantPoints(db, team.id, session.userId, awards);
  return { teamSlug: team.slug };
}

