"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { createTeamCore } from "@/lib/team-formation";

export async function createTeamAction(_prevState: { error: string } | null, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  const result = await createTeamCore(db, session, {
    teamName: (formData.get("teamName") as string)?.trim() ?? "",
    partnerId: (formData.get("partnerId") as string)?.trim() || undefined,
  });

  if ("error" in result) return { error: result.error };

  revalidatePath("/leaderboard");
  revalidatePath("/gallery");
  redirect(`/teams/${result.teamSlug}/locked`);
}
