"use server"

import { randomUUID } from "node:crypto"

import { revalidatePath } from "next/cache"

import {
  getAppSetting,
  setAppSetting,
  SETTING_ADMIN_EVENT_PHASE,
  SETTING_SCORE_EVENT_WEIGHT,
  SETTING_SCORE_JUDGE_WEIGHT,
} from "@/lib/app-settings"
import { db } from "@/lib/db"
import { defaultEventPhaseId, EVENT_PHASES, nextPhaseId, type EventPhaseId } from "@/lib/event-phase"

function requiredValue(formData: FormData, key: string) {
  const value = formData.get(key)

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required`)
  }

  return value.trim()
}

function optionalValue(formData: FormData, key: string) {
  const value = formData.get(key)

  if (typeof value !== "string" || !value.trim()) {
    return null
  }

  return value.trim()
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function parseOptionalDate(value: string | null) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

export async function updateUserRole(formData: FormData) {
  const userId = requiredValue(formData, "userId")
  const role = requiredValue(formData, "role")
  const enabled = requiredValue(formData, "enabled") === "true"

  if (role !== "admin" && role !== "judge") {
    throw new Error("Unsupported role")
  }

  await db.user.update({
    where: { id: userId },
    data: role === "admin" ? { isAdmin: enabled } : { isJudge: enabled },
  })

  revalidatePath("/admin", "layout")
}

export async function createApiKey(formData: FormData) {
  const provider = requiredValue(formData, "provider")
  const label = requiredValue(formData, "label")
  const secret = requiredValue(formData, "secret")
  const assignedTeamId = optionalValue(formData, "assignedTeamId")
  const visibleFrom = parseOptionalDate(optionalValue(formData, "visibleFrom"))
  const notes = optionalValue(formData, "notes")

  await db.$transaction(async (tx) => {
    if (assignedTeamId) {
      await tx.apiKey.updateMany({
        where: { assignedTeamId },
        data: {
          assignedTeamId: null,
          assignedAt: null,
          status: "AVAILABLE",
        },
      })
    }

    await tx.apiKey.create({
      data: {
        provider,
        label,
        secret,
        status: assignedTeamId ? "ASSIGNED" : "AVAILABLE",
        assignedTeamId,
        assignedAt: assignedTeamId ? new Date() : null,
        visibleFrom,
        notes,
      },
    })
  })

  revalidatePath("/admin", "layout")
}

export async function assignApiKey(formData: FormData) {
  const apiKeyId = requiredValue(formData, "apiKeyId")
  const assignedTeamId = optionalValue(formData, "assignedTeamId")
  const visibleFrom = parseOptionalDate(optionalValue(formData, "visibleFrom"))

  await db.$transaction(async (tx) => {
    if (assignedTeamId) {
      await tx.apiKey.updateMany({
        where: {
          assignedTeamId,
          NOT: { id: apiKeyId },
        },
        data: {
          assignedTeamId: null,
          assignedAt: null,
          status: "AVAILABLE",
        },
      })
    }

    await tx.apiKey.update({
      where: { id: apiKeyId },
      data: {
        assignedTeamId,
        assignedAt: assignedTeamId ? new Date() : null,
        visibleFrom,
        status: assignedTeamId ? "ASSIGNED" : "AVAILABLE",
        revokedAt: null,
      },
    })
  })

  revalidatePath("/admin", "layout")
}

export async function revokeApiKey(formData: FormData) {
  const apiKeyId = requiredValue(formData, "apiKeyId")

  await db.apiKey.update({
    where: { id: apiKeyId },
    data: {
      status: "REVOKED",
      revokedAt: new Date(),
      assignedTeamId: null,
      assignedAt: null,
    },
  })

  revalidatePath("/admin", "layout")
}

export async function createEventScore(formData: FormData) {
  const label = requiredValue(formData, "label")
  const description = optionalValue(formData, "description")
  const pointsValue = Number(requiredValue(formData, "pointsValue"))
  const sortOrder = Number(optionalValue(formData, "sortOrder") ?? "99")
  const key = slugify(optionalValue(formData, "key") ?? label)

  if (!Number.isInteger(pointsValue) || pointsValue < 0) {
    throw new Error("pointsValue must be a positive integer")
  }

  await db.scoreCriterion.upsert({
    where: { key },
    update: {
      label,
      description,
      category: "EVENT",
      pointsValue,
      sortOrder,
      isActive: true,
    },
    create: {
      id: randomUUID(),
      key,
      label,
      description,
      category: "EVENT",
      pointsValue,
      sortOrder,
      isActive: true,
    },
  })

  revalidatePath("/admin", "layout")
  revalidatePath("/admin/scoring")
  revalidatePath("/leaderboard")
  revalidatePath("/results")
  revalidatePath("/tv")
  revalidatePath("/teams/new")
}

const TEAM_STATUS_ALLOWLIST = new Set(["FORMED", "FORMING", "BUILDING", "SUBMITTED", "LOCKED"])

export async function updateTeamStatus(formData: FormData) {
  const teamId = requiredValue(formData, "teamId")
  const status = requiredValue(formData, "status")

  if (!TEAM_STATUS_ALLOWLIST.has(status)) {
    throw new Error("Unsupported team status")
  }

  await db.team.update({
    where: { id: teamId },
    data: { status },
  })

  revalidatePath("/admin", "layout")
  revalidatePath("/leaderboard")
  revalidatePath("/tv")
}

function parsePhaseId(value: string | null): EventPhaseId {
  if (!value) {
    return defaultEventPhaseId()
  }

  const found = EVENT_PHASES.find((p) => p.id === value)
  return found ? found.id : defaultEventPhaseId()
}

export async function advanceEventPhase(formData: FormData) {
  void formData
  const current = parsePhaseId(await getAppSetting(SETTING_ADMIN_EVENT_PHASE, defaultEventPhaseId()))
  await setAppSetting(SETTING_ADMIN_EVENT_PHASE, nextPhaseId(current))
  revalidatePath("/admin", "layout")
}

export async function setEventPhase(formData: FormData) {
  const phaseId = parsePhaseId(optionalValue(formData, "phaseId"))
  await setAppSetting(SETTING_ADMIN_EVENT_PHASE, phaseId)
  revalidatePath("/admin", "layout")
}

export async function updateScoreWeights(formData: FormData) {
  const eventPct = Number(requiredValue(formData, "eventWeightPct"))
  const judgePct = Number(requiredValue(formData, "judgeWeightPct"))

  if (!Number.isFinite(eventPct) || !Number.isFinite(judgePct) || eventPct < 0 || judgePct < 0) {
    throw new Error("Weights must be non-negative numbers")
  }

  const sum = eventPct + judgePct
  if (sum <= 0) {
    throw new Error("At least one weight must be positive")
  }

  await Promise.all([
    setAppSetting(SETTING_SCORE_EVENT_WEIGHT, String(eventPct / sum)),
    setAppSetting(SETTING_SCORE_JUDGE_WEIGHT, String(judgePct / sum)),
  ])

  revalidatePath("/admin", "layout")
  revalidatePath("/leaderboard")
  revalidatePath("/results")
  revalidatePath("/tv")
}

export async function resetScoreWeights(formData: FormData) {
  void formData
  await Promise.all([
    setAppSetting(SETTING_SCORE_EVENT_WEIGHT, "0.4"),
    setAppSetting(SETTING_SCORE_JUDGE_WEIGHT, "0.6"),
  ])

  revalidatePath("/admin", "layout")
  revalidatePath("/leaderboard")
  revalidatePath("/results")
  revalidatePath("/tv")
}

export async function publishAdminAnnouncement(formData: FormData) {
  const title = requiredValue(formData, "title")
  const message = requiredValue(formData, "message")

  await db.announcement.create({
    data: {
      title,
      message,
      level: "INFO",
      isPinned: false,
      isPublished: true,
      publishedAt: new Date(),
    },
  })

  revalidatePath("/admin", "layout")
  revalidatePath("/tv")
}

export async function toggleEventScore(formData: FormData) {
  const criterionId = requiredValue(formData, "criterionId")
  const enabled = requiredValue(formData, "enabled") === "true"

  await db.scoreCriterion.update({
    where: { id: criterionId },
    data: { isActive: enabled },
  })

  revalidatePath("/admin", "layout")
  revalidatePath("/admin/scoring")
  revalidatePath("/leaderboard")
  revalidatePath("/results")
  revalidatePath("/tv")
  revalidatePath("/teams/new")
}

export async function updateJudgeCriterion(formData: FormData) {
  const criterionId = requiredValue(formData, "criterionId")
  const label = requiredValue(formData, "label")
  const description = optionalValue(formData, "description") ?? ""
  const maxScoreRaw = requiredValue(formData, "maxScore")
  const maxScore = Number.parseInt(maxScoreRaw, 10)
  if (!Number.isFinite(maxScore) || maxScore < 1 || maxScore > 999) {
    throw new Error("Max score must be a whole number from 1 to 999")
  }

  const existing = await db.scoreCriterion.findFirst({
    where: { id: criterionId, category: "JUDGE" },
  })
  if (!existing) {
    throw new Error("Judge criterion not found")
  }

  await db.scoreCriterion.update({
    where: { id: criterionId },
    data: {
      label,
      description: description.trim() ? description.trim() : null,
      maxScore,
    },
  })

  revalidatePath("/admin", "layout")
  revalidatePath("/admin/scoring")
  revalidatePath("/leaderboard")
  revalidatePath("/results")
  revalidatePath("/tv")
  revalidatePath("/judge")
}

export async function updateEventCriterion(formData: FormData) {
  const criterionId = requiredValue(formData, "criterionId")
  const label = requiredValue(formData, "label")
  const description = optionalValue(formData, "description") ?? ""
  const pointsRaw = requiredValue(formData, "pointsValue")
  const pointsValue = Number.parseInt(pointsRaw, 10)
  if (!Number.isFinite(pointsValue) || pointsValue < 0 || pointsValue > 999) {
    throw new Error("Event points must be a whole number from 0 to 999")
  }

  const sortRaw = requiredValue(formData, "sortOrder")
  const sortOrder = Number.parseInt(sortRaw, 10)
  if (!Number.isFinite(sortOrder)) {
    throw new Error("Sort order must be a number")
  }

  const existing = await db.scoreCriterion.findFirst({
    where: { id: criterionId, category: "EVENT" },
  })
  if (!existing) {
    throw new Error("Event criterion not found")
  }

  await db.scoreCriterion.update({
    where: { id: criterionId },
    data: {
      label,
      description: description.trim() ? description.trim() : null,
      pointsValue,
      sortOrder,
    },
  })

  revalidatePath("/admin", "layout")
  revalidatePath("/admin/scoring")
  revalidatePath("/leaderboard")
  revalidatePath("/results")
  revalidatePath("/tv")
  revalidatePath("/teams/new")
  revalidatePath("/gallery")
}

export async function createIdeaBankEntry(formData: FormData) {
  const rawSort = optionalValue(formData, "sortOrder") ?? "0"
  const sortOrder = Number.parseInt(rawSort, 10)
  if (!Number.isFinite(sortOrder)) {
    throw new Error("sort order must be a number")
  }

  await db.ideaBankEntry.create({
    data: {
      title: requiredValue(formData, "title"),
      problemStatement: requiredValue(formData, "problemStatement"),
      description: requiredValue(formData, "description"),
      expectedOutcome: requiredValue(formData, "expectedOutcome"),
      stackHint: optionalValue(formData, "stackHint"),
      category: optionalValue(formData, "category"),
      sortOrder,
      isActive: true,
    },
  })

  revalidatePath("/admin", "layout")
  revalidatePath("/gallery")
}

export async function updateIdeaBankEntry(formData: FormData) {
  const id = requiredValue(formData, "id")
  const rawSort = optionalValue(formData, "sortOrder") ?? "0"
  const sortOrder = Number.parseInt(rawSort, 10)
  if (!Number.isFinite(sortOrder)) {
    throw new Error("sort order must be a number")
  }

  await db.ideaBankEntry.update({
    where: { id },
    data: {
      title: requiredValue(formData, "title"),
      problemStatement: requiredValue(formData, "problemStatement"),
      description: requiredValue(formData, "description"),
      expectedOutcome: requiredValue(formData, "expectedOutcome"),
      stackHint: optionalValue(formData, "stackHint"),
      category: optionalValue(formData, "category"),
      sortOrder,
    },
  })

  revalidatePath("/admin", "layout")
  revalidatePath("/gallery")
}

export async function toggleIdeaBankEntry(formData: FormData) {
  const id = requiredValue(formData, "id")
  const enabled = requiredValue(formData, "enabled") === "true"

  await db.ideaBankEntry.update({
    where: { id },
    data: { isActive: enabled },
  })

  revalidatePath("/admin", "layout")
  revalidatePath("/gallery")
}

export async function deleteIdeaBankEntry(formData: FormData) {
  const id = requiredValue(formData, "id")

  await db.ideaBankEntry.delete({
    where: { id },
  })

  revalidatePath("/admin", "layout")
  revalidatePath("/gallery")
}

export async function updateUserDetails(formData: FormData) {
  const userId = requiredValue(formData, "userId")
  const fullName = requiredValue(formData, "fullName")
  const email = requiredValue(formData, "email")
  const password = optionalValue(formData, "password")
  const title = optionalValue(formData, "title")
  const employeeId = optionalValue(formData, "employeeId")
  const reportingManager = optionalValue(formData, "reportingManager")
  const primaryAssignment = optionalValue(formData, "primaryAssignment")
  const secondaryAssignment = optionalValue(formData, "secondaryAssignment")
  const isActive = formData.get("isActive") === "true"
  const isEligible = formData.get("isEligible") === "true"

  await db.user.update({
    where: { id: userId },
    data: {
      fullName,
      email: email.toLowerCase(),
      ...(password ? { password } : {}),
      title,
      employeeId,
      reportingManager,
      primaryAssignment,
      secondaryAssignment,
      isActive,
      isEligible,
    },
  })

  revalidatePath("/admin", "layout")
  revalidatePath("/admin/people")
}
