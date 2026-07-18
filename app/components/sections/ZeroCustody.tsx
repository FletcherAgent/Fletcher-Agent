export default function ZeroCustody() {
  return (
    <section id="zero-custody">
      <div className="wrap">
        <div className="eyebrow reveal">Architecture</div>
        <h2 className="reveal">Completely Zero Custody.</h2>
        <p className="lede reveal">
          Your keys never leave your hands. Fletcher generates unsigned transactions that you approve via Telegram, ensuring absolute security.
        </p>

        <div className="pillars reveal">
          <div className="pillar">
            <h3>Unsigned Tx Only<span className="dot" style={{ color: 'var(--green)' }}>_</span></h3>
            <p>Fletcher proposes trades but never executes them without explicit permission. Capital remains in your hardware wallet.</p>
          </div>
          <div className="pillar">
            <h3>Telegram Approval<span className="dot" style={{ color: 'var(--green)' }}>_</span></h3>
            <p>Instant push notifications to your Telegram for 1-click execution or rejection.</p>
          </div>
          <div className="pillar">
            <h3>ERC-4337 Session Keys<span className="dot" style={{ color: 'var(--green)' }}>_</span></h3>
            <p>Scoped, revocable permissions for full-autonomous LP. Fletcher can rebalance, but can never withdraw.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
