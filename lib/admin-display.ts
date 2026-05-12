import type { ApiKey } from "@prisma/client";

export function maskSecret(secret: string) {
  if (!secret || secret.length < 12) {
    return "••••••••";
  }

  return `${secret.slice(0, 8)}••••${secret.slice(-4)}`;
}

export function abbreviatedMemberNames(members: { fullName: string }[]) {
  return members
    .map((member) => {
      const parts = member.fullName.trim().split(/\s+/).filter(Boolean);
      const first = parts[0] ?? "";
      const last = parts[parts.length - 1] ?? "";
      const initial = last.length ? `${last[0]}.` : "";
      return `${first} ${initial}`.trim();
    })
    .join(", ");
}

export function deptCrossLabel(members: { primaryAssignment: string | null; secondaryAssignment: string | null }[]) {
  const depts = new Set<string>();
  for (const member of members) {
    if (member.primaryAssignment) {
      depts.add(member.primaryAssignment);
    }
    if (member.secondaryAssignment) {
      depts.add(member.secondaryAssignment);
    }
  }

  const list = [...depts];
  if (list.length === 0) {
    return "—";
  }

  if (list.length === 1) {
    return list[0] ?? "—";
  }

  return `${list[0]}×${list[1]}`;
}

export function submissionArtifactCount(submission: {
  repoUrl: string | null;
  demoUrl: string | null;
  presentationUrl: string | null;
} | null) {
  if (!submission) {
    return { filled: 0, total: 3 };
  }

  let filled = 0;
  if (submission.repoUrl?.trim()) {
    filled += 1;
  }
  if (submission.demoUrl?.trim()) {
    filled += 1;
  }
  if (submission.presentationUrl?.trim()) {
    filled += 1;
  }

  return { filled, total: 3 };
}

export function keyStatusLabel(apiKey: Pick<ApiKey, "status" | "assignedTeamId"> | null) {
  if (!apiKey) {
    return "none";
  }

  if (apiKey.status === "REVOKED") {
    return "revoked";
  }

  if (apiKey.status === "AVAILABLE" && !apiKey.assignedTeamId) {
    return "spare";
  }

  if (apiKey.status === "ASSIGNED") {
    return "live";
  }

  return apiKey.status.toLowerCase();
}
