/**
 * Rewrites the datasource provider in prisma/schema.prisma based on
 * the DATABASE_PROVIDER env var. Runs automatically before dev and build.
 *
 * DATABASE_PROVIDER=sqlite       → provider = "sqlite"
 * DATABASE_PROVIDER=postgresql   → provider = "postgresql"
 *
 * Defaults to "sqlite" if DATABASE_PROVIDER is not set.
 */

import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const SCHEMA_PATH = resolve(__dirname, "../prisma/schema.prisma")

const SUPPORTED = ["sqlite", "postgresql"]
const provider = process.env.DATABASE_PROVIDER ?? "sqlite"

if (!SUPPORTED.includes(provider)) {
  console.error(`[sync-schema-provider] Unknown DATABASE_PROVIDER "${provider}". Use: ${SUPPORTED.join(", ")}`)
  process.exit(1)
}

const schema = readFileSync(SCHEMA_PATH, "utf8")
const updated = schema.replace(
  /^(\s*provider\s*=\s*)"(sqlite|postgresql)"/m,
  `$1"${provider}"`
)

if (updated === schema) {
  console.log(`[sync-schema-provider] Provider already "${provider}" — no change.`)
} else {
  writeFileSync(SCHEMA_PATH, updated, "utf8")
  console.log(`[sync-schema-provider] Updated schema.prisma provider → "${provider}"`)
}
