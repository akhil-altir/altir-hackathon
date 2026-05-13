import { db } from "./db";
import { blendTotalScore } from "./scoring-blend";

function normalizePoints(points: number, maxPoints: number) {
  if (maxPoints <= 0) {
    return 0;
  }

  return Number(Math.min((points / maxPoints) * 100, 100).toFixed(2));
}

function toPassword(email: string) {
  return email.split("@")[0] ?? "";
}

export async function authenticateUser(email: string, password: string) {
  return db.user.findFirst({
    where: {
      id: email.toLowerCase(),
      email: email.toLowerCase(),
      password,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      isAdmin: true,
      isJudge: true,
      primaryAssignment: true,
      secondaryAssignment: true,
    },
  });
}

export async function getSeedLoginHints(limit = 12) {
  const users = await db.user.findMany({
    where: { isActive: true, isEligible: true },
    orderBy: [{ fullName: "asc" }],
    take: limit,
    select: {
      id: true,
      email: true,
      fullName: true,
    },
  });

  return users.map((user: { id: string; email: string; fullName: string }) => ({
    ...user,
    temporaryPassword: toPassword(user.email),
  }));
}

export async function getUserTeam(userId: string) {
  const membership = await db.teamMember.findFirst({
    where: { userId },
    include: { team: true },
  });
  return membership?.team ?? null;
}

export async function getAvailableEmployees() {
  const takenUserIds = (await db.teamMember.findMany({ select: { userId: true } })).map(
    (m) => m.userId,
  );

  return db.user.findMany({
    where: {
      isActive: true,
      isEligible: true,
      id: { notIn: takenUserIds },
    },
    orderBy: [{ fullName: "asc" }],
    select: {
      id: true,
      email: true,
      fullName: true,
      title: true,
      primaryAssignment: true,
      secondaryAssignment: true,
    },
  });
}

export async function getEmployeeDirectory() {
  return db.user.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ fullName: "asc" }],
    select: {
      id: true,
      email: true,
      employeeId: true,
      fullName: true,
      title: true,
      reportingManager: true,
      primaryAssignment: true,
      secondaryAssignment: true,
      isEligible: true,
      isAdmin: true,
      isJudge: true,
    },
  });
}

export async function getTimelineAndAnnouncements(now = new Date()) {
  const [timeline, announcements] = await Promise.all([
    db.timelineItem.findMany({
      where: {
        isPublic: true,
      },
      orderBy: [{ startsAt: "asc" }, { sortOrder: "asc" }],
    }),
    db.announcement.findMany({
      where: {
        isPublished: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
    }),
  ]);

  return { timeline, announcements };
}

export async function getCommandCenterSnapshot(now = new Date()) {
  const [teamCount, activeSubmissionCount, eligibleUserCount, apiKeyCount, recent] =
    await Promise.all([
      db.team.count(),
      db.submission.count({
        where: {
          status: {
            in: ["READY_FOR_JUDGING", "SUBMITTED"],
          },
        },
      }),
      db.user.count({
        where: {
          isEligible: true,
          isActive: true,
        },
      }),
      db.apiKey.count(),
      getTimelineAndAnnouncements(now),
    ]);

  const leaderboard = await listLeaderboard();

  return {
    totals: {
      teams: teamCount,
      eligibleUsers: eligibleUserCount,
      completedSubmissions: activeSubmissionCount,
      apiKeysLoaded: apiKeyCount,
    },
    leaderboard,
    ...recent,
  };
}

export async function listLeaderboard() {
  const [teams, criteria] = await Promise.all([
    db.team.findMany({
      include: {
        memberships: {
          include: {
            user: true,
          },
        },
        ideas: {
          where: { isCurrent: true },
          orderBy: { submittedAt: "desc" },
          take: 1,
        },
        submission: true,
        pointAwards: {
          include: {
            criterion: true,
          },
        },
        judgeScores: {
          include: {
            criterion: true,
          },
        },
      },
      orderBy: [{ name: "asc" }],
    }),
    db.scoreCriterion.findMany({
      where: { isActive: true },
    }),
  ]);

  const eventMax = criteria
    .filter(
      (criterion: { category: string; pointsValue: number | null }) =>
        criterion.category === "EVENT" && Boolean(criterion.pointsValue),
    )
    .reduce(
      (sum: number, criterion: { pointsValue: number | null }) => sum + (criterion.pointsValue ?? 0),
      0,
    );
  const judgeMax = criteria
    .filter(
      (criterion: { category: string; maxScore: number | null }) =>
        criterion.category === "JUDGE" && Boolean(criterion.maxScore),
    )
    .reduce(
      (sum: number, criterion: { maxScore: number | null }) => sum + (criterion.maxScore ?? 0),
      0,
    );

  return teams
    .map((team) => {
      // Use current criterion value if it exists (reflects admin edits); fall back to stored value.
      const eventPoints = team.pointAwards.reduce(
        (sum: number, award: { points: number; criterion: { pointsValue: number | null } | null }) =>
          sum + (award.criterion?.pointsValue ?? award.points),
        0,
      );
      const judgeTeams = new Map<string, number>();

      for (const score of team.judgeScores) {
        judgeTeams.set(score.judgeId, (judgeTeams.get(score.judgeId) ?? 0) + score.score);
      }

      const judgeAverage =
        judgeTeams.size > 0
          ? [...judgeTeams.values()].reduce((sum, score) => sum + score, 0) / judgeTeams.size
          : 0;

      const normalizedEvent = normalizePoints(eventPoints, eventMax);
      const normalizedJudge = normalizePoints(judgeAverage, judgeMax);
      const finalScore = blendTotalScore(normalizedEvent, normalizedJudge);
      const currentIdea = team.ideas[0] ?? null;

      return {
        teamId: team.id,
        slug: team.slug,
        teamName: team.name,
        status: team.status,
        members: team.memberships.map((membership) => ({
          id: membership.user.id,
          fullName: membership.user.fullName,
          email: membership.user.email,
          primaryAssignment: membership.user.primaryAssignment,
          secondaryAssignment: membership.user.secondaryAssignment,
        })),
        idea: currentIdea,
        ideaTitle: currentIdea?.title ?? null,
        ideaSourceType: currentIdea?.sourceType ?? null,
        submissionStatus: team.submission?.status ?? "NOT_STARTED",
        submission: team.submission
          ? {
              repoUrl: team.submission.repoUrl,
              demoUrl: team.submission.demoUrl,
              presentationUrl: team.submission.presentationUrl,
            }
          : null,
        eventPoints,
        judgeAverage: Number(judgeAverage.toFixed(2)),
        normalizedEvent,
        normalizedJudge,
        finalScore,
      };
    })
    .sort(
      (left: { finalScore: number; eventPoints: number }, right: { finalScore: number; eventPoints: number }) =>
        right.finalScore - left.finalScore || right.eventPoints - left.eventPoints,
    );
}

export async function getTeamWorkspace(teamSlug: string, now = new Date()) {
  const team = await db.team.findUnique({
    where: { slug: teamSlug },
    include: {
      memberships: {
        include: {
          user: true,
        },
      },
      ideas: {
        orderBy: { submittedAt: "desc" },
      },
      apiKey: true,
      submission: true,
      pointAwards: {
        include: {
          criterion: true,
          grantedBy: true,
        },
        orderBy: { grantedAt: "asc" },
      },
      judgeScores: {
        include: {
          criterion: true,
          judge: true,
        },
        orderBy: [{ judgeId: "asc" }, { criterion: { sortOrder: "asc" } }],
      },
    },
  });

  if (!team) {
    return null;
  }

  const currentIdea = team.ideas.find((idea: { isCurrent: boolean }) => idea.isCurrent) ?? team.ideas[0] ?? null;
  const keyVisible =
    Boolean(team.apiKey?.visibleFrom) &&
    Boolean(currentIdea) &&
    team.apiKey?.status !== "REVOKED" &&
    now >= (team.apiKey?.visibleFrom ?? now);

  const judgeGroups = new Map<string, { judgeId: string; judgeName: string; total: number }>();

  for (const score of team.judgeScores) {
    const group = judgeGroups.get(score.judgeId) ?? {
      judgeId: score.judgeId,
      judgeName: score.judge.fullName,
      total: 0,
    };

    group.total += score.score;
    judgeGroups.set(score.judgeId, group);
  }

  return {
    id: team.id,
    slug: team.slug,
    name: team.name,
    status: team.status,
    members: team.memberships.map((membership) => ({
      id: membership.user.id,
      email: membership.user.email,
      employeeId: membership.user.employeeId,
      fullName: membership.user.fullName,
      title: membership.user.title,
      primaryAssignment: membership.user.primaryAssignment,
      secondaryAssignment: membership.user.secondaryAssignment,
      isAdmin: membership.user.isAdmin,
      isJudge: membership.user.isJudge,
    })),
    currentIdea,
    ideaHistory: team.ideas,
    submission: team.submission,
    apiKey: team.apiKey
      ? {
          provider: team.apiKey.provider,
          label: team.apiKey.label,
          status: team.apiKey.status,
          visibleFrom: team.apiKey.visibleFrom,
          value: keyVisible ? team.apiKey.secret : null,
        }
      : null,
    pointBreakdown: team.pointAwards,
    judgeSummary: [...judgeGroups.values()],
    judgeScores: team.judgeScores,
  };
}

export async function getJudgeWorkspace(judgeId: string) {
  const criteria = await db.scoreCriterion.findMany({
    where: {
      category: "JUDGE",
      isActive: true,
    },
    orderBy: [{ sortOrder: "asc" }],
  });

  const teams = await db.team.findMany({
    include: {
      memberships: {
        include: {
          user: true,
        },
      },
      ideas: {
        where: { isCurrent: true },
        take: 1,
      },
      submission: true,
      judgeScores: {
        where: { judgeId },
      },
    },
    orderBy: [{ name: "asc" }],
  });

  return teams.map((team) => ({
    id: team.id,
    slug: team.slug,
    name: team.name,
    members: team.memberships.map((membership) => membership.user.fullName),
    currentIdea: team.ideas[0] ?? null,
    submission: team.submission,
    criteria,
    existingScores: team.judgeScores,
  }));
}

export async function getDashboardData(now = new Date()) {
  const snapshot = await getCommandCenterSnapshot(now);
  const teamPalette = ["#c4ff00", "#ff2bd6", "#00d4ff", "#ffb020", "#ff5a3c", "#9d6dff"];
  const criteria = await db.scoreCriterion.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ sortOrder: "asc" }],
  });

  return {
    metadata: {
      totalTeams: snapshot.totals.teams,
      totalParticipants: snapshot.totals.eligibleUsers,
      keyCount: snapshot.totals.apiKeysLoaded,
    },
    totals: snapshot.totals,
    leaderboard: snapshot.leaderboard.map((team, index: number) => ({
      ...team,
      colorHex: teamPalette[index % teamPalette.length],
    })),
    teams: snapshot.leaderboard.map((team, index: number) => ({
      id: team.teamId,
      slug: team.slug,
      name: team.teamName,
      status: team.status,
      colorHex: teamPalette[index % teamPalette.length],
      members: team.members,
      idea: team.idea
        ? {
            id: team.idea.id,
            title: team.idea.title,
            description: team.idea.summary,
            stackSummary: team.idea.stackSummary,
          }
        : null,
      submission: {
        status: team.submissionStatus,
        stackSummary: team.idea?.stackSummary ?? null,
        repoUrl: null,
        demoUrl: null,
        presentationUrl: null,
      },
      eventPoints: team.eventPoints,
      finalScore: team.finalScore,
    })),
    timeline: snapshot.timeline,
    announcements: snapshot.announcements.map((item) => ({
      ...item,
      body: item.message,
    })),
    criteria,
  };
}
