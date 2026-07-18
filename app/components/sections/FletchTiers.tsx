export default function FletchTiers() {
  return (
    <section id="fletch-tiers">
      <div className="wrap">
        <div className="eyebrow reveal">$FLETCH Access Tiers</div>
        <h2 className="reveal">Unlock the Swarm.</h2>
        <p className="lede reveal">
          Fletcher operates on a tiered access model based on your $FLETCH holdings.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', background: 'var(--line)', border: '1px solid var(--line)', marginTop: '64px' }} className="reveal">
          <div style={{ background: 'var(--bg)', padding: '40px 30px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '12px' }}>Free<span style={{ color: 'var(--green)' }}>_</span></h3>
            <p style={{ color: 'var(--dim)', fontSize: '13.5px' }}>Screening feed (delayed). Basic market signals and token analysis.</p>
          </div>
          <div style={{ background: 'var(--bg)', padding: '40px 30px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '12px' }}>Tier 1<span style={{ color: 'var(--green)' }}>_</span></h3>
            <p style={{ color: 'var(--dim)', fontSize: '13.5px' }}>1 manual position. Access to the Scout agent for real-time alerts.</p>
          </div>
          <div style={{ background: 'var(--bg)', padding: '40px 30px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '12px' }}>Tier 2<span style={{ color: 'var(--green)' }}>_</span></h3>
            <p style={{ color: 'var(--dim)', fontSize: '13.5px' }}>3 positions semi-auto. Deploy concentrated LP ranges via Telegram.</p>
          </div>
          <div style={{ background: 'var(--bg)', padding: '40px 30px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '12px' }}>Tier 3<span style={{ color: 'var(--green)' }}>_</span></h3>
            <p style={{ color: 'var(--dim)', fontSize: '13.5px' }}>Full autonomous LP + copy-trade. Maximum heat capacity and alpha mirroring.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
