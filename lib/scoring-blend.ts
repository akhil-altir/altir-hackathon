/** Final leaderboard ladder: 1000 points total from normalized pillars. */
/** Active EVENT `scoreCriterion.pointsValue` rows should sum to {@link BLEND_EVENT_CAP} — see `lib/event-point-weights.ts`. */
export const BLEND_EVENT_CAP = 400;
export const BLEND_JUDGE_CAP = 600;
export const BLEND_TOTAL = BLEND_EVENT_CAP + BLEND_JUDGE_CAP;

/**
 * @param normalizedEvent 0–100 from earned event points vs active event rules max
 * @param normalizedJudge 0–100 from average judge raw total vs active judge criteria max
 */
export function blendTotalScore(normalizedEvent: number, normalizedJudge: number): number {
  const raw = (normalizedEvent / 100) * BLEND_EVENT_CAP + (normalizedJudge / 100) * BLEND_JUDGE_CAP;
  return Number(raw.toFixed(2));
}
