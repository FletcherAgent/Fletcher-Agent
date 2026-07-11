export default function Agents() {
  return (
    <section id="agents">
      <div className="wrap">
        <div className="eyebrow reveal">Agent Mesh</div>
        <h2 className="reveal">Five agents. One unified intelligence.</h2>

        <div className="agents">
          <div className="agent reveal">
            <span className="agent-id">AGT_01</span>
            <div>
              <h3>
                Orchestrator<span className="dot">_</span>
              </h3>
              <p>The central brain. Dispatches tasks to sub-agents and handles lifecycle.</p>
            </div>
          </div>
          <div className="agent reveal">
            <span className="agent-id">AGT_02</span>
            <div>
              <h3>
                Scout<span className="dot">_</span>
              </h3>
              <p>Listens to Blockscout and on-chain RPCs for new tokens and pools.</p>
            </div>
          </div>
          <div className="agent reveal">
            <span className="agent-id">AGT_03</span>
            <div>
              <h3>
                Trader<span className="dot">_</span>
              </h3>
              <p>Interacts with the user via Telegram and executes buy/sell logic.</p>
            </div>
          </div>
          <div className="agent reveal">
            <span className="agent-id">AGT_04</span>
            <div>
              <h3>
                Guardian<span className="dot">_</span>
              </h3>
              <p>Analyzes token contracts for honeypots, mint privileges, and rug risks.</p>
            </div>
          </div>
          <div className="agent reveal" style={{ gridColumn: "1 / -1" }}>
            <span className="agent-id">AGT_05</span>
            <div>
              <h3>
                LP Manager<span className="dot">_</span>
              </h3>
              <p>Manages Uniswap V3 positions, auto-compounds, and rebalances volatility bands.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
