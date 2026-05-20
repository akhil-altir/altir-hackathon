import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DEFAULT_VISIBLE_FROM = new Date("2026-05-22T07:30:00.000Z");

type ParsedKey = {
  label: string;
  secret: string;
};

function parseKeysList(markdown: string): ParsedKey[] {
  const lines = markdown.split(/\r?\n/);
  const parsed: ParsedKey[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]?.trim() ?? "";
    if (!line.startsWith("Project:")) continue;

    const label = line.replace("Project:", "").trim();
    const apiLine = (lines[i + 1] ?? "").trim();
    if (!apiLine.startsWith("API Key:")) continue;

    const secret = apiLine.replace("API Key:", "").trim();
    if (!label || !secret) continue;

    parsed.push({ label, secret });
  }

  return parsed;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const positional = args.filter((arg) => !arg.startsWith("--"));
  const inputPath = positional[0] ?? "keyslist.md";
  const provider = positional[1] ?? "OpenAI";
  const file = resolve(process.cwd(), inputPath);
  const raw = readFileSync(file, "utf8");
  const keys = parseKeysList(raw);

  if (!keys.length) {
    throw new Error(`No keys parsed from ${inputPath}. Expected lines with 'Project:' and 'API Key:'`);
  }

  const labels = keys.map((key) => key.label);
  const existing = await prisma.apiKey.findMany({
    where: { label: { in: labels } },
    select: { label: true },
  });
  const existingSet = new Set(existing.map((row) => row.label));
  const toUpdate = keys.filter((key) => existingSet.has(key.label));
  const toInsert = keys.filter((key) => !existingSet.has(key.label));

  if (dryRun) {
    console.log(`[dry-run] Source file: ${inputPath}`);
    console.log(`[dry-run] Provider: ${provider}`);
    console.log(`[dry-run] Total parsed: ${keys.length}`);
    console.log(`[dry-run] Will update: ${toUpdate.length}`);
    console.log(`[dry-run] Will insert: ${toInsert.length}`);
    if (toUpdate.length > 0) {
      console.log("[dry-run] Update labels:");
      for (const key of toUpdate) console.log(`- ${key.label}`);
    }
    if (toInsert.length > 0) {
      console.log("[dry-run] Insert labels:");
      for (const key of toInsert) console.log(`- ${key.label}`);
    }
    return;
  }

  for (const key of keys) {
    await prisma.apiKey.upsert({
      where: { label: key.label },
      update: {
        provider,
        secret: key.secret,
        visibleFrom: DEFAULT_VISIBLE_FROM,
        notes: null,
        revokedAt: null,
      },
      create: {
        provider,
        label: key.label,
        secret: key.secret,
        status: "AVAILABLE",
        visibleFrom: DEFAULT_VISIBLE_FROM,
      },
    });
  }

  console.log(`Upserted ${keys.length} API keys from ${inputPath}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
