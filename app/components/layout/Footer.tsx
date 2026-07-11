export default function Footer() {
  return (
    <footer>
      <div className="foot-grid">
        <div className="foot-brand">
          <a className="logo" href="#">
            <svg viewBox="0 0 40 40" fill="none" stroke="#f2f2f2" strokeWidth="1.6" style={{ width: "30px", height: "30px" }}>
              <line x1="20" y1="2" x2="20" y2="14" />
              <line x1="20" y1="26" x2="20" y2="38" />
              <line x1="2" y1="20" x2="14" y2="20" />
              <line x1="26" y1="20" x2="38" y2="20" />
              <line x1="7" y1="7" x2="15" y2="15" />
              <line x1="25" y1="25" x2="33" y2="33" />
              <line x1="33" y1="7" x2="25" y2="15" />
              <line x1="15" y1="25" x2="7" y2="33" />
              <circle cx="20" cy="20" r="3.5" stroke="#2bff5b" />
            </svg>
            <span className="logo-name" style={{ fontSize: "13px" }}>
              FLETCH
              <br />
              ER
            </span>
          </a>
          <p>Autonomous Trading and Liquidity Swarm for Robinhood Chain.</p>
        </div>
        <div className="foot-col">
          <h4>Product</h4>
          <a href="#architecture">Architecture</a>
          <a href="#agents">Agent Mesh</a>
          <a href="#safety">Safety Layer</a>
        </div>
        <div className="foot-col">
          <h4>Resources</h4>
          <a href="#">Roadmap</a>
          <a href="#">GitHub</a>
        </div>
        <div className="foot-col">
          <h4>Community</h4>
          <a href="#">Telegram</a>
        </div>
      </div>
      <div className="watermark">FLETCHER</div>
      <div className="foot-base">
        <span>©2026 FLETCHER</span>
        <span>Confirm by default · Auto mode is earned</span>
      </div>
    </footer>
  );
}
