const TEAM_PALETTE = ["#c4ff00", "#ff7ac6", "#00d4ff", "#ffb020", "#9d6dff", "#00ff9d", "#ff5a3c", "#6ee7ff"] as const

export function teamHueFromSlug(slug: string): string {
  let hash = 0
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash + slug.charCodeAt(i) * (i + 1)) % 100000
  }
  return TEAM_PALETTE[hash % TEAM_PALETTE.length]
}
