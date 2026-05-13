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
        gap: 32, padding: 40,
      }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <LogoBig />
            <div style={{ marginTop: 56 }}>
              <div className="label" style={{ color: 'var(--acid)' }}># 22 may 2026 / friday / hq + remote</div>
              <h1 style={{
                fontSize: 92, fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.04em',
                lineHeight: 0.92, marginTop: 20,
              }}>
                Three hours.<br />
                Two people.<br />
                <span style={{ color: 'var(--acid)', textShadow: '0 0 32px var(--acid-glow)' }}>One idea you ship.</span>
              </h1>
              <p style={{ marginTop: 24, fontSize: 16, color: 'var(--text-dim)', maxWidth: 560, lineHeight: 1.55 }}>
                Tech Day is Altir's all-hands hackathon. Pair up across departments,
                claim an API key, and stand up something that demos in under three minutes.
                The platform handles teams, keys, scoring and the room.
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
              display: 'flex', alignItems: 'baseline', gap: 6,
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
                ['18:30', 'Winners + drinks', 'mute'],
              ].map(([t, l, c], i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '8px 0', borderBottom: i < 5 ? '1px solid var(--line)' : 0 }}>
                  <span className="mute" style={{ width: 42, fontVariantNumeric: 'tabular-nums' }}>{t}</span>
                  <span className={c}>{l}</span>
                </div>
              ))}
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
    </div>
  );
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
    </div>
  );
}

Object.assign(window, { LockscreenArtboard, LoginArtboard });
