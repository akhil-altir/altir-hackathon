import Image from "next/image"

import { BuildCountdown } from "@/components/shell/build-countdown"
import { ParticipantAppShell, ParticipantStage } from "@/components/shell/participant-app-shell"
import { loadParticipantNavContext } from "@/lib/participant-nav-context"

export const dynamic = "force-dynamic"

type VisualStep = {
  number: string
  title: string
  body: string
  command?: string
  image?: {
    src: string
    alt: string
    caption: string
    width: number
    height: number
  }
}

const codexSteps: VisualStep[] = [
  {
    number: "01",
    title: "Install Codex CLI",
    body: "Install the OpenAI Codex command-line tool on your machine.",
    command: "npm i -g @openai/codex",
  },
  {
    number: "02",
    title: "Start Codex",
    body: "Run the CLI from your terminal. Use lowercase for the command.",
    command: "codex",
  },
  {
    number: "03",
    title: "Choose API-key login",
    body: "When Codex asks how you want to sign in, select the third option: Provide your own API key.",
    image: {
      src: "/handbook/codex-login-options.png",
      alt: "Codex CLI login screen with option 3, Provide your own API key, visible.",
      caption: "Choose option 3 to use the team OpenAI API key.",
      width: 944,
      height: 1006,
    },
  },
  {
    number: "04",
    title: "Paste the team key",
    body: "Paste the OpenAI API key from the Tech Day platform, then press enter to save it locally.",
    image: {
      src: "/handbook/codex-api-key-entry.png",
      alt: "Codex CLI API key entry screen asking for an OpenAI API key.",
      caption: "Paste the key into this prompt and press enter.",
      width: 952,
      height: 892,
    },
  },
]

const cursorSteps: VisualStep[] = [
  {
    number: "01",
    title: "Open Settings",
    body: "Open Cursor Settings from the app. This guide starts on the General settings screen.",
    image: {
      src: "/handbook/cursor-settings-general.png",
      alt: "Cursor Settings page showing the General section and Models tab in the left sidebar.",
      caption: "Open Settings, then use the left sidebar.",
      width: 1652,
      height: 1324,
    },
  },
  {
    number: "02",
    title: "Select Models",
    body: "Click Models in the left sidebar. This is where Cursor manages model availability and provider keys.",
    image: {
      src: "/handbook/cursor-models-tab.png",
      alt: "Cursor Models tab selected, with model toggles visible.",
      caption: "Select Models before looking for API Keys.",
      width: 1640,
      height: 1314,
    },
  },
  {
    number: "03",
    title: "Enter the OpenAI API key",
    body: "Scroll to API Keys, find OpenAI API Key, enable or use the field, and paste the team key.",
    image: {
      src: "/handbook/cursor-openai-api-key.png",
      alt: "Cursor Models settings API Keys section with an OpenAI API Key input field.",
      caption: "Paste the team key into the OpenAI API Key field.",
      width: 1668,
      height: 1220,
    },
  },
  {
    number: "04",
    title: "Use OpenAI models",
    body: "After the key is accepted, Cursor can use the configured key for OpenAI provider calls.",
  },
]

function CommandBlock({ command }: { command: string }) {
  return (
    <div className="mt-4 border border-[var(--line)] bg-black/35 px-4 py-3 font-mono text-[12px] text-[var(--acid)]">
      <span className="text-[var(--text-mute)]">$ </span>
      {command}
    </div>
  )
}

function ScreenshotPanel({ step }: { step: VisualStep }) {
  if (!step.image) return null

  return (
    <figure className="overflow-hidden border border-[var(--line)] bg-[var(--panel)]">
      <div className="bg-white">
        <Image
          src={step.image.src}
          alt={step.image.alt}
          width={step.image.width}
          height={step.image.height}
          className="h-auto w-full object-contain"
          sizes="(min-width: 1024px) 46vw, 100vw"
        />
      </div>
      <figcaption className="border-t border-[var(--line)] px-4 py-3 text-xs leading-5 text-[var(--text-dim)]">
        {step.image.caption}
      </figcaption>
    </figure>
  )
}

function SetupSection({
  eyebrow,
  title,
  description,
  steps,
  note,
}: {
  eyebrow: string
  title: string
  description: string
  steps: VisualStep[]
  note?: string
}) {
  return (
    <section id={title.toLowerCase().replaceAll(" ", "-")} className="border border-[var(--line)] bg-[var(--panel-2)]">
      <div className="border-b border-[var(--line)] p-5 md:p-6">
        <div className="text-[10px] uppercase tracking-[0.24em] text-[var(--warn)]">{eyebrow}</div>
        <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-white md:text-3xl">{title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-dim)]">{description}</p>
      </div>

      <div className="divide-y divide-[var(--line)]">
        {steps.map((step) => (
          <div key={step.number} className="grid gap-5 p-5 md:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(360px,1fr)]">
            <div>
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center border border-[var(--line)] bg-black/25 font-mono text-[11px] text-[var(--acid)]">
                  {step.number}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-dim)]">{step.body}</p>
                  {step.command && <CommandBlock command={step.command} />}
                </div>
              </div>
            </div>
            <ScreenshotPanel step={step} />
          </div>
        ))}
      </div>

      {note && (
        <div className="border-t border-[var(--line)] bg-black/20 p-5 text-xs leading-5 text-[var(--text-mute)] md:p-6">
          {note}
        </div>
      )}
    </section>
  )
}

export default async function HandbookPage() {
  const nav = await loadParticipantNavContext()
  const session = nav.session

  return (
    <ParticipantAppShell
      browserTitle="handbook"
      urlDisplay="techday.altir.internal/handbook"
      browserRight={<span className="text-[var(--acid)]">reference</span>}
      activeNav="handbook"
      workspaceHref={nav.workspaceHref}
      ideaHref={nav.ideaHref}
      submitHref={nav.submitHref}
      countdownSlot={<BuildCountdown />}
      teamSlug={nav.teamSlug}
      teamName={nav.teamName}
      userEmail={session?.email ?? null}
      userName={session?.fullName ?? null}
      hasTeam={nav.hasTeam}
    >
      <ParticipantStage wide>
        <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[var(--warn)]"># /handbook · setup guide</div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(260px,0.28fr)]">
          <div>
            <h1 className="text-4xl font-bold tracking-[-0.04em] text-white md:text-5xl">Set up your coding tool.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-dim)]">
              Set up your coding tool with the team OpenAI API key.
            </p>
          </div>
          <div className="border border-[var(--line)] bg-[var(--panel-2)] p-4 text-xs leading-5 text-[var(--text-dim)]">
            <div className="mb-3 text-[10px] uppercase tracking-[0.22em] text-[var(--text-mute)]">before you start</div>
            Get the team OpenAI API key from the Tech Day platform. Never commit it, paste it into frontend code, or share it outside
            your team.
          </div>
        </div>

        <nav className="mt-8 grid gap-3 md:grid-cols-2">
          <a href="#codex-cli" className="border border-[var(--line)] bg-[var(--panel)] p-4 transition hover:border-[var(--acid)]">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--acid)]">01</div>
            <div className="mt-2 text-lg font-semibold text-white">Codex CLI</div>
            <div className="mt-1 text-xs leading-5 text-[var(--text-dim)]">Install Codex and log in with the team API key.</div>
          </a>
          <a href="#cursor" className="border border-[var(--line)] bg-[var(--panel)] p-4 transition hover:border-[var(--acid)]">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--acid)]">02</div>
            <div className="mt-2 text-lg font-semibold text-white">Cursor</div>
            <div className="mt-1 text-xs leading-5 text-[var(--text-dim)]">Add the OpenAI API key in Cursor Models settings.</div>
          </a>
        </nav>

        <div className="mt-8 space-y-8">
          <SetupSection
            eyebrow="OpenAI setup"
            title="Codex CLI"
            description="Use Codex from your terminal with usage billed through the OpenAI API key assigned to your team."
            steps={codexSteps}
          />

          <SetupSection
            eyebrow="Editor setup"
            title="Cursor"
            description="Configure Cursor to call OpenAI directly with the team API key from the Models settings page."
            steps={cursorSteps}
            note="Cursor API-key support is configured in Models settings and uses the provided key for provider calls."
          />
        </div>
      </ParticipantStage>
    </ParticipantAppShell>
  )
}
