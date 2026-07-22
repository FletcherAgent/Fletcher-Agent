export default function Footer() {
  return (
    <footer>
      <div className="foot-grid">
        <div className="foot-brand">
          <a className="logo" href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <img src="/logo.PNG" alt="Fletcher Logo" style={{ height: '30px', objectFit: 'contain' }} />
            <span className="logo-name" style={{ fontSize: '15px', fontWeight: 'bold', color: '#f2f2f2', letterSpacing: '1px' }}>FLETCHER</span>
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
          <a href="https://x.com/fletcheragt" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X (Twitter)
          </a>
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
