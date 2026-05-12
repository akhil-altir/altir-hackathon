import { db } from "@/lib/db";

export const SETTING_SCORE_EVENT_WEIGHT = "score_event_weight";
export const SETTING_SCORE_JUDGE_WEIGHT = "score_judge_weight";
export const SETTING_ADMIN_EVENT_PHASE = "admin_event_phase";

export async function getAppSetting(key: string, defaultValue: string) {
  const row = await db.appSetting.findUnique({ where: { key } });
  return row?.value ?? defaultValue;
}

export async function setAppSetting(key: string, value: string) {
  await db.appSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function getScoreWeights() {
  const rawEvent = Number.parseFloat(await getAppSetting(SETTING_SCORE_EVENT_WEIGHT, "0.4"));
  const rawJudge = Number.parseFloat(await getAppSetting(SETTING_SCORE_JUDGE_WEIGHT, "0.6"));
  if (!Number.isFinite(rawEvent) || !Number.isFinite(rawJudge) || rawEvent < 0 || rawJudge < 0) {
    return { event: 0.4, judge: 0.6 };
  }
  const sum = rawEvent + rawJudge;
  if (sum <= 0) {
    return { event: 0.4, judge: 0.6 };
  }
  return { event: rawEvent / sum, judge: rawJudge / sum };
}
