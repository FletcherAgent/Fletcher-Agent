export default function Navbar() {
  return (
    <header>
      <a className="logo" href="/">
        <svg viewBox="0 0 40 40" fill="none" stroke="#f2f2f2" strokeWidth="1.6">
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
        <span className="logo-name">
          FLETCH
          <br />
          ER
        </span>
      </a>
      <nav>
        <a href="/#architecture">Architecture</a>
        <a href="/#agents">Agents</a>
        <a href="/#mind">Swarm Mind</a>
        <a href="/#safety">Risk Protocol</a>
        <a href="/#roadmap">Roadmap</a>
      </nav>
      <div className="header-right">
        <a href="/dashboard-v2" className="btn-app" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Open Dashboard</a>
        <button className="burger" aria-label="Menu">
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
