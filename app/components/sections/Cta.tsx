export default function Cta() {
  return (
    <section className="cta">
      <div className="wrap">
        <div className="eyebrow reveal">Deploy</div>
        <h2 className="reveal">Autonomous DeFi starts here</h2>
        <p className="lede reveal">
          Snipe Nexa Fun tokens and manage your liquidity on Robinhood Chain, completely hands-free.
        </p>
        <div className="cta-actions reveal">
          <a href="/dashboard" className="btn-solid" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Open Dashboard</a>
          <button className="btn-ghost">View on Github</button>
        </div>
      </div>
    </section>
  );
}
