// screens-judge.jsx — Judge scoring console + final results / winners reveal

function JudgeArtboard() {
  const criteria = [
    { k: 'INNOVATION',          v: 88, n: 'How novel is the idea or approach?' },
    { k: 'BUSINESS USEFULNESS', v: 82, n: 'Could Altir actually use this?' },
    { k: 'EXECUTION',           v: 76, n: 'Does it work end-to-end in 3 hours?' },
    { k: 'DEMO QUALITY',        v: 91, n: 'Is the demo clear and tight?' },
    { k: 'PRESENTATION',        v: 84, n: 'Does the pitch land?' },
  ];
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
          {['Queue · 12', 'Drafts · 3', 'Submitted · 5', 'Help'].map((l, i) => (
            <a key={i} className={i === 0 ? 'is-active' : ''}>{l}</a>
          ))}
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
            const states = ['done','done','done','done','active','draft','todo','todo'];
            const s = states[i];
            return (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px', borderRadius: 3,
                background: s === 'active' ? 'var(--panel-3)' : 'transparent',
                borderLeft: s === 'active' ? `2px solid ${t.hue}` : '2px solid transparent',
                fontSize: 12,
              }}>
                <span style={{ width: 8, height: 8, background: t.hue }}></span>
                <span className="bold" style={{ color: s === 'todo' ? 'var(--text-dim)' : 'var(--white)', flex: 1 }}>{t.name}</span>
                <span style={{ fontSize: 10, color: s === 'done' ? 'var(--acid)' : s === 'draft' ? 'var(--warn)' : s === 'active' ? '#ff7ac6' : 'var(--text-faint)' }}>
                  {s === 'done' ? '✓' : s === 'draft' ? '◐' : s === 'active' ? '▸' : '○'}
                </span>
              </div>
            );
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
              {['▶ Demo video · 1:24', '⌥ GitHub repo', '◫ Presentation · 6 slides'].map((s, i) => (
                <button key={i} className="btn sm" style={{ justifyContent: 'flex-start' }}>{s}</button>
              ))}
            </div>
          </div>

          <div className="panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="label">YOUR SCORES · 0–100 PER CRITERION</div>
              <span className="pill warn">● DRAFT · AUTOSAVED 17:42:01</span>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              {criteria.map((c, i) => (
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
              ))}
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
    </div>
  );
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
          ['#c4ff00', 760, 760, '×'], ['#00d4ff', 360, 760, '+'], ['#ff2bd6', 1060, 800, '◆'],
        ].map(([c, x, y, g], i) => (
          <span key={i} style={{
            position: 'absolute', left: x, top: y, color: c, fontSize: 24, textShadow: `0 0 10px ${c}`,
          }}>{g}</span>
        ))}
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
            { rank: 3, t: window.TEAMS[4], score: 84.6, h: 180 },
          ].map((p, i) => (
            <div key={p.rank} className="panel" style={{
              padding: 22, height: p.h, position: 'relative',
              borderColor: p.rank === 1 ? 'var(--acid)' : 'var(--line)',
              boxShadow: p.rank === 1 ? '0 0 0 1px var(--acid), 0 0 48px var(--acid-glow)' : 'none',
              background: 'var(--panel)',
            }}>
              <CornerCrop size={12} color={p.rank === 1 ? 'var(--acid)' : p.t.hue} />
              <div className="label" style={{ color: p.rank === 1 ? 'var(--acid)' : 'var(--text-mute)' }}>
                # {p.rank === 1 ? 'FIRST PLACE · OVERALL' : p.rank === 2 ? 'SECOND' : 'THIRD'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                <span style={{ width: 14, height: 14, background: p.t.hue, boxShadow: `0 0 14px ${p.t.hue}` }}></span>
                <span style={{
                  fontSize: p.rank === 1 ? 36 : 26, fontWeight: 700, color: 'var(--white)', letterSpacing: '0.04em',
                  textShadow: p.rank === 1 ? `0 0 18px ${p.t.hue}` : 'none',
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
                  letterSpacing: '-0.03em',
                }}>{p.score}</span>
              </div>
            </div>
          ))}
        </div>

        {/* special awards row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { award: 'JUDGES\' CHOICE',       t: 'NOVA',        sub: 'highest judge avg · 88.6', hue: '#c4ff00' },
            { award: 'PEOPLE\'S CHOICE',      t: 'AUTOPILOT',   sub: '42 reactions in TV mode',  hue: '#ff5a3c' },
            { award: 'FASTEST SHIP',          t: 'NORTHSTAR',   sub: 'first repo at 14:48',      hue: '#ff8a00' },
            { award: 'CROSS-FUNCTIONAL CUP',  t: 'QUOTEBOT',    sub: 'biz × ops · highest delta',hue: '#ff7ac6' },
          ].map((a, i) => (
            <div key={i} className="panel" style={{ padding: 14, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: a.hue }}></div>
              <div className="label" style={{ fontSize: 9 }}>★ {a.award}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: a.hue, marginTop: 8, letterSpacing: '0.04em' }}>{a.t}</div>
              <div className="dim" style={{ fontSize: 11, marginTop: 4 }}>{a.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 22 }}>
          <button className="btn acid lg">▸ Export full standings (CSV)</button>
          <button className="btn lg ghost">View full leaderboard</button>
          <button className="btn lg ghost">Open gallery</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { JudgeArtboard, ResultsArtboard });
