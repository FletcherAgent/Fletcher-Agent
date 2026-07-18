export default function Navbar() {
  return (
    <header>
      <a className="logo" href="/">
        <img src="/logo.PNG" alt="Fletcher Logo" style={{ height: '40px', objectFit: 'contain' }} />
      </a>
      <nav>
        <a href="/#architecture">Architecture</a>
        <a href="/#agents">Agents</a>
        <a href="/#mind">Swarm Mind</a>
        <a href="/#safety">Risk Protocol</a>
        <a href="/#roadmap">Roadmap</a>
      </nav>
      <div className="header-right" style={{ display: 'flex', alignItems: 'center' }}>
        <a href="https://x.com/fletcheragent21?s=11" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px', color: '#f2f2f2' }} aria-label="X (Twitter)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a href="/dashboard-v2" className="btn-app" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Open Dashboard</a>
        <button className="burger" aria-label="Menu">
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
