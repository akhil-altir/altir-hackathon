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
                {window.TEAMS.map(t => (
                  <span key={t.id} className="team-tag" style={{ '--team': t.hue, fontSize: 10 }}>
                    <span className="swatch"></span>{t.name}
                  </span>
                ))}
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
        <DCArtboard id="admin-keys" label="API keys · pool + bulk add + assignment" width={1440} height={900}>
          <AdminKeysArtboard />
        </DCArtboard>
        <DCArtboard id="admin-scoring" label="Scoring mechanics · weights, rules, blend" width={1440} height={900}>
          <AdminScoringArtboard />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
