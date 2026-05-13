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
            ['  Handbook', false, ''],
          ].map(([l, on, r], i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '8px 10px', borderRadius: 3, fontSize: 12,
              background: on ? 'var(--panel-3)' : 'transparent',
              color: on ? 'var(--white)' : 'var(--text-dim)',
              fontWeight: on ? 700 : 500,
            }}>
              <span>{l}</span>
              <span className={r === '◆' ? 'acid' : 'mute'} style={{ fontSize: 10 }}>{r}</span>
            </div>
          ))}
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
                  display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden',
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
                  ['github repo',      'github.com/altir/quotebot-techday', false, '+10'],
                  ['demo video',       'add a 90-second loom or mp4',         false, '+15'],
                  ['presentation',     'figma, slides or pdf link',           false, '+10'],
                ].map(([l, hint, done, pts], i) => (
                  <div key={i} className="input" style={{ height: 'auto', padding: '10px 12px' }}>
                    <span className="prompt">▸</span>
                    <div style={{ flex: 1 }}>
                      <div className="label" style={{ fontSize: 9 }}>{l.toUpperCase()}</div>
                      <div className="dim" style={{ fontSize: 12 }}>{hint}</div>
                    </div>
                    <span className="pill acid">{pts}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* event points */}
            <div className="panel">
              <div className="panel-head"><span>// event points</span><span className="right acid">48 pts · rank 4</span></div>
              <div style={{ padding: 18 }}>
                {[
                  ['Complete team formed',          '+10', true],
                  ['Different departments',         '+5',  true],
                  ['Cross-function bonus (biz↔ops)','+10', true],
                  ['Idea submitted from bank',      '+13', true],
                  ['GitHub repo',                   '+10', false],
                  ['README + setup notes',          '+5',  false],
                  ['Demo video',                    '+15', false],
                ].map(([l, p, on], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '6px 0', borderBottom: i < 6 ? '1px solid var(--line)' : 0 }}>
                    <span className={on ? 'acid' : 'faint'} style={{ width: 14 }}>{on ? '✓' : '○'}</span>
                    <span style={{ fontSize: 12, color: on ? 'var(--text)' : 'var(--text-mute)' }}>{l}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: on ? 'var(--acid)' : 'var(--text-faint)', fontWeight: 700 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* activity / announcements row */}
          <div className="panel" style={{ padding: 0 }}>
            <div className="panel-head"><span>// live announcements</span><span className="right"><span className="dot live"></span><span className="dim">subscribed</span></span></div>
            <div style={{ padding: '12px 18px', display: 'grid', gap: 8 }}>
              {[
                ['14:32', 'KEYS RELEASED', 'all 12 keys unlocked. start hitting the api.', 'acid'],
                ['14:48', 'NORTHSTAR',     'first repo of the day — they\'re moving fast.', 'mute'],
                ['15:12', 'AUTOPILOT',     'first demo video uploaded — preview gallery is live.', 'mute'],
              ].map(([t, who, msg, c], i) => (
                <div key={i} style={{ display: 'flex', gap: 14, fontSize: 12, padding: '4px 0' }}>
                  <span className="mute" style={{ width: 42, fontVariantNumeric: 'tabular-nums' }}>{t}</span>
                  <span className={c} style={{ width: 130, fontWeight: 700 }}>{who}</span>
                  <span className="dim">{msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
          fontSize: 88, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--white)', lineHeight: 0.95,
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
          position: 'relative', maxWidth: 720, width: '100%',
        }}>
          <CornerCrop size={14} />
          <div className="label">PRELOADED · OPENAI · GPT-4o + WHISPER-1</div>
          <div style={{
            marginTop: 14, fontFamily: 'var(--mono)', fontSize: 28, fontWeight: 600,
            color: 'var(--acid)', letterSpacing: '0.04em', textShadow: '0 0 14px var(--acid-glow)',
            display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
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
          ['#ffb020', 60, 600, '◆'],  ['#9d6dff', 200, 320, '×'], ['#ff5a3c', 1180, 380, '+'],
          ['#00ff9d', 1340, 440, '×'],['#fff200',  60, 460, '◆'],
        ].map(([c, x, y, g], i) => (
          <span key={i} style={{
            position: 'absolute', left: x, top: y, color: c, fontSize: 22,
            textShadow: `0 0 12px ${c}`,
          }}>{g}</span>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { WorkspaceArtboard, KeyRevealArtboard });
