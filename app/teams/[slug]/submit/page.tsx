import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { submitProjectAction } from "./actions"
import { ParticipantOnboardingStrip } from "@/components/team/participant-onboarding-strip"
import { BuildCountdown } from "@/components/shell/build-countdown"
import { ParticipantAppShell, ParticipantStage } from "@/components/shell/participant-app-shell"
import { Button } from "@/components/ui/button"
import { getTeamWorkspace } from "@/lib/data"
import { getActiveEventPointsByKeys } from "@/lib/event-score-display"
import { getTeamOnboardingState } from "@/lib/participant-onboarding"
import { loadParticipantNavContext } from "@/lib/participant-nav-context"
import { teamHueFromSlug } from "@/lib/team-visual"
import { getSession } from "@/lib/session"

export const dynamic = "force-dynamic"

function Row({
  label,
  ok,
  detail,
  sub,
  points,
  isBonus = false,
}: {
  label: string
  ok: boolean
  detail: string
  sub?: string
  points: string
  isBonus?: boolean
}) {
  const isDash = points === "—"
  return (
    <div className="flex items-start gap-4 border border-[var(--line)] bg-[var(--panel-2)] px-5 py-4">
      {/* ✓ / ▸ indicator */}
      <span
        className="mt-0.5 shrink-0 font-mono text-base font-bold"
        style={{ color: ok ? "var(--acid)" : "var(--text-faint)" }}
      >
        {ok ? "✓" : "▸"}
      </span>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-mute)]">{label}</div>
        <div className="mt-1.5 break-all font-mono text-sm text-white">{detail || <span className="text-[var(--text-faint)]">—</span>}</div>
        {sub ? <div className="mt-1 text-[11px] text-[var(--text-dim)]">{sub}</div> : null}
      </div>

      {/* Points pill */}
      {!isDash && (
        <span
          className="mt-0.5 shrink-0 border px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em]"
          style={
            isBonus
              ? { color: "var(--warn)", borderColor: "rgba(255,176,32,0.4)", background: "rgba(255,176,32,0.08)" }
              : { color: "var(--acid)", borderColor: "rgba(196,255,0,0.4)", background: "rgba(196,255,0,0.06)" }
          }
        >
          {points}
        </span>
      )}
    </div>
  )
}

export default async function SubmitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await getSession()
  if (!session) redirect("/login")

  const team = await getTeamWorkspace(slug)
  if (!team) notFound()

  if (!team.members.some((m) => m.id === session.userId)) notFound()

  const onboarding = getTeamOnboardingState(team)
  const nav = await loadParticipantNavContext()
  const s = team.submission
  const hue = teamHueFromSlug(team.slug)

  const repoOk = Boolean(s?.repoUrl)
  const demoOk = Boolean(s?.demoUrl)
  const deckOk = Boolean(s?.presentationUrl)
  const stackOk = Boolean(s?.stackTags?.trim())
  const filled = [repoOk, demoOk, deckOk, stackOk].filter(Boolean).length

  const eventPoints = team.pointBreakdown.reduce((acc, a) => acc + (a.criterion?.pointsValue ?? a.points), 0)

  const evPts = await getActiveEventPointsByKeys(["repo_submitted", "demo_uploaded", "deck_uploaded", "before_515"])

  return (
    <ParticipantAppShell
      lead={<ParticipantOnboardingStrip teamSlug={team.slug} state={onboarding} />}
      browserTitle="final submission"
      urlDisplay={`techday.altir.internal/teams/${team.slug}/submit`}
      browserRight={<span className="text-[var(--warn)]">deadline</span>}
      activeNav="submit"
      workspaceHref={nav.workspaceHref}
      ideaHref={nav.ideaHref}
      submitHref={nav.submitHref}
      countdownSlot={<BuildCountdown />}
      teamSlug={team.slug}
      teamName={team.name}
      userEmail={session?.email ?? null}
      userName={session?.fullName ?? null}
      hasTeam={nav.hasTeam}
    >
      <ParticipantStage wide>
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--warn)]"># step 04 / submit before 17:30</div>
          <span className="inline-flex items-center gap-1.5 rounded-sm border border-orange-400/40 bg-orange-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-orange-200">
            <span className="size-1.5 rounded-full bg-orange-300" />
            window closes 17:30 · bonus before 17:00
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-[-0.04em] text-white md:text-5xl">Lock in your final assets.</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--text-dim)]">Checklist mirrors the judge packet. Save often — finalize when every link resolves.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-3">
            <Row
              label="github repo"
              ok={repoOk}
              detail={s?.repoUrl ?? ""}
              sub="public or org-readable · main branch demoable"
              points={`+${evPts.repo_submitted}`}
            />
            <Row label="demo video / url" ok={demoOk} detail={s?.demoUrl ?? ""} sub="90s max · narrate the build" points={`+${evPts.demo_uploaded}`} />
            <Row label="presentation" ok={deckOk} detail={s?.presentationUrl ?? ""} sub="slides or figma" points={`+${evPts.deck_uploaded}`} />
            <Row label="tech stack tags" ok={stackOk} detail={s?.stackTags ?? team.currentIdea?.stackSummary ?? ""} points="—" />

            <form action={submitProjectAction} id="submission-form" className="space-y-3 border border-[var(--line)] bg-black/30 p-5">
              <input type="hidden" name="teamSlug" value={team.slug} />
              <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">// edit fields</div>
              <label className="block text-[10px] uppercase text-[var(--text-mute)]">
                repo url
                <input
                  name="repoUrl"
                  type="url"
                  defaultValue={s?.repoUrl ?? ""}
                  className="mt-1 h-11 w-full rounded-none border border-[var(--line)] bg-black px-3 font-mono text-sm text-white outline-none focus:border-[var(--acid)]"
                />
              </label>
              <label className="block text-[10px] uppercase text-[var(--text-mute)]">
                demo url
                <input
                  name="demoUrl"
                  type="url"
                  defaultValue={s?.demoUrl ?? ""}
                  className="mt-1 h-11 w-full rounded-none border border-[var(--line)] bg-black px-3 font-mono text-sm text-white outline-none focus:border-[var(--acid)]"
                />
              </label>
              <label className="block text-[10px] uppercase text-[var(--text-mute)]">
                presentation url
                <input
                  name="presentationUrl"
                  type="url"
                  defaultValue={s?.presentationUrl ?? ""}
                  className="mt-1 h-11 w-full rounded-none border border-[var(--line)] bg-black px-3 font-mono text-sm text-white outline-none focus:border-[var(--acid)]"
                />
              </label>
              <label className="block text-[10px] uppercase text-[var(--text-mute)]">
                stack tags
                <input
                  name="stackTags"
                  defaultValue={s?.stackTags ?? team.currentIdea?.stackSummary ?? ""}
                  className="mt-1 h-11 w-full rounded-none border border-[var(--line)] bg-black px-3 font-mono text-sm text-white outline-none focus:border-[var(--acid)]"
                />
              </label>
              <label className="block text-[10px] uppercase text-[var(--text-mute)]">
                build summary (optional)
                <textarea
                  name="buildSummary"
                  rows={2}
                  defaultValue={s?.buildSummary ?? ""}
                  className="mt-1 w-full rounded-none border border-[var(--line)] bg-black px-3 py-2 font-mono text-sm text-white outline-none focus:border-[var(--acid)]"
                />
              </label>
              <Button type="submit" className="w-full rounded-none bg-[var(--acid)] font-mono text-black uppercase tracking-[0.12em] hover:bg-[var(--acid-2)]">
                ▶ Save submission
              </Button>
            </form>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border border-[var(--acid)]/35 bg-[var(--acid)]/10 p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--acid)]">final submission state</div>
                <div className="mt-2 text-lg font-bold text-[var(--acid)]">
                  {filled === 4 ? "READY" : "IN PROGRESS"} · {filled} / 4 fields
                </div>
                <p className="mt-2 text-[11px] text-[var(--text-dim)]">autosave on save · edits allowed until hard lock</p>
              </div>
              <div className="border border-orange-400/35 bg-orange-400/5 p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-200">bonus window</div>
                <div className="mt-2 text-lg font-bold text-orange-100">submit before 17:00 → +{evPts.before_515}</div>
                <div className="mt-3 h-1.5 overflow-hidden bg-black">
                  <div className="h-full bg-orange-400/80" style={{ width: `${Math.min(100, filled * 25)}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Public card preview */}
            <div className="panel-surface relative overflow-hidden">
              {/* Team color top strip */}
              <div className="h-0.5 w-full" style={{ background: hue, boxShadow: `0 0 12px ${hue}` }} />
              <div className="p-5">
                <p className="mb-4 text-[10px] uppercase tracking-[0.2em]" style={{ color: hue }}>
                  # public card preview
                </p>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 shrink-0" style={{ background: hue, boxShadow: `0 0 8px ${hue}` }} />
                    <span className="font-mono text-sm font-bold uppercase tracking-[0.1em] text-white">{team.name}</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-mute)]">
                    {team.members.map((m) => m.primaryAssignment ?? "—").join(" × ").toUpperCase()}
                  </span>
                </div>
                <div className="mt-4 text-lg font-bold leading-snug text-white">{team.currentIdea?.title ?? "Idea pending"}</div>
                <p className="mt-2 text-[12px] leading-relaxed text-[var(--text-dim)]">{team.currentIdea?.summary ?? ""}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(s?.stackTags ?? team.currentIdea?.stackSummary ?? "")
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .slice(0, 6)
                    .map((tag) => (
                      <span key={tag} className="border border-[var(--line-2)] px-2 py-0.5 font-mono text-[9px] uppercase text-[var(--text-dim)]">
                        {tag}
                      </span>
                    ))}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[["repo", repoOk], ["demo", demoOk], ["deck", deckOk]].map(([label, done]) => (
                    <span
                      key={label as string}
                      className="border py-2 text-center font-mono text-[9px] font-bold uppercase"
                      style={
                        done
                          ? { borderColor: "rgba(196,255,0,0.4)", color: "var(--acid)" }
                          : { borderColor: "var(--line)", color: "var(--text-mute)" }
                      }
                    >
                      {done ? "✓ " : ""}{label as string}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-[10px] text-[var(--text-faint)]">appears in gallery after publish · 17:30</p>
              </div>
            </div>

            {/* Event points summary */}
            <div className="panel-surface panel-highlight p-6 text-center">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">event points · live</div>
                <div
                  className="mt-2 font-mono text-5xl font-bold leading-none text-[var(--acid)]"
                  style={{ textShadow: "0 0 24px var(--acid-glow)" }}
                >
                  {eventPoints}
                </div>
                <p className="mt-2 text-[11px] text-[var(--text-dim)]">rank updates on leaderboard after judging</p>
                <div className="mx-auto mt-4 h-1.5 max-w-xs overflow-hidden bg-[var(--panel-3)]">
                  <div className="h-full bg-[var(--acid)]" style={{ boxShadow: "0 0 8px var(--acid-glow)", width: "72%" }} />
                </div>
                <Button asChild className="mt-5 w-full rounded-none bg-[var(--acid)] font-mono text-black uppercase tracking-[0.12em] hover:bg-[var(--acid-2)]">
                  <Link href="/gallery">▶ Finalize &amp; view gallery</Link>
                </Button>
                <p className="mt-2 text-[10px] text-[var(--text-mute)]">save checklist first · gallery is read-only</p>
            </div>
          </div>
        </div>
      </ParticipantStage>
    </ParticipantAppShell>
  )
}
