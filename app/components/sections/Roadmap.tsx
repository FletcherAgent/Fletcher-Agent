export default function Roadmap() {
  return (
    <section id="roadmap">
      <div className="wrap">
        <div className="eyebrow reveal">Roadmap</div>
        <h2 className="reveal">The Evolution of Fletcher</h2>
        
        <div className="roadmap-grid">
          <div className="roadmap-item reveal">
            <div className="phase">Phase 1 (Live)</div>
            <h3>Core Execution</h3>
            <ul>
              <li>Uniswap V3 Auto-Trading on Robinhood Chain</li>
              <li>NOXA Factory Sniping via WebSockets</li>
              <li>Telegram Push Notifications & Confirm Mode</li>
            </ul>
          </div>

          <div className="roadmap-item reveal">
            <div className="phase">Phase 2 (Current)</div>
            <h3>Alpha Tracking & Risk Protocol</h3>
            <ul>
              <li>Alchemy Webhook Interceptor for Copy-Trading</li>
              <li>15% Daily Drawdown Circuit Breaker</li>
              <li>Portfolio Heat Limits (Max 5 active trades)</li>
            </ul>
          </div>

          <div className="roadmap-item reveal" style={{ opacity: 0.6 }}>
            <div className="phase">Phase 3 (Upcoming)</div>
            <h3>Swarm Expansion</h3>
            <ul>
              <li>Multi-wallet distributed copy-trading</li>
              <li>AI-driven Sentiment Analysis via X (Twitter)</li>
              <li>Autonomous Smart Contract Deployer</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
