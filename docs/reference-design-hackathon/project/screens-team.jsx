// screens-team.jsx — Form team, Team locked confirmation, Idea picker/submit

function FormTeamArtboard() {
  const available = [
    { name: 'Maya Reyes',     dept: 'Design',   role: 'Sr. Product Designer' },
    { name: 'Jonas Tran',     dept: 'Eng',      role: 'Platform Engineer' },
    { name: 'Priya Sandhu',   dept: 'Eng',      role: 'AI/ML Engineer' },
    { name: 'Devon Knox',     dept: 'Ops',      role: 'Customer Ops Lead' },
    { name: 'Aiden Mahmoud',  dept: 'Biz',      role: 'Product Manager' },
    { name: 'Yuki Ono',       dept: 'Design',   role: 'Brand Designer' },
    { name: 'Sam Brennan',    dept: 'Ops',      role: 'Field Ops' },
    { name: 'Lena Falk',      dept: 'Biz',      role: 'Strategy' },
  ];
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
              {available.map((p, i) => (
                <button key={i} className="panel" style={{
                  padding: '12px 14px', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 12,
                  borderColor: p.name === 'Asha Verma' ? 'var(--acid)' : 'var(--line)',
                  background: p.name === 'Asha Verma' ? 'var(--acid-soft)' : 'var(--panel-2)',
                }}>
                  <Avatar name={p.name} />
                  <div style={{ minWidth: 0 }}>
                    <div className="bold" style={{ fontSize: 13, color: 'var(--white)' }}>{p.name}</div>
                    <div className="dim" style={{ fontSize: 11 }}>{p.dept} · {p.role}</div>
                  </div>
                </button>
              ))}
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
              { name: 'Jordan Lin',  dept: 'Biz · Pricing Analyst',   you: true },
              { name: 'Asha Verma',  dept: 'Ops · Onboarding Lead',   you: false },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderTop: i ? '1px solid var(--line)' : 0 }}>
                <Avatar name={m.name} hue={i === 0 ? 'var(--acid)' : '#ff7ac6'} />
                <div>
                  <div className="bold" style={{ color: 'var(--white)' }}>{m.name}{m.you && <span className="acid" style={{ marginLeft: 8, fontSize: 10 }}>YOU</span>}</div>
                  <div className="dim" style={{ fontSize: 11 }}>{m.dept}</div>
                </div>
              </div>
            ))}

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
    </div>
  );
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
              ['#00d4ff', 560, 160, '×'], ['#ffb020', 1300, 380, '+'], ['#ff2bd6', 60, 410, '◆'],
            ].map(([c, x, y, g], i) => (
              <span key={i} style={{
                position: 'absolute', left: x, top: y, color: c, fontSize: 18,
                textShadow: `0 0 8px ${c}`, opacity: 0.85,
              }}>{g}</span>
            ))}
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
            ['01', 'TEAM',     'done',  '+30'],
            ['02', 'IDEA',     'next',  '0/15'],
            ['03', 'KEY',      'wait',  '—'],
            ['04', 'BUILD',    'wait',  '—'],
            ['05', 'SUBMIT',   'wait',  '0/40'],
            ['06', 'JUDGE',    'wait',  '—'],
          ].map(([n, l, s, p], i) => (
            <div key={i} style={{
              padding: '18px 18px',
              background: s === 'done' ? 'var(--panel-2)' : s === 'next' ? 'var(--panel-2)' : 'var(--panel)',
              borderLeft: s === 'done' ? '2px solid var(--acid)' : s === 'next' ? '2px solid #ff7ac6' : '2px solid transparent',
            }}>
              <div className="dim" style={{ fontSize: 10, letterSpacing: '0.18em' }}>{n}</div>
              <div className="bold" style={{ color: 'var(--white)', marginTop: 4 }}>{l}</div>
              <div style={{
                fontSize: 11, marginTop: 6,
                color: s === 'done' ? 'var(--acid)' : s === 'next' ? '#ff7ac6' : 'var(--text-mute)',
              }}>{s === 'done' ? '✓ ' : s === 'next' ? '▸ ' : '○ '}{p}</div>
            </div>
          ))}
        </div>

        {/* roster + next */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div className="panel">
            <div className="panel-head"><span>// team roster</span><span className="right mute">2 / 2</span></div>
            <div style={{ padding: 18 }}>
              {[
                ['Jordan Lin', 'Biz · Pricing Analyst', 'jordan.l@altir.co', true],
                ['Asha Verma', 'Ops · Onboarding Lead', 'asha.v@altir.co',   false],
              ].map(([n, d, e, you], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderTop: i ? '1px solid var(--line)' : 0 }}>
                  <Avatar name={n} hue={i === 0 ? 'var(--acid)' : '#ff7ac6'} />
                  <div style={{ flex: 1 }}>
                    <div className="bold" style={{ color: 'var(--white)' }}>{n} {you && <span className="acid" style={{ fontSize: 10, marginLeft: 6 }}>YOU</span>}</div>
                    <div className="dim" style={{ fontSize: 11 }}>{d} · {e}</div>
                  </div>
                  <span className="pill ghost">● online</span>
                </div>
              ))}
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
    </div>
  );
}

function IdeaPickerArtboard() {
  const ideas = [
    { tag: 'OPS',     title: 'Auto-tag inbound CRM leads by intent',           pts: '~3h', stack: ['Python', 'OpenAI'], heat: 7 },
    { tag: 'CLAIMS',  title: 'Document checklist builder for review cycles',   pts: '~2h', stack: ['Replit', 'pdf-lib'], heat: 4 },
    { tag: 'INTERNAL',title: 'Slack daily-digest of Stripe + HubSpot events',  pts: '~2h', stack: ['Node', 'Slack API'], heat: 5 },
    { tag: 'DESIGN',  title: 'Slide composer from raw meeting transcripts',    pts: '~3h', stack: ['Next.js', 'Whisper'], heat: 9 },
    { tag: 'OPS',     title: 'Voice-to-ticket triage for support shifts',      pts: '~2h', stack: ['Twilio', 'GPT-4'], heat: 6 },
    { tag: 'BIZ',     title: 'Forecasted quote-to-close win-rate explainer',   pts: '~3h', stack: ['Anything'], heat: 3 },
  ];
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
            {['ALL · 18', 'OPS · 6', 'CLAIMS · 3', 'BIZ · 4', 'DESIGN · 2', 'INTERNAL · 3'].map((t, i) => (
              <span key={i} className={i === 0 ? 'pill acid' : 'pill'}>{t}</span>
            ))}
            <span className="pill ghost" style={{ marginLeft: 'auto' }}>SORT: HOTTEST ▾</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {ideas.map((it, i) => (
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
                {i === 3 && (
                  <div className="acid" style={{ fontSize: 11, marginTop: 12, fontWeight: 700 }}>▸ SELECTED · +3 PTS</div>
                )}
              </div>
            ))}
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
                padding: 12, fontSize: 13, color: 'var(--text-dim)', resize: 'none',
              }}
            />
            <div className="dim" style={{ fontSize: 11, marginTop: 8 }}>custom idea = +5 pts on top of submission</div>
          </div>

          <button className="btn acid lg">▸ Submit idea & unlock key path</button>
          <span className="dim" style={{ fontSize: 11, textAlign: 'center' }}>you can change this later · first submission gates the key</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FormTeamArtboard, TeamLockedArtboard, IdeaPickerArtboard });
