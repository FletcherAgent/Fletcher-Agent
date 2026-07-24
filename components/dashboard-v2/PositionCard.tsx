import React from 'react';
import { LPPositionCard } from './LPPositionCard';

export function PositionCard({ positions }: { positions: any[] }) {
  return (
    <div className="sect sect-fill" style={{ flex: '0 0 auto', paddingBottom: '0', marginBottom: '12px' }}>
      <div className="sect-head" style={{ flexShrink: 0 }}>
        <h2>Open Positions</h2>
        <span className="tag live">[LIVE]</span>
        <span className="tag" style={{ marginLeft: "auto" }}>CAP $2K / POS · MAX 3</span>
      </div>

      <div className="scrollable" style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px', paddingBottom: '12px' }}>
      {positions.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mute)' }}>
          No open positions currently.
        </div>
      )}

      {positions.map((pos: any, idx: number) => {
        const openedAt = pos.createdAt ? new Date(pos.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '00:00';

        // --- LP POSITION RENDER ---
        if (pos._type === 'LP') {
          return <LPPositionCard key={pos.id || idx} initialPos={pos} idx={idx} />;
        }

        // --- SPOT/TRENCH POSITION RENDER ---
        return (
          <article key={pos.id || idx} className="pos">
            <div className="pos-top">
              <span className="pair">{pos.tokenSymbol || 'TKN'}</span>
              <span className="tag" style={{ marginLeft: "8px", background: "#444", color: "#fff" }}>[SPOT]</span>
              <span className={`mode-b day`}>
                {pos.tradingMode}
              </span>
              {pos.source === 'ALPHA' && (
                <span className="tag live" style={{ marginLeft: "8px", background: "#7D52F4", color: "#fff" }}>
                  [ALPHA]
                </span>
              )}
              {pos.source === 'COPYTRADE' && (
                <span className="tag live" style={{ marginLeft: "8px", background: "#2563EB", color: "#fff" }}>
                  [COPY]
                </span>
              )}
              {pos.txHash && pos.tradingMode !== 'DRY_RUN' && (
                <a href={`https://robinhoodchain.blockscout.com/tx/${pos.txHash}`} target="_blank" rel="noreferrer" className="tag live" style={{ marginLeft: "8px", background: "#333", color: "#ddd", textDecoration: "none" }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Tx
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </span>
                </a>
              )}
              <span className="apr" style={{ color: "var(--green)" }}>
                Active
              </span>
            </div>
            
            <div className="pos-meta" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Size: {pos.size} · opened {openedAt} · Avg R-multiple: {(pos.rMultiple || 0).toFixed(1)}R</span>
              <span style={{ color: (pos.pnl || 0) >= 0 ? "var(--green)" : "var(--amber)", fontWeight: 600, fontSize: '11px' }}>
                PNL: {(pos.pnl || 0) >= 0 ? '+' : ''}{((pos.pnl || 0) * 100).toFixed(2)}%
              </span>
            </div>
            
            <div className="bars" style={{ marginTop: "12px" }}>

              <div className="bar">
                <div className="bk"><span>ENTRY PRICE</span><span>{Number(pos.entryPrice).toExponential(4)}</span></div>
              </div>
            </div>
            
            <div className="verdict" style={{ marginTop: "12px" }}>
              <span className="ok">▶ POSITION OPEN</span> · Monitoring profit targets
            </div>
            
            <div className="pos-actions">
              <button>CLOSE POSITION</button>
            </div>
          </article>
        );
      })}
      </div>
    </div>
  );
}
