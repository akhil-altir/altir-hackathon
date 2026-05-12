"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { buildIdeaSummaryFromBankEntry } from "@/lib/idea-bank";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed || null;
}

export async function submitIdeaAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const teamSlug = (formData.get("teamSlug") as string)?.trim();
  const bankEntryId = optionalString(formData, "ideaBankEntryId");

  if (!teamSlug) {
    redirect("/teams/new");
  }

  const team = await db.team.findUnique({
    where: { slug: teamSlug },
    include: { memberships: true, ideas: { where: { isCurrent: true } } },
  });

  if (!team) {
    redirect("/teams/new");
  }

  const isMember = team.memberships.some((m) => m.userId === session.userId);
  if (!isMember && !session.isAdmin) {
    redirect(`/teams/${teamSlug}`);
  }

  let title: string;
  let summary: string;
  let stackSummary: string | null;
  let sourceType: string;
  let bankCategory: string | null;
  let pivotReason: string | null;
  let ideaBankEntryId: string | null;

  if (bankEntryId) {
    const entry = await db.ideaBankEntry.findFirst({
      where: { id: bankEntryId, isActive: true },
    });
    if (!entry) {
      redirect(`/teams/${teamSlug}/idea`);
    }
    title = entry.title;
    summary = buildIdeaSummaryFromBankEntry(entry);
    stackSummary = entry.stackHint?.trim() || null;
    sourceType = "BANK";
    bankCategory = entry.category?.trim() || null;
    pivotReason = "Selected from curated idea bank.";
    ideaBankEntryId = entry.id;
  } else {
    title = (formData.get("title") as string)?.trim() ?? "";
    summary = (formData.get("summary") as string)?.trim() ?? "";
    stackSummary = (formData.get("stackSummary") as string)?.trim() || null;
    sourceType = (formData.get("sourceType") as string)?.trim() || "CUSTOM";
    bankCategory = null;
    pivotReason = null;
    ideaBankEntryId = null;

    if (!title || !summary) {
      redirect(`/teams/${teamSlug}/idea`);
    }
  }

  await db.idea.updateMany({
    where: { teamId: team.id, isCurrent: true },
    data: { isCurrent: false },
  });

  await db.idea.create({
    data: {
      teamId: team.id,
      submittedById: session.userId,
      title,
      summary,
      sourceType,
      stackSummary,
      bankCategory,
      pivotReason,
      ideaBankEntryId,
      isCurrent: true,
      isPublic: true,
    },
  });

  if (team.ideas.length === 0) {
    const criterion = await db.scoreCriterion.findUnique({
      where: { key: "idea_submitted" },
      select: { id: true, pointsValue: true },
    });
    await db.eventPointAward.create({
      data: {
        teamId: team.id,
        criterionId: criterion?.id ?? null,
        grantedById: session.userId,
        points: criterion?.pointsValue ?? 0,
        source: "SYSTEM",
        reason: bankEntryId ? "Idea selected from bank before build start." : "Idea submitted before build start.",
      },
    });
  }

  revalidatePath(`/teams/${teamSlug}`);
  revalidatePath(`/teams/${teamSlug}/idea`);
  revalidatePath("/leaderboard");
  revalidatePath("/gallery");
  redirect(`/teams/${teamSlug}`);
}
