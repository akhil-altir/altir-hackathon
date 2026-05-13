"use server";

import { redirect } from "next/navigation";

import { authenticateUser, getTeamWorkspace, getUserTeam } from "@/lib/data";
import { getParticipantResumeHref } from "@/lib/participant-onboarding";
import { createSession, destroySession } from "@/lib/session";

export async function loginAction(_prevState: { error: string } | null, formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = (formData.get("password") as string)?.trim();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await authenticateUser(email, password);

  if (!user) {
    return { error: "Invalid credentials. Password format: emailprefix_EMPID (e.g. psharma_ATI042)." };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    isAdmin: user.isAdmin,
    isJudge: user.isJudge,
    primaryAssignment: user.primaryAssignment,
  });

  if (user.isAdmin) {
    redirect("/admin/teams");
  }

  if (user.isJudge) {
    redirect("/judge");
  }

  const existingTeam = await getUserTeam(user.id);
  if (existingTeam) {
    const workspace = await getTeamWorkspace(existingTeam.slug);
    if (workspace) {
      redirect(getParticipantResumeHref(workspace));
    }
    redirect(`/teams/${existingTeam.slug}`);
  }

  redirect("/teams/new");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
