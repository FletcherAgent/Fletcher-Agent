export default function Cta() {
  return (
    <section className="cta">
      <div className="wrap">
        <div className="eyebrow reveal">Deploy</div>
        <h2 className="reveal">Autonomous DeFi starts here</h2>
        <p className="lede reveal">
          LP the meta, snipe NOXA launches, and mirror smart money on Robinhood Chain. Completely hands-free, completely zero-custody.
        </p>
        <div className="cta-actions reveal">
          <a href="/dashboard-v2" className="btn-solid" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Open Dashboard</a>
          <a href="https://github.com/FletcherAgent" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>View on Github</a>
        </div>
      </div>
    </section>
  );
}
