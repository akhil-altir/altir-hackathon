// shared.jsx — atoms used across every artboard.
// Components are attached to window at the bottom so other Babel scripts see them.

const TEAMS = [
  { id: 'nova',        name: 'NOVA',        hue: '#c4ff00', members: ['Maya R.',  'Jonas T.'],   depts: ['Eng', 'Design'],  idea: 'AI claims assistant for ops workflows' },
  { id: 'promptops',   name: 'PROMPTOPS',   hue: '#ff2bd6', members: ['Priya S.', 'Devon K.'],   depts: ['Eng', 'Ops'],     idea: 'Support triage copilot with auto-routing' },
  { id: 'claimcraft',  name: 'CLAIMCRAFT',  hue: '#00d4ff', members: ['Aiden M.', 'Ravi P.'],    depts: ['Biz', 'Eng'],     idea: 'Document checklist builder for review cycles' },
  { id: 'pixeldesk',   name: 'PIXELDESK',   hue: '#ffb020', members: ['Yuki O.',  'Sam B.'],     depts: ['Design', 'Ops'],  idea: 'Design-system explorer for the support hub' },
  { id: 'growthhack',  name: 'GROWTHHACK',  hue: '#9d6dff', members: ['Lena F.',  'Theo W.'],    depts: ['Biz', 'Eng'],     idea: 'Cold-outbound rewriter tuned on our voice' },
  { id: 'autopilot',   name: 'AUTOPILOT',   hue: '#ff5a3c', members: ['Quinn H.', 'Mira J.'],    depts: ['Ops', 'Eng'],     idea: 'Internal runbook auto-executor for SRE' },
  { id: 'bigcanvas',   name: 'BIGCANVAS',   hue: '#00ff9d', members: ['Iris D.',  'Felix N.'],   depts: ['Design', 'Biz'],  idea: 'Slide-deck composer from raw meeting notes' },
  { id: 'quotebot',    name: 'QUOTEBOT',    hue: '#ff7ac6', members: ['Asha V.',  'Jordan L.'],  depts: ['Biz', 'Ops'],     idea: 'Quote generator that pulls from CRM + Stripe' },
  { id: 'underwrite',  name: 'UNDERWRITE',  hue: '#fff200', members: ['Owen C.',  'Tess R.'],    depts: ['Biz', 'Design'],  idea: 'Risk explainer for non-technical brokers' },
  { id: 'hotfix',      name: 'HOTFIX',      hue: '#00aaff', members: ['Kai G.',   'Nora E.'],    depts: ['Eng', 'Eng'],     idea: 'Stack-trace narrator with rollback nudges' },
  { id: 'kickoff',     name: 'KICKOFF',     hue: '#ff4d4d', members: ['Eli P.',   'Maya L.'],    depts: ['Ops', 'Design'],  idea: 'Onboarding sprint planner with day-1 checklist' },
  { id: 'northstar',   name: 'NORTHSTAR',   hue: '#ff8a00', members: ['Vera S.',  'Mohan T.'],   depts: ['Biz', 'Eng'],     idea: 'Goal-tracking dashboard tied to weekly OKRs' },
];

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
    </div>
  );
}

function Topbar({ active = 'workspace', team, countdown = '01:14:32', phase = 'BUILD', user }) {
  const items = [
    ['workspace', 'Workspace'],
    ['idea',      'Idea'],
    ['submit',    'Submit'],
    ['gallery',   'Gallery'],
    ['leaderboard','Leaderboard'],
    ['handbook',  'Handbook'],
  ];
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
        {items.map(([k, l]) => (
          <a key={k} className={k === active ? 'is-active' : ''}>{l}</a>
        ))}
      </div>
      <div className="topbar-right">
        <span className="countdown">
          <i className="blip"></i>
          <span>{phase} ENDS IN</span>
          <b>{countdown}</b>
        </span>
        {team && (
          <span className="team-tag" style={{ '--team': team.hue }}>
            <span className="swatch"></span>{team.name}
          </span>
        )}
        {user && <span style={{ color: 'var(--text-dim)' }}>{user}</span>}
      </div>
    </div>
  );
}

function AsciiRule({ char = '━', width = 80, color }) {
  return (
    <div className="ascii" style={{ color: color || undefined }}>
      {char.repeat(width)}
    </div>
  );
}

function SectionTitle({ kicker, children, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 14 }}>
      <div>
        {kicker && <div className="label" style={{ color: 'var(--acid)', marginBottom: 6 }}># {kicker}</div>}
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--white)', lineHeight: 1.15 }}>{children}</h2>
      </div>
      {right && <div style={{ marginLeft: 'auto' }}>{right}</div>}
    </div>
  );
}

function Stat({ label, value, sub, accent }) {
  return (
    <div style={{ padding: '14px 16px', border: '1px solid var(--line)', background: 'var(--panel)' }}>
      <div className="label">{label}</div>
      <div style={{
        fontSize: 26, fontWeight: 700, marginTop: 6,
        color: accent ? 'var(--acid)' : 'var(--white)',
        textShadow: accent ? '0 0 16px var(--acid-glow)' : 'none',
      }}>{value}</div>
      {sub && <div className="dim" style={{ fontSize: 11, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Avatar({ name, hue }) {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('');
  return (
    <span style={{
      width: 24, height: 24, display: 'inline-grid', placeItems: 'center',
      background: 'var(--panel-3)',
      border: '1px solid var(--line-2)',
      color: hue || 'var(--text)',
      fontSize: 10, fontWeight: 700, letterSpacing: 0,
      borderRadius: 2,
    }}>{initials}</span>
  );
}

function PromptLine({ children, dim }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
      <span style={{ color: 'var(--acid)', fontWeight: 700 }}>$</span>
      <span style={{ color: dim ? 'var(--text-dim)' : 'var(--text)' }}>{children}</span>
    </div>
  );
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
    </>
  );
}

function LogoBig() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <span style={{
        width: 36, height: 36, display: 'grid', placeItems: 'center',
        background: 'var(--acid)', color: '#000', fontWeight: 900, fontSize: 22,
        boxShadow: '0 0 24px var(--acid-glow)', borderRadius: 3,
      }}>A</span>
      <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--white)' }}>
        ALTIR <span style={{ color: 'var(--text-mute)' }}>// TECH DAY 2026</span>
      </span>
    </div>
  );
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
  LogoBig,
});
