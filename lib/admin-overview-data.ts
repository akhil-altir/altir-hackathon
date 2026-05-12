import {
  getAppSetting,
  SETTING_ADMIN_EVENT_PHASE,
} from "@/lib/app-settings";
import { db } from "@/lib/db";
import { defaultEventPhaseId, EVENT_PHASES } from "@/lib/event-phase";

export type AdminOverviewMetrics = {
  teamCount: number;
  liveKeys: number;
  keyTotal: number;
  ideasLockedCount: number;
  submissionReadyCount: number;
  judgeScoreCount: number;
  expectedJudgeCells: number;
  eventMaxPts: number;
  judgeMaxPts: number;
  phaseId: string;
  currentPhaseIndex: number;
};

export async function getAdminOverviewMetrics(): Promise<AdminOverviewMetrics> {
  const [
    teamCount,
    apiKeys,
    judgeScoreCount,
    judgeUserCount,
    submissionReadyCount,
    ideasLockedCount,
    eventCriteria,
    judgeCriteria,
    phaseIdRaw,
  ] = await Promise.all([
    db.team.count(),
    db.apiKey.findMany({ select: { status: true, assignedTeamId: true } }),
    db.judgeScore.count(),
    db.user.count({ where: { isJudge: true, isActive: true } }),
    db.submission.count({
      where: { status: { in: ["READY_FOR_JUDGING", "SUBMITTED"] } },
    }),
    db.team.count({
      where: { ideas: { some: { isCurrent: true } } },
    }),
    db.scoreCriterion.findMany({
      where: { category: "EVENT", isActive: true },
    }),
    db.scoreCriterion.findMany({
      where: { category: "JUDGE", isActive: true },
    }),
    getAppSetting(SETTING_ADMIN_EVENT_PHASE, defaultEventPhaseId()),
  ]);

  const liveKeys = apiKeys.filter((k) => k.status === "ASSIGNED").length;
  const eventMaxPts = eventCriteria.reduce((s, c) => s + (c.pointsValue ?? 0), 0);
  const judgeMaxPts = judgeCriteria.reduce((s, c) => s + (c.maxScore ?? 0), 0);
  const expectedJudgeCells = judgeUserCount * judgeCriteria.length * teamCount;
  const phaseId = EVENT_PHASES.some((p) => p.id === phaseIdRaw) ? phaseIdRaw : defaultEventPhaseId();
  const currentPhaseIndex = EVENT_PHASES.findIndex((p) => p.id === phaseId);

  return {
    teamCount,
    liveKeys,
    keyTotal: apiKeys.length,
    ideasLockedCount,
    submissionReadyCount,
    judgeScoreCount,
    expectedJudgeCells: Math.max(expectedJudgeCells, 1),
    eventMaxPts,
    judgeMaxPts,
    phaseId,
    currentPhaseIndex,
  };
}
