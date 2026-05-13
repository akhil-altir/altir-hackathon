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
  // 12 teams with admin-side state
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
        {/* LEFT — stats + table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <SectionTitle kicker="admin · console" right={
            <span style={{ display: 'flex', gap: 6 }}>
              <span className="pill" style={{ color: '#ff2bd6', borderColor: 'rgba(255,43,214,0.4)' }}>● PHASE / BUILD</span>
              <span className="pill ghost">UPDATED 16:48:09</span>
            </span>
          }>
            Everything, in one place.
          </SectionTitle>

          {/* stat strip */}
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

          {/* mega table */}
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

        {/* RIGHT — phase control + announcements */}
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
  const keys = [
    { id: 'sk-aLT1r_NV4_••••8mZ2', prov: 'openai',    model: 'gpt-4o',         rl: '25k/min', team: 'NOVA',       hue: '#c4ff00', status: 'live',    usage: 78, tok: '18.4k', last: '16:47' },
    { id: 'sk-aLT1r_PRm_••••7kT9', prov: 'openai',    model: 'gpt-4o',         rl: '25k/min', team: 'PROMPTOPS',  hue: '#ff2bd6', status: 'live',    usage: 64, tok: '14.8k', last: '16:46' },
    { id: 'sk-aLT1r_CLm_••••2pX1', prov: 'openai',    model: 'gpt-4o',         rl: '25k/min', team: 'CLAIMCRAFT', hue: '#00d4ff', status: 'live',    usage: 52, tok: '11.2k', last: '16:43' },
    { id: 'sk-aLT1r_PXd_••••4nQ8', prov: 'openai',    model: 'gpt-4o-mini',    rl: '50k/min', team: 'PIXELDESK',  hue: '#ffb020', status: 'live',    usage: 31, tok: '9.1k',  last: '16:38' },
    { id: 'sk-ant1r_GRw_••••6kL3', prov: 'anthropic', model: 'claude-sonnet',  rl: '20k/min', team: 'GROWTHHACK', hue: '#9d6dff', status: 'live',    usage: 88, tok: '21.6k', last: '16:48' },
    { id: 'sk-aLT1r_APt_••••3vC2', prov: 'openai',    model: 'gpt-4o',         rl: '25k/min', team: 'AUTOPILOT',  hue: '#ff5a3c', status: 'live',    usage: 92, tok: '22.8k', last: '16:48' },
    { id: 'sk-aLT1r_BCv_••••9rH4', prov: 'openai',    model: 'gpt-4o',         rl: '25k/min', team: 'BIGCANVAS',  hue: '#00ff9d', status: 'live',    usage: 47, tok: '10.8k', last: '16:31' },
    { id: 'sk-aLT1r_QBt_••••3kQ7', prov: 'openai',    model: 'gpt-4o',         rl: '25k/min', team: 'QUOTEBOT',   hue: '#ff7ac6', status: 'live',    usage: 41, tok: '9.6k',  last: '16:42' },
    { id: 'sk-aLT1r_UWr_••••8pZ5', prov: 'anthropic', model: 'claude-sonnet',  rl: '20k/min', team: 'UNDERWRITE', hue: '#fff200', status: 'live',    usage: 58, tok: '13.4k', last: '16:35' },
    { id: 'sk-aLT1r_HFx_••••2nB6', prov: 'openai',    model: 'gpt-4o',         rl: '25k/min', team: 'HOTFIX',     hue: '#00aaff', status: 'live',    usage: 67, tok: '15.2k', last: '16:44' },
    { id: 'sk-aLT1r_KFf_••••5tD1', prov: 'openai',    model: 'gpt-4o',         rl: '25k/min', team: 'KICKOFF',    hue: '#ff4d4d', status: 'rotated', usage: 22, tok: '4.8k',  last: '15:18' },
    { id: 'sk-aLT1r_KFf_••••9wM7', prov: 'openai',    model: 'gpt-4o',         rl: '25k/min', team: 'KICKOFF',    hue: '#ff4d4d', status: 'live',    usage: 38, tok: '8.2k',  last: '16:39' },
    { id: 'sk-aLT1r_NSt_••••1xJ0', prov: 'openai',    model: 'gpt-4o',         rl: '25k/min', team: 'NORTHSTAR',  hue: '#ff8a00', status: 'revoked', usage: 12, tok: '2.4k',  last: '15:42' },
    { id: 'sk-aLT1r_____________', prov: 'openai',    model: 'gpt-4o',         rl: '25k/min', team: null,         hue: null,      status: 'spare',   usage: 0,  tok: '—',     last: '—' },
  ];

  return (
    <div className="ab" style={{ width: 1440, height: 900 }}>
      <BrowserChrome url="techday.altir.internal/admin/keys" title="admin · api keys" />
      <AdminTopbar active="keys" />

      <div style={{ position: 'absolute', inset: '96px 24px 24px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18 }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <SectionTitle kicker="admin · key pool"
            right={<span style={{ display: 'flex', gap: 6 }}>
              <span className="pill acid">14 KEYS</span>
              <span className="pill">12 ASSIGNED</span>
              <span className="pill warn">1 SPARE</span>
              <span className="pill danger">1 REVOKED</span>
            </span>}>
            API key pool.
          </SectionTitle>

          {/* bulk add */}
          <div className="panel" style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div className="label" style={{ marginBottom: 6 }}>BULK ADD · PASTE ONE PER LINE</div>
                <div style={{
                  background: 'var(--panel-2)', border: '1px solid var(--line-2)',
                  padding: '10px 12px', height: 76, fontSize: 12, fontFamily: 'var(--mono)',
                  color: 'var(--text-dim)', overflow: 'hidden', lineHeight: 1.6,
                }}>
                  <div style={{ color: 'var(--acid)' }}>sk-aLT1r_____new_____1c3F4kZ9p</div>
                  <div style={{ color: 'var(--acid)' }}>sk-aLT1r_____new_____7vT8bM2x</div>
                  <div className="dim" style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'var(--acid)' }}>$</span>
                    <span className="caret" style={{ marginLeft: 6 }}></span>
                  </div>
                </div>
              </div>
              <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <div className="label" style={{ marginBottom: 6 }}>PROVIDER</div>
                  <div className="input" style={{ height: 32 }}>
                    <span style={{ color: 'var(--white)', fontSize: 12 }}>openai</span>
                    <span className="dim" style={{ marginLeft: 'auto' }}>▾</span>
                  </div>
                </div>
                <div>
                  <div className="label" style={{ marginBottom: 6 }}>MODEL</div>
                  <div className="input" style={{ height: 32 }}>
                    <span style={{ color: 'var(--white)', fontSize: 12 }}>gpt-4o</span>
                    <span className="dim" style={{ marginLeft: 'auto' }}>▾</span>
                  </div>
                </div>
                <div>
                  <div className="label" style={{ marginBottom: 6 }}>RATE LIMIT</div>
                  <div className="input" style={{ height: 32 }}>
                    <span style={{ color: 'var(--white)', fontSize: 12 }}>25k tok/min</span>
                    <span className="dim" style={{ marginLeft: 'auto' }}>▾</span>
                  </div>
                </div>
              </div>
              <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="label">ASSIGNMENT</div>
                <button className="btn acid sm" style={{ justifyContent: 'flex-start' }}>⚂ Auto-assign (round robin)</button>
                <button className="btn sm" style={{ justifyContent: 'flex-start' }}>○ Add as spare pool</button>
                <button className="btn ghost sm" style={{ justifyContent: 'flex-start' }}>↳ Pick team manually</button>
                <button className="btn sm" style={{ borderColor: 'var(--acid)', color: 'var(--acid)', marginTop: 4 }}>＋ Add 2 keys</button>
              </div>
            </div>
          </div>

          {/* table */}
          <div className="panel" style={{ padding: 0, minWidth: 0, overflow: 'hidden' }}>
            <div className="panel-head">
              <span>// key registry · 14 rows</span>
              <span className="right">
                <span className="dim" style={{ fontSize: 10 }}>filter:</span>
                <span className="pill acid" style={{ fontSize: 9 }}>ALL</span>
                <span className="pill" style={{ fontSize: 9 }}>LIVE</span>
                <span className="pill" style={{ fontSize: 9 }}>REVOKED</span>
                <button className="btn ghost sm">⟲ rotate all</button>
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.8fr 0.7fr 0.9fr 0.7fr 1fr 0.7fr 1.1fr 0.6fr 0.7fr',
              padding: '8px 14px', borderBottom: '1px solid var(--line)',
              fontSize: 9, color: 'var(--text-mute)', letterSpacing: '0.14em',
            }}>
              <span>KEY</span><span>PROV</span><span>MODEL</span><span>RATE</span>
              <span>ASSIGNED TO</span><span>STATUS</span><span>USAGE</span>
              <span style={{ textAlign: 'right' }}>LAST</span><span style={{ textAlign: 'right' }}>ACT</span>
            </div>
            {keys.map((k, i) => {
              const sc = k.status === 'live' ? 'var(--acid)' : k.status === 'rotated' ? 'var(--warn)' : k.status === 'revoked' ? 'var(--danger)' : 'var(--text-mute)';
              return (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '1.8fr 0.7fr 0.9fr 0.7fr 1fr 0.7fr 1.1fr 0.6fr 0.7fr',
                  padding: '8px 14px', alignItems: 'center', fontSize: 11,
                  borderBottom: i < keys.length - 1 ? '1px solid var(--line)' : 0,
                  background: k.status === 'spare' ? 'rgba(196,255,0,0.04)' : k.status === 'revoked' ? 'rgba(255,77,77,0.04)' : 'transparent',
                }}>
                  <span style={{ fontFamily: 'var(--mono)', color: k.status === 'revoked' ? 'var(--text-mute)' : 'var(--white)', textDecoration: k.status === 'revoked' ? 'line-through' : 'none' }}>
                    {k.id}
                  </span>
                  <span className="dim">{k.prov}</span>
                  <span className="dim">{k.model}</span>
                  <span className="dim">{k.rl}</span>
                  <span>
                    {k.team ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 7, height: 7, background: k.hue, boxShadow: `0 0 6px ${k.hue}` }}></span>
                        <span className="bold" style={{ color: 'var(--white)' }}>{k.team}</span>
                      </span>
                    ) : (
                      <span className="acid" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>＋ ASSIGN</span>
                    )}
                  </span>
                  <span style={{ color: sc, fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>● {k.status}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="bar" style={{ width: 70, height: 4 }}>
                      <i style={{ width: `${k.usage}%`, background: k.usage > 85 ? 'var(--danger)' : k.usage > 60 ? 'var(--warn)' : 'var(--acid)' }}></i>
                    </div>
                    <span className="dim" style={{ fontSize: 10, fontVariantNumeric: 'tabular-nums', width: 36 }}>{k.tok}</span>
                  </span>
                  <span className="dim" style={{ textAlign: 'right', fontSize: 10, fontVariantNumeric: 'tabular-nums' }}>{k.last}</span>
                  <span style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                    <button className="btn ghost sm" style={{ height: 20, padding: '0 6px', fontSize: 9 }}>⟲</button>
                    <button className="btn ghost sm" style={{ height: 20, padding: '0 6px', fontSize: 9 }}>⌫</button>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="panel" style={{ padding: 18 }}>
            <div className="label">TOTAL USAGE · COHORT</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: 'var(--acid)', textShadow: '0 0 24px var(--acid-glow)', letterSpacing: '-0.03em', marginTop: 4 }}>
              162.3<span style={{ fontSize: 18, color: 'var(--text-mute)' }}>k tok</span>
            </div>
            <div className="dim" style={{ fontSize: 11, marginTop: 2 }}>of 12M budget · 1.4% used</div>
            <div className="ascii" style={{ margin: '12px 0 8px' }}>{'─'.repeat(36)}</div>
            <div style={{ display: 'grid', gap: 6 }}>
              {[
                ['AUTOPILOT', 92, '22.8k'],
                ['GROWTHHACK', 88, '21.6k'],
                ['NOVA', 78, '18.4k'],
                ['HOTFIX', 67, '15.2k'],
                ['PROMPTOPS', 64, '14.8k'],
              ].map(([n, p, t], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                  <span className="bold" style={{ width: 96, color: 'var(--white)' }}>{n}</span>
                  <div className="bar" style={{ flex: 1, height: 4 }}><i style={{ width: `${p}%` }}></i></div>
                  <span className="dim" style={{ width: 40, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel" style={{ padding: 18 }}>
            <div className="label" style={{ marginBottom: 8 }}>ROTATION POLICY</div>
            <div className="kv" style={{ marginBottom: 6 }}><span className="k">on rate-limit</span><span className="v acid">auto-rotate</span></div>
            <div className="kv" style={{ marginBottom: 6 }}><span className="k">on leak</span><span className="v danger">revoke + alert</span></div>
            <div className="kv" style={{ marginBottom: 6 }}><span className="k">cool-down</span><span className="v">60s</span></div>
            <div className="kv"><span className="k">max per team</span><span className="v">2 active</span></div>
            <button className="btn ghost sm" style={{ width: '100%', marginTop: 12 }}>⌥ edit policy</button>
          </div>

          <div className="panel" style={{ padding: 14, border: '1px solid rgba(255,77,77,0.35)', background: 'rgba(255,77,77,0.04)' }}>
            <div className="label" style={{ color: 'var(--danger)' }}>⚠ INCIDENT</div>
            <div style={{ fontSize: 12, marginTop: 6, color: 'var(--white)', lineHeight: 1.4 }}>
              <span className="bold">NORTHSTAR</span> key posted in #general at 15:42 · auto-revoked · new key issued.
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
  const criteria = [
    { k: 'INNOVATION',          w: 20, n: 'novelty of idea + approach' },
    { k: 'BUSINESS USEFULNESS', w: 25, n: 'could altir actually use this?' },
    { k: 'EXECUTION',           w: 20, n: 'does it work end-to-end?' },
    { k: 'DEMO QUALITY',        w: 20, n: 'is the demo clear + tight?' },
    { k: 'PRESENTATION',        w: 15, n: 'does the pitch land?' },
  ];
  const rules = [
    ['team-complete',        'Complete team formed',                'team',  10, true],
    ['cross-dept',           'Different departments',               'team',   5, true],
    ['cross-function',       'Very different functions (biz↔ops)',  'team',  10, true],
    ['idea-bank',            'Idea picked from bank',               'idea',   3, true],
    ['idea-custom',          'Custom idea written',                 'idea',   5, true],
    ['idea-submitted',       'Idea submitted before lock',          'idea',  10, true],
    ['repo-added',           'GitHub repo added',                   'build', 10, true],
    ['readme',               'README + setup notes',                'build',  5, true],
    ['demo-video',           'Demo video uploaded',                 'build', 15, true],
    ['presentation',         'Presentation added',                  'build', 10, true],
    ['early-submit',         'Submitted before 17:00',              'build', 10, true],
    ['react-bonus',          'TV gallery reactions (per 10)',       'live',   2, true],
    ['judge-flag-penalty',   'Flagged by judge',                    'pen',  -10, true],
    ['late-submit',          'Submitted after deadline',            'pen',  -20, false],
  ];
  const ruleColor = (t) => t === 'pen' ? 'var(--danger)' : t === 'team' ? '#ff7ac6' : t === 'idea' ? '#00d4ff' : t === 'build' ? 'var(--acid)' : 'var(--warn)';

  return (
    <div className="ab" style={{ width: 1440, height: 900 }}>
      <BrowserChrome url="techday.altir.internal/admin/scoring" title="admin · scoring mechanics" />
      <AdminTopbar active="scoring" />

      <div style={{ position: 'absolute', inset: '96px 24px 24px' }}>
        <SectionTitle kicker="admin · scoring engine" right={
          <span style={{ display: 'flex', gap: 6 }}>
            <span className="pill" style={{ color: '#ff2bd6', borderColor: 'rgba(255,43,214,0.4)' }}>DRAFT · CHANGES NOT PUBLISHED</span>
            <button className="btn acid sm">▸ publish to leaderboard</button>
            <button className="btn ghost sm">↺ reset to defaults</button>
          </span>
        }>
          How the score is built.
        </SectionTitle>

        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1.25fr 0.95fr', gap: 14, marginTop: 14, height: 720 }}>
          {/* 1. JUDGE CRITERIA */}
          <div className="panel" style={{ padding: 18, display: 'flex', flexDirection: 'column' }}>
            <div className="label">01 · JUDGE CRITERIA · WEIGHTS</div>
            <p className="dim" style={{ fontSize: 11, marginTop: 6 }}>
              Each judge scores 0–100 per criterion. Weights are applied to their composite.
            </p>
            <div className="ascii" style={{ margin: '10px 0' }}>{'─'.repeat(34)}</div>
            <div style={{ display: 'grid', gap: 14, flex: 1 }}>
              {criteria.map((c, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <span className="bold" style={{ color: 'var(--white)', fontSize: 12 }}>{c.k}</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--acid)', textShadow: '0 0 8px var(--acid-glow)', fontVariantNumeric: 'tabular-nums' }}>
                      {c.w}<span style={{ fontSize: 11, color: 'var(--text-mute)' }}>%</span>
                    </span>
                  </div>
                  <div className="dim" style={{ fontSize: 10, marginBottom: 6 }}>{c.n}</div>
                  <div style={{ position: 'relative', height: 6, background: 'var(--panel-3)' }}>
                    <div style={{ position: 'absolute', inset: 0, width: `${c.w * 3}%`, background: 'var(--acid)', boxShadow: '0 0 10px var(--acid-glow)' }}></div>
                    <div style={{ position: 'absolute', top: -3, left: `calc(${c.w * 3}% - 4px)`, width: 8, height: 12, background: 'var(--white)' }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--panel-2)', border: '1px solid var(--line-2)', display: 'flex', justifyContent: 'space-between' }}>
              <span className="label">TOTAL WEIGHTS</span>
              <span className="bold acid" style={{ fontSize: 16, textShadow: '0 0 10px var(--acid-glow)' }}>100% ✓</span>
            </div>
          </div>

          {/* 2. EVENT POINT RULES */}
          <div className="panel" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="panel-head">
              <span>// 02 · event point rules</span>
              <span className="right">
                <span className="pill ghost" style={{ fontSize: 9 }}>14 RULES</span>
                <button className="btn ghost sm">＋ add rule</button>
              </span>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 0.5fr 0.5fr 0.6fr',
              padding: '8px 14px', borderBottom: '1px solid var(--line)',
              fontSize: 9, color: 'var(--text-mute)', letterSpacing: '0.14em',
            }}>
              <span>RULE</span><span>BUCKET</span><span style={{ textAlign: 'right' }}>POINTS</span><span style={{ textAlign: 'right' }}>STATE</span>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              {rules.map(([id, label, bucket, pts, on], i) => (
                <div key={id} style={{
                  display: 'grid', gridTemplateColumns: '1fr 0.5fr 0.5fr 0.6fr',
                  padding: '7px 14px', alignItems: 'center', fontSize: 11.5,
                  borderBottom: i < rules.length - 1 ? '1px solid var(--line)' : 0,
                  background: !on ? 'transparent' : pts < 0 ? 'rgba(255,77,77,0.04)' : 'transparent',
                  opacity: on ? 1 : 0.45,
                }}>
                  <span>
                    <span style={{ color: 'var(--white)', fontWeight: 600 }}>{label}</span>
                    <span className="faint" style={{ marginLeft: 8, fontSize: 9 }}>{id}</span>
                  </span>
                  <span style={{ color: ruleColor(bucket), fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>● {bucket}</span>
                  <span style={{ textAlign: 'right', fontWeight: 700, color: pts < 0 ? 'var(--danger)' : 'var(--acid)', fontVariantNumeric: 'tabular-nums' }}>
                    {pts > 0 ? '+' : ''}{pts}
                  </span>
                  <span style={{ textAlign: 'right' }}>
                    <span className="pill" style={{
                      fontSize: 8,
                      color: on ? 'var(--acid)' : 'var(--text-mute)',
                      borderColor: on ? 'rgba(196,255,0,0.4)' : 'var(--line-2)',
                    }}>● {on ? 'ON' : 'OFF'}</span>
                  </span>
                </div>
              ))}
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--line)', background: 'var(--panel-2)', display: 'flex', justifyContent: 'space-between' }}>
              <span className="label">MAX EVENT POINTS</span>
              <span className="bold acid" style={{ fontSize: 16, textShadow: '0 0 10px var(--acid-glow)', fontVariantNumeric: 'tabular-nums' }}>138 pts</span>
            </div>
          </div>

          {/* 3. BLEND + PREVIEW */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
            <div className="panel" style={{ padding: 18 }}>
              <div className="label">03 · BLEND FORMULA</div>
              <p className="dim" style={{ fontSize: 11, marginTop: 6 }}>
                Final score = (judge × W<sub>j</sub>) + (event × W<sub>e</sub>) normalized to 100.
              </p>
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 8 }}>
                  <span className="dim">EVENT</span>
                  <span className="dim">JUDGE</span>
                </div>
                <div style={{ position: 'relative', height: 14, background: 'var(--panel-3)', border: '1px solid var(--line-2)', display: 'flex' }}>
                  <div style={{ width: '40%', background: 'var(--acid)', boxShadow: '0 0 12px var(--acid-glow)' }}></div>
                  <div style={{ width: '60%', background: '#ff7ac6', boxShadow: '0 0 12px rgba(255,122,198,0.5)' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 14, fontWeight: 700 }}>
                  <span className="acid" style={{ textShadow: '0 0 8px var(--acid-glow)' }}>40%</span>
                  <span style={{ color: '#ff7ac6', textShadow: '0 0 8px rgba(255,122,198,0.5)' }}>60%</span>
                </div>
                <div className="ascii" style={{ margin: '12px 0' }}>{'─'.repeat(30)}</div>
                <div className="kv" style={{ marginBottom: 6 }}><span className="k">tie-break 1</span><span className="v">higher judge avg</span></div>
                <div className="kv" style={{ marginBottom: 6 }}><span className="k">tie-break 2</span><span className="v">earliest submission</span></div>
                <div className="kv" style={{ marginBottom: 6 }}><span className="k">judge drafts</span><span className="v warn">excluded</span></div>
                <div className="kv"><span className="k">cap per rule</span><span className="v">no cap</span></div>
              </div>
            </div>

            {/* live preview */}
            <div className="panel" style={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="panel-head">
                <span>// live preview · top 5</span>
                <span className="right"><span className="dot live"></span><span className="dim">recomputes on change</span></span>
              </div>
              <div style={{ padding: '8px 0', flex: 1 }}>
                {[
                  { n: 'AUTOPILOT',  h: '#ff5a3c', e: 128, j: 84, d: '0'  },
                  { n: 'NOVA',       h: '#c4ff00', e: 124, j: 88, d: '+1' },
                  { n: 'GROWTHHACK', h: '#9d6dff', e: 119, j: 81, d: '-1' },
                  { n: 'PROMPTOPS',  h: '#ff2bd6', e: 113, j: 79, d: '+1' },
                  { n: 'QUOTEBOT',   h: '#ff7ac6', e: 113, j: 78, d: '+2' },
                ].map((r, i) => {
                  const blend = (r.j * 0.6 + (r.e / 138 * 100) * 0.4).toFixed(1);
                  return (
                    <div key={i} style={{
                      display: 'grid', gridTemplateColumns: '20px 1fr auto auto',
                      padding: '8px 14px', alignItems: 'center', gap: 8, fontSize: 11,
                      borderBottom: i < 4 ? '1px solid var(--line)' : 0,
                    }}>
                      <span className="bold" style={{ color: i === 0 ? 'var(--acid)' : 'var(--text-mute)', fontVariantNumeric: 'tabular-nums' }}>0{i + 1}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 7, height: 7, background: r.h, boxShadow: `0 0 6px ${r.h}` }}></span>
                        <span className="bold" style={{ color: 'var(--white)' }}>{r.n}</span>
                      </span>
                      <span style={{ fontSize: 9, color: r.d.startsWith('+') ? 'var(--acid)' : r.d.startsWith('-') ? 'var(--danger)' : 'var(--text-mute)', fontWeight: 700 }}>
                        {r.d === '0' ? '—' : r.d}
                      </span>
                      <span className="bold acid" style={{ fontSize: 15, textShadow: '0 0 8px var(--acid-glow)', fontVariantNumeric: 'tabular-nums', width: 44, textAlign: 'right' }}>{blend}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ padding: '10px 14px', borderTop: '1px solid var(--line)', background: 'var(--panel-2)' }}>
                <div className="dim" style={{ fontSize: 10, lineHeight: 1.5 }}>
                  ⚠ publishing recomputes <span className="acid bold">all 12 teams</span> and updates leaderboard + TV mode within 5s.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminConsoleArtboard, AdminKeysArtboard, AdminScoringArtboard });
