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
              { l: 'GITHUB REPO',     v: 'github.com/altir/quotebot-techday', state: 'ok',   pts: '+10', hint: 'public or org-readable · main branch demoable' },
              { l: 'README + SETUP',  v: 'detected: README.md · setup-notes.md', state: 'ok', pts: '+5',  hint: 'how to run it in <5 min' },
              { l: 'DEMO VIDEO',      v: 'loom.com/share/9b3f7c2e-quotebot-demo', state: 'ok', pts: '+15', hint: '90s max · narrate the build, not the slides' },
              { l: 'PRESENTATION',    v: 'figma.com/proto/QB-techday-deck',     state: 'ok', pts: '+10', hint: 'optional but recommended for judges' },
              { l: 'TECH STACK TAGS', v: 'Next.js · OpenAI · Whisper · Vercel · Replit', state: 'ok', pts: '—', hint: 'comma-separate · no restrictions' },
            ].map((f, i) => (
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
            ))}
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
              marginTop: 14, padding: 16, background: 'var(--bg)', border: '1px solid var(--line-2)',
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
                {['Next.js', 'OpenAI', 'Whisper', 'Vercel'].map(s => <span key={s} className="pill ghost">{s}</span>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, marginTop: 14 }}>
                {['Repo', 'Demo', 'Deck'].map(s => (
                  <span key={s} style={{ display: 'grid', placeItems: 'center', height: 30, border: '1px solid var(--line-2)', fontSize: 11, fontWeight: 700 }}>{s}</span>
                ))}
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
    </div>
  );
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
          {cards.map((t, i) => (
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
                {['REPO', 'DEMO', 'DECK'].map(s => (
                  <span key={s} style={{ display: 'grid', placeItems: 'center', height: 28, border: '1px solid var(--line-2)', fontSize: 10, fontWeight: 700, color: 'var(--text)' }}>{s} →</span>
                ))}
              </div>
              <div className="dim" style={{ fontSize: 10, marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <span>{t.members.join(' + ')}</span>
                <span>{i % 3 === 0 ? '17:24' : i % 3 === 1 ? '17:18' : '17:09'}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="dim" style={{ fontSize: 11, marginTop: 14, display: 'flex', justifyContent: 'space-between' }}>
          <span>API keys, audit notes and judge drafts stay private. Public viewers see this same gallery.</span>
          <span>showing 9 of 12 · scroll for more</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FinalSubmitArtboard, GalleryArtboard });
