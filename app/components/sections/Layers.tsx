"use client";

export default function Layers() {
  const layers = [
    {
      num: "AGENT 01",
      title: "Scout",
      sub: "Detection & Scoring",
      color: "data",
      agents: ["NOXA Event Listener", "Deployer History Scraper", "Honeypot Simulator"],
    },
    {
      num: "AGENT 02",
      title: "Trader",
      sub: "Sizing & Execution",
      color: "enrich",
      agents: ["Position Sizer", "Calldata Generator", "Uniswap Router Interface"],
    },
    {
      num: "AGENT 03",
      title: "LP Manager",
      sub: "Module B Loop",
      color: "analysis",
      agents: ["Volatility Tracker", "Position Minter", "Fee Auto-compounder"],
    },
    {
      num: "AGENT 04",
      title: "Risk Warden",
      sub: "Prop-desk Risk Module",
      color: "decision",
      agents: ["Portfolio Heat Monitor", "Hard Gate Enforcer", "Regime Filter"],
    },
    {
      num: "AGENT 05",
      title: "Guardian",
      sub: "Emergency Monitor",
      color: "exec",
      agents: ["Exit Guard", "Sell Simulator", "Liquidity-drain Circuit Breaker"],
    },
    {
      num: "MCP",
      title: "MCP Server",
      sub: "Claude/Copilot Interface",
      color: "iface",
      agents: ["Read Tools", "Signal Tools", "Unsigned TX Returner"],
    },
  ];

  return (
    <section id="layers">
      <div className="wrap">
        <div className="layers-hd">
          <div>
            <div className="sec-label">Minimum Viable Swarm</div>
            <h2 className="sec-h2">5 Agents.<br />1 Mission.</h2>
          </div>
          <p className="sec-body">
            Fletcher is designed as a focused swarm of 5 specialized micro-agents for v1, coordinating via a central orchestrator. No bloated architecture—just pure execution speed.
          </p>
        </div>
        <div className="layers-grid">
          {layers.map((layer, idx) => (
            <div key={idx} className="layer-card">
              <span className="lc-num">{layer.num}</span>
              <div className="lc-dot"></div>
              <h3 className="lc-h">{layer.title}</h3>
              <p className="lc-sub">{layer.sub}</p>
              <div className="lc-agents">
                {layer.agents.map((agent, aIdx) => (
                  <div key={aIdx} className={`lc-tag lc-${layer.color}`}>
                    {agent}
                  </div>
                ))}
              </div>
              <div className="layer-detail-bar">
                <span>INSPECT LAYER</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
