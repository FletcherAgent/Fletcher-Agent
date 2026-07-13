import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://fletcher-core-production.up.railway.app";
  
  let wallets = [];
  let signals = [];
  let positions = [];

  try {
    const res = await fetch(`${API_URL}/api/dashboard`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      wallets = data.wallets || [];
      signals = data.signals || [];
      positions = data.positions || [];
    }
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
  }

  const openPositionsCount = positions.filter((p: any) => p.status === 'OPEN').length;

  return (
    <>
      <Navbar />
      
      <main className="dashboard-main wrap">
        
        <div className="dash-header">
          <div>
            <h1>System Dashboard</h1>
            <p className="dash-sub">Real-time overview of Fletcher agents and targets.</p>
          </div>
          <div className="status-badge">
            <span className="pulse-dot"></span>
            System Online
          </div>
        </div>

        <div className="dash-kpi">
          <div className="kpi-card">
            <div className="kpi-label">Tracked Wallets</div>
            <div className="kpi-val">{wallets.length}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Open Positions</div>
            <div className="kpi-val">{openPositionsCount}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Signals Intercepted</div>
            <div className="kpi-val">{signals.length}</div>
          </div>
        </div>

        <div className="dash-grid">
          
          <div className="dash-main-col">
            
            <div className="dash-panel">
              <div className="panel-head">Active Positions</div>
              <div className="panel-body">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Token</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th style={{textAlign:'right'}}>Size (ETH)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.length === 0 ? (
                      <tr><td colSpan={4} className="empty-state">No active positions.</td></tr>
                    ) : (
                      positions.map((p: any) => (
                        <tr key={p.id}>
                          <td>{p.tokenAddress.substring(0,6)}...{p.tokenAddress.substring(38)}</td>
                          <td>
                            <span className={`badge badge-${p.source.toLowerCase()}`}>{p.source}</span>
                          </td>
                          <td>
                            <div className="status-cell">
                              {p.status === 'OPEN' ? (
                                <><span className="dot open"></span>Open</>
                              ) : (
                                <><span className="dot closed"></span>Closed</>
                              )}
                            </div>
                          </td>
                          <td style={{textAlign:'right'}}>{p.size.toFixed(4)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="dash-panel">
              <div className="panel-head">Signal Feed</div>
              <div className="panel-body scroll-area h-96">
                {signals.length === 0 ? (
                  <div className="empty-state">Awaiting incoming signals...</div>
                ) : (
                  <div className="signal-list">
                    {signals.map((s: any) => (
                      <div key={s.id} className="signal-item">
                        <div className="sig-left">
                          <span className="sig-time">
                            {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                          <span className={`badge badge-${s.source.toLowerCase()}`}>{s.source}</span>
                          <div className="sig-info">
                            <span className="sig-token">{s.tokenAddress}</span>
                            {s.copiedFrom && (
                              <span className="sig-wallet">Wallet: {s.copiedFrom.substring(0, 8)}...</span>
                            )}
                          </div>
                        </div>
                        <div className="sig-right">
                          {s.passed ? (
                            <span className="badge badge-pass">PASS</span>
                          ) : (
                            <span className="badge badge-veto">VETO</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="dash-side-col">
            <div className="dash-panel h-full">
              <div className="panel-head">Tracked Targets</div>
              <div className="panel-body scroll-area h-full-scroll">
                {wallets.length === 0 ? (
                  <div className="empty-state">No targets tracked.</div>
                ) : (
                  <div className="target-list">
                    {wallets.map((w: any) => (
                      <div key={w.id} className="target-item">
                        <div className="tgt-head">
                          <div className="tgt-name">{w.label || 'Unnamed Wallet'}</div>
                          <span className={`badge badge-tier${w.tier}`}>TIER {w.tier}</span>
                        </div>
                        <div className="tgt-addr">{w.address}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
