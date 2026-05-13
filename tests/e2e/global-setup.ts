import { execSync } from "node:child_process";
import path from "node:path";
import type { FullConfig } from "@playwright/test";

export default async function globalSetup(_config: FullConfig) {
  const root = path.resolve(__dirname, "../..");
  execSync("npx prisma db push --force-reset", { cwd: root, stdio: "inherit" });
  execSync("npx prisma db seed", { cwd: root, stdio: "inherit" });
}
