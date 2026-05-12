"use server"

import { randomUUID } from "node:crypto"

import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"

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

  revalidatePath("/admin")
}

export async function createApiKey(formData: FormData) {
  const provider = requiredValue(formData, "provider")
  const label = requiredValue(formData, "label")
  const secret = requiredValue(formData, "secret")
  const assignedTeamId = optionalValue(formData, "assignedTeamId")
  const visibleFrom = parseOptionalDate(optionalValue(formData, "visibleFrom"))

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
      },
    })
  })

  revalidatePath("/admin")
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
      },
    })
  })

  revalidatePath("/admin")
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

  revalidatePath("/admin")
}

export async function toggleEventScore(formData: FormData) {
  const criterionId = requiredValue(formData, "criterionId")
  const enabled = requiredValue(formData, "enabled") === "true"

  await db.scoreCriterion.update({
    where: { id: criterionId },
    data: { isActive: enabled },
  })

  revalidatePath("/admin")
}
