"use server";

import { redirect } from "next/navigation";

import { authenticateUser, getUserTeam } from "@/lib/data";
import { createSession, destroySession } from "@/lib/session";

export async function loginAction(_prevState: { error: string } | null, formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = (formData.get("password") as string)?.trim();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await authenticateUser(email, password);

  if (!user) {
    return { error: "Invalid credentials. Password is the local part of your email (e.g. agupta)." };
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
    redirect("/admin");
  }

  if (user.isJudge) {
    redirect("/judge");
  }

  // If the user already has a team, go straight to their workspace
  const existingTeam = await getUserTeam(user.id);
  if (existingTeam) {
    redirect(`/teams/${existingTeam.slug}`);
  }

  redirect("/teams/new");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
