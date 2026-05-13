# Altir Tech Day Teaser Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 45-second `16:9` HyperFrames teaser video for Altir Tech Day using the approved script, Altir logo assets, and a royalty-free music track.

**Architecture:** Add a standalone HyperFrames project under `videos/altir-tech-day-teaser/` so the teaser work stays isolated from the Next.js app. Use one root composition in `index.html`, scoped scene markup and CSS in place, GSAP timelines registered on `window.__timelines`, copied local logo/audio assets, and rendered outputs kept inside the video project.

**Tech Stack:** HyperFrames CLI, HTML/CSS/GSAP, FFmpeg, local image assets, Mixkit MP3, git

---

## File Structure

- `videos/altir-tech-day-teaser/`
  - Dedicated HyperFrames project root created by `npx hyperframes init`
- `videos/altir-tech-day-teaser/DESIGN.md`
  - Video-specific visual identity derived from the landing page
- `videos/altir-tech-day-teaser/index.html`
  - Root `1920x1080` composition and master timeline
- `videos/altir-tech-day-teaser/assets/altir-logo-dark.png`
  - Dark-surface Altir mark copied from `logo.png`
- `videos/altir-tech-day-teaser/assets/altir-logo-light.webp`
  - Light-surface Altir mark copied from `Large+logo+Black.webp`
- `videos/altir-tech-day-teaser/assets/masking-the-masters.mp3`
  - Downloaded royalty-free track
- `videos/altir-tech-day-teaser/renders/`
  - Render outputs produced by HyperFrames
- `.gitignore`
  - Ignore render artifacts if the path is not already ignored
- `docs/superpowers/specs/2026-05-13-altir-tech-day-teaser-design.md`
  - Approved spec, used as implementation source of truth

### Task 1: Scaffold the HyperFrames Project and Local Assets

**Files:**
- Create: `videos/altir-tech-day-teaser/`
- Create: `videos/altir-tech-day-teaser/index.html`
- Create: `videos/altir-tech-day-teaser/assets/altir-logo-dark.png`
- Create: `videos/altir-tech-day-teaser/assets/altir-logo-light.webp`
- Modify: `.gitignore`

- [ ] **Step 1: Scaffold the HyperFrames project**

Run:

```bash
npx hyperframes init videos/altir-tech-day-teaser --example kinetic-type --non-interactive
```

Expected:
- The command exits `0`
- `videos/altir-tech-day-teaser/index.html` exists
- HyperFrames creates its default project structure without touching the Next.js app

- [ ] **Step 2: Verify the scaffold before editing**

Run:

```bash
npx hyperframes lint videos/altir-tech-day-teaser
```

Expected:
- Exit `0`
- No missing-project errors
- If the scaffold emits warnings, record them and resolve them before adding custom scene code

- [ ] **Step 3: Copy the approved Altir logo assets into the video project**

Run:

```bash
mkdir -p videos/altir-tech-day-teaser/assets
cp logo.png videos/altir-tech-day-teaser/assets/altir-logo-dark.png
cp 'Large+logo+Black.webp' videos/altir-tech-day-teaser/assets/altir-logo-light.webp
```

Expected:
- Both files exist under `videos/altir-tech-day-teaser/assets/`
- The root repo assets remain unchanged

- [ ] **Step 4: Ignore render outputs if needed**

Add this line to `.gitignore` only if an equivalent rule is not already present:

```gitignore
videos/altir-tech-day-teaser/renders/
```

Expected:
- Rendered binaries stay out of source control
- Project sources remain commit-safe

- [ ] **Step 5: Commit the scaffold and copied assets**

```bash
git add .gitignore videos/altir-tech-day-teaser
git commit -m "chore: scaffold HyperFrames teaser project"
```

### Task 2: Lock the Video Visual Identity and Timing Map

**Files:**
- Create: `videos/altir-tech-day-teaser/DESIGN.md`
- Modify: `videos/altir-tech-day-teaser/index.html`

- [ ] **Step 1: Write the project-specific design identity**

Create `videos/altir-tech-day-teaser/DESIGN.md` with:

```md
# Altir Tech Day Teaser Design System

## Style Prompt
Brutalist cinematic technology promo using near-black surfaces, acid-green highlights, monospaced typography, faint grid geometry, scanline texture, and restrained logo usage. Motion should begin tense and sparse, accelerate into precise kinetic type and panel reveals, then resolve into a calm, confident final lockup.

## Colors
- `#000000` background
- `#0a0a0a` panel
- `#101010` panel-2
- `#ebedf0` text
- `#9aa0a6` text-dim
- `#c4ff00` acid accent
- `rgba(196, 255, 0, 0.18)` acid glow

## Typography
- Primary: `JetBrains Mono`
- Fallback: `ui-monospace`, `SFMono-Regular`, `Menlo`, `monospace`

## What NOT to Do
- No purple gradients
- No generic corporate blue
- No hard glitch spam
- No literal screen recordings of the app
- No dense body copy that cannot be read on a stage screen
```

Expected:
- The HyperFrames project now has an explicit visual identity
- The design document matches the approved spec and landing-page palette

- [ ] **Step 2: Replace scaffold content with a timed scene map**

Update `videos/altir-tech-day-teaser/index.html` so the root composition has:

```html
<div
  data-composition-id="altir-tech-day-teaser"
  data-width="1920"
  data-height="1080"
>
  <audio
    id="music-bed"
    data-start="0"
    data-duration="45"
    data-track-index="2"
    src="assets/masking-the-masters.mp3"
    data-volume="0.95"
  ></audio>

  <section class="scene scene-1" data-start="0" data-duration="5" data-track-index="1"></section>
  <section class="scene scene-2" data-start="5" data-duration="5" data-track-index="1"></section>
  <section class="scene scene-3" data-start="10" data-duration="6" data-track-index="1"></section>
  <section class="scene scene-4" data-start="16" data-duration="6" data-track-index="1"></section>
  <section class="scene scene-5" data-start="22" data-duration="9" data-track-index="1"></section>
  <section class="scene scene-6" data-start="31" data-duration="6" data-track-index="1"></section>
  <section class="scene scene-7" data-start="37" data-duration="8" data-track-index="1"></section>
</div>
```

Expected:
- Runtime equals `45` seconds
- Every approved scene from the spec has an explicit slot in the timeline
- Audio is wired as a separate track, not embedded in a video element

- [ ] **Step 3: Commit the design system and timing map**

```bash
git add videos/altir-tech-day-teaser/DESIGN.md videos/altir-tech-day-teaser/index.html
git commit -m "feat: define teaser design system and scene map"
```

### Task 3: Build the Static Hero Frames for All Seven Scenes

**Files:**
- Modify: `videos/altir-tech-day-teaser/index.html`

- [ ] **Step 1: Write the full static layout and scoped CSS before animation**

Replace the scaffold body with scene markup and scoped CSS shaped like:

```html
<style>
  [data-composition-id="altir-tech-day-teaser"] {
    --bg: #000000;
    --panel: #0a0a0a;
    --panel-2: #101010;
    --line: #1f1f1f;
    --text: #ebedf0;
    --text-dim: #9aa0a6;
    --acid: #c4ff00;
    --acid-glow: rgba(196, 255, 0, 0.18);
    background:
      radial-gradient(circle at 50% 0%, rgba(196, 255, 0, 0.09), transparent 26%),
      linear-gradient(180deg, #040404 0%, #000000 45%, #020202 100%);
    color: var(--text);
    font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
    overflow: hidden;
  }

  .scene {
    width: 100%;
    height: 100%;
    padding: 104px 128px;
    box-sizing: border-box;
  }

  .scene-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 24px;
  }

  .eyebrow {
    font-size: 20px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--text-dim);
  }

  .headline {
    font-size: 104px;
    line-height: 0.92;
    letter-spacing: -0.06em;
    text-transform: uppercase;
  }

  .subhead {
    max-width: 1100px;
    font-size: 30px;
    line-height: 1.35;
    color: var(--text-dim);
  }
```

Expected:
- Each scene is readable as a still frame before any GSAP code is added
- Type sizes are appropriate for `1920x1080`
- The composition uses padding and flex layout, not absolute-positioned content containers

- [ ] **Step 2: Add the approved scene text and logo placements**

Include scene content that directly matches the approved copy:

```html
<section class="scene scene-1" data-start="0" data-duration="5" data-track-index="1">
  <div class="scene-content">
    <img class="logo logo-light" src="assets/altir-logo-light.webp" alt="" />
    <div class="eyebrow">Altir Tech Day</div>
    <h1 class="headline">May 22,<br />2026</h1>
  </div>
</section>

<section class="scene scene-5" data-start="22" data-duration="9" data-track-index="1">
  <div class="scene-content">
    <div class="eyebrow">Build rush</div>
    <h2 class="headline">Three Hours</h2>
    <div class="metric-row">
      <span>Real tools</span>
      <span>Real builds</span>
      <span>No spectating</span>
    </div>
  </div>
</section>

<section class="scene scene-7" data-start="37" data-duration="8" data-track-index="1">
  <div class="scene-content">
    <img class="logo logo-dark" src="assets/altir-logo-dark.png" alt="" />
    <h2 class="headline">Build Exciting<br />Projects</h2>
    <p class="subhead">Have fun building</p>
    <div class="eyebrow">May 22, 2026</div>
  </div>
</section>
```

Expected:
- All seven scenes contain the approved script lines
- The Altir mark appears only in the opening and final lockup
- Scene 5 is visibly denser than the others

- [ ] **Step 3: Lint the static composition before animation**

Run:

```bash
npx hyperframes lint videos/altir-tech-day-teaser
```

Expected:
- Exit `0`
- No layout-contract or composition-structure errors

- [ ] **Step 4: Commit the static scene build**

```bash
git add videos/altir-tech-day-teaser/index.html
git commit -m "feat: build teaser static scene layouts"
```

### Task 4: Add the GSAP Motion System and Scene Transitions

**Files:**
- Modify: `videos/altir-tech-day-teaser/index.html`

- [ ] **Step 1: Add GSAP and register the master timeline**

Add the required script tags and timeline contract:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<script>
  window.__timelines = window.__timelines || {};

  const tl = gsap.timeline({ paused: true });

  window.__timelines["altir-tech-day-teaser"] = tl;
</script>
```

Expected:
- The composition exposes one registered paused timeline
- HyperFrames can control playback deterministically

- [ ] **Step 2: Add entrance-only motion for scenes 1 through 6**

Build scene timelines using `from()` tweens with staggered easing:

```js
tl.from(".scene-1 .logo-light", { opacity: 0, scale: 0.82, duration: 0.8, ease: "power3.out" }, 0.2);
tl.from(".scene-1 .eyebrow", { opacity: 0, y: 24, duration: 0.5, ease: "power2.out" }, 0.55);
tl.from(".scene-1 .headline", { opacity: 0, y: 46, duration: 0.72, ease: "expo.out" }, 0.75);

tl.from(".scene-2 .headline-line", { opacity: 0, x: -64, duration: 0.55, stagger: 0.12, ease: "circ.out" }, 5.25);
tl.from(".scene-3 .split-panel", { opacity: 0, y: 54, duration: 0.62, stagger: 0.08, ease: "power4.out" }, 10.2);
tl.from(".scene-4 .idea-card", { opacity: 0, scale: 0.94, duration: 0.46, stagger: 0.1, ease: "back.out(1.1)" }, 16.2);
tl.from(".scene-5 .metric-chip", { opacity: 0, y: 22, duration: 0.36, stagger: 0.06, ease: "sine.out" }, 22.15);
tl.from(".scene-6 .headline", { opacity: 0, letterSpacing: "0.04em", duration: 0.55, ease: "power2.out" }, 31.25);
```

Expected:
- Every scene has visible entrance motion
- No scene exits early before its transition point
- Motion ramps up through Scene 5, then calms in Scene 6

- [ ] **Step 3: Add non-glitch transitions between scenes and final fade**

Add transition overlays and final fade-only exit for the last scene:

```js
tl.from(".transition-1", { scaleX: 0, transformOrigin: "left center", duration: 0.45, ease: "power2.inOut" }, 4.55);
tl.from(".transition-2", { clipPath: "inset(0 100% 0 0)", duration: 0.42, ease: "expo.inOut" }, 9.55);
tl.from(".transition-3", { yPercent: 100, duration: 0.48, ease: "power3.inOut" }, 15.5);
tl.from(".transition-4", { opacity: 0, duration: 0.35, ease: "none" }, 21.55);
tl.from(".transition-5", { scaleY: 0, transformOrigin: "center top", duration: 0.4, ease: "power2.inOut" }, 30.55);
tl.from(".transition-6", { clipPath: "inset(100% 0 0 0)", duration: 0.45, ease: "expo.inOut" }, 36.45);

tl.to(".scene-7", { opacity: 0, duration: 0.7, ease: "power2.in" }, 44.1);
```

Expected:
- No jump cuts remain
- Scene 7 is the only scene with an actual fade-out exit
- Transitions stay cinematic and controlled

- [ ] **Step 4: Preview the motion system**

Run:

```bash
npx hyperframes preview videos/altir-tech-day-teaser --port 3002
```

Expected:
- Local preview opens successfully
- Motion pacing and legibility can be reviewed scene by scene

- [ ] **Step 5: Commit the animated composition**

```bash
git add videos/altir-tech-day-teaser/index.html
git commit -m "feat: animate teaser timeline and transitions"
```

### Task 5: Add the Music Track, Validate, and Render

**Files:**
- Create: `videos/altir-tech-day-teaser/assets/masking-the-masters.mp3`
- Modify: `videos/altir-tech-day-teaser/index.html`

- [ ] **Step 1: Download the selected Mixkit track into the video project**

Run:

```bash
curl -L https://assets.mixkit.co/music/552/552.mp3 -o videos/altir-tech-day-teaser/assets/masking-the-masters.mp3
```

Expected:
- Exit `0`
- The local MP3 file exists
- The asset path matches the root composition audio element

- [ ] **Step 2: Trim the source track to a 45-second working cut if needed**

If the full MP3 pacing does not fit the approved arc, create a trimmed working asset:

```bash
ffmpeg -y \
  -ss 0:00:18 \
  -t 45 \
  -i videos/altir-tech-day-teaser/assets/masking-the-masters.mp3 \
  -c copy \
  videos/altir-tech-day-teaser/assets/masking-the-masters-45s.mp3
```

Then update the composition audio source to:

```html
<audio
  id="music-bed"
  data-start="0"
  data-duration="45"
  data-track-index="2"
  src="assets/masking-the-masters-45s.mp3"
  data-volume="0.95"
></audio>
```

Expected:
- The composition uses a 45-second music bed that supports the narrative arc
- Audio stays local and deterministic

- [ ] **Step 3: Run final validation**

Run:

```bash
npx hyperframes lint videos/altir-tech-day-teaser
npx hyperframes render videos/altir-tech-day-teaser --output videos/altir-tech-day-teaser/renders/altir-tech-day-teaser-draft.mp4 --quality draft
```

Expected:
- Lint exits `0`
- Draft render succeeds
- Output file exists at `videos/altir-tech-day-teaser/renders/altir-tech-day-teaser-draft.mp4`

- [ ] **Step 4: Produce the review render and final handoff note**

Run:

```bash
npx hyperframes render videos/altir-tech-day-teaser --output videos/altir-tech-day-teaser/renders/altir-tech-day-teaser-final.mp4 --quality high
```

Expected:
- High-quality review render succeeds
- Final output exists at `videos/altir-tech-day-teaser/renders/altir-tech-day-teaser-final.mp4`
- The worker can report the exact output path and any remaining polish notes

- [ ] **Step 5: Commit the source changes**

```bash
git add .gitignore videos/altir-tech-day-teaser
git commit -m "feat: add Altir Tech Day teaser video"
```

## Self-Review

Spec coverage check:
- Brand look, motion tone, 7-scene script, local logo usage, music-only audio, and HyperFrames delivery all map to Tasks 1-5.
- Music search outcome is captured in Task 5 with the approved Mixkit track.
- Verification requirements from the spec map to lint, preview, and both draft/final renders.

Placeholder scan:
- No `TODO`, `TBD`, or generic “handle later” instructions remain.
- Commands, file paths, and composition snippets are concrete.

Type consistency:
- Root composition id is consistently `altir-tech-day-teaser`.
- Asset filenames are consistent across scaffold, markup, and render tasks.
- Scene timings match the approved 45-second breakdown.
