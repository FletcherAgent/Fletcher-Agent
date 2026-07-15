import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ClientTime from "../components/ClientTime";
import AutoRefresh from "./AutoRefresh";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://fletcher-core-production-d4b8.up.railway.app";

  let wallets = [];
  let signals = [];
  let positions = [];
  let logs: any[] = [];
  let totalSignals = 0;
  let openPositionsCount = 0;

  try {
    const res = await fetch(`${API_URL}/api/dashboard`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      wallets = data.wallets || [];
      signals = data.signals || [];
      positions = data.positions || [];
      logs = data.logs || [];
      totalSignals = data.totalSignals || 0;
      openPositionsCount = data.openPositionsCount || 0;
    }
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
  }

  return (
    <>
      <Navbar />

      <main className="dashboard-main wrap">

        <div className="dash-header">
          <div>
            <h1>System Dashboard</h1>
            <p className="dash-sub">Real-time overview of Fletcher agents and targets.</p>
          </div>
          <div className="status-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div>
              <span className="pulse-dot"></span>
              System Online
            </div>
            <AutoRefresh interval={3000} />
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
            <div className="kpi-val">{totalSignals}</div>
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
                      <th style={{ textAlign: 'right' }}>Size (ETH)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.filter((p: any) => p.status !== 'CLOSED' && p.status !== 'FAILED').length === 0 ? (
                      <tr><td colSpan={4} className="empty-state">No active positions.</td></tr>
                    ) : (
                      positions
                        .filter((p: any) => p.status !== 'CLOSED' && p.status !== 'FAILED')
                        .map((p: any) => (
                        <tr key={p.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>
                              {p.tokenName ? `${p.tokenName} (${p.tokenSymbol})` : `${p.tokenAddress.substring(0, 6)}...${p.tokenAddress.substring(38)}`}
                            </div>
                            <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                              Entry: {p.entryPrice ? p.entryPrice.toFixed(8) : '-'}
                            </div>
                          </td>
                          <td>
                            <span className={`badge badge-${p.source.toLowerCase()}`}>{p.source}</span>
                          </td>
                          <td>
                            <div className="status-cell">
                              {p.status === 'OPEN' ? (
                                <><span className="dot open"></span>Open</>
                              ) : p.status === 'PENDING' ? (
                                <><span className="dot" style={{ background: '#ffa000', boxShadow: '0 0 8px #ffa000' }}></span>Pending</>
                              ) : p.status === 'EXITING' ? (
                                <><span className="dot" style={{ background: '#29b6f6', boxShadow: '0 0 8px #29b6f6' }}></span>Exiting</>
                              ) : (
                                <><span className="dot closed"></span>{p.status}</>
                              )}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }}>{p.size.toFixed(6)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="dash-panel" style={{ marginTop: '20px' }}>
              <div className="panel-head">PnL History by Agent</div>
              <div className="panel-body">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Token</th>
                      <th>Agent (Source)</th>
                      <th style={{ textAlign: 'right' }}>PnL (%)</th>
                      <th style={{ textAlign: 'right' }}>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.filter((p: any) => p.status === 'CLOSED').length === 0 ? (
                      <tr><td colSpan={4} className="empty-state">No closed positions history.</td></tr>
                    ) : (
                      positions
                        .filter((p: any) => p.status === 'CLOSED' && p.entryPrice && p.exitPrice)
                        .map((p: any) => {
                          const pnlRatio = p.pnl != null ? (p.pnl * 100) : (((p.exitPrice - p.entryPrice) / p.entryPrice) * 100);
                          const isWin = pnlRatio > 0;
                          return (
                            <tr key={p.id}>
                              <td>
                                <div style={{ fontWeight: 600 }}>
                                  {p.tokenName ? `${p.tokenName} (${p.tokenSymbol})` : `${p.tokenAddress.substring(0, 6)}...${p.tokenAddress.substring(38)}`}
                                </div>
                                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                                  Entry: {p.entryPrice ? p.entryPrice.toFixed(8) : '-'} | Exit: {p.exitPrice ? p.exitPrice.toFixed(8) : '-'}
                                </div>
                              </td>
                              <td>
                                <span className={`badge badge-${p.source.toLowerCase()}`}>{p.source}</span>
                              </td>
                              <td style={{ textAlign: 'right', color: isWin ? '#00e676' : '#ff3d00' }}>
                                {pnlRatio > 0 ? '+' : ''}{pnlRatio.toFixed(2)}%
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                {isWin ? (
                                  <span className="badge badge-pass">WIN</span>
                                ) : (
                                  <span className="badge badge-veto">LOSS</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="dash-panel" style={{ marginTop: '20px' }}>
              <div className="panel-head">Signal Feed</div>
              <div className="panel-body scroll-area h-96">
                {signals.length === 0 ? (
                  <div className="empty-state">Awaiting incoming signals...</div>
                ) : (
                  <div className="signal-list">
                    {signals.map((s: any) => {
                      const sigType = s.rawContext?.type as string | undefined;
                      const isBuy = sigType === 'BUY';
                      const isSell = sigType === 'SELL';
                      return (
                        <div key={s.id} className="signal-item">
                          <div className="sig-left">
                            <span className="sig-time">
                              {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                            {/* BUY / SELL badge */}
                            {isBuy && (
                              <span className="badge" style={{ background: 'rgba(0,230,118,0.15)', color: '#00e676', border: '1px solid #00e67644' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px', verticalAlign: 'text-bottom'}}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                                BUY
                              </span>
                            )}
                            {isSell && (
                              <span className="badge" style={{ background: 'rgba(255,61,0,0.15)', color: '#ff6d3a', border: '1px solid #ff3d0044' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px', verticalAlign: 'text-bottom'}}><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
                                SELL
                              </span>
                            )}
                            {!isBuy && !isSell && (
                              <span className={`badge badge-${s.source.toLowerCase()}`}>{s.source}</span>
                            )}
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
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ── Activity Log ── */}
            <div className="dash-panel" style={{ marginTop: '20px' }}>
              <div className="panel-head">Activity Log</div>
              <div className="panel-body scroll-area h-96">
                {logs.length === 0 ? (
                  <div className="empty-state">No activity logged yet.</div>
                ) : (
                  <div className="log-list">
                    {logs.map((l: any) => {
                      const levelClass = l.level === 'ERROR' ? 'log-error'
                        : l.level === 'WARN' ? 'log-warn'
                          : 'log-info';
                      return (
                        <div key={l.id} className={`log-item ${levelClass}`}>
                          <span className="log-time">
                            <ClientTime timestamp={l.createdAt} />
                          </span>
                          <span className={`log-badge log-badge-${l.level.toLowerCase()}`}>{l.level}</span>
                          <span className="log-msg">
                            {l.message}
                            {l.meta && l.meta.txHash && (
                              <a href={`https://robinhoodchain.blockscout.com/tx/${l.meta.txHash}`} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '8px', color: '#4facfe', fontSize: '12px' }}>
                                View TX
                              </a>
                            )}
                          </span>
                        </div>
                      );
                    })}
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
                      <div key={w.id} className="target-item" style={{ marginBottom: '15px' }}>
                        <div className="tgt-head">
                          <div className="tgt-name">{w.label || 'Unnamed Wallet'}</div>
                          <span className={`badge badge-tier${w.tier}`}>TIER {w.tier}</span>
                        </div>
                        <div className="tgt-addr">{w.address}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '8px', color: '#888' }}>
                          <span>Signals: {w.totalSignals || 0}</span>
                          <span>Win Rate: {w.winRate != null ? w.winRate.toFixed(1) + '%' : 'N/A'}</span>
                          <span style={{ color: w.avgPnlR && w.avgPnlR > 0 ? '#00e676' : w.avgPnlR && w.avgPnlR < 0 ? '#ff3d00' : 'inherit' }}>
                            Avg P&L: {w.avgPnlR != null ? (w.avgPnlR > 0 ? '+' : '') + (w.avgPnlR * 100).toFixed(2) + '%' : 'N/A'}
                          </span>
                        </div>
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
