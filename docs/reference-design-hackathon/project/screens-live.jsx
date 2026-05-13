// screens-live.jsx — Participant leaderboard + TV / Live Energy display

function LeaderboardArtboard() {
  const ranked = [
    { ...window.TEAMS[5], pts: 128, judge: 84, delta: '+2' },  // autopilot
    { ...window.TEAMS[0], pts: 124, judge: 88, delta: '0'  },  // nova
    { ...window.TEAMS[4], pts: 119, judge: 81, delta: '+1' },  // growthhack
    { ...window.TEAMS[1], pts: 113, judge: 79, delta: '-1' },  // promptops
    { ...window.TEAMS[7], pts: 113, judge: 78, delta: '+3' },  // quotebot
    { ...window.TEAMS[2], pts: 108, judge: 80, delta: '-2' },  // claimcraft
    { ...window.TEAMS[9], pts: 102, judge: 76, delta: '0'  },  // hotfix
    { ...window.TEAMS[6], pts:  98, judge: 74, delta: '+1' },  // bigcanvas
    { ...window.TEAMS[3], pts:  91, judge: 71, delta: '-1' },  // pixeldesk
    { ...window.TEAMS[11], pts: 88, judge: 70, delta: '+2' },  // northstar
    { ...window.TEAMS[8], pts:  82, judge: 66, delta: '-3' },  // underwrite
    { ...window.TEAMS[10], pts: 71, judge: 63, delta: '0'  },  // kickoff
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
              const blended = Math.round(t.judge * 0.6 + (t.pts / 138 * 100) * 0.4);
              const isYou = t.id === 'quotebot';
              return (
                <div key={t.id} style={{
                  display: 'grid', gridTemplateColumns: '40px 1.6fr 1fr 1fr 1fr 60px',
                  padding: '10px 14px', alignItems: 'center',
                  borderBottom: i < 11 ? '1px solid var(--line)' : 0,
                  background: isYou ? 'var(--acid-soft)' : 'transparent',
                  borderLeft: isYou ? '2px solid var(--acid)' : '2px solid transparent',
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
                    color: t.delta.startsWith('+') ? 'var(--acid)' : t.delta.startsWith('-') ? 'var(--danger)' : 'var(--text-mute)',
                  }}>{t.delta === '0' ? '—' : t.delta}</span>
                </div>
              );
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
                ['16:48', 'AUTOPILOT',  'demo video uploaded', '+15', 'acid'],
                ['16:46', 'JUDGE · MAYA','draft score: NORTHSTAR · 82/100', '—', 'mute'],
                ['16:42', 'QUOTEBOT',   'repo submitted github.com/altir/quotebot', '+10', 'acid'],
                ['16:39', 'HOTFIX',     'changed idea to "stack-trace narrator"', '—', 'mute'],
                ['16:35', 'PIXELDESK',  'README + setup notes',  '+5',  'acid'],
                ['16:30', 'CLAIMCRAFT', 'team formed (late, admin override)',  '+10', 'warn'],
                ['16:28', 'BIGCANVAS',  'demo video uploaded',   '+15', 'acid'],
                ['16:20', 'JUDGE · SAM','submitted scores for 4 teams', '—', 'mute'],
              ].map(([t, who, msg, pts, c], i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: i < 7 ? '1px solid var(--line)' : 0, alignItems: 'center', fontSize: 11.5 }}>
                  <span className="mute" style={{ width: 38, fontVariantNumeric: 'tabular-nums' }}>{t}</span>
                  <span className={c} style={{ width: 110, fontWeight: 700 }}>{who}</span>
                  <span className="dim" style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg}</span>
                  {pts !== '—' && <span className="pill acid" style={{ fontSize: 9 }}>{pts}</span>}
                </div>
              ))}
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
              ['Judges done', '2 / 4'],
            ].map(([l, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 5 ? '1px solid var(--line)' : 0, fontSize: 12 }}>
                <span className="dim">{l}</span>
                <span className="bold" style={{ color: v.split(' / ')[0] === v.split(' / ')[1] ? 'var(--acid)' : 'var(--text)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TVArtboard() {
  const top5 = [
    { ...window.TEAMS[5], pts: 128 },
    { ...window.TEAMS[0], pts: 124 },
    { ...window.TEAMS[4], pts: 119 },
    { ...window.TEAMS[1], pts: 113 },
    { ...window.TEAMS[7], pts: 113 },
  ];
  return (
    <div className="ab" style={{ width: 1920, height: 1080 }}>
      <div className="ab-grid" style={{ backgroundSize: '64px 64px' }}></div>

      {/* big chrome top */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 24, padding: '24px 36px', borderBottom: '1px solid var(--line)',
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
            {top5.map((t, i) => (
              <div key={t.id} style={{
                display: 'grid', gridTemplateColumns: '60px 1fr 220px',
                alignItems: 'center', gap: 24,
                padding: '18px 22px',
                background: 'var(--panel-2)',
                border: i === 0 ? '1px solid var(--acid)' : '1px solid var(--line)',
                boxShadow: i === 0 ? '0 0 0 1px var(--acid), 0 0 36px var(--acid-glow)' : 'none',
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
            ))}
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
              ['DECKS READY', 10, 12],
            ].map(([l, n, d], i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                  <span className="dim" style={{ letterSpacing: '0.14em' }}>{l}</span>
                  <span className="bold" style={{ color: n === d ? 'var(--acid)' : 'var(--white)' }}>{n} / {d}</span>
                </div>
                <div className="bar" style={{ height: 6 }}><i style={{ width: `${n / d * 100}%`, background: n === d ? 'var(--acid)' : '#ff7ac6' }}></i></div>
              </div>
            ))}
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
        whiteSpace: 'nowrap', overflow: 'hidden',
      }}>
        <span style={{ background: '#000', color: 'var(--acid)', padding: '8px 14px', letterSpacing: '0.2em' }}>● LIVE</span>
        <span>AUTOPILOT moves to #1</span><span>●</span>
        <span>NOVA holds judge favourite at 88/100</span><span>●</span>
        <span>9 of 12 demos uploaded</span><span>●</span>
        <span>Build closes in 00:41:12</span><span>●</span>
        <span>Winners announced 18:30 sharp</span>
      </div>
    </div>
  );
}

Object.assign(window, { LeaderboardArtboard, TVArtboard });
