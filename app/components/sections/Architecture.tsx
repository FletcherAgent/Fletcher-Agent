export default function Architecture() {
  return (
    <section id="architecture">
      <div className="wrap">
        <div className="eyebrow reveal">Architecture</div>
        <h2 className="reveal">Intelligence first. Execution later. Risk always.</h2>
        <p className="lede reveal">
          Fletcher is not just a trading bot. It is an autonomous agentic mesh. Every pool creation event, 
          every slippage calculation, and every liquidity range is scored before a transaction is broadcasted.
        </p>

        <div className="pillars">
          <div className="pillar reveal">
            <svg className="pillar-glyph" viewBox="0 0 44 44" fill="none" stroke="#2bff5b" strokeWidth="1.4">
              <circle cx="22" cy="22" r="14" />
              <circle cx="22" cy="22" r="7" />
              <line x1="32" y1="32" x2="41" y2="41" />
            </svg>
            <h3>Nexa Fun Scout</h3>
            <p>
              Continuously monitors Robinhood Chain for newly launched tokens and Uniswap V3 PoolCreated events.
              Zero human intervention needed to discover Alpha.
            </p>
          </div>
          <div className="pillar reveal">
            <svg className="pillar-glyph" viewBox="0 0 44 44" fill="none" stroke="#2bff5b" strokeWidth="1.4">
              <rect x="6" y="22" width="5" height="14" />
              <rect x="14" y="14" width="5" height="22" />
              <rect x="22" y="6" width="5" height="30" stroke="#f2f2f2" />
              <rect x="30" y="14" width="5" height="22" />
            </svg>
            <h3>Liquidity Sculptor</h3>
            <p>
              Auto-compounds fees and dynamically rebalances tick ranges. Widen ranges during high volatility,
              tighten during sideways markets to maximize fee density.
            </p>
          </div>
          <div className="pillar reveal">
            <svg className="pillar-glyph" viewBox="0 0 44 44" fill="none" stroke="#2bff5b" strokeWidth="1.4">
              <path d="M22 4 L38 11 V22 C38 32 31 38 22 41 C13 38 6 32 6 22 V11 Z" />
              <path d="M15 22 L20 27 L29 17" stroke="#f2f2f2" />
            </svg>
            <h3>Risk Guardian</h3>
            <p>
              Evaluates impermanent loss against HODL strategies. If a token rugpulls or volatility breaches limits,
              the system triggers a hard stop.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
