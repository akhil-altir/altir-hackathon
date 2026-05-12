import { BLEND_EVENT_CAP } from "@/lib/scoring-blend";

/**
 * Default EVENT milestone weights (round numbers). Seeding and marketing UIs use these;
 * live awards read each row’s `pointsValue` from the database (Admin → Scoring).
 *
 * Sum should match {@link BLEND_EVENT_CAP} so raw “max event” lines up with the /1000 ladder.
 */
export const EVENT_POINT_WEIGHTS = {
  team_formed: 50,
  cross_assignment: 40,
  formed_before_lock: 40,
  idea_submitted: 50,
  repo_submitted: 50,
  demo_uploaded: 80,
  deck_uploaded: 50,
  before_515: 40,
} as const;

export type EventPointRuleKey = keyof typeof EVENT_POINT_WEIGHTS;

export const EVENT_POINT_WEIGHTS_SUM = (Object.values(EVENT_POINT_WEIGHTS) as number[]).reduce((a, b) => a + b, 0);

/** Max event points from team-formation rules if all apply (cross-dept + before lock). */
export const EVENT_TEAM_FORMATION_MAX =
  EVENT_POINT_WEIGHTS.team_formed + EVENT_POINT_WEIGHTS.cross_assignment + EVENT_POINT_WEIGHTS.formed_before_lock;

/** Max from submission-time milestones (repo, demo, deck, early window). */
export const EVENT_SUBMISSION_MILESTONES_MAX =
  EVENT_POINT_WEIGHTS.repo_submitted +
  EVENT_POINT_WEIGHTS.demo_uploaded +
  EVENT_POINT_WEIGHTS.deck_uploaded +
  EVENT_POINT_WEIGHTS.before_515;

if (typeof process !== "undefined" && process.env.NODE_ENV !== "production" && EVENT_POINT_WEIGHTS_SUM !== BLEND_EVENT_CAP) {
  console.warn(
    `[event-point-weights] EVENT_POINT_WEIGHTS_SUM (${EVENT_POINT_WEIGHTS_SUM}) should equal BLEND_EVENT_CAP (${BLEND_EVENT_CAP})`,
  );
}
