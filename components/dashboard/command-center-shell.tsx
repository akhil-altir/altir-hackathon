import Image from "next/image"
import {
  Activity,
  ArrowUpRight,
  BellRing,
  ChevronRight,
  Clock3,
  FileCode2,
  Gauge,
  KeyRound,
  LockKeyhole,
  MonitorPlay,
  RadioTower,
  ShieldCheck,
  Sparkles,
  Users2,
} from "lucide-react"

type DashboardData = Awaited<ReturnType<typeof import("@/lib/data").getDashboardData>>
type LeaderboardTeam = DashboardData["leaderboard"][number]

const navItems = ["Command", "Teams", "Judges", "Submissions", "TV Mode", "Admin"]

const judgeCriteria = [
  { label: "Innovation", max: 20 },
  { label: "Business Usefulness", max: 20 },
  { label: "Demo Clarity", max: 20 },
]

function toneClasses(tone: "acid" | "warn" | "default") {
  if (tone === "acid") {
    return "border-[rgba(196,255,0,0.35)] bg-[rgba(196,255,0,0.08)] text-[var(--acid)]"
  }

  if (tone === "warn") {
    return "border-[rgba(255,176,32,0.3)] bg-[rgba(255,176,32,0.06)] text-[var(--warn)]"
  }

  return "border-[var(--line-2)] bg-[var(--panel-2)] text-[var(--text-dim)]"
}

function formatTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(value)
}

function metricLabel(value: number, total: number) {
  return `${String(value).padStart(2, "0")} / ${String(total).padStart(2, "0")}`
}

function teamStatusTone(status: string): "acid" | "warn" | "default" {
  if (status === "SUBMITTED" || status === "READY_FOR_JUDGING" || status === "BUILDING") {
    return "acid"
  }

  if (status === "FORMING") {
    return "warn"
  }

  return "default"
}

function teamQueueNote(team: LeaderboardTeam) {
  if (!team.idea) {
    return "Waiting on idea brief before API release can open."
  }

  if (team.submissionStatus === "NOT_STARTED") {
    return "Idea captured. Submission links have not been staged yet."
  }

  if (team.submissionStatus === "IN_PROGRESS") {
    return "Build is active. Submission packet is still being assembled."
  }

  if (team.submissionStatus === "READY_FOR_JUDGING") {
    return "Repo and supporting links are in place for the judge pass."
  }

  return "Submission packet is complete and queued for showcase."
}

function teamStack(team: LeaderboardTeam) {
  const ideaSource = team.idea?.sourceType === "BANK" ? "Idea bank" : "Custom idea"
  const assignments = team.members
    .map((member: LeaderboardTeam["members"][number]) => member.primaryAssignment || member.secondaryAssignment)
    .filter(Boolean)
    .slice(0, 2)
    .join(" / ")

  return assignments ? `${ideaSource} · ${assignments}` : ideaSource
}

function Panel({
  title,
  action,
  children,
  highlight = false,
}: {
  title: string
  action?: string
  children: React.ReactNode
  highlight?: boolean
}) {
  return (
    <section
      className={[
        "panel-surface overflow-hidden rounded-[4px]",
        highlight ? "panel-highlight" : "",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--text-dim)]">
        <span className="inline-block size-2 rounded-full bg-[var(--acid)] shadow-[0_0_10px_var(--acid-glow)]" />
        <span>{title}</span>
        {action ? <span className="ml-auto text-[var(--text-mute)]">{action}</span> : null}
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

export function CommandCenterShell({ data }: { data: DashboardData }) {
  const totalTeams = Math.max(data.totals.teams, 1)
  const teamsWithIdeas = data.leaderboard.filter((team: LeaderboardTeam) => team.idea).length
  const teamsWithJudgeSignal = data.leaderboard.filter((team: LeaderboardTeam) => team.judgeAverage > 0).length
  const teamsReadyForJudging = data.leaderboard.filter((team: LeaderboardTeam) =>
    ["READY_FOR_JUDGING", "SUBMITTED"].includes(team.submissionStatus),
  ).length
  const topTeams: LeaderboardTeam[] = data.leaderboard.slice(0, 4)
  const queue: LeaderboardTeam[] = data.leaderboard.slice(0, 3)

  const metrics = [
    {
      label: "Registered",
      value: `${data.totals.eligibleUsers}`,
      detail: `${data.totals.teams} team cells online`,
      tone: "default" as const,
    },
    {
      label: "Idea Gate",
      value: metricLabel(teamsWithIdeas, totalTeams),
      detail: `${totalTeams - teamsWithIdeas} waiting on brief`,
      tone: "acid" as const,
    },
    {
      label: "API Keys",
      value: metricLabel(data.totals.apiKeysLoaded, totalTeams),
      detail: "staged for locked teams",
      tone: "default" as const,
    },
    {
      label: "Judge Ready",
      value: metricLabel(teamsReadyForJudging, totalTeams),
      detail: `${teamsWithJudgeSignal} teams scored`,
      tone: "warn" as const,
    },
  ]

  const submissions = [
    {
      label: "Ready for judging",
      progress: Math.round((teamsReadyForJudging / totalTeams) * 100),
    },
    {
      label: "Ideas captured",
      progress: Math.round((teamsWithIdeas / totalTeams) * 100),
    },
    {
      label: "Leaderboard score live",
      progress: Math.round((teamsWithJudgeSignal / totalTeams) * 100),
    },
  ]

  const announcementItems =
    data.announcements.length > 0
      ? data.announcements.map((item: DashboardData["announcements"][number]) => `${item.title}: ${item.body}`)
      : ["No announcements published yet. Use the right rail for ops updates."]

  return (
    <main className="min-h-screen bg-[var(--bg)] px-3 py-3 text-[var(--text)] md:px-4">
      <div className="scanlines grid-overlay relative mx-auto max-w-[1680px] overflow-hidden rounded-[6px] border border-[var(--line)] bg-[linear-gradient(180deg,#050505_0%,#020202_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.55)]">
        <div className="relative z-10">
          <div className="flex h-9 items-center gap-3 border-b border-[var(--line)] bg-[#050505] px-4 text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)]">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#2b2b2b]" />
              <span className="size-2 rounded-full bg-[#2b2b2b]" />
              <span className="size-2 rounded-full bg-[#2b2b2b]" />
            </div>
            <div className="mx-auto flex w-full max-w-md items-center gap-2 rounded-[3px] border border-[var(--line)] bg-[#0d0d0d] px-3 py-1.5 text-[var(--text-dim)]">
              <LockKeyhole className="size-3.5 text-[var(--acid)]" />
              <span>altir.techday.internal/command-center</span>
            </div>
            <div className="hidden items-center gap-4 md:flex">
              <span>build: shell</span>
              <span>state: live mock</span>
            </div>
          </div>

          <header className="flex flex-col gap-4 border-b border-[var(--line)] bg-[#060606] px-4 py-4 xl:flex-row xl:items-center xl:gap-8 xl:px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-[4px] border border-[rgba(196,255,0,0.3)] bg-[rgba(196,255,0,0.08)]">
                <Image src="/logo.png" alt="Altir logo" width={30} height={30} className="size-7 object-contain" />
              </div>
              <div>
                <div className="text-[12px] font-bold uppercase tracking-[0.34em] text-white">Altir</div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-mute)]">
                  Tech Day Command Center
                </div>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-mute)]">
              {navItems.map((item, index) => (
                <a
                  key={item}
                  href="#"
                  className={[
                    "rounded-[3px] border px-3 py-2 transition",
                    index === 0
                      ? "border-[var(--line-2)] bg-[var(--panel-3)] text-white"
                      : "border-transparent bg-transparent hover:border-[var(--line)] hover:bg-[var(--panel-2)]",
                  ].join(" ")}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="ml-auto flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.16em]">
              <div className="flex items-center gap-2 rounded-[3px] border border-[var(--line-2)] bg-[var(--panel)] px-3 py-2 text-[var(--text-dim)]">
                <span className="size-2 rounded-full bg-[var(--acid)] shadow-[0_0_12px_var(--acid-glow)]" />
                <span>{data.timeline[0] ? `next ${formatTime(data.timeline[0].startsAt)}` : "schedule live"}</span>
              </div>
              <div className="rounded-[3px] border border-[rgba(196,255,0,0.28)] bg-[rgba(196,255,0,0.08)] px-3 py-2 text-[var(--acid)]">
                Internal MVP / demo auth rules active
              </div>
            </div>
          </header>

          <div className="grid gap-px bg-[var(--line)] xl:grid-cols-[280px,minmax(0,1fr),340px]">
            <aside className="space-y-px bg-[var(--bg)]">
              <Panel title="Operator State" action="live feed" highlight>
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="acid-text-shadow text-[22px] font-bold uppercase tracking-[0.18em] text-white">
                        Build Control
                      </div>
                      <p className="mt-2 max-w-[26ch] text-[12px] leading-6 text-[var(--text-dim)]">
                        Dense internal shell aligned to the dark Altir command-center exploration.
                      </p>
                    </div>
                    <Gauge className="mt-1 size-5 text-[var(--acid)]" />
                  </div>

                  <div className="rounded-[4px] border border-[var(--line-2)] bg-[var(--panel-2)] px-3 py-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--text-mute)]">
                      <Sparkles className="size-3.5 text-[var(--acid)]" />
                      Demo sign-in rule
                    </div>
                    <div className="mt-3 space-y-2 text-[12px] text-[var(--text-dim)]">
                      <div className="flex items-center justify-between gap-3">
                        <span>User ID</span>
                        <span className="text-white">employee email</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span>Password</span>
                        <span className="text-white">local-part before @</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[4px] border border-[var(--line-2)] bg-[var(--panel-2)] px-3 py-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--text-mute)]">
                      <RadioTower className="size-3.5 text-[var(--acid)]" />
                      Console prompt
                    </div>
                    <div className="mt-3 flex items-center gap-2 rounded-[3px] border border-[rgba(196,255,0,0.25)] bg-black px-3 py-3 text-[12px] text-white">
                      <span className="font-bold text-[var(--acid)]">altir@ops</span>
                      <span className="text-[var(--text-mute)]">$</span>
                      <span>watch --teams --judges --submissions</span>
                    </div>
                  </div>
                </div>
              </Panel>

              <Panel title="Event Clock" action="22 May 2026">
                <div className="space-y-3">
                  {data.timeline.slice(0, 4).map((item: DashboardData["timeline"][number], index: number) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="pt-0.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-mute)]">
                        {formatTime(item.startsAt)}
                      </div>
                      <div className="min-w-0 flex-1 border-l border-[var(--line-2)] pl-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={[
                              "size-2 rounded-full",
                              item.kind === "MILESTONE"
                                ? "bg-[var(--acid)]"
                                : index === 1
                                  ? "bg-[var(--warn)]"
                                  : "bg-[var(--line-3)]",
                            ].join(" ")}
                          />
                          <span className="text-[12px] text-white">{item.title}</span>
                        </div>
                        <p className="mt-1 text-[11px] leading-5 text-[var(--text-dim)]">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Judge Grid" action="03 criteria">
                <div className="space-y-3">
                  {judgeCriteria.map((criterion, index) => (
                    <div
                      key={criterion.label}
                      className="flex items-center justify-between rounded-[4px] border border-[var(--line-2)] bg-[var(--panel-2)] px-3 py-2"
                    >
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-mute)]">
                          Criterion {index + 1}
                        </div>
                        <div className="mt-1 text-[12px] text-white">{criterion.label}</div>
                      </div>
                      <div className="text-right text-[11px] text-[var(--text-dim)]">
                        <div>max {criterion.max}</div>
                        <div className="mt-1 text-[var(--acid)]">draft ready</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </aside>

            <section className="space-y-px bg-[var(--bg)]">
              <div className="grid gap-px bg-[var(--line)] md:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                  <div key={metric.label} className="bg-[var(--bg)] p-4">
                    <div className="panel-surface rounded-[4px] px-4 py-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--text-mute)]">
                        {metric.label}
                      </div>
                      <div className="mt-3 flex items-end justify-between gap-3">
                        <div className="text-[28px] font-bold uppercase tracking-[0.1em] text-white">
                          {metric.value}
                        </div>
                        <span
                          className={[
                            "rounded-[3px] border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em]",
                            toneClasses(metric.tone),
                          ].join(" ")}
                        >
                          live
                        </span>
                      </div>
                      <div className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
                        {metric.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-px bg-[var(--line)] xl:grid-cols-[minmax(0,1.3fr),minmax(0,0.9fr)]">
                <Panel title="Mission Board" action="command rail" highlight>
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr),minmax(0,0.85fr)]">
                    <div className="rounded-[4px] border border-[var(--line-2)] bg-[linear-gradient(180deg,rgba(196,255,0,0.1),rgba(196,255,0,0.03)_38%,rgba(0,0,0,0)_100%)] p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-[var(--acid)]">
                            Ops Summary
                          </div>
                          <h1 className="mt-3 max-w-[15ch] text-[34px] font-bold uppercase leading-none tracking-[0.08em] text-white">
                            Dense build floor with live energy.
                          </h1>
                        </div>
                        <MonitorPlay className="size-5 text-[var(--acid)]" />
                      </div>
                      <p className="mt-4 max-w-[62ch] text-[13px] leading-7 text-[var(--text-dim)]">
                        Team formation, idea gating, API release, judge readiness, and leaderboard
                        momentum are surfaced in one dark, TV-friendly shell.
                      </p>
                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-[4px] border border-[var(--line-2)] bg-black/40 px-3 py-3">
                          <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-mute)]">
                            Build window
                          </div>
                          <div className="mt-2 text-[13px] font-semibold text-white">14:30 → 17:30</div>
                        </div>
                        <div className="rounded-[4px] border border-[var(--line-2)] bg-black/40 px-3 py-3">
                          <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-mute)]">
                            Presentation block
                          </div>
                          <div className="mt-2 text-[13px] font-semibold text-white">17:30 → 18:30</div>
                        </div>
                        <div className="rounded-[4px] border border-[var(--line-2)] bg-black/40 px-3 py-3">
                          <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-mute)]">
                            Deployment target
                          </div>
                          <div className="mt-2 text-[13px] font-semibold text-white">SQLite now / Postgres later</div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[4px] border border-[var(--line-2)] bg-[var(--panel-2)] p-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--text-mute)]">
                        <Activity className="size-3.5 text-[var(--acid)]" />
                        Launch sequence
                      </div>
                      <div className="mt-4 space-y-4">
                        {([
                          ["Eligible employees loaded", 100],
                          ["Teams formed", Math.round((data.totals.teams / Math.max(Math.ceil(data.totals.eligibleUsers / 2), 1)) * 100)],
                          ["Ideas captured before unlock", Math.round((teamsWithIdeas / totalTeams) * 100)],
                          ["Judge packets moving", Math.round((teamsReadyForJudging / totalTeams) * 100)],
                        ] as Array<[string, number]>).map(([label, progress]) => (
                          <div key={label}>
                            <div className="mb-2 flex items-center justify-between gap-3 text-[12px]">
                              <span className="text-[var(--text-dim)]">{label}</span>
                              <span className="text-white">{progress}%</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--panel-3)]">
                              <div
                                className="h-full bg-[var(--acid)] shadow-[0_0_14px_var(--acid-glow)]"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Panel>

                <Panel title="Submission Pulse" action="readiness">
                  <div className="space-y-4">
                    {submissions.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[4px] border border-[var(--line-2)] bg-[var(--panel-2)] px-3 py-3"
                      >
                        <div className="flex items-center justify-between gap-3 text-[12px]">
                          <span className="text-[var(--text-dim)]">{item.label}</span>
                          <span className="font-semibold text-white">{item.progress}%</span>
                        </div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--panel-3)]">
                          <div
                            className="h-full bg-[linear-gradient(90deg,var(--acid),var(--acid-2))] shadow-[0_0_14px_var(--acid-glow)]"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}

                    <div className="rounded-[4px] border border-[rgba(196,255,0,0.28)] bg-[rgba(196,255,0,0.06)] p-3 text-[12px] leading-6 text-[var(--text-dim)]">
                      Public and TV views show scoreboards, progress, and ideas only. API keys and
                      auth details stay private to the team/admin surface.
                    </div>
                  </div>
                </Panel>
              </div>

              <div className="grid gap-px bg-[var(--line)] xl:grid-cols-[minmax(0,1fr),minmax(0,1fr)]">
                <Panel title="Idea / Stack Watch" action="active teams">
                  <div className="terminal-scrollbar overflow-x-auto">
                    <table className="w-full min-w-[620px] border-collapse text-left text-[12px]">
                      <thead>
                        <tr className="border-b border-[var(--line)] text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">
                          <th className="pb-3 pr-4 font-semibold">Team</th>
                          <th className="pb-3 pr-4 font-semibold">Idea</th>
                          <th className="pb-3 pr-4 font-semibold">Stack</th>
                          <th className="pb-3 pr-4 font-semibold">Gate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.leaderboard.map((team: LeaderboardTeam, index: number) => (
                          <tr
                            key={team.teamId}
                            className={index < data.leaderboard.length - 1 ? "border-b border-[var(--line)]" : ""}
                          >
                            <td className="py-3 pr-4 text-white">{team.teamName}</td>
                            <td className="py-3 pr-4 text-[var(--text-dim)]">
                              {team.idea?.title ?? "Idea pending"}
                            </td>
                            <td className="py-3 pr-4 text-[var(--text-dim)]">{teamStack(team)}</td>
                            <td className="py-3 pr-4">
                              <span
                                className={[
                                  "inline-flex rounded-[3px] border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em]",
                                  toneClasses(teamStatusTone(team.status)),
                                ].join(" ")}
                              >
                                {team.submissionStatus.toLowerCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Panel>

                <Panel title="Live Leaderboard" action="event points">
                  <div className="space-y-3">
                    {topTeams.map((team: LeaderboardTeam, index: number) => (
                      <div
                        key={team.teamId}
                        className={[
                          "flex items-center gap-3 rounded-[4px] border px-3 py-3",
                          index === 0
                            ? "border-[rgba(196,255,0,0.32)] bg-[rgba(196,255,0,0.08)]"
                            : "border-[var(--line-2)] bg-[var(--panel-2)]",
                        ].join(" ")}
                      >
                        <div className="w-9 text-[18px] font-bold uppercase tracking-[0.12em] text-white">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] font-semibold text-white">{team.teamName}</div>
                          <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[var(--text-dim)]">
                            Judge {team.normalizedJudge.toFixed(1)} · Event {team.eventPoints.toFixed(0)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[18px] font-bold text-white">
                          {Math.round(team.finalScore)}
                          <span className="text-[12px] font-normal text-[var(--text-mute)]">/1000</span>
                        </div>
                          <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[var(--acid)]">
                            live
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            </section>

            <aside className="space-y-px bg-[var(--bg)]">
              <Panel title="Team Queue" action="ops watch" highlight>
                <div className="space-y-3">
                  {queue.map((team: LeaderboardTeam) => (
                    <div key={team.teamId} className="rounded-[4px] border border-[var(--line-2)] bg-[var(--panel-2)] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[12px] font-semibold text-white">{team.teamName}</div>
                          <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)]">
                            {team.members
                              .map((member: LeaderboardTeam["members"][number]) => member.fullName)
                              .join(" / ")}
                          </div>
                        </div>
                        <span
                          className={[
                            "rounded-[3px] border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em]",
                            toneClasses(teamStatusTone(team.status)),
                          ].join(" ")}
                        >
                          {team.status}
                        </span>
                      </div>
                      <p className="mt-3 text-[12px] leading-6 text-[var(--text-dim)]">{teamQueueNote(team)}</p>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Key Release" action="gated">
                <div className="space-y-4">
                  <div className="rounded-[4px] border border-[rgba(196,255,0,0.28)] bg-[rgba(196,255,0,0.06)] p-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--acid)]">
                      <KeyRound className="size-3.5" />
                      Team credential gate
                    </div>
                    <div className="mt-3 text-[22px] font-bold uppercase tracking-[0.12em] text-white">
                      {Math.max(totalTeams - teamsWithIdeas, 0)} key hold
                    </div>
                    <p className="mt-3 text-[12px] leading-6 text-[var(--text-dim)]">
                      Keys reveal only after idea capture and the release window. Public walls never
                      expose them.
                    </p>
                  </div>

                  <div className="rounded-[4px] border border-[var(--line-2)] bg-[var(--panel-2)] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">
                        Access control
                      </div>
                      <ShieldCheck className="size-4 text-[var(--acid)]" />
                    </div>
                    <ul className="mt-3 space-y-2 text-[12px] leading-6 text-[var(--text-dim)]">
                      <li>Participant: sees own team workspace only</li>
                      <li>Judge: sees review packet, never keys</li>
                      <li>Public/TV: ideas, momentum, countdown only</li>
                    </ul>
                  </div>
                </div>
              </Panel>

              <Panel title="Broadcast Stack" action="TV loop">
                <div className="space-y-3">
                  {announcementItems.map((item: string) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-[4px] border border-[var(--line-2)] bg-[var(--panel-2)] px-3 py-3"
                    >
                      <BellRing className="mt-0.5 size-4 text-[var(--acid)]" />
                      <p className="text-[12px] leading-6 text-[var(--text-dim)]">{item}</p>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Footer Rail" action="mvp shell">
                <div className="grid gap-3 text-[12px]">
                  <div className="flex items-center justify-between rounded-[4px] border border-[var(--line-2)] bg-[var(--panel-2)] px-3 py-2">
                    <span className="flex items-center gap-2 text-[var(--text-dim)]">
                      <Users2 className="size-4 text-[var(--acid)]" />
                      Team workspace
                    </span>
                    <ChevronRight className="size-4 text-[var(--text-mute)]" />
                  </div>
                  <div className="flex items-center justify-between rounded-[4px] border border-[var(--line-2)] bg-[var(--panel-2)] px-3 py-2">
                    <span className="flex items-center gap-2 text-[var(--text-dim)]">
                      <FileCode2 className="size-4 text-[var(--acid)]" />
                      Submission gallery
                    </span>
                    <ArrowUpRight className="size-4 text-[var(--text-mute)]" />
                  </div>
                  <div className="flex items-center justify-between rounded-[4px] border border-[var(--line-2)] bg-[var(--panel-2)] px-3 py-2">
                    <span className="flex items-center gap-2 text-[var(--text-dim)]">
                      <Clock3 className="size-4 text-[var(--acid)]" />
                      Judge publication
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-mute)]">
                      after admin publish
                    </span>
                  </div>
                </div>
              </Panel>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}
