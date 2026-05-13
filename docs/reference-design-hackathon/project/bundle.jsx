
// ═══════════════════════════════════════════════════════════════
// shared.jsx
// ═══════════════════════════════════════════════════════════════
// shared.jsx — atoms used across every artboard.
// Components are attached to window at the bottom so other Babel scripts see them.

const TEAMS = [
{ id: 'nova', name: 'NOVA', hue: '#c4ff00', members: ['Maya R.', 'Jonas T.'], depts: ['Eng', 'Design'], idea: 'AI claims assistant for ops workflows' },
{ id: 'promptops', name: 'PROMPTOPS', hue: '#ff2bd6', members: ['Priya S.', 'Devon K.'], depts: ['Eng', 'Ops'], idea: 'Support triage copilot with auto-routing' },
{ id: 'claimcraft', name: 'CLAIMCRAFT', hue: '#00d4ff', members: ['Aiden M.', 'Ravi P.'], depts: ['Biz', 'Eng'], idea: 'Document checklist builder for review cycles' },
{ id: 'pixeldesk', name: 'PIXELDESK', hue: '#ffb020', members: ['Yuki O.', 'Sam B.'], depts: ['Design', 'Ops'], idea: 'Design-system explorer for the support hub' },
{ id: 'growthhack', name: 'GROWTHHACK', hue: '#9d6dff', members: ['Lena F.', 'Theo W.'], depts: ['Biz', 'Eng'], idea: 'Cold-outbound rewriter tuned on our voice' },
{ id: 'autopilot', name: 'AUTOPILOT', hue: '#ff5a3c', members: ['Quinn H.', 'Mira J.'], depts: ['Ops', 'Eng'], idea: 'Internal runbook auto-executor for SRE' },
{ id: 'bigcanvas', name: 'BIGCANVAS', hue: '#00ff9d', members: ['Iris D.', 'Felix N.'], depts: ['Design', 'Biz'], idea: 'Slide-deck composer from raw meeting notes' },
{ id: 'quotebot', name: 'QUOTEBOT', hue: '#ff7ac6', members: ['Asha V.', 'Jordan L.'], depts: ['Biz', 'Ops'], idea: 'Quote generator that pulls from CRM + Stripe' },
{ id: 'underwrite', name: 'UNDERWRITE', hue: '#fff200', members: ['Owen C.', 'Tess R.'], depts: ['Biz', 'Design'], idea: 'Risk explainer for non-technical brokers' },
{ id: 'hotfix', name: 'HOTFIX', hue: '#00aaff', members: ['Kai G.', 'Nora E.'], depts: ['Eng', 'Eng'], idea: 'Stack-trace narrator with rollback nudges' },
{ id: 'kickoff', name: 'KICKOFF', hue: '#ff4d4d', members: ['Eli P.', 'Maya L.'], depts: ['Ops', 'Design'], idea: 'Onboarding sprint planner with day-1 checklist' },
{ id: 'northstar', name: 'NORTHSTAR', hue: '#ff8a00', members: ['Vera S.', 'Mohan T.'], depts: ['Biz', 'Eng'], idea: 'Goal-tracking dashboard tied to weekly OKRs' }];


function BrowserChrome({ url = 'techday.altir.internal', title = 'Tech Day Command Center', right }) {
  return (
    <div className="chrome">
      <div className="chrome-dots"><i></i><i></i><i></i></div>
      <div className="chrome-url">
        <span className="lock">⌧</span>
        <span style={{ color: 'var(--text-mute)' }}>https://</span>
        <span style={{ color: 'var(--text)' }}>{url}</span>
        <span style={{ color: 'var(--text-faint)', marginLeft: 'auto' }}>· {title}</span>
      </div>
      <div className="chrome-side">{right || <span>conn ok</span>}</div>
    </div>);

}

function Topbar({ active = 'workspace', team, countdown = '01:14:32', phase = 'BUILD', user }) {
  const items = [
  ['workspace', 'Workspace'],
  ['idea', 'Idea'],
  ['submit', 'Submit'],
  ['gallery', 'Gallery'],
  ['leaderboard', 'Leaderboard'],
  ['handbook', 'Handbook']];

  return (
    <div className="topbar">
      <div className="brand">
        <span className="brand-mark">A</span>
        <span>
          <span className="brand-name">ALTIR</span>
          <span className="brand-event" style={{ marginLeft: 8 }}>// TECH-DAY-2026</span>
        </span>
      </div>
      <div className="topbar-nav">
        {items.map(([k, l]) =>
        <a key={k} className={k === active ? 'is-active' : ''}>{l}</a>
        )}
      </div>
      <div className="topbar-right">
        <span className="countdown">
          <i className="blip"></i>
          <span>{phase} ENDS IN</span>
          <b>{countdown}</b>
        </span>
        {team &&
        <span className="team-tag" style={{ '--team': team.hue }}>
            <span className="swatch"></span>{team.name}
          </span>
        }
        {user && <span style={{ color: 'var(--text-dim)' }}>{user}</span>}
      </div>
    </div>);

}

function AsciiRule({ char = '━', width = 80, color }) {
  return (
    <div className="ascii" style={{ color: color || undefined }}>
      {char.repeat(width)}
    </div>);

}

function SectionTitle({ kicker, children, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 14 }}>
      <div>
        {kicker && <div className="label" style={{ color: 'var(--acid)', marginBottom: 6 }}># {kicker}</div>}
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--white)', lineHeight: 1.15 }}>{children}</h2>
      </div>
      {right && <div style={{ marginLeft: 'auto' }}>{right}</div>}
    </div>);

}

function Stat({ label, value, sub, accent }) {
  return (
    <div style={{ padding: '14px 16px', border: '1px solid var(--line)', background: 'var(--panel)' }}>
      <div className="label">{label}</div>
      <div style={{
        fontSize: 26, fontWeight: 700, marginTop: 6,
        color: accent ? 'var(--acid)' : 'var(--white)',
        textShadow: accent ? '0 0 16px var(--acid-glow)' : 'none'
      }}>{value}</div>
      {sub && <div className="dim" style={{ fontSize: 11, marginTop: 4 }}>{sub}</div>}
    </div>);

}

function Avatar({ name, hue }) {
  const initials = name.split(' ').map((s) => s[0]).slice(0, 2).join('');
  return (
    <span style={{
      width: 24, height: 24, display: 'inline-grid', placeItems: 'center',
      background: 'var(--panel-3)',
      border: '1px solid var(--line-2)',
      color: hue || 'var(--text)',
      fontSize: 10, fontWeight: 700, letterSpacing: 0,
      borderRadius: 2
    }}>{initials}</span>);

}

function PromptLine({ children, dim }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
      <span style={{ color: 'var(--acid)', fontWeight: 700 }}>$</span>
      <span style={{ color: dim ? 'var(--text-dim)' : 'var(--text)' }}>{children}</span>
    </div>);

}

function CornerCrop({ size = 10, color = 'var(--acid)' }) {
  // four L-brackets at the corners (purely decorative)
  const base = { position: 'absolute', width: size, height: size, borderColor: color, borderStyle: 'solid', borderWidth: 0 };
  return (
    <>
      <span style={{ ...base, top: 0, left: 0, borderTopWidth: 1, borderLeftWidth: 1 }} />
      <span style={{ ...base, top: 0, right: 0, borderTopWidth: 1, borderRightWidth: 1 }} />
      <span style={{ ...base, bottom: 0, left: 0, borderBottomWidth: 1, borderLeftWidth: 1 }} />
      <span style={{ ...base, bottom: 0, right: 0, borderBottomWidth: 1, borderRightWidth: 1 }} />
    </>);

}

function LogoBig() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <span style={{
        width: 36, height: 36, display: 'grid', placeItems: 'center',
        background: 'var(--acid)', color: '#000', fontWeight: 900, fontSize: 22,
        boxShadow: '0 0 24px var(--acid-glow)', borderRadius: 3
      }}>A</span>
      <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--white)' }}>
        ALTIR <span style={{ color: 'var(--text-mute)' }}>// TECH DAY 2026</span>
      </span>
    </div>);

}

Object.assign(window, {
  TEAMS,
  BrowserChrome,
  Topbar,
  AsciiRule,
  SectionTitle,
  Stat,
  Avatar,
  PromptLine,
  CornerCrop,
  LogoBig
});


// ═══════════════════════════════════════════════════════════════
// screens-entry.jsx
// ═══════════════════════════════════════════════════════════════
// screens-entry.jsx — Lockscreen + Login

function LockscreenArtboard() {
  return (
    <div className="ab" style={{ width: 1440, height: 900 }}>
      <div className="ab-grid"></div>
      <BrowserChrome url="techday.altir.internal" title="lockscreen — t-minus" right={<span style={{ color: 'var(--acid)' }}>● live</span>} />

      {/* huge ascii backdrop */}
      <div style={{
        position: 'absolute', inset: 36, top: 56,
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: 32, padding: 40
      }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <LogoBig />
            <div style={{ marginTop: 56 }}>
              <div className="label" style={{ color: 'var(--acid)' }}># 22 may 2026 / friday / hq + remote</div>
              <h1 style={{
                fontSize: 92, fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.04em',
                lineHeight: 0.92, marginTop: 20
              }}>
                Three hours.<br />
                Two people.<br />
                <span style={{ color: 'var(--acid)', textShadow: '0 0 32px var(--acid-glow)' }}>One idea you ship.</span>
              </h1>
              <p style={{ marginTop: 24, fontSize: 16, color: 'var(--text-dim)', maxWidth: 560, lineHeight: 1.55 }}>Pair up across departments, claim an API key, and stand up something that demos in under three minutes. The platform handles teams, keys, scoring and the room.



              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="btn acid lg">▸ Sign in to claim your spot</button>
            <button className="btn lg ghost">Read the handbook</button>
            <span className="dim" style={{ fontSize: 11, marginLeft: 12 }}>SSO via altir.co · ESC to dismiss</span>
          </div>
        </div>

        {/* RIGHT — countdown panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="panel" style={{ padding: 22, position: 'relative' }}>
            <CornerCrop size={12} />
            <div className="label" style={{ marginBottom: 10 }}>TIME TO BUILD WINDOW</div>
            <div style={{
              fontSize: 88, fontWeight: 700, letterSpacing: '-0.04em',
              lineHeight: 1, color: 'var(--acid)', textShadow: '0 0 36px var(--acid-glow)',
              display: 'flex', alignItems: 'baseline', gap: 6
            }}>
              <span>04</span><span style={{ color: 'var(--text-faint)' }}>:</span>
              <span>23</span><span style={{ color: 'var(--text-faint)' }}>:</span>
              <span>11</span>
            </div>
            <div className="dim" style={{ fontSize: 11, marginTop: 8 }}>hh : mm : ss · build opens 14:30 EST</div>
            <div className="bar" style={{ marginTop: 18 }}><i style={{ width: '32%' }}></i></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10 }}>
              <span className="mute">CHECK-IN</span>
              <span className="mute">TEAM LOCK 13:00</span>
              <span className="acid">BUILD 14:30</span>
              <span className="mute">DEMOS 17:30</span>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head"><span>// agenda</span><span className="right mute">CST</span></div>
            <div style={{ padding: '6px 14px 14px' }}>
              {[
              ['12:00', 'Doors open · check-in', 'mute'],
              ['13:00', 'Team formation locks', 'mute'],
              ['14:30', 'Build starts · keys reveal', 'acid'],
              ['17:00', 'Submission deadline window', 'mute'],
              ['17:30', 'Demos + judging', 'mute'],
              ['18:30', 'Winners + drinks', 'mute']].
              map(([t, l, c], i) =>
              <div key={i} style={{ display: 'flex', gap: 14, padding: '8px 0', borderBottom: i < 5 ? '1px solid var(--line)' : 0 }}>
                  <span className="mute" style={{ width: 42, fontVariantNumeric: 'tabular-nums' }}>{t}</span>
                  <span className={c}>{l}</span>
                </div>
              )}
            </div>
          </div>

          <div className="panel" style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div><div className="label">EMPLOYEES</div><div className="bold" style={{ fontSize: 22, marginTop: 4 }}>24</div></div>
            <div><div className="label">EXPECTED TEAMS</div><div className="bold" style={{ fontSize: 22, marginTop: 4 }}>12</div></div>
            <div><div className="label">PRELOADED KEYS</div><div className="bold acid" style={{ fontSize: 22, marginTop: 4 }}>12</div></div>
            <div><div className="label">JUDGES</div><div className="bold" style={{ fontSize: 22, marginTop: 4 }}>4</div></div>
          </div>
        </div>
      </div>
    </div>);

}

function LoginArtboard() {
  return (
    <div className="ab" style={{ width: 1440, height: 900 }}>
      <BrowserChrome url="techday.altir.internal/auth" title="sign in" />
      <div className="ab-grid"></div>

      <div style={{ position: 'absolute', inset: 36, top: 56, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {/* LEFT — terminal vibes */}
        <div style={{ padding: 56, borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <LogoBig />

          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.7, color: 'var(--text-dim)' }}>
            <PromptLine>altir-techday --version</PromptLine>
            <div style={{ paddingLeft: 16, color: 'var(--text-mute)' }}>v1.0.0 // command-center // 22-may-2026</div>
            <div style={{ height: 12 }}></div>
            <PromptLine>whoami</PromptLine>
            <div style={{ paddingLeft: 16, color: 'var(--text-mute)' }}>not authenticated · sso required</div>
            <div style={{ height: 12 }}></div>
            <PromptLine>auth login --sso google</PromptLine>
            <div style={{ paddingLeft: 16, color: 'var(--acid)' }}>→ redirecting to altir.co identity broker...</div>
            <div style={{ paddingLeft: 16 }}><span className="dim">→ allowed roles: </span><span style={{ color: 'var(--text)' }}>participant, judge, admin</span></div>
            <div style={{ paddingLeft: 16 }}><span className="dim">→ session ttl: </span><span style={{ color: 'var(--text)' }}>8h · cookie httpOnly · csrf token bound</span></div>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--acid)', fontWeight: 700 }}>$</span>
              <span className="input caret"></span>
            </div>
          </div>

          <div className="dim" style={{ fontSize: 11 }}>by signing in you accept the event handbook, AUP and key-handling policy</div>
        </div>

        {/* RIGHT — proper card */}
        <div style={{ padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26 }}>
          <div>
            <div className="label" style={{ color: 'var(--acid)' }}># /auth/sign-in</div>
            <h1 style={{ fontSize: 44, fontWeight: 700, marginTop: 10, letterSpacing: '-0.02em', color: 'var(--white)' }}>Welcome back.</h1>
            <p className="dim" style={{ marginTop: 8, fontSize: 14, maxWidth: 380 }}>
              Use the Google account tied to <span className="acid">@altir.co</span>.
              Your role unlocks automatically.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 380 }}>
            <button className="btn lg" style={{ justifyContent: 'flex-start', gap: 12 }}>
              <span style={{ width: 18, height: 18, display: 'grid', placeItems: 'center', background: '#fff', color: '#000', borderRadius: 2, fontWeight: 900, fontSize: 11 }}>G</span>
              Continue with Google Workspace
            </button>
            <button className="btn lg ghost" style={{ justifyContent: 'flex-start' }}>
              ⌥ Use magic link from email
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
              <div className="hair" style={{ flex: 1 }}></div>
              <span className="mute" style={{ fontSize: 10, letterSpacing: '0.2em' }}>OR DEV</span>
              <div className="hair" style={{ flex: 1 }}></div>
            </div>
            <button className="btn lg ghost" style={{ justifyContent: 'flex-start' }}>
              ▸ Impersonate (admin only)
            </button>
          </div>

          <div className="panel" style={{ maxWidth: 380, padding: 14 }}>
            <div className="kv"><span className="k">role detected</span><span className="v acid">participant</span></div>
            <div className="kv" style={{ marginTop: 6 }}><span className="k">department</span><span className="v">design</span></div>
            <div className="kv" style={{ marginTop: 6 }}><span className="k">eligible</span><span className="v">yes · seat 14</span></div>
          </div>
        </div>
      </div>
    </div>);

}

Object.assign(window, { LockscreenArtboard, LoginArtboard });


// ═══════════════════════════════════════════════════════════════
// screens-team.jsx
// ═══════════════════════════════════════════════════════════════
// screens-team.jsx — Form team, Team locked confirmation, Idea picker/submit

function FormTeamArtboard() {
  const available = [
  { name: 'Maya Reyes', dept: 'Design', role: 'Sr. Product Designer' },
  { name: 'Jonas Tran', dept: 'Eng', role: 'Platform Engineer' },
  { name: 'Priya Sandhu', dept: 'Eng', role: 'AI/ML Engineer' },
  { name: 'Devon Knox', dept: 'Ops', role: 'Customer Ops Lead' },
  { name: 'Aiden Mahmoud', dept: 'Biz', role: 'Product Manager' },
  { name: 'Yuki Ono', dept: 'Design', role: 'Brand Designer' },
  { name: 'Sam Brennan', dept: 'Ops', role: 'Field Ops' },
  { name: 'Lena Falk', dept: 'Biz', role: 'Strategy' }];

  return (
    <div className="ab" style={{ width: 1440, height: 900 }}>
      <BrowserChrome url="techday.altir.internal/teams/new" title="form a team" />
      <Topbar active="workspace" countdown="00:42:17" phase="LOCK" user="you · jordan.l@altir.co" />

      <div style={{ position: 'absolute', inset: '96px 36px 36px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        {/* LEFT */}
        <div>
          <SectionTitle kicker="step 01 / form a team"
          right={<span className="pill warn">● TEAM LOCK 13:00 · IN 42 MIN</span>}>
            Pick yourself + one partner.
          </SectionTitle>
          <p className="dim" style={{ fontSize: 13, maxWidth: 620, marginBottom: 18 }}>
            Teams are exactly 2 people. Cross-department pairs unlock bonus event points.
            You can leave or edit until 13:00 — after that, only an admin can override.
          </p>

          <div className="panel" style={{ padding: 22 }}>
            <div className="label" style={{ marginBottom: 8 }}>TEAM NAME</div>
            <div className="input focused" style={{ height: 56, fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>
              <span className="prompt">▸</span>
              <span style={{ color: 'var(--white)' }}>QUOTEBOT</span>
              <span className="caret"></span>
              <span className="pill ghost" style={{ marginLeft: 'auto' }}>AVAILABLE</span>
            </div>
            <div className="dim" style={{ fontSize: 11, marginTop: 6 }}>3–24 chars · letters, numbers, dashes · public on the TV display</div>

            <div className="ascii" style={{ margin: '20px 0 16px' }}>{'━'.repeat(64)}</div>

            <div className="label" style={{ marginBottom: 10 }}>YOUR TEAMMATE</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {available.map((p, i) =>
              <button key={i} className="panel" style={{
                padding: '12px 14px', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12,
                borderColor: p.name === 'Asha Verma' ? 'var(--acid)' : 'var(--line)',
                background: p.name === 'Asha Verma' ? 'var(--acid-soft)' : 'var(--panel-2)'
              }}>
                  <Avatar name={p.name} />
                  <div style={{ minWidth: 0 }}>
                    <div className="bold" style={{ fontSize: 13, color: 'var(--white)' }}>{p.name}</div>
                    <div className="dim" style={{ fontSize: 11 }}>{p.dept} · {p.role}</div>
                  </div>
                </button>
              )}
            </div>
            <div className="dim" style={{ fontSize: 11, marginTop: 12 }}>17 of 24 employees available · already-paired teammates are hidden</div>
          </div>
        </div>

        {/* RIGHT — sticky summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="panel" style={{ padding: 22, position: 'relative' }}>
            <CornerCrop size={10} />
            <div className="label">TEAM PREVIEW</div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 18, height: 18, background: '#ff7ac6', boxShadow: '0 0 14px rgba(255,122,198,0.5)' }}></span>
              <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--white)', letterSpacing: '0.05em' }}>QUOTEBOT</span>
            </div>
            <div className="dim" style={{ fontSize: 11, marginTop: 4 }}>auto-assigned color · 08 of 12 hues remaining</div>

            <div style={{ height: 1, background: 'var(--line)', margin: '18px 0' }}></div>

            {[
            { name: 'Jordan Lin', dept: 'Biz · Pricing Analyst', you: true },
            { name: 'Asha Verma', dept: 'Ops · Onboarding Lead', you: false }].
            map((m, i) =>
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderTop: i ? '1px solid var(--line)' : 0 }}>
                <Avatar name={m.name} hue={i === 0 ? 'var(--acid)' : '#ff7ac6'} />
                <div>
                  <div className="bold" style={{ color: 'var(--white)' }}>{m.name}{m.you && <span className="acid" style={{ marginLeft: 8, fontSize: 10 }}>YOU</span>}</div>
                  <div className="dim" style={{ fontSize: 11 }}>{m.dept}</div>
                </div>
              </div>
            )}

            <div className="panel" style={{ padding: 12, background: 'var(--panel-2)', marginTop: 14 }}>
              <div className="label" style={{ marginBottom: 8 }}>EVENT POINTS YOU'LL EARN</div>
              <div className="kv" style={{ marginBottom: 6 }}><span className="dot live"></span><span className="k">Complete team</span><span className="v acid" style={{ marginLeft: 'auto' }}>+10</span></div>
              <div className="kv" style={{ marginBottom: 6 }}><span className="dot live"></span><span className="k">Different departments</span><span className="v acid" style={{ marginLeft: 'auto' }}>+5</span></div>
              <div className="kv" style={{ marginBottom: 6 }}><span className="dot live"></span><span className="k">Very different functions (biz↔ops)</span><span className="v acid" style={{ marginLeft: 'auto' }}>+10</span></div>
              <div className="kv"><span className="dot live"></span><span className="k">Formed before lock</span><span className="v acid" style={{ marginLeft: 'auto' }}>+5</span></div>
              <div className="ascii" style={{ marginTop: 10 }}>{'─'.repeat(40)}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span className="upper bold dim">subtotal</span>
                <span className="acid bold" style={{ fontSize: 22 }}>30 pts</span>
              </div>
            </div>

            <button className="btn acid lg" style={{ width: '100%', marginTop: 14 }}>▸ Lock it in</button>
            <button className="btn ghost sm" style={{ width: '100%', marginTop: 6 }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>);

}

function TeamLockedArtboard() {
  return (
    <div className="ab" style={{ width: 1440, height: 900 }}>
      <BrowserChrome url="techday.altir.internal/teams/quotebot" title="team locked" right={<span style={{ color: 'var(--acid)' }}>● team ready</span>} />
      <Topbar active="workspace" team={{ name: 'QUOTEBOT', hue: '#ff7ac6' }} countdown="01:34:00" phase="BUILD OPENS" user="you · jordan.l" />

      <div style={{ position: 'absolute', inset: '96px 36px 36px' }}>
        {/* big celebratory hero */}
        <div className="panel" style={{ padding: 48, position: 'relative', overflow: 'hidden' }}>
          {/* confetti glyphs */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {[
            ['#c4ff00', 80, 80, '×'], ['#ff2bd6', 1240, 40, '+'], ['#00d4ff', 1340, 120, '◆'],
            ['#ffb020', 480, 30, '◆'], ['#9d6dff', 980, 60, '×'], ['#ff5a3c', 720, 110, '+'],
            ['#00ff9d', 180, 130, '◆'], ['#ff7ac6', 1100, 150, '×'], ['#c4ff00', 920, 22, '+'],
            ['#00d4ff', 560, 160, '×'], ['#ffb020', 1300, 380, '+'], ['#ff2bd6', 60, 410, '◆']].
            map(([c, x, y, g], i) =>
            <span key={i} style={{
              position: 'absolute', left: x, top: y, color: c, fontSize: 18,
              textShadow: `0 0 8px ${c}`, opacity: 0.85
            }}>{g}</span>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <div className="label" style={{ color: 'var(--acid)' }}># team locked · 12:18:42</div>
            <h1 style={{ fontSize: 72, fontWeight: 700, marginTop: 12, color: 'var(--white)', letterSpacing: '-0.03em', lineHeight: 0.95 }}>
              <span style={{ color: '#ff7ac6', textShadow: '0 0 32px rgba(255,122,198,0.4)' }}>QUOTEBOT</span> is in the room.
            </h1>
            <p className="dim" style={{ marginTop: 16, fontSize: 16, maxWidth: 640 }}>
              Both members are signed in and your workspace is live. Next up: pick or submit an idea before the API key reveals at 14:30.
            </p>

            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button className="btn acid lg">▸ Go to workspace</button>
              <button className="btn lg ghost">Browse idea bank</button>
              <button className="btn ghost sm">Edit team</button>
            </div>
          </div>
        </div>

        {/* progress strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, background: 'var(--line)', marginTop: 16, border: '1px solid var(--line)' }}>
          {[
          ['01', 'TEAM', 'done', '+30'],
          ['02', 'IDEA', 'next', '0/15'],
          ['03', 'KEY', 'wait', '—'],
          ['04', 'BUILD', 'wait', '—'],
          ['05', 'SUBMIT', 'wait', '0/40'],
          ['06', 'JUDGE', 'wait', '—']].
          map(([n, l, s, p], i) =>
          <div key={i} style={{
            padding: '18px 18px',
            background: s === 'done' ? 'var(--panel-2)' : s === 'next' ? 'var(--panel-2)' : 'var(--panel)',
            borderLeft: s === 'done' ? '2px solid var(--acid)' : s === 'next' ? '2px solid #ff7ac6' : '2px solid transparent'
          }}>
              <div className="dim" style={{ fontSize: 10, letterSpacing: '0.18em' }}>{n}</div>
              <div className="bold" style={{ color: 'var(--white)', marginTop: 4 }}>{l}</div>
              <div style={{
              fontSize: 11, marginTop: 6,
              color: s === 'done' ? 'var(--acid)' : s === 'next' ? '#ff7ac6' : 'var(--text-mute)'
            }}>{s === 'done' ? '✓ ' : s === 'next' ? '▸ ' : '○ '}{p}</div>
            </div>
          )}
        </div>

        {/* roster + next */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div className="panel">
            <div className="panel-head"><span>// team roster</span><span className="right mute">2 / 2</span></div>
            <div style={{ padding: 18 }}>
              {[
              ['Jordan Lin', 'Biz · Pricing Analyst', 'jordan.l@altir.co', true],
              ['Asha Verma', 'Ops · Onboarding Lead', 'asha.v@altir.co', false]].
              map(([n, d, e, you], i) =>
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderTop: i ? '1px solid var(--line)' : 0 }}>
                  <Avatar name={n} hue={i === 0 ? 'var(--acid)' : '#ff7ac6'} />
                  <div style={{ flex: 1 }}>
                    <div className="bold" style={{ color: 'var(--white)' }}>{n} {you && <span className="acid" style={{ fontSize: 10, marginLeft: 6 }}>YOU</span>}</div>
                    <div className="dim" style={{ fontSize: 11 }}>{d} · {e}</div>
                  </div>
                  <span className="pill ghost">● online</span>
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head"><span>// next step</span><span className="right acid">02 IDEA</span></div>
            <div style={{ padding: 22 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.01em' }}>Pick or submit an idea before the API key reveals.</div>
              <p className="dim" style={{ marginTop: 8, fontSize: 13 }}>
                Idea submission is required to unlock your team's preloaded API key at 14:30.
                You can change ideas later — first commit just gates the key.
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button className="btn acid sm">Browse 18 ideas</button>
                <button className="btn sm">Write a custom one</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}

function IdeaPickerArtboard() {
  const ideas = [
  { tag: 'OPS', title: 'Auto-tag inbound CRM leads by intent', pts: '~3h', stack: ['Python', 'OpenAI'], heat: 7 },
  { tag: 'CLAIMS', title: 'Document checklist builder for review cycles', pts: '~2h', stack: ['Replit', 'pdf-lib'], heat: 4 },
  { tag: 'INTERNAL', title: 'Slack daily-digest of Stripe + HubSpot events', pts: '~2h', stack: ['Node', 'Slack API'], heat: 5 },
  { tag: 'DESIGN', title: 'Slide composer from raw meeting transcripts', pts: '~3h', stack: ['Next.js', 'Whisper'], heat: 9 },
  { tag: 'OPS', title: 'Voice-to-ticket triage for support shifts', pts: '~2h', stack: ['Twilio', 'GPT-4'], heat: 6 },
  { tag: 'BIZ', title: 'Forecasted quote-to-close win-rate explainer', pts: '~3h', stack: ['Anything'], heat: 3 }];

  return (
    <div className="ab" style={{ width: 1440, height: 900 }}>
      <BrowserChrome url="techday.altir.internal/teams/quotebot/idea" title="idea bank" />
      <Topbar active="idea" team={{ name: 'QUOTEBOT', hue: '#ff7ac6' }} countdown="00:12:43" phase="KEY UNLOCKS" />

      <div style={{ position: 'absolute', inset: '96px 36px 36px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
        <div>
          <SectionTitle kicker="step 02 / pick or submit"
          right={<span className="pill"><span className="dot warn"></span>IDEA REQUIRED FOR KEY</span>}>
            What are you building?
          </SectionTitle>

          {/* filter row */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            {['ALL · 18', 'OPS · 6', 'CLAIMS · 3', 'BIZ · 4', 'DESIGN · 2', 'INTERNAL · 3'].map((t, i) =>
            <span key={i} className={i === 0 ? 'pill acid' : 'pill'}>{t}</span>
            )}
            <span className="pill ghost" style={{ marginLeft: 'auto' }}>SORT: HOTTEST ▾</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {ideas.map((it, i) =>
            <div key={i} className="panel" style={{ padding: 16, position: 'relative', borderColor: i === 3 ? 'var(--acid)' : 'var(--line)', background: i === 3 ? 'var(--acid-soft)' : 'var(--panel)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="pill">{it.tag}</span>
                  <span className="dim" style={{ fontSize: 10 }}>{'●'.repeat(it.heat) + '○'.repeat(10 - it.heat)}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--white)', marginTop: 10, lineHeight: 1.3 }}>{it.title}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                  {it.stack.map((s, j) => <span key={j} className="pill ghost">{s}</span>)}
                  <span className="dim" style={{ fontSize: 11, marginLeft: 'auto', alignSelf: 'center' }}>{it.pts}</span>
                </div>
                {i === 3 &&
              <div className="acid" style={{ fontSize: 11, marginTop: 12, fontWeight: 700 }}>▸ SELECTED · +3 PTS</div>
              }
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — custom + selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="panel" style={{ padding: 22 }}>
            <div className="label">CURRENT SELECTION</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--white)', marginTop: 8, lineHeight: 1.25 }}>Slide composer from raw meeting transcripts</div>
            <p className="dim" style={{ marginTop: 8, fontSize: 13 }}>
              Drop in a transcript or call recording → returns a structured 8-slide deck with title, bullet points and speaker notes. Targets pre-sales motion.
            </p>
            <div className="ascii" style={{ margin: '14px 0' }}>{'─'.repeat(40)}</div>
            <div className="kv" style={{ marginBottom: 6 }}><span className="k">scope</span><span className="v">~3h MVP</span></div>
            <div className="kv" style={{ marginBottom: 6 }}><span className="k">suggested stack</span><span className="v">Next.js + Whisper</span></div>
            <div className="kv" style={{ marginBottom: 6 }}><span className="k">picked from bank</span><span className="v acid">+3 pts</span></div>
            <div className="kv"><span className="k">idea submitted</span><span className="v acid">+10 pts</span></div>
          </div>

          <div className="panel" style={{ padding: 22 }}>
            <div className="label" style={{ marginBottom: 10 }}>OR WRITE YOUR OWN</div>
            <div className="input" style={{ height: 44 }}>
              <span className="prompt">▸</span>
              <span className="dim">Title — short, what it does in 6 words</span>
            </div>
            <textarea
              defaultValue=""
              placeholder="Description — problem, who it's for, what shipping looks like in 3 hours."
              style={{
                width: '100%', minHeight: 96, marginTop: 10,
                background: 'var(--panel-2)', border: '1px solid var(--line-2)', borderRadius: 3,
                padding: 12, fontSize: 13, color: 'var(--text-dim)', resize: 'none'
              }} />
            
            <div className="dim" style={{ fontSize: 11, marginTop: 8 }}>custom idea = +5 pts on top of submission</div>
          </div>

          <button className="btn acid lg">▸ Submit idea & unlock key path</button>
          <span className="dim" style={{ fontSize: 11, textAlign: 'center' }}>you can change this later · first submission gates the key</span>
        </div>
      </div>
    </div>);

}

Object.assign(window, { FormTeamArtboard, TeamLockedArtboard, IdeaPickerArtboard });


// ═══════════════════════════════════════════════════════════════
// screens-workspace.jsx
// ═══════════════════════════════════════════════════════════════
// screens-workspace.jsx — Team dashboard + dramatic key reveal moment

function WorkspaceArtboard() {
  return (
    <div className="ab" style={{ width: 1440, height: 900 }}>
      <BrowserChrome url="techday.altir.internal/teams/quotebot" title="team workspace" right={<span style={{ color: 'var(--acid)' }}>● 02:14:08 left</span>} />
      <Topbar active="workspace" team={{ name: 'QUOTEBOT', hue: '#ff7ac6' }} countdown="02:14:08" phase="BUILD ENDS" user="you · jordan.l" />

      <div style={{ position: 'absolute', inset: '96px 24px 24px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 18 }}>
        {/* sidebar */}
        <div className="panel" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 4, alignSelf: 'start' }}>
          <div className="label" style={{ marginBottom: 6 }}>WORKSPACE</div>
          {[
          ['▸ Dashboard', true, ''],
          ['  Idea', false, ''],
          ['  API key', false, '◆'],
          ['  Submissions', false, '0/3'],
          ['  Event points', false, '48'],
          ['  Judge score', false, '—'],
          ['  Handbook', false, '']].
          map(([l, on, r], i) =>
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '8px 10px', borderRadius: 3, fontSize: 12,
            background: on ? 'var(--panel-3)' : 'transparent',
            color: on ? 'var(--white)' : 'var(--text-dim)',
            fontWeight: on ? 700 : 500
          }}>
              <span>{l}</span>
              <span className={r === '◆' ? 'acid' : 'mute'} style={{ fontSize: 10 }}>{r}</span>
            </div>
          )}
          <div style={{ height: 1, background: 'var(--line)', margin: '10px 0' }}></div>
          <div className="label" style={{ marginBottom: 6 }}>TEAMMATES</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 6 }}>
            <Avatar name="Jordan Lin" hue="var(--acid)" />
            <span style={{ fontSize: 12 }}>Jordan <span className="acid">●</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 6 }}>
            <Avatar name="Asha Verma" hue="#ff7ac6" />
            <span style={{ fontSize: 12 }}>Asha <span className="acid">●</span></span>
          </div>
        </div>

        {/* main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          {/* hero status */}
          <div className="panel" style={{ padding: 22, display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center', position: 'relative' }}>
            <div>
              <div className="label" style={{ color: 'var(--acid)' }}># CURRENT STEP / BUILD</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--white)', marginTop: 8, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Idea locked. API key released. <span className="acid">Ship something.</span>
              </h2>
              <p className="dim" style={{ fontSize: 13, marginTop: 8 }}>
                You're on track. Add your GitHub repo before 17:00 to keep the +10 bonus alive.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="label">BUILD WINDOW LEFT</div>
              <div style={{ fontSize: 42, fontWeight: 700, color: 'var(--acid)', textShadow: '0 0 24px var(--acid-glow)', letterSpacing: '-0.03em' }}>02:14:08</div>
              <div className="bar" style={{ marginTop: 10, width: 220, marginLeft: 'auto' }}><i style={{ width: '26%' }}></i></div>
            </div>
          </div>

          {/* 4-up grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 14 }}>
            {/* idea */}
            <div className="panel">
              <div className="panel-head"><span>// idea</span><span className="right"><button className="btn ghost sm">edit</button></span></div>
              <div style={{ padding: 18 }}>
                <span className="pill">DESIGN</span>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--white)', marginTop: 10 }}>Slide composer from raw meeting transcripts</div>
                <p className="dim" style={{ marginTop: 8, fontSize: 12.5 }}>
                  Drop in a call recording → get back an 8-slide pre-sales deck with speaker notes.
                  Pulls from Gong / Granola exports.
                </p>
                <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                  <span className="pill ghost">Next.js</span>
                  <span className="pill ghost">Whisper</span>
                  <span className="pill ghost">OpenAI</span>
                </div>
              </div>
            </div>

            {/* api key */}
            <div className="panel glow" style={{ background: 'var(--panel)' }}>
              <div className="panel-head" style={{ color: 'var(--acid)' }}><span>// api key · unlocked 14:30</span><span className="right"><span className="dot live"></span></span></div>
              <div style={{ padding: 18 }}>
                <div className="label">YOUR PRELOADED KEY</div>
                <div style={{
                  marginTop: 10, padding: '12px 14px',
                  background: '#000', border: '1px solid var(--acid)',
                  fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: 0,
                  color: 'var(--acid)', textShadow: '0 0 8px var(--acid-glow)',
                  display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden'
                }}>
                  <span>sk-</span>
                  <span>aLT1r_••••••••••••••••••••3kQ7</span>
                  <button className="btn ghost sm" style={{ marginLeft: 'auto', borderColor: 'var(--acid)' }}>copy</button>
                </div>
                <div className="dim" style={{ fontSize: 11, marginTop: 10 }}>OpenAI · gpt-4o + whisper-1 · 25k tokens/min · do not share</div>
                <div style={{ display: 'flex', gap: 14, marginTop: 14 }}>
                  <div className="kv"><span className="k">model</span><span className="v">gpt-4o</span></div>
                  <div className="kv"><span className="k">used</span><span className="v">2,118 / 25,000</span></div>
                </div>
              </div>
            </div>

            {/* submissions */}
            <div className="panel">
              <div className="panel-head"><span>// submissions</span><span className="right dim">0 / 3 ADDED</span></div>
              <div style={{ padding: 18, display: 'grid', gap: 10 }}>
                {[
                ['github repo', 'github.com/altir/quotebot-techday', false, '+10'],
                ['demo video', 'add a 90-second loom or mp4', false, '+15'],
                ['presentation', 'figma, slides or pdf link', false, '+10']].
                map(([l, hint, done, pts], i) =>
                <div key={i} className="input" style={{ height: 'auto', padding: '10px 12px' }}>
                    <span className="prompt">▸</span>
                    <div style={{ flex: 1 }}>
                      <div className="label" style={{ fontSize: 9 }}>{l.toUpperCase()}</div>
                      <div className="dim" style={{ fontSize: 12 }}>{hint}</div>
                    </div>
                    <span className="pill acid">{pts}</span>
                  </div>
                )}
              </div>
            </div>

            {/* event points */}
            <div className="panel">
              <div className="panel-head"><span>// event points</span><span className="right acid">48 pts · rank 4</span></div>
              <div style={{ padding: 18 }}>
                {[
                ['Complete team formed', '+10', true],
                ['Different departments', '+5', true],
                ['Cross-function bonus (biz↔ops)', '+10', true],
                ['Idea submitted from bank', '+13', true],
                ['GitHub repo', '+10', false],
                ['README + setup notes', '+5', false],
                ['Demo video', '+15', false]].
                map(([l, p, on], i) =>
                <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '6px 0', borderBottom: i < 6 ? '1px solid var(--line)' : 0 }}>
                    <span className={on ? 'acid' : 'faint'} style={{ width: 14 }}>{on ? '✓' : '○'}</span>
                    <span style={{ fontSize: 12, color: on ? 'var(--text)' : 'var(--text-mute)' }}>{l}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: on ? 'var(--acid)' : 'var(--text-faint)', fontWeight: 700 }}>{p}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* activity / announcements row */}
          <div className="panel" style={{ padding: 0 }}>
            <div className="panel-head"><span>// live announcements</span><span className="right"><span className="dot live"></span><span className="dim">subscribed</span></span></div>
            <div style={{ padding: '12px 18px', display: 'grid', gap: 8 }}>
              {[
              ['14:32', 'KEYS RELEASED', 'all 12 keys unlocked. start hitting the api.', 'acid'],
              ['14:48', 'NORTHSTAR', 'first repo of the day — they\'re moving fast.', 'mute'],
              ['15:12', 'AUTOPILOT', 'first demo video uploaded — preview gallery is live.', 'mute']].
              map(([t, who, msg, c], i) =>
              <div key={i} style={{ display: 'flex', gap: 14, fontSize: 12, padding: '4px 0' }}>
                  <span className="mute" style={{ width: 42, fontVariantNumeric: 'tabular-nums' }}>{t}</span>
                  <span className={c} style={{ width: 130, fontWeight: 700 }}>{who}</span>
                  <span className="dim">{msg}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>);

}

function KeyRevealArtboard() {
  return (
    <div className="ab" style={{ width: 1440, height: 900 }}>
      <BrowserChrome url="techday.altir.internal/teams/quotebot/key" title="key reveal" right={<span style={{ color: 'var(--acid)' }}>● BUILD OPEN</span>} />
      <Topbar active="workspace" team={{ name: 'QUOTEBOT', hue: '#ff7ac6' }} countdown="02:59:48" phase="BUILD ENDS" />

      {/* dim background */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 45%, rgba(196,255,0,0.08), transparent 50%)', pointerEvents: 'none' }}></div>

      <div style={{ position: 'absolute', inset: '96px 36px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 28 }}>
        <div className="label" style={{ color: 'var(--acid)', fontSize: 12 }}># 14:30:01 · api key released for QUOTEBOT</div>
        <h1 style={{
          fontSize: 88, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--white)', lineHeight: 0.95
        }}>
          Your key is <span className="acid" style={{ textShadow: '0 0 40px var(--acid-glow)' }}>live</span>.<br />
          Three hours. Go.
        </h1>

        {/* the key */}
        <div className="panel" style={{
          padding: '24px 28px',
          border: '1px solid var(--acid)',
          background: '#000',
          boxShadow: '0 0 0 1px var(--acid), 0 0 60px var(--acid-glow), inset 0 0 32px rgba(196,255,0,0.06)',
          position: 'relative', maxWidth: 720, width: '100%'
        }}>
          <CornerCrop size={14} />
          <div className="label">PRELOADED · OPENAI · GPT-4o + WHISPER-1</div>
          <div style={{
            marginTop: 14, fontFamily: 'var(--mono)', fontSize: 28, fontWeight: 600,
            color: 'var(--acid)', letterSpacing: '0.04em', textShadow: '0 0 14px var(--acid-glow)',
            display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center'
          }}>
            <span>sk-aLT1r_QboTx48zX9_Nxx2yV4Mq3kQ7</span>
            <span className="caret" style={{ height: 28, width: 10 }}></span>
          </div>
          <div className="dim" style={{ marginTop: 12, fontSize: 12 }}>visible only to QUOTEBOT · never appears in public pages or TV mode</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'center' }}>
            <button className="btn acid">⎘ Copy key</button>
            <button className="btn ghost">View handbook</button>
            <button className="btn ghost">Rotation policy</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 32, fontSize: 12 }}>
          <div className="kv"><span className="k">budget</span><span className="v">25k tok/min · 1M tok session</span></div>
          <div className="kv"><span className="k">team only</span><span className="v">jordan.l, asha.v</span></div>
          <div className="kv"><span className="k">expires</span><span className="v">22 May 18:30</span></div>
        </div>

        {/* confetti at corners */}
        {[
        ['#c4ff00', 100, 200, '+'], ['#ff2bd6', 1280, 220, '×'], ['#00d4ff', 1320, 600, '◆'],
        ['#ffb020', 60, 600, '◆'], ['#9d6dff', 200, 320, '×'], ['#ff5a3c', 1180, 380, '+'],
        ['#00ff9d', 1340, 440, '×'], ['#fff200', 60, 460, '◆']].
        map(([c, x, y, g], i) =>
        <span key={i} style={{
          position: 'absolute', left: x, top: y, color: c, fontSize: 22,
          textShadow: `0 0 12px ${c}`
        }}>{g}</span>
        )}
      </div>
    </div>);

}

Object.assign(window, { WorkspaceArtboard, KeyRevealArtboard });


// ═══════════════════════════════════════════════════════════════
// screens-submit.jsx
// ═══════════════════════════════════════════════════════════════
// screens-submit.jsx — Final submission + post-deadline gallery

function FinalSubmitArtboard() {
  return (
    <div className="ab" style={{ width: 1440, height: 900 }}>
      <BrowserChrome url="techday.altir.internal/teams/quotebot/submit" title="final submission" />
      <Topbar active="submit" team={{ name: 'QUOTEBOT', hue: '#ff7ac6' }} countdown="00:08:21" phase="DEADLINE IN" />

      <div style={{ position: 'absolute', inset: '96px 36px 36px', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 22 }}>
        <div>
          <SectionTitle kicker="step 04 / submit before 17:30"
          right={<span className="pill warn"><span className="dot warn"></span>WINDOW CLOSES 17:30 · BONUS BEFORE 17:00</span>}>
            Lock in your final assets.
          </SectionTitle>

          <div className="panel" style={{ padding: 22, display: 'grid', gap: 14 }}>
            {[
            { l: 'GITHUB REPO', v: 'github.com/altir/quotebot-techday', state: 'ok', pts: '+10', hint: 'public or org-readable · main branch demoable' },
            { l: 'README + SETUP', v: 'detected: README.md · setup-notes.md', state: 'ok', pts: '+5', hint: 'how to run it in <5 min' },
            { l: 'DEMO VIDEO', v: 'loom.com/share/9b3f7c2e-quotebot-demo', state: 'ok', pts: '+15', hint: '90s max · narrate the build, not the slides' },
            { l: 'PRESENTATION', v: 'figma.com/proto/QB-techday-deck', state: 'ok', pts: '+10', hint: 'optional but recommended for judges' },
            { l: 'TECH STACK TAGS', v: 'Next.js · OpenAI · Whisper · Vercel · Replit', state: 'ok', pts: '—', hint: 'comma-separate · no restrictions' }].
            map((f, i) =>
            <div key={i} className="input" style={{ height: 'auto', padding: '12px 14px', gap: 14 }}>
                <span className={f.state === 'ok' ? 'acid' : 'mute'} style={{ fontWeight: 700 }}>{f.state === 'ok' ? '✓' : '▸'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="label" style={{ fontSize: 10 }}>{f.l}</div>
                  <div style={{ color: 'var(--white)', marginTop: 4, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.v}</div>
                  <div className="dim" style={{ fontSize: 11, marginTop: 2 }}>{f.hint}</div>
                </div>
                <span className={f.pts === '—' ? 'pill ghost' : 'pill acid'}>{f.pts}</span>
                <button className="btn ghost sm">edit</button>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
            <div className="panel" style={{ padding: 16 }}>
              <div className="label">FINAL SUBMISSION STATE</div>
              <div className="bold acid" style={{ fontSize: 22, marginTop: 6 }}>READY · 4 / 4 fields</div>
              <div className="dim" style={{ fontSize: 11, marginTop: 4 }}>auto-saved at 16:51:12 · can re-edit until 17:30</div>
            </div>
            <div className="panel" style={{ padding: 16 }}>
              <div className="label">BONUS WINDOW</div>
              <div className="bold" style={{ fontSize: 22, marginTop: 6, color: 'var(--warn)' }}>SUBMIT BEFORE 17:00 → +10</div>
              <div className="bar" style={{ marginTop: 10 }}><i style={{ width: '82%', background: 'var(--warn)' }}></i></div>
            </div>
          </div>
        </div>

        {/* RIGHT — preview + cta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="panel" style={{ padding: 22, position: 'relative' }}>
            <CornerCrop size={10} color="#ff7ac6" />
            <div className="label" style={{ color: '#ff7ac6' }}># public card preview</div>
            <div style={{
              marginTop: 14, padding: 16, background: 'var(--bg)', border: '1px solid var(--line-2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="team-tag" style={{ '--team': '#ff7ac6' }}><span className="swatch"></span>QUOTEBOT</span>
                <span className="dim" style={{ fontSize: 11 }}>BIZ × OPS</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--white)', marginTop: 12, lineHeight: 1.25 }}>
                Slide composer from raw meeting transcripts
              </div>
              <p className="dim" style={{ fontSize: 12, marginTop: 8 }}>
                Drop in a call recording → get back an 8-slide pre-sales deck with speaker notes.
              </p>
              <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                {['Next.js', 'OpenAI', 'Whisper', 'Vercel'].map((s) => <span key={s} className="pill ghost">{s}</span>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, marginTop: 14 }}>
                {['Repo', 'Demo', 'Deck'].map((s) =>
                <span key={s} style={{ display: 'grid', placeItems: 'center', height: 30, border: '1px solid var(--line-2)', fontSize: 11, fontWeight: 700 }}>{s}</span>
                )}
              </div>
            </div>
            <div className="dim" style={{ fontSize: 11, marginTop: 10 }}>this card appears in the public gallery after 17:30</div>
          </div>

          <div className="panel" style={{ padding: 22 }}>
            <div className="label">EVENT POINTS SUMMARY</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
              <span className="acid" style={{ fontSize: 48, fontWeight: 700, textShadow: '0 0 24px var(--acid-glow)' }}>113</span>
              <span className="dim">/ 138 max · rank 4 of 12</span>
            </div>
            <div className="bar" style={{ marginTop: 12 }}><i style={{ width: '82%' }}></i></div>
            <div className="dim" style={{ fontSize: 11, marginTop: 8 }}>+10 still available if you finalize before 17:00</div>
          </div>

          <button className="btn acid lg">▸ FINALIZE & SUBMIT</button>
          <span className="dim" style={{ fontSize: 11, textAlign: 'center' }}>you can still edit · finalize unlocks the +10 early bird bonus</span>
        </div>
      </div>
    </div>);

}

function GalleryArtboard() {
  const cards = window.TEAMS.slice(0, 9);
  return (
    <div className="ab" style={{ width: 1440, height: 900 }}>
      <BrowserChrome url="techday.altir.internal/gallery" title="all submissions" right={<span className="dim">12 / 12 SUBMITTED</span>} />
      <Topbar active="gallery" team={{ name: 'QUOTEBOT', hue: '#ff7ac6' }} countdown="00:00:00" phase="GALLERY LIVE" />

      <div style={{ position: 'absolute', inset: '96px 36px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 16 }}>
          <div>
            <div className="label" style={{ color: 'var(--acid)' }}># /gallery · published 17:30:00</div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--white)', marginTop: 6, letterSpacing: '-0.01em' }}>
              Twelve teams. Twelve shipped builds.
            </h2>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <div className="input" style={{ width: 240, height: 36 }}>
              <span className="prompt">⌕</span>
              <span className="dim">search teams, stack, ideas</span>
            </div>
            <span className="pill">DEPT · ALL</span>
            <span className="pill">STACK · ALL</span>
            <span className="pill acid">SORT: NEWEST</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {cards.map((t, i) =>
          <div key={t.id} className="panel" style={{ padding: 18, position: 'relative', minHeight: 220 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: t.hue, boxShadow: `0 0 12px ${t.hue}` }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="team-tag" style={{ '--team': t.hue }}><span className="swatch"></span>{t.name}</span>
                <span className="dim" style={{ fontSize: 11 }}>{t.depts.join(' × ').toUpperCase()}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--white)', marginTop: 12, lineHeight: 1.3 }}>{t.idea}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                {['Python', 'OpenAI', t.depts[0]].map((s, j) => <span key={j} className="pill ghost">{s}</span>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginTop: 14 }}>
                {['REPO', 'DEMO', 'DECK'].map((s) =>
              <span key={s} style={{ display: 'grid', placeItems: 'center', height: 28, border: '1px solid var(--line-2)', fontSize: 10, fontWeight: 700, color: 'var(--text)' }}>{s} →</span>
              )}
              </div>
              <div className="dim" style={{ fontSize: 10, marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <span>{t.members.join(' + ')}</span>
                <span>{i % 3 === 0 ? '17:24' : i % 3 === 1 ? '17:18' : '17:09'}</span>
              </div>
            </div>
          )}
        </div>

        <div className="dim" style={{ fontSize: 11, marginTop: 14, display: 'flex', justifyContent: 'space-between' }}>
          <span>API keys, audit notes and judge drafts stay private. Public viewers see this same gallery.</span>
          <span>showing 9 of 12 · scroll for more</span>
        </div>
      </div>
    </div>);

}

Object.assign(window, { FinalSubmitArtboard, GalleryArtboard });


// ═══════════════════════════════════════════════════════════════
// screens-live.jsx
// ═══════════════════════════════════════════════════════════════
// screens-live.jsx — Participant leaderboard + TV / Live Energy display

function LeaderboardArtboard() {
  const ranked = [
  { ...window.TEAMS[5], pts: 128, judge: 84, delta: '+2' }, // autopilot
  { ...window.TEAMS[0], pts: 124, judge: 88, delta: '0' }, // nova
  { ...window.TEAMS[4], pts: 119, judge: 81, delta: '+1' }, // growthhack
  { ...window.TEAMS[1], pts: 113, judge: 79, delta: '-1' }, // promptops
  { ...window.TEAMS[7], pts: 113, judge: 78, delta: '+3' }, // quotebot
  { ...window.TEAMS[2], pts: 108, judge: 80, delta: '-2' }, // claimcraft
  { ...window.TEAMS[9], pts: 102, judge: 76, delta: '0' }, // hotfix
  { ...window.TEAMS[6], pts: 98, judge: 74, delta: '+1' }, // bigcanvas
  { ...window.TEAMS[3], pts: 91, judge: 71, delta: '-1' }, // pixeldesk
  { ...window.TEAMS[11], pts: 88, judge: 70, delta: '+2' }, // northstar
  { ...window.TEAMS[8], pts: 82, judge: 66, delta: '-3' }, // underwrite
  { ...window.TEAMS[10], pts: 71, judge: 63, delta: '0' } // kickoff
  ];
  return (
    <div className="ab" style={{ width: 1440, height: 900 }}>
      <BrowserChrome url="techday.altir.internal/leaderboard" title="live energy" right={<span style={{ color: 'var(--acid)' }}>● LIVE · UPDATED 16:48:09</span>} />
      <Topbar active="leaderboard" team={{ name: 'QUOTEBOT', hue: '#ff7ac6' }} countdown="00:41:12" phase="DEMOS IN" />

      <div style={{ position: 'absolute', inset: '96px 36px 36px', display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 22 }}>
        <div>
          <SectionTitle kicker="live · participant view"
          right={<span style={{ display: 'flex', gap: 6 }}><span className="pill acid">EVENT · 40%</span><span className="pill">JUDGE · 60%</span></span>}>
            Live energy leaderboard.
          </SectionTitle>

          <div className="panel" style={{ padding: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1.6fr 1fr 1fr 1fr 60px', padding: '10px 14px', borderBottom: '1px solid var(--line)', fontSize: 10, color: 'var(--text-mute)', letterSpacing: '0.12em' }}>
              <span>#</span><span>TEAM</span><span>EVENT PTS</span><span>JUDGE</span><span>BLENDED</span><span style={{ textAlign: 'right' }}>Δ</span>
            </div>
            {ranked.map((t, i) => {
              const blended = Math.round(t.judge * 0.6 + t.pts / 138 * 100 * 0.4);
              const isYou = t.id === 'quotebot';
              return (
                <div key={t.id} style={{
                  display: 'grid', gridTemplateColumns: '40px 1.6fr 1fr 1fr 1fr 60px',
                  padding: '10px 14px', alignItems: 'center',
                  borderBottom: i < 11 ? '1px solid var(--line)' : 0,
                  background: isYou ? 'var(--acid-soft)' : 'transparent',
                  borderLeft: isYou ? '2px solid var(--acid)' : '2px solid transparent'
                }}>
                  <span style={{ fontWeight: 700, color: i < 3 ? t.hue : 'var(--text-mute)', textShadow: i < 3 ? `0 0 10px ${t.hue}` : 'none' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 8, height: 8, background: t.hue, boxShadow: `0 0 8px ${t.hue}` }}></span>
                    <span className="bold" style={{ color: 'var(--white)' }}>{t.name}</span>
                    {isYou && <span className="pill acid">YOU</span>}
                    <span className="dim" style={{ fontSize: 11 }}>· {t.depts.join('×')}</span>
                  </span>
                  <span>
                    <span className="bold" style={{ color: 'var(--white)' }}>{t.pts}</span>
                    <span className="dim" style={{ fontSize: 10, marginLeft: 4 }}>/138</span>
                  </span>
                  <span>
                    <span className="bold" style={{ color: 'var(--white)' }}>{t.judge}</span>
                    <span className="dim" style={{ fontSize: 10, marginLeft: 4 }}>/100</span>
                  </span>
                  <span style={{ position: 'relative' }}>
                    <span className="bold acid" style={{ textShadow: '0 0 8px var(--acid-glow)' }}>{blended}.{Math.floor(Math.random() * 9)}</span>
                    <div className="bar" style={{ marginTop: 4, width: 120 }}><i style={{ width: `${blended}%` }}></i></div>
                  </span>
                  <span style={{
                    textAlign: 'right', fontWeight: 700,
                    color: t.delta.startsWith('+') ? 'var(--acid)' : t.delta.startsWith('-') ? 'var(--danger)' : 'var(--text-mute)'
                  }}>{t.delta === '0' ? '—' : t.delta}</span>
                </div>);

            })}
          </div>

          <div className="ascii" style={{ marginTop: 10 }}>{'─'.repeat(80)}</div>
          <div className="dim" style={{ fontSize: 11, marginTop: 6 }}>
            blended = (judge × 0.60) + (event × 0.40) · admins can tune 35-40% on event weight · judge draft scores excluded
          </div>
        </div>

        {/* RIGHT — feed + breakdowns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="panel" style={{ padding: 18 }}>
            <div className="label">YOUR POSITION</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 6 }}>
              <span style={{ fontSize: 56, fontWeight: 700, color: '#ff7ac6', textShadow: '0 0 24px rgba(255,122,198,0.5)', letterSpacing: '-0.03em' }}>05</span>
              <span className="dim">of 12 · +3 since 16:00</span>
            </div>
            <div className="bar" style={{ marginTop: 10 }}><i style={{ width: '58%', background: '#ff7ac6' }}></i></div>
            <div className="dim" style={{ fontSize: 11, marginTop: 6 }}>5 pts behind PROMPTOPS · catch up by finalizing before 17:00</div>
          </div>

          <div className="panel">
            <div className="panel-head"><span>// live feed</span><span className="right"><span className="dot live"></span><span className="dim">streaming</span></span></div>
            <div style={{ padding: '8px 14px 14px', maxHeight: 320, overflow: 'hidden' }}>
              {[
              ['16:48', 'AUTOPILOT', 'demo video uploaded', '+15', 'acid'],
              ['16:46', 'JUDGE · MAYA', 'draft score: NORTHSTAR · 82/100', '—', 'mute'],
              ['16:42', 'QUOTEBOT', 'repo submitted github.com/altir/quotebot', '+10', 'acid'],
              ['16:39', 'HOTFIX', 'changed idea to "stack-trace narrator"', '—', 'mute'],
              ['16:35', 'PIXELDESK', 'README + setup notes', '+5', 'acid'],
              ['16:30', 'CLAIMCRAFT', 'team formed (late, admin override)', '+10', 'warn'],
              ['16:28', 'BIGCANVAS', 'demo video uploaded', '+15', 'acid'],
              ['16:20', 'JUDGE · SAM', 'submitted scores for 4 teams', '—', 'mute']].
              map(([t, who, msg, pts, c], i) =>
              <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: i < 7 ? '1px solid var(--line)' : 0, alignItems: 'center', fontSize: 11.5 }}>
                  <span className="mute" style={{ width: 38, fontVariantNumeric: 'tabular-nums' }}>{t}</span>
                  <span className={c} style={{ width: 110, fontWeight: 700 }}>{who}</span>
                  <span className="dim" style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg}</span>
                  {pts !== '—' && <span className="pill acid" style={{ fontSize: 9 }}>{pts}</span>}
                </div>
              )}
            </div>
          </div>

          <div className="panel" style={{ padding: 18 }}>
            <div className="label" style={{ marginBottom: 10 }}>PROGRESS · COHORT</div>
            {[
            ['Teams formed', '12 / 12'],
            ['Ideas submitted', '12 / 12'],
            ['Repos added', '11 / 12'],
            ['Demos ready', '9 / 12'],
            ['Decks ready', '10 / 12'],
            ['Judges done', '2 / 4']].
            map(([l, v], i) =>
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 5 ? '1px solid var(--line)' : 0, fontSize: 12 }}>
                <span className="dim">{l}</span>
                <span className="bold" style={{ color: v.split(' / ')[0] === v.split(' / ')[1] ? 'var(--acid)' : 'var(--text)' }}>{v}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>);

}

function TVArtboard() {
  const top5 = [
  { ...window.TEAMS[5], pts: 128 },
  { ...window.TEAMS[0], pts: 124 },
  { ...window.TEAMS[4], pts: 119 },
  { ...window.TEAMS[1], pts: 113 },
  { ...window.TEAMS[7], pts: 113 }];

  return (
    <div className="ab" style={{ width: 1920, height: 1080 }}>
      <div className="ab-grid" style={{ backgroundSize: '64px 64px' }}></div>

      {/* big chrome top */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 24, padding: '24px 36px', borderBottom: '1px solid var(--line)'
      }}>
        <span style={{ width: 48, height: 48, display: 'grid', placeItems: 'center', background: 'var(--acid)', color: '#000', fontWeight: 900, fontSize: 28, boxShadow: '0 0 28px var(--acid-glow)' }}>A</span>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.16em', color: 'var(--white)' }}>ALTIR // TECH DAY 2026</div>
          <div className="dim" style={{ fontSize: 13, letterSpacing: '0.16em' }}>22 MAY · HQ + REMOTE · #techday-live</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 24 }}>
          <span className="dim" style={{ fontSize: 14, letterSpacing: '0.18em' }}>BUILD ENDS IN</span>
          <span style={{ fontSize: 80, fontWeight: 700, color: 'var(--acid)', textShadow: '0 0 32px var(--acid-glow)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>00:41:12</span>
          <span className="dot live" style={{ width: 18, height: 18 }}></span>
        </div>
      </div>

      <div style={{ padding: '28px 36px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        {/* leaderboard */}
        <div className="panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div className="label" style={{ fontSize: 14, color: 'var(--acid)' }}># LIVE ENERGY · TOP 5 OF 12</div>
            <span className="dim" style={{ fontSize: 13 }}>refreshes every 15s</span>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {top5.map((t, i) =>
            <div key={t.id} style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 220px',
              alignItems: 'center', gap: 24,
              padding: '18px 22px',
              background: 'var(--panel-2)',
              border: i === 0 ? '1px solid var(--acid)' : '1px solid var(--line)',
              boxShadow: i === 0 ? '0 0 0 1px var(--acid), 0 0 36px var(--acid-glow)' : 'none'
            }}>
                <span style={{ fontSize: 38, fontWeight: 700, color: i === 0 ? 'var(--acid)' : t.hue, letterSpacing: '-0.04em', textShadow: `0 0 16px ${i === 0 ? 'var(--acid)' : t.hue}` }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--white)', letterSpacing: '0.04em' }}>{t.name}</div>
                  <div className="dim" style={{ fontSize: 14, marginTop: 4, letterSpacing: '0.12em' }}>{t.members.join('  +  ')}  ·  {t.depts.join(' × ')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 48, fontWeight: 700, color: t.hue, textShadow: `0 0 20px ${t.hue}`, lineHeight: 1, letterSpacing: '-0.02em' }}>{t.pts}</div>
                  <div className="dim" style={{ fontSize: 12, marginTop: 4, letterSpacing: '0.16em' }}>EVENT POINTS</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* progress + announcements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="panel" style={{ padding: 24 }}>
            <div className="label" style={{ fontSize: 14, color: 'var(--acid)', marginBottom: 16 }}># COHORT PROGRESS</div>
            {[
            ['TEAMS FORMED', 12, 12],
            ['IDEAS SUBMITTED', 12, 12],
            ['REPOS ADDED', 11, 12],
            ['DEMOS READY', 9, 12],
            ['DECKS READY', 10, 12]].
            map(([l, n, d], i) =>
            <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                  <span className="dim" style={{ letterSpacing: '0.14em' }}>{l}</span>
                  <span className="bold" style={{ color: n === d ? 'var(--acid)' : 'var(--white)' }}>{n} / {d}</span>
                </div>
                <div className="bar" style={{ height: 6 }}><i style={{ width: `${n / d * 100}%`, background: n === d ? 'var(--acid)' : '#ff7ac6' }}></i></div>
              </div>
            )}
          </div>

          <div className="panel" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div className="label" style={{ fontSize: 14, color: 'var(--acid)' }}># ANNOUNCEMENTS</div>
              <span className="dot live"></span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              <span className="acid">▸</span> Snack run at 16:00.<br />
              <span className="acid">▸</span> Final demos start <span className="acid">17:30 sharp</span>.<br />
              <span className="acid">▸</span> Submit early before 17:00 for +10.
            </div>
          </div>

          <div className="panel" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
            <span className="dot live" style={{ width: 14, height: 14 }}></span>
            <div style={{ flex: 1, fontSize: 18 }}>
              <span className="dim">latest:</span> <span className="bold" style={{ color: 'var(--white)' }}>AUTOPILOT</span> <span className="acid">+15</span> <span className="dim">demo video uploaded</span>
            </div>
            <span className="dim" style={{ fontSize: 14 }}>16:48</span>
          </div>
        </div>
      </div>

      {/* ticker */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 56,
        background: 'var(--acid)', color: '#000',
        display: 'flex', alignItems: 'center', gap: 40,
        padding: '0 36px', fontSize: 18, fontWeight: 700, letterSpacing: '0.1em',
        whiteSpace: 'nowrap', overflow: 'hidden'
      }}>
        <span style={{ background: '#000', color: 'var(--acid)', padding: '8px 14px', letterSpacing: '0.2em' }}>● LIVE</span>
        <span>AUTOPILOT moves to #1</span><span>●</span>
        <span>NOVA holds judge favourite at 88/100</span><span>●</span>
        <span>9 of 12 demos uploaded</span><span>●</span>
        <span>Build closes in 00:41:12</span><span>●</span>
        <span>Winners announced 18:30 sharp</span>
      </div>
    </div>);

}

Object.assign(window, { LeaderboardArtboard, TVArtboard });


// ═══════════════════════════════════════════════════════════════
// screens-judge.jsx
// ═══════════════════════════════════════════════════════════════
// screens-judge.jsx — Judge scoring console + final results / winners reveal

function JudgeArtboard() {
  const criteria = [
  { k: 'INNOVATION', v: 88, n: 'How novel is the idea or approach?' },
  { k: 'BUSINESS USEFULNESS', v: 82, n: 'Could Altir actually use this?' },
  { k: 'EXECUTION', v: 76, n: 'Does it work end-to-end in 3 hours?' },
  { k: 'DEMO QUALITY', v: 91, n: 'Is the demo clear and tight?' },
  { k: 'PRESENTATION', v: 84, n: 'Does the pitch land?' }];

  return (
    <div className="ab" style={{ width: 1440, height: 900 }}>
      <BrowserChrome url="techday.altir.internal/judge/quotebot" title="judge console" right={<span className="dim">JUDGE · MAYA R.</span>} />

      {/* judge mode topbar — different accent treatment */}
      <div className="topbar">
        <div className="brand">
          <span className="brand-mark" style={{ background: '#ff7ac6', color: '#000' }}>J</span>
          <span>
            <span className="brand-name">JUDGE CONSOLE</span>
            <span className="brand-event" style={{ marginLeft: 8 }}>// signed in as maya.r</span>
          </span>
        </div>
        <div className="topbar-nav">
          {['Queue · 12', 'Drafts · 3', 'Submitted · 5', 'Help'].map((l, i) =>
          <a key={i} className={i === 0 ? 'is-active' : ''}>{l}</a>
          )}
        </div>
        <div className="topbar-right">
          <span className="pill warn"><span className="dot warn"></span>4 OF 12 TEAMS LEFT</span>
        </div>
      </div>

      <div style={{ position: 'absolute', inset: '96px 24px 24px', display: 'grid', gridTemplateColumns: '240px 1fr 320px', gap: 14 }}>
        {/* queue */}
        <div className="panel" style={{ padding: 12, alignSelf: 'start' }}>
          <div className="label" style={{ padding: '4px 6px 8px' }}>QUEUE · 12 TEAMS</div>
          {window.TEAMS.slice(0, 8).map((t, i) => {
            const states = ['done', 'done', 'done', 'done', 'active', 'draft', 'todo', 'todo'];
            const s = states[i];
            return (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px', borderRadius: 3,
                background: s === 'active' ? 'var(--panel-3)' : 'transparent',
                borderLeft: s === 'active' ? `2px solid ${t.hue}` : '2px solid transparent',
                fontSize: 12
              }}>
                <span style={{ width: 8, height: 8, background: t.hue }}></span>
                <span className="bold" style={{ color: s === 'todo' ? 'var(--text-dim)' : 'var(--white)', flex: 1 }}>{t.name}</span>
                <span style={{ fontSize: 10, color: s === 'done' ? 'var(--acid)' : s === 'draft' ? 'var(--warn)' : s === 'active' ? '#ff7ac6' : 'var(--text-faint)' }}>
                  {s === 'done' ? '✓' : s === 'draft' ? '◐' : s === 'active' ? '▸' : '○'}
                </span>
              </div>);

          })}
          <div className="ascii" style={{ padding: '8px 6px 4px' }}>{'─'.repeat(28)}</div>
          <div className="kv" style={{ padding: 6 }}><span className="k">submitted</span><span className="v acid">5</span></div>
          <div className="kv" style={{ padding: 6 }}><span className="k">drafts</span><span className="v warn">3</span></div>
          <div className="kv" style={{ padding: 6 }}><span className="k">remaining</span><span className="v">4</span></div>
        </div>

        {/* main scoring */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <div className="panel" style={{ padding: 20, position: 'relative' }}>
            <CornerCrop size={10} color="#ff7ac6" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 14, height: 14, background: '#ff7ac6', boxShadow: '0 0 14px #ff7ac6' }}></span>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--white)', letterSpacing: '0.04em' }}>QUOTEBOT</h2>
              <span className="pill">BIZ × OPS</span>
              <span className="pill ghost">jordan.l · asha.v</span>
              <span className="dim" style={{ marginLeft: 'auto', fontSize: 11 }}>5 of 12 · ← prev · next →</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--white)', marginTop: 14, lineHeight: 1.3 }}>Slide composer from raw meeting transcripts</div>
            <p className="dim" style={{ marginTop: 6, fontSize: 13 }}>
              Drop in a call recording → get back an 8-slide pre-sales deck with speaker notes. Pulls from Gong / Granola.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
              {['▶ Demo video · 1:24', '⌥ GitHub repo', '◫ Presentation · 6 slides'].map((s, i) =>
              <button key={i} className="btn sm" style={{ justifyContent: 'flex-start' }}>{s}</button>
              )}
            </div>
          </div>

          <div className="panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="label">YOUR SCORES · 0–100 PER CRITERION</div>
              <span className="pill warn">● DRAFT · AUTOSAVED 17:42:01</span>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              {criteria.map((c, i) =>
              <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div>
                      <span className="bold" style={{ color: 'var(--white)' }}>{c.k}</span>
                      <span className="dim" style={{ marginLeft: 10, fontSize: 11 }}>{c.n}</span>
                    </div>
                    <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--acid)', textShadow: '0 0 12px var(--acid-glow)', fontVariantNumeric: 'tabular-nums' }}>{c.v}</span>
                  </div>
                  <div style={{ position: 'relative', height: 8, background: 'var(--panel-3)' }}>
                    <div style={{ position: 'absolute', inset: 0, width: `${c.v}%`, background: 'var(--acid)', boxShadow: '0 0 12px var(--acid-glow)' }}></div>
                    <div style={{ position: 'absolute', top: -4, left: `calc(${c.v}% - 5px)`, width: 10, height: 16, background: 'var(--white)', boxShadow: '0 0 8px var(--acid-glow)' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10 }}>
                    <span className="faint">0 · weak</span>
                    <span className="faint">50 · solid</span>
                    <span className="faint">100 · best in show</span>
                  </div>
                </div>
              )}
            </div>
            <div style={{ marginTop: 16, padding: 12, background: 'var(--panel-2)', border: '1px solid var(--line-2)' }}>
              <div className="label" style={{ marginBottom: 6 }}>NOTES TO ORGANIZERS · OPTIONAL</div>
              <div className="dim" style={{ fontSize: 12 }}>
                Strong demo, the deck is the weakest link. The "auto-narrate" pivot in the last 30 min sold me — judges should ask about it.
                <span className="caret" style={{ verticalAlign: 'middle' }}></span>
              </div>
            </div>
          </div>
        </div>

        {/* right rail — summary + actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="panel" style={{ padding: 18 }}>
            <div className="label">YOUR COMPOSITE</div>
            <div style={{ fontSize: 56, fontWeight: 700, color: 'var(--acid)', textShadow: '0 0 24px var(--acid-glow)', letterSpacing: '-0.03em', marginTop: 6 }}>84.2</div>
            <div className="dim" style={{ fontSize: 11, marginTop: 4 }}>avg of 5 criteria · weight 1.0 across</div>
            <div className="ascii" style={{ margin: '12px 0 8px' }}>{'─'.repeat(28)}</div>
            <div className="kv"><span className="k">other judges</span><span className="v">3 submitted · 0 drafts</span></div>
            <div className="kv" style={{ marginTop: 4 }}><span className="k">team event pts</span><span className="v">113 / 138</span></div>
            <div className="kv" style={{ marginTop: 4 }}><span className="k">projected blend</span><span className="v acid">83.4</span></div>
          </div>

          <div className="panel" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn acid">▸ Submit final score</button>
            <button className="btn">Save draft</button>
            <button className="btn ghost sm">Flag for admin</button>
          </div>

          <div className="panel" style={{ padding: 14, fontSize: 11 }}>
            <div className="label" style={{ marginBottom: 8 }}>RULES</div>
            <div className="dim" style={{ lineHeight: 1.6 }}>
              · Score every team you watch live.<br />
              · Drafts auto-save every 5s.<br />
              · After submit, admin can override with audit note.<br />
              · Bias check: rotate order each judge.
            </div>
          </div>
        </div>
      </div>
    </div>);

}

function ResultsArtboard() {
  return (
    <div className="ab" style={{ width: 1440, height: 900 }}>
      <BrowserChrome url="techday.altir.internal/results" title="winners" right={<span style={{ color: 'var(--acid)' }}>● PUBLISHED 18:30:00</span>} />
      <Topbar active="leaderboard" countdown="WRAP" phase="EVENT" />

      {/* confetti */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[
        ['#c4ff00', 80, 200, '+'], ['#ff2bd6', 1240, 240, '×'], ['#00d4ff', 1340, 620, '◆'],
        ['#ffb020', 80, 620, '◆'], ['#9d6dff', 980, 260, '×'], ['#ff5a3c', 720, 110, '+'],
        ['#00ff9d', 180, 130, '◆'], ['#ff7ac6', 1180, 460, '×'], ['#c4ff00', 1300, 130, '+'],
        ['#fff200', 60, 460, '×'], ['#00aaff', 60, 800, '◆'], ['#ff4d4d', 1340, 820, '+'],
        ['#c4ff00', 760, 760, '×'], ['#00d4ff', 360, 760, '+'], ['#ff2bd6', 1060, 800, '◆']].
        map(([c, x, y, g], i) =>
        <span key={i} style={{
          position: 'absolute', left: x, top: y, color: c, fontSize: 24, textShadow: `0 0 10px ${c}`
        }}>{g}</span>
        )}
      </div>

      <div style={{ position: 'absolute', inset: '96px 36px 36px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div className="label" style={{ color: 'var(--acid)' }}># tech day 2026 · final standings</div>
          <h1 style={{ fontSize: 80, fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.04em', lineHeight: 0.95, marginTop: 10 }}>
            That's a <span className="acid" style={{ textShadow: '0 0 36px var(--acid-glow)' }}>wrap</span>.
          </h1>
          <p className="dim" style={{ marginTop: 12, fontSize: 15, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
            12 teams shipped. 14,612 lines of code. 23 API key rotations. One winner on the night, eleven things we'll keep building Monday.
          </p>
        </div>

        {/* podium */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1fr', gap: 14, alignItems: 'end', marginBottom: 18 }}>
          {[
          { rank: 2, t: window.TEAMS[0], score: 87.4, h: 220 },
          { rank: 1, t: window.TEAMS[5], score: 91.8, h: 300 },
          { rank: 3, t: window.TEAMS[4], score: 84.6, h: 180 }].
          map((p, i) =>
          <div key={p.rank} className="panel" style={{
            padding: 22, height: p.h, position: 'relative',
            borderColor: p.rank === 1 ? 'var(--acid)' : 'var(--line)',
            boxShadow: p.rank === 1 ? '0 0 0 1px var(--acid), 0 0 48px var(--acid-glow)' : 'none',
            background: 'var(--panel)'
          }}>
              <CornerCrop size={12} color={p.rank === 1 ? 'var(--acid)' : p.t.hue} />
              <div className="label" style={{ color: p.rank === 1 ? 'var(--acid)' : 'var(--text-mute)' }}>
                # {p.rank === 1 ? 'FIRST PLACE · OVERALL' : p.rank === 2 ? 'SECOND' : 'THIRD'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                <span style={{ width: 14, height: 14, background: p.t.hue, boxShadow: `0 0 14px ${p.t.hue}` }}></span>
                <span style={{
                fontSize: p.rank === 1 ? 36 : 26, fontWeight: 700, color: 'var(--white)', letterSpacing: '0.04em',
                textShadow: p.rank === 1 ? `0 0 18px ${p.t.hue}` : 'none'
              }}>{p.t.name}</span>
              </div>
              <div className="dim" style={{ fontSize: 12, marginTop: 6 }}>{p.t.members.join(' + ')} · {p.t.depts.join(' × ')}</div>
              <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text)' }}>{p.t.idea}</div>
              <div style={{ position: 'absolute', bottom: 18, left: 22, right: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="dim" style={{ fontSize: 11 }}>BLENDED</span>
                <span style={{
                fontSize: p.rank === 1 ? 56 : 36, fontWeight: 700,
                color: p.rank === 1 ? 'var(--acid)' : p.t.hue,
                textShadow: p.rank === 1 ? '0 0 24px var(--acid-glow)' : `0 0 14px ${p.t.hue}`,
                letterSpacing: '-0.03em'
              }}>{p.score}</span>
              </div>
            </div>
          )}
        </div>

        {/* special awards row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
          { award: 'JUDGES\' CHOICE', t: 'NOVA', sub: 'highest judge avg · 88.6', hue: '#c4ff00' },
          { award: 'PEOPLE\'S CHOICE', t: 'AUTOPILOT', sub: '42 reactions in TV mode', hue: '#ff5a3c' },
          { award: 'FASTEST SHIP', t: 'NORTHSTAR', sub: 'first repo at 14:48', hue: '#ff8a00' },
          { award: 'CROSS-FUNCTIONAL CUP', t: 'QUOTEBOT', sub: 'biz × ops · highest delta', hue: '#ff7ac6' }].
          map((a, i) =>
          <div key={i} className="panel" style={{ padding: 14, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: a.hue }}></div>
              <div className="label" style={{ fontSize: 9 }}>★ {a.award}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: a.hue, marginTop: 8, letterSpacing: '0.04em' }}>{a.t}</div>
              <div className="dim" style={{ fontSize: 11, marginTop: 4 }}>{a.sub}</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 22 }}>
          <button className="btn acid lg">▸ Export full standings (CSV)</button>
          <button className="btn lg ghost">View full leaderboard</button>
          <button className="btn lg ghost">Open gallery</button>
        </div>
      </div>
    </div>);

}

Object.assign(window, { JudgeArtboard, ResultsArtboard });


// ═══════════════════════════════════════════════════════════════
// screens-admin.jsx
// ═══════════════════════════════════════════════════════════════
// screens-admin.jsx — Admin console, API keys table, Scoring mechanics

function AdminTopbar({ active = 'console' }) {
  const items = [
    ['console', 'Console'],
    ['teams',   'Teams · 12'],
    ['keys',    'Keys · 14'],
    ['scoring', 'Scoring'],
    ['judges',  'Judges · 4'],
    ['audit',   'Audit'],
  ];
  return (
    <div className="topbar">
      <div className="brand">
        <span className="brand-mark" style={{ background: '#ff2bd6', color: '#000', boxShadow: '0 0 14px rgba(255,43,214,0.5)' }}>A</span>
        <span>
          <span className="brand-name">ADMIN · COMMAND</span>
          <span className="brand-event" style={{ marginLeft: 8 }}>// root.altir@techday</span>
        </span>
      </div>
      <div className="topbar-nav">
        {items.map(([k, l]) => (
          <a key={k} className={k === active ? 'is-active' : ''}>{l}</a>
        ))}
      </div>
      <div className="topbar-right">
        <span className="pill" style={{ color: '#ff2bd6', borderColor: 'rgba(255,43,214,0.4)' }}>
          <span className="dot" style={{ background: '#ff2bd6', boxShadow: '0 0 8px rgba(255,43,214,0.5)' }}></span>
          ROLE · ADMIN
        </span>
        <span className="countdown">
          <i className="blip"></i>
          <span>BUILD ENDS IN</span>
          <b>02:14:08</b>
        </span>
        <span className="dim">root.altir</span>
      </div>
    </div>
  );
}

function AdminConsoleArtboard() {
  const rows = window.TEAMS.map((t, i) => {
    const events = [128, 124, 119, 113, 113, 108, 102, 98, 91, 88, 82, 71];
    const judges = [84, 88, 81, 79, 78, 80, 76, 74, 71, 70, 66, 63];
    const keys = ['live','live','live','live','live','live','live','live','live','rotated','live','revoked'];
    const ideas = ['locked','locked','locked','locked','locked','locked','locked','locked','locked','locked','locked','locked'];
    const subs = ['3/3','2/3','3/3','3/3','2/3','3/3','2/3','3/3','1/3','3/3','1/3','0/3'];
    const flags = [null,'judge-flag',null,null,null,null,null,null,null,'late-key',null,'no-show'];
    return { ...t, evt: events[i], j: judges[i], key: keys[i], idea: ideas[i], sub: subs[i], flag: flags[i] };
  });

  return (
    <div className="ab" style={{ width: 1440, height: 900 }}>
      <BrowserChrome url="techday.altir.internal/admin" title="admin · command center" right={<span style={{ color: '#ff2bd6' }}>● admin session</span>} />
      <AdminTopbar active="console" />

      <div style={{ position: 'absolute', inset: '96px 24px 24px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <SectionTitle kicker="admin · console" right={
            <span style={{ display: 'flex', gap: 6 }}>
              <span className="pill" style={{ color: '#ff2bd6', borderColor: 'rgba(255,43,214,0.4)' }}>● PHASE / BUILD</span>
              <span className="pill ghost">UPDATED 16:48:09</span>
            </span>
          }>
            Everything, in one place.
          </SectionTitle>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, background: 'var(--line)', border: '1px solid var(--line)' }}>
            {[
              ['TEAMS',        '12 / 12',  'acid'],
              ['KEYS LIVE',    '12 / 14',  'acid'],
              ['IDEAS LOCKED', '12 / 12',  'acid'],
              ['SUBMITTED',    '11 / 12',  'warn'],
              ['JUDGE SCORES', '38 / 48',  'warn'],
              ['FLAGS OPEN',   '3',        'danger'],
            ].map(([l, v, c], i) => (
              <div key={i} style={{ padding: '12px 14px', background: 'var(--panel)' }}>
                <div className="label">{l}</div>
                <div className={'bold ' + c} style={{ fontSize: 22, marginTop: 4, letterSpacing: '-0.01em', textShadow: c === 'acid' ? '0 0 12px var(--acid-glow)' : 'none' }}>{v}</div>
              </div>
            ))}
          </div>

          <div className="panel" style={{ padding: 0, minWidth: 0 }}>
            <div className="panel-head">
              <span>// teams · 12 rows</span>
              <span className="right">
                <span className="dim" style={{ fontSize: 10 }}>filter:</span>
                <span className="pill acid" style={{ fontSize: 9 }}>ALL</span>
                <span className="pill" style={{ fontSize: 9 }}>FLAGGED</span>
                <span className="pill" style={{ fontSize: 9 }}>NO-SUB</span>
                <button className="btn ghost sm">⌥ export csv</button>
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '28px 1.4fr 1.1fr 0.7fr 0.6fr 0.7fr 0.6fr 0.8fr 0.7fr 0.9fr',
              padding: '8px 14px',
              borderBottom: '1px solid var(--line)',
              fontSize: 9, color: 'var(--text-mute)', letterSpacing: '0.14em', alignItems: 'center',
            }}>
              <span>#</span><span>TEAM</span><span>MEMBERS · DEPT</span>
              <span>IDEA</span><span>KEY</span><span>SUB</span>
              <span style={{ textAlign: 'right' }}>EVT</span><span style={{ textAlign: 'right' }}>JUDGE</span><span style={{ textAlign: 'right' }}>BLEND</span>
              <span style={{ textAlign: 'right' }}>ACT</span>
            </div>

            {rows.map((t, i) => {
              const blend = (t.j * 0.6 + (t.evt / 138 * 100) * 0.4).toFixed(1);
              const keyColor = t.key === 'live' ? 'var(--acid)' : t.key === 'rotated' ? 'var(--warn)' : 'var(--danger)';
              return (
                <div key={t.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '28px 1.4fr 1.1fr 0.7fr 0.6fr 0.7fr 0.6fr 0.8fr 0.7fr 0.9fr',
                  padding: '9px 14px', alignItems: 'center', fontSize: 11.5,
                  borderBottom: i < 11 ? '1px solid var(--line)' : 0,
                  background: t.flag ? 'rgba(255,77,77,0.04)' : 'transparent',
                }}>
                  <span style={{ color: 'var(--text-mute)', fontVariantNumeric: 'tabular-nums' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <span style={{ width: 8, height: 8, background: t.hue, boxShadow: `0 0 8px ${t.hue}`, flex: '0 0 auto' }}></span>
                    <span className="bold" style={{ color: 'var(--white)' }}>{t.name}</span>
                    {t.flag && <span className="pill danger" style={{ fontSize: 8 }}>● {t.flag}</span>}
                  </span>
                  <span className="dim" style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.members.join(', ')} <span className="faint">· {t.depts.join('×')}</span>
                  </span>
                  <span style={{ color: 'var(--acid)' }}>✓ {t.idea}</span>
                  <span style={{ color: keyColor, fontWeight: 700 }}>● {t.key}</span>
                  <span className="dim">{t.sub}</span>
                  <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }} className="bold">{t.evt}</span>
                  <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{t.j}</span>
                  <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }} className="acid bold">{blend}</span>
                  <span style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                    <button className="btn ghost sm" style={{ height: 22, padding: '0 6px', fontSize: 10 }}>open</button>
                    <button className="btn ghost sm" style={{ height: 22, padding: '0 6px', fontSize: 10 }}>⋯</button>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="panel" style={{ padding: 18, position: 'relative' }}>
            <CornerCrop size={10} color="#ff2bd6" />
            <div className="label" style={{ color: '#ff2bd6' }}># EVENT PHASE · OVERRIDE</div>
            <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
              {[
                ['12:00', 'CHECK-IN',     'done'],
                ['13:00', 'TEAM LOCK',    'done'],
                ['14:30', 'KEY RELEASE',  'done'],
                ['15:00', 'BUILD',        'active'],
                ['17:00', 'SUBMISSION',   'next'],
                ['17:30', 'DEMOS',        'wait'],
                ['18:00', 'JUDGING',      'wait'],
                ['18:30', 'RESULTS',      'wait'],
              ].map(([t, l, s], i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '44px 1fr auto', alignItems: 'center', gap: 8,
                  padding: '6px 8px',
                  background: s === 'active' ? 'rgba(255,43,214,0.08)' : 'transparent',
                  borderLeft: s === 'active' ? '2px solid #ff2bd6' : s === 'done' ? '2px solid var(--acid)' : '2px solid transparent',
                }}>
                  <span className="mute" style={{ fontSize: 10, fontVariantNumeric: 'tabular-nums' }}>{t}</span>
                  <span style={{ fontSize: 11, color: s === 'wait' ? 'var(--text-mute)' : 'var(--white)', fontWeight: 700 }}>{l}</span>
                  <span style={{ fontSize: 9, color: s === 'done' ? 'var(--acid)' : s === 'active' ? '#ff2bd6' : 'var(--text-faint)' }}>
                    {s === 'done' ? '✓ DONE' : s === 'active' ? '▸ NOW' : s === 'next' ? '○ NEXT' : '○ WAIT'}
                  </span>
                </div>
              ))}
            </div>
            <div className="ascii" style={{ margin: '12px 0 8px' }}>{'─'.repeat(36)}</div>
            <div style={{ display: 'grid', gap: 6 }}>
              <button className="btn sm" style={{ borderColor: '#ff2bd6', color: '#ff2bd6' }}>⏵ Advance phase manually</button>
              <button className="btn ghost sm">⏸ Pause clock (announce)</button>
              <button className="btn ghost sm">⊕ Extend window +15 min</button>
            </div>
          </div>

          <div className="panel" style={{ padding: 14 }}>
            <div className="label" style={{ marginBottom: 8 }}>BROADCAST</div>
            <div className="input" style={{ height: 'auto', padding: '10px 12px', alignItems: 'flex-start' }}>
              <span className="prompt">▸</span>
              <span className="dim" style={{ fontSize: 12, lineHeight: 1.4 }}>
                Snack run at 16:00. Submit early before 17:00 for +10.
                <span className="caret" style={{ verticalAlign: 'middle', marginLeft: 4 }}></span>
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <span className="pill acid" style={{ fontSize: 9 }}>✓ TV MODE</span>
              <span className="pill acid" style={{ fontSize: 9 }}>✓ ALL TEAMS</span>
              <span className="pill" style={{ fontSize: 9 }}>○ #techday-live</span>
            </div>
            <button className="btn acid sm" style={{ width: '100%', marginTop: 10 }}>▸ Send announcement</button>
          </div>

          <div className="panel">
            <div className="panel-head"><span>// audit · last 6</span><span className="right dim">22:48 today</span></div>
            <div style={{ padding: '6px 14px 12px', fontSize: 10.5, lineHeight: 1.6 }}>
              {[
                ['16:48', 'admin', 'rotated key for kickoff (rate-limit)'],
                ['16:31', 'maya.r', 'submitted score · quotebot · 84.2'],
                ['16:18', 'admin', 'overrode team formation · claimcraft'],
                ['15:42', 'admin', 'revoked key for northstar (leak detected)'],
                ['14:30', 'system', 'released 12 keys to all teams'],
                ['13:00', 'system', 'team formation locked'],
              ].map(([t, who, msg], i) => (
                <div key={i} style={{ display: 'flex', gap: 8, padding: '3px 0' }}>
                  <span className="mute" style={{ width: 36, fontVariantNumeric: 'tabular-nums' }}>{t}</span>
                  <span className="bold" style={{ width: 56, color: 'var(--white)' }}>{who}</span>
                  <span className="dim" style={{ flex: 1 }}>{msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminKeysArtboard() {
  // Manually-assigned key pool. No usage tracking — keys carry only assignment + status + last-seen.
  const keys = [
    { id: 'sk-aLT1r_NV4_••••8mZ2', prov: 'openai',    model: 'gpt-4o',        team: 'NOVA',       hue: '#c4ff00', status: 'live',    last: '16:47' },
    { id: 'sk-aLT1r_PRm_••••7kT9', prov: 'openai',    model: 'gpt-4o',        team: 'PROMPTOPS',  hue: '#ff2bd6', status: 'live',    last: '16:46' },
    { id: 'sk-aLT1r_CLm_••••2pX1', prov: 'openai',    model: 'gpt-4o',        team: 'CLAIMCRAFT', hue: '#00d4ff', status: 'live',    last: '16:43' },
    { id: 'sk-aLT1r_PXd_••••4nQ8', prov: 'openai',    model: 'gpt-4o-mini',   team: 'PIXELDESK',  hue: '#ffb020', status: 'live',    last: '16:38' },
    { id: 'sk-ant1r_GRw_••••6kL3', prov: 'anthropic', model: 'claude-sonnet', team: 'GROWTHHACK', hue: '#9d6dff', status: 'live',    last: '16:48' },
    { id: 'sk-aLT1r_APt_••••3vC2', prov: 'openai',    model: 'gpt-4o',        team: 'AUTOPILOT',  hue: '#ff5a3c', status: 'live',    last: '16:48' },
    { id: 'sk-aLT1r_BCv_••••9rH4', prov: 'openai',    model: 'gpt-4o',        team: 'BIGCANVAS',  hue: '#00ff9d', status: 'live',    last: '16:31' },
    { id: 'sk-aLT1r_QBt_••••3kQ7', prov: 'openai',    model: 'gpt-4o',        team: 'QUOTEBOT',   hue: '#ff7ac6', status: 'live',    last: '16:42' },
    { id: 'sk-aLT1r_UWr_••••8pZ5', prov: 'anthropic', model: 'claude-sonnet', team: 'UNDERWRITE', hue: '#fff200', status: 'live',    last: '16:35' },
    { id: 'sk-aLT1r_HFx_••••2nB6', prov: 'openai',    model: 'gpt-4o',        team: 'HOTFIX',     hue: '#00aaff', status: 'live',    last: '16:44' },
    { id: 'sk-aLT1r_KFf_••••9wM7', prov: 'openai',    model: 'gpt-4o',        team: 'KICKOFF',    hue: '#ff4d4d', status: 'live',    last: '16:39' },
    { id: 'sk-aLT1r_NSt_••••1xJ0', prov: 'openai',    model: 'gpt-4o',        team: 'NORTHSTAR',  hue: '#ff8a00', status: 'revoked', last: '15:42' },
    { id: 'sk-aLT1r_____new____1', prov: 'openai',    model: 'gpt-4o',        team: null,         hue: null,      status: 'spare',   last: '—'    },
    { id: 'sk-aLT1r_____new____2', prov: 'openai',    model: 'gpt-4o',        team: null,         hue: null,      status: 'spare',   last: '—'    },
  ];
  const liveCount = keys.filter(k => k.status === 'live').length;
  const spareCount = keys.filter(k => k.status === 'spare').length;
  const revokedCount = keys.filter(k => k.status === 'revoked').length;

  return (
    <div className="ab" style={{ width: 1440, height: 900 }}>
      <BrowserChrome url="techday.altir.internal/admin/keys" title="admin · api keys" />
      <AdminTopbar active="keys" />

      <div style={{ position: 'absolute', inset: '96px 24px 24px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <SectionTitle kicker="admin · key pool"
            right={<span style={{ display: 'flex', gap: 6 }}>
              <span className="pill acid">{liveCount} LIVE</span>
              <span className="pill warn">{spareCount} SPARE</span>
              <span className="pill danger">{revokedCount} REVOKED</span>
            </span>}>
            API key pool.
          </SectionTitle>

          {/* ─── Add a single key ───────────────────────────────── */}
          <div className="panel" style={{ padding: 16 }}>
            <div className="label" style={{ marginBottom: 10 }}>＋ ADD A KEY · ONE AT A TIME</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.7fr 0.9fr 1fr auto', gap: 8, alignItems: 'flex-end' }}>
              <div>
                <div className="label" style={{ marginBottom: 4, fontSize: 9 }}>KEY</div>
                <div className="input focused" style={{ height: 36 }}>
                  <span className="prompt">▸</span>
                  <span style={{ color: 'var(--acid)', fontFamily: 'var(--mono)', fontSize: 12 }}>sk-aLT1r_____new_____3xM7q</span>
                  <span className="caret" style={{ marginLeft: 2 }}></span>
                </div>
              </div>
              <div>
                <div className="label" style={{ marginBottom: 4, fontSize: 9 }}>PROVIDER</div>
                <div className="input" style={{ height: 36 }}>
                  <span style={{ color: 'var(--white)', fontSize: 12 }}>openai</span>
                  <span className="dim" style={{ marginLeft: 'auto' }}>▾</span>
                </div>
              </div>
              <div>
                <div className="label" style={{ marginBottom: 4, fontSize: 9 }}>MODEL</div>
                <div className="input" style={{ height: 36 }}>
                  <span style={{ color: 'var(--white)', fontSize: 12 }}>gpt-4o</span>
                  <span className="dim" style={{ marginLeft: 'auto' }}>▾</span>
                </div>
              </div>
              <div>
                <div className="label" style={{ marginBottom: 4, fontSize: 9 }}>ASSIGN TO</div>
                <div className="input" style={{ height: 36 }}>
                  <span className="dim" style={{ fontSize: 12 }}>— spare pool —</span>
                  <span className="dim" style={{ marginLeft: 'auto' }}>▾</span>
                </div>
              </div>
              <button className="btn acid" style={{ height: 36 }}>＋ Add key</button>
            </div>
          </div>

          {/* ─── Key registry table ─────────────────────────────── */}
          <div className="panel" style={{ padding: 0, minWidth: 0 }}>
            <div className="panel-head">
              <span>// key registry · {keys.length} rows</span>
              <span className="right">
                <span className="dim" style={{ fontSize: 10 }}>filter:</span>
                <span className="pill acid" style={{ fontSize: 9 }}>ALL</span>
                <span className="pill" style={{ fontSize: 9 }}>SPARE</span>
                <span className="pill" style={{ fontSize: 9 }}>REVOKED</span>
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 0.8fr 1fr 1.3fr 0.8fr 0.7fr 0.9fr',
              padding: '8px 14px', borderBottom: '1px solid var(--line)',
              fontSize: 9, color: 'var(--text-mute)', letterSpacing: '0.14em',
            }}>
              <span>KEY</span><span>PROV</span><span>MODEL</span>
              <span>ASSIGNED TO</span><span>STATUS</span>
              <span style={{ textAlign: 'right' }}>LAST USED</span>
              <span style={{ textAlign: 'right' }}>ACTIONS</span>
            </div>
            {keys.map((k, i) => {
              const sc = k.status === 'live' ? 'var(--acid)' : k.status === 'revoked' ? 'var(--danger)' : 'var(--text-mute)';
              return (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 0.8fr 1fr 1.3fr 0.8fr 0.7fr 0.9fr',
                  padding: '5px 14px', alignItems: 'center', fontSize: 11,
                  borderBottom: i < keys.length - 1 ? '1px solid var(--line)' : 0,
                  background: k.status === 'spare' ? 'rgba(196,255,0,0.04)' : k.status === 'revoked' ? 'rgba(255,77,77,0.04)' : 'transparent',
                }}>
                  <span style={{ fontFamily: 'var(--mono)', color: k.status === 'revoked' ? 'var(--text-mute)' : 'var(--white)', textDecoration: k.status === 'revoked' ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {k.id}
                  </span>
                  <span className="dim">{k.prov}</span>
                  <span className="dim">{k.model}</span>
                  <span>
                    {/* assignment dropdown */}
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '3px 8px', height: 24,
                      background: 'var(--panel-2)', border: '1px solid var(--line-2)', borderRadius: 2,
                      cursor: 'pointer',
                    }}>
                      {k.team ? (
                        <>
                          <span style={{ width: 7, height: 7, background: k.hue, boxShadow: `0 0 6px ${k.hue}` }}></span>
                          <span className="bold" style={{ color: 'var(--white)', fontSize: 11 }}>{k.team}</span>
                        </>
                      ) : (
                        <span className="acid" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em' }}>＋ ASSIGN</span>
                      )}
                      <span className="dim" style={{ marginLeft: 4, fontSize: 9 }}>▾</span>
                    </span>
                  </span>
                  <span style={{ color: sc, fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>● {k.status}</span>
                  <span className="dim" style={{ textAlign: 'right', fontSize: 10, fontVariantNumeric: 'tabular-nums' }}>{k.last}</span>
                  <span style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                    <button className="btn ghost sm" title="rotate" style={{ height: 22, padding: '0 8px', fontSize: 10 }}>⟲</button>
                    <button className="btn ghost sm" title="revoke" style={{ height: 22, padding: '0 8px', fontSize: 10 }}>⌫</button>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── RIGHT RAIL ────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="panel" style={{ padding: 18 }}>
            <div className="label">POOL</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--acid)', textShadow: '0 0 16px var(--acid-glow)', letterSpacing: '-0.02em', lineHeight: 1 }}>{liveCount}</div>
                <div className="dim" style={{ fontSize: 10, marginTop: 4, letterSpacing: '0.1em' }}>LIVE · ASSIGNED</div>
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--warn)', letterSpacing: '-0.02em', lineHeight: 1 }}>{spareCount}</div>
                <div className="dim" style={{ fontSize: 10, marginTop: 4, letterSpacing: '0.1em' }}>SPARE · UNUSED</div>
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--danger)', letterSpacing: '-0.02em', lineHeight: 1 }}>{revokedCount}</div>
                <div className="dim" style={{ fontSize: 10, marginTop: 4, letterSpacing: '0.1em' }}>REVOKED</div>
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.02em', lineHeight: 1 }}>{keys.length}</div>
                <div className="dim" style={{ fontSize: 10, marginTop: 4, letterSpacing: '0.1em' }}>TOTAL</div>
              </div>
            </div>
            <div className="ascii" style={{ margin: '14px 0 8px' }}>{'─'.repeat(36)}</div>
            <div className="dim" style={{ fontSize: 11, lineHeight: 1.5 }}>
              12 of 12 teams have a live key. <span className="acid bold">2 spares</span> ready to swap in if anything rotates.
            </div>
          </div>

          <div className="panel" style={{ padding: 18 }}>
            <div className="label" style={{ marginBottom: 8 }}>POLICY</div>
            <div className="kv" style={{ marginBottom: 6, justifyContent: 'space-between' }}><span className="k">visible to</span><span className="v">assigned team only</span></div>
            <div className="kv" style={{ marginBottom: 6, justifyContent: 'space-between' }}><span className="k">on leak</span><span className="v danger">revoke</span></div>
            <div className="kv" style={{ marginBottom: 6, justifyContent: 'space-between' }}><span className="k">max / team</span><span className="v">1 active</span></div>
            <div className="kv" style={{ justifyContent: 'space-between' }}><span className="k">expires</span><span className="v">22 May 18:30</span></div>
          </div>

          <div className="panel" style={{ padding: 14, border: '1px solid rgba(255,77,77,0.35)', background: 'rgba(255,77,77,0.04)' }}>
            <div className="label" style={{ color: 'var(--danger)' }}>⚠ INCIDENT · 15:42</div>
            <div style={{ fontSize: 12, marginTop: 6, color: 'var(--white)', lineHeight: 1.4 }}>
              <span className="bold">NORTHSTAR</span> key revoked. Assign a spare from the table.
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <button className="btn sm" style={{ flex: 1, borderColor: 'var(--danger)', color: 'var(--danger)' }}>view audit</button>
              <button className="btn ghost sm" style={{ flex: 1 }}>dismiss</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminScoringArtboard() {
  // Read-only-feel page that explains the scoring model in plain reading order:
  //   1) the final formula  2) what judges score  3) what earns event points
  const criteria = [
    { k: 'INNOVATION',     n: 'How novel is the idea or approach?' },
    { k: 'USEFULNESS',     n: 'Could Altir actually use this?' },
    { k: 'EXECUTION',      n: 'Does it work end-to-end in 3 hours?' },
    { k: 'DEMO QUALITY',   n: 'Is the demo clear and tight?' },
    { k: 'PRESENTATION',   n: 'Does the pitch land?' },
  ];
  const eventRules = [
    { bucket: 'TEAM',  rules: [
      ['Complete team formed',              10],
      ['Different departments',              5],
      ['Very different functions (biz↔ops)',10],
    ]},
    { bucket: 'IDEA',  rules: [
      ['Picked from bank',                   3],
      ['Custom idea written',                5],
      ['Submitted before lock',             10],
    ]},
    { bucket: 'BUILD', rules: [
      ['GitHub repo added',                 10],
      ['README + setup notes',               5],
      ['Demo video uploaded',               15],
      ['Presentation added',                10],
      ['Submitted before 17:00',            10],
    ]},
  ];
  const maxEvent = eventRules.reduce((a, b) => a + b.rules.reduce((x, r) => x + r[1], 0), 0);
  const bucketHue = { TEAM: '#ff7ac6', IDEA: '#00d4ff', BUILD: 'var(--acid)' };

  return (
    <div className="ab" style={{ width: 1440, height: 900 }}>
      <BrowserChrome url="techday.altir.internal/admin/scoring" title="admin · scoring" />
      <AdminTopbar active="scoring" />

      <div style={{ position: 'absolute', inset: '92px 36px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SectionTitle kicker="admin · scoring" right={
          <span style={{ display: 'flex', gap: 6, whiteSpace: 'nowrap' }}>
            <span className="pill ghost">SAVED · 16:48:09</span>
            <button className="btn ghost sm">↺ reset to defaults</button>
            <button className="btn acid sm">▸ publish changes</button>
          </span>
        }>
          How scoring works.
        </SectionTitle>

        {/* ─── FORMULA · the whole story in one row ──────────────── */}
        <div className="panel" style={{ padding: 18, position: 'relative' }}>
          <CornerCrop size={12} color="#ff2bd6" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'nowrap' }}>
            {/* JUDGE */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="label" style={{ color: '#ff7ac6' }}>① JUDGE SCORE</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.02em', marginTop: 4, lineHeight: 1 }}>
                avg of <span style={{ color: '#ff7ac6' }}>5 criteria</span>
              </div>
              <div className="dim" style={{ fontSize: 12, marginTop: 8 }}>each judge rates 0–100 → averaged across all judges → out of 100</div>
            </div>

            <div style={{ fontSize: 56, color: 'var(--text-faint)', fontWeight: 300, lineHeight: 1 }}>×</div>

            <div style={{ textAlign: 'center', minWidth: 80 }}>
              <div style={{ fontSize: 56, fontWeight: 700, color: '#ff7ac6', textShadow: '0 0 24px rgba(255,122,198,0.5)', letterSpacing: '-0.04em', lineHeight: 1 }}>60%</div>
              <div className="dim" style={{ fontSize: 10, marginTop: 6, letterSpacing: '0.1em' }}>WEIGHT</div>
            </div>

            <div style={{ fontSize: 56, color: 'var(--text-faint)', fontWeight: 300, lineHeight: 1 }}>+</div>

            {/* EVENT */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="label" style={{ color: 'var(--acid)' }}>② EVENT POINTS</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.02em', marginTop: 4, lineHeight: 1 }}>
                out of <span className="acid">{maxEvent}</span>
              </div>
              <div className="dim" style={{ fontSize: 12, marginTop: 8 }}>automatic — earned by doing things in the platform → normalized to 100</div>
            </div>

            <div style={{ fontSize: 56, color: 'var(--text-faint)', fontWeight: 300, lineHeight: 1 }}>×</div>

            <div style={{ textAlign: 'center', minWidth: 80 }}>
              <div style={{ fontSize: 56, fontWeight: 700, color: 'var(--acid)', textShadow: '0 0 24px var(--acid-glow)', letterSpacing: '-0.04em', lineHeight: 1 }}>40%</div>
              <div className="dim" style={{ fontSize: 10, marginTop: 6, letterSpacing: '0.1em' }}>WEIGHT</div>
            </div>
          </div>

          {/* the slider that controls weights */}
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 18 }}>
            <span className="label" style={{ width: 110 }}>BLEND →</span>
            <span style={{ color: '#ff7ac6', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>JUDGE</span>
            <div style={{ flex: 1, position: 'relative', height: 8, background: 'var(--panel-3)', border: '1px solid var(--line-2)' }}>
              <div style={{ position: 'absolute', inset: 0, width: '60%', background: '#ff7ac6', boxShadow: '0 0 12px rgba(255,122,198,0.5)' }}></div>
              <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '40%', background: 'var(--acid)', boxShadow: '0 0 12px var(--acid-glow)' }}></div>
              <div style={{ position: 'absolute', top: -4, left: 'calc(60% - 6px)', width: 12, height: 16, background: 'var(--white)' }}></div>
            </div>
            <span className="acid" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>EVENT</span>
            <span className="dim" style={{ width: 110, textAlign: 'right', fontSize: 11 }}>drag to retune</span>
          </div>
        </div>

        {/* ─── TWO COLUMNS · what judges score · what earns event pts ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 14, flex: 1, minHeight: 0 }}>
          {/* JUDGES SCORE */}
          <div className="panel" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="panel-head">
              <span>① <span style={{ color: '#ff7ac6' }}>JUDGES SCORE</span> · 5 criteria, 0–100 each</span>
              <span className="right"><button className="btn ghost sm">⌥ edit criteria</button></span>
            </div>
            <div style={{ padding: 20, flex: 1 }}>
              {criteria.map((c, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 40px', gap: 14, alignItems: 'center', padding: '12px 0', borderBottom: i < 4 ? '1px solid var(--line)' : 0 }}>
                  <span className="bold" style={{ color: 'var(--white)', fontSize: 13, letterSpacing: '0.04em' }}>{c.k}</span>
                  <span className="dim" style={{ fontSize: 12 }}>{c.n}</span>
                  <span className="dim" style={{ textAlign: 'right', fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>0–100</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--line)', background: 'var(--panel-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="dim" style={{ fontSize: 11 }}>each judge submits one score per team · drafts are excluded · we average across judges</span>
              <span className="bold" style={{ color: '#ff7ac6', fontSize: 13 }}>→ /100</span>
            </div>
          </div>

          {/* EVENT POINTS */}
          <div className="panel" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="panel-head">
              <span>② <span className="acid">TEAMS EARN EVENT POINTS</span> · automatic</span>
              <span className="right"><button className="btn ghost sm">＋ add rule</button></span>
            </div>
            <div style={{ padding: '12px 0', flex: 1, overflow: 'hidden' }}>
              {eventRules.map((g, gi) => (
                <div key={g.bucket}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 20px 4px' }}>
                    <span style={{ width: 8, height: 8, background: bucketHue[g.bucket], boxShadow: `0 0 6px ${bucketHue[g.bucket]}` }}></span>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: bucketHue[g.bucket] }}>{g.bucket}</span>
                    <span className="dim" style={{ fontSize: 10, marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>{g.rules.reduce((a, r) => a + r[1], 0)} pts max</span>
                  </div>
                  {g.rules.map((r, ri) => (
                    <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1fr 50px', alignItems: 'center', padding: '5px 20px', fontSize: 12 }}>
                      <span style={{ color: 'var(--text)' }}>{r[0]}</span>
                      <span className="bold acid" style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', textShadow: '0 0 8px var(--acid-glow)' }}>+{r[1]}</span>
                    </div>
                  ))}
                  {gi < eventRules.length - 1 && <div className="ascii" style={{ padding: '6px 20px 2px', fontSize: 10 }}>{'─'.repeat(60)}</div>}
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--line)', background: 'var(--panel-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="dim" style={{ fontSize: 11 }}>summed automatically as teams hit each milestone · ties broken by earliest submission</span>
              <span className="bold acid" style={{ fontSize: 13, textShadow: '0 0 8px var(--acid-glow)' }}>→ /{maxEvent}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminConsoleArtboard, AdminKeysArtboard, AdminScoringArtboard });


// ═══════════════════════════════════════════════════════════════
// app.jsx
// ═══════════════════════════════════════════════════════════════
// app.jsx — assembles every artboard onto a design canvas

const { DesignCanvas, DCSection, DCArtboard } = window;

function App() {
  return (
    <DesignCanvas>
      <DCSection id="intro" title="00 · Intent + system" subtitle="The dark terminal direction — pure black, one acid accent, mono throughout">
        <DCArtboard id="readme" label="README" width={720} height={900}>
          <div className="ab" style={{ width: 720, height: 900, padding: 48 }}>
            <div className="ab-grid"></div>
            <div style={{ position: 'relative' }}>
              <LogoBig />
              <div className="label" style={{ marginTop: 36, color: 'var(--acid)' }}># direction 01 of 01 · dark terminal</div>
              <h1 style={{ fontSize: 42, fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.02em', marginTop: 10, lineHeight: 1 }}>
                Command-line<br />energy for a<br />three-hour event.
              </h1>
              <p className="dim" style={{ marginTop: 18, fontSize: 13, lineHeight: 1.6, maxWidth: 540 }}>
                Twelve hi-fi screens covering every surface in the PRD: lockscreen → login →
                team formation → idea → workspace → key reveal → submission → public
                gallery → live leaderboard → TV mode → judge console → winners.
              </p>
              <div className="ascii" style={{ margin: '24px 0' }}>{'━'.repeat(40)}</div>

              <div className="label" style={{ marginBottom: 10 }}>SYSTEM</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
                <div className="kv"><span className="k">type</span><span className="v">JetBrains Mono · 400-700</span></div>
                <div className="kv"><span className="k">base</span><span className="v">#000 · panel #0a0a0a</span></div>
                <div className="kv"><span className="k">accent</span><span className="v acid">#c4ff00 acid lime</span></div>
                <div className="kv"><span className="k">team hues</span><span className="v">12 unique · used as identity</span></div>
                <div className="kv"><span className="k">rhythm</span><span className="v">scanlines + ascii rules</span></div>
                <div className="kv"><span className="k">motion</span><span className="v">blinking caret, glowing live</span></div>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 20 }}>
                {window.TEAMS.map((t) =>
                <span key={t.id} className="team-tag" style={{ '--team': t.hue, fontSize: 10 }}>
                    <span className="swatch"></span>{t.name}
                  </span>
                )}
              </div>

              <div className="ascii" style={{ margin: '24px 0 12px' }}>{'━'.repeat(40)}</div>
              <div className="label" style={{ marginBottom: 10 }}>HOW TO READ THIS CANVAS</div>
              <p className="dim" style={{ fontSize: 12, lineHeight: 1.7 }}>
                Each row is a chronological phase of the day. Scroll right within a row to follow the flow.
                Click any artboard's "⛶" icon to view it fullscreen. Drag the grid to pan, scroll to zoom.
              </p>
            </div>
          </div>
        </DCArtboard>
      </DCSection>

      <DCSection id="entry" title="01 · Entry" subtitle="Pre-event lockscreen + identity">
        <DCArtboard id="lockscreen" label="Lockscreen · pre-event hero" width={1440} height={900}>
          <LockscreenArtboard />
        </DCArtboard>
        <DCArtboard id="login" label="Login · SSO + terminal" width={1440} height={900}>
          <LoginArtboard />
        </DCArtboard>
      </DCSection>

      <DCSection id="team" title="02 · Team formation" subtitle="Until 13:00 lock">
        <DCArtboard id="form-team" label="Form a team" width={1440} height={900}>
          <FormTeamArtboard />
        </DCArtboard>
        <DCArtboard id="team-locked" label="Team locked · confetti" width={1440} height={900}>
          <TeamLockedArtboard />
        </DCArtboard>
        <DCArtboard id="idea-picker" label="Idea bank + custom" width={1440} height={900}>
          <IdeaPickerArtboard />
        </DCArtboard>
      </DCSection>

      <DCSection id="workspace" title="03 · Build window" subtitle="Workspace + the dramatic key reveal moment">
        <DCArtboard id="workspace" label="Team workspace · mid-build" width={1440} height={900}>
          <WorkspaceArtboard />
        </DCArtboard>
        <DCArtboard id="key-reveal" label="API key reveal · 14:30 sharp" width={1440} height={900}>
          <KeyRevealArtboard />
        </DCArtboard>
      </DCSection>

      <DCSection id="submit" title="04 · Submission" subtitle="Final assets + post-deadline gallery">
        <DCArtboard id="final-submit" label="Final submission form" width={1440} height={900}>
          <FinalSubmitArtboard />
        </DCArtboard>
        <DCArtboard id="gallery" label="Public submission gallery" width={1440} height={900}>
          <GalleryArtboard />
        </DCArtboard>
      </DCSection>

      <DCSection id="live" title="05 · Live ops" subtitle="Participant leaderboard + TV display">
        <DCArtboard id="leaderboard" label="Live energy · participant view" width={1440} height={900}>
          <LeaderboardArtboard />
        </DCArtboard>
        <DCArtboard id="tv-mode" label="TV mode · 1920×1080 office display" width={1920} height={1080}>
          <TVArtboard />
        </DCArtboard>
      </DCSection>

      <DCSection id="judge" title="06 · Judging + results" subtitle="Score → blend → announce">
        <DCArtboard id="judge-console" label="Judge scoring console" width={1440} height={900}>
          <JudgeArtboard />
        </DCArtboard>
        <DCArtboard id="results" label="Winners · final standings" width={1440} height={900}>
          <ResultsArtboard />
        </DCArtboard>
      </DCSection>

      <DCSection id="admin" title="07 · Admin" subtitle="Command center for organizers — teams, keys, scoring mechanics">
        <DCArtboard id="admin-console" label="Admin console · all teams + phase override" width={1440} height={900}>
          <AdminConsoleArtboard />
        </DCArtboard>
        <DCArtboard id="admin-keys" label="API keys · add one at a time, assign per row" width={1440} height={900}>
          <AdminKeysArtboard />
        </DCArtboard>
        <DCArtboard id="admin-scoring" label="Scoring · how the final score is built" width={1440} height={900}>
          <AdminScoringArtboard />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>);

}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);