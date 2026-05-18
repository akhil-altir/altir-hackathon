import type { IdeaBankEntry } from "@prisma/client";

import { db } from "@/lib/db";
import { getIdeaBankVisible } from "@/lib/app-settings";

export function buildIdeaSummaryFromBankEntry(entry: Pick<IdeaBankEntry, "problemStatement" | "description" | "expectedOutcome">) {
  const parts = [
    "PROBLEM",
    entry.problemStatement.trim(),
    "",
    "DESCRIPTION",
    entry.description.trim(),
    "",
    "EXPECTED OUTCOME",
    entry.expectedOutcome.trim(),
  ];

  return parts.join("\n").trim();
}

export async function listActiveIdeaBankEntries() {
  const visible = await getIdeaBankVisible();
  if (!visible) return [];
  return db.ideaBankEntry.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
}

export async function listAllIdeaBankEntriesForAdmin() {
  return db.ideaBankEntry.findMany({
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
}
