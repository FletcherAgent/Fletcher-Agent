export default function Agents() {
  return (
    <section id="agents">
      <div className="wrap">
        <div className="eyebrow reveal">Agent Mesh</div>
        <h2 className="reveal">Six agents. One unified intelligence.</h2>

        <div className="agents">
          <div className="agent reveal">
            <span className="agent-id">AGT_01</span>
            <div>
              <h3>
                Orchestrator<span className="dot">_</span>
              </h3>
              <p>The central nervous system. Routes signals between agents and manages Telegram notifications.</p>
            </div>
          </div>
          <div className="agent reveal">
            <span className="agent-id">AGT_02</span>
            <div>
              <h3>
                Scout<span className="dot">_</span>
              </h3>
              <p>Connects via WebSockets to detect TokenCreated events natively on the NOXA Factory.</p>
            </div>
          </div>
          <div className="agent reveal">
            <span className="agent-id">AGT_03</span>
            <div>
              <h3>
                Tracker<span className="dot">_</span>
              </h3>
              <p>Intercepts Alchemy Webhooks to mirror high-conviction trades from targeted Alpha Wallets.</p>
            </div>
          </div>
          <div className="agent reveal">
            <span className="agent-id">AGT_04</span>
            <div>
              <h3>
                Trader<span className="dot">_</span>
              </h3>
              <p>Executes swap transactions instantly via Uniswap V3 Quoter & Router on Robinhood Chain.</p>
            </div>
          </div>
          <div className="agent reveal">
            <span className="agent-id">AGT_05</span>
            <div>
              <h3>
                Guardian<span className="dot">_</span>
              </h3>
              <p>Monitors active positions in real-time, executing dynamic trailing stop-losses to secure profits.</p>
            </div>
          </div>
          <div className="agent reveal">
            <span className="agent-id">AGT_06</span>
            <div>
              <h3>
                Risk Warden<span className="dot">_</span>
              </h3>
              <p>The gatekeeper. Enforces maximum portfolio heat caps and a strict 15% daily drawdown limit.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
