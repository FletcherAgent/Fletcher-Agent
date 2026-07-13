export default function Architecture() {
  return (
    <section id="architecture">
      <div className="wrap">
        <div className="eyebrow reveal">Architecture</div>
        <h2 className="reveal">Intelligence first. Execution later. Risk always.</h2>
        <p className="lede reveal">
          Fletcher is a sovereign AI mesh built for the Robinhood Chain. From scouting NOXA launches to executing precision copy-trades, every move is protected by military-grade risk management.
        </p>

        <div className="pillars">
          <div className="pillar reveal">
            <svg className="pillar-glyph" viewBox="0 0 44 44" fill="none" stroke="#2bff5b" strokeWidth="1.4">
              <circle cx="22" cy="22" r="14" />
              <circle cx="22" cy="22" r="7" />
              <line x1="32" y1="32" x2="41" y2="41" />
            </svg>
            <h3>Scout & Track</h3>
            <p>
              Dual-mode surveillance. The Scout monitors the NOXA Factory for new launches, while the Tracker intercepts Alpha wallet movements in real-time via Webhooks.
            </p>
          </div>
          <div className="pillar reveal">
            <svg className="pillar-glyph" viewBox="0 0 44 44" fill="none" stroke="#2bff5b" strokeWidth="1.4">
              <rect x="6" y="22" width="5" height="14" />
              <rect x="14" y="14" width="5" height="22" />
              <rect x="22" y="6" width="5" height="30" stroke="#f2f2f2" />
              <rect x="30" y="14" width="5" height="22" />
            </svg>
            <h3>Algorithmic Trader</h3>
            <p>
              Executes instant Buy/Sell orders via Uniswap V3 on the Robinhood Chain. Capable of fully autonomous sniping or human-in-the-loop confirmation mode.
            </p>
          </div>
          <div className="pillar reveal">
            <svg className="pillar-glyph" viewBox="0 0 44 44" fill="none" stroke="#2bff5b" strokeWidth="1.4">
              <path d="M22 4 L38 11 V22 C38 32 31 38 22 41 C13 38 6 32 6 22 V11 Z" />
              <path d="M15 22 L20 27 L29 17" stroke="#f2f2f2" />
            </svg>
            <h3>Guardian Protocol</h3>
            <p>
              Absolute capital preservation. Enforces a strict 15% daily drawdown limit, portfolio heat caps, and dynamic trailing stop-losses for all active positions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
