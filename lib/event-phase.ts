export const EVENT_PHASES = [
  { id: "CHECK_IN", label: "11:00 CHECK-IN" },
  { id: "TEAM_LOCK", label: "12:00 TEAM LOCK" },
  { id: "KEY_RELEASE", label: "13:00 KEY RELEASE" },
  { id: "BUILD", label: "13:30 BUILD" },
  { id: "SUBMISSION", label: "17:30 SUBMISSION" },
  { id: "DEMOS", label: "17:30 DEMOS" },
  { id: "JUDGING", label: "18:00 JUDGING" },
  { id: "RESULTS", label: "19:00 RESULTS" },
] as const;

export type EventPhaseId = (typeof EVENT_PHASES)[number]["id"];

export function defaultEventPhaseId(): EventPhaseId {
  return "BUILD";
}

export function indexOfPhase(phaseId: string): number {
  const idx = EVENT_PHASES.findIndex((p) => p.id === phaseId);
  return idx >= 0 ? idx : EVENT_PHASES.findIndex((p) => p.id === defaultEventPhaseId());
}

export function nextPhaseId(currentId: string): EventPhaseId {
  const i = indexOfPhase(currentId);
  const next = (i + 1) % EVENT_PHASES.length;
  return EVENT_PHASES[next]!.id;
}

export function phaseState(currentIndex: number, phaseIndex: number): "done" | "now" | "next" | "wait" {
  if (phaseIndex < currentIndex) {
    return "done";
  }
  if (phaseIndex === currentIndex) {
    return "now";
  }
  if (phaseIndex === currentIndex + 1) {
    return "next";
  }
  return "wait";
}
