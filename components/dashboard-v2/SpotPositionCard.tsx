import React from 'react';

export function SpotPositionCard({ positions }: { positions: any[] }) {
  return (
    <div className="sect sect-fill" style={{ flex: '0 0 auto', paddingBottom: '0', marginBottom: '0' }}>
      <div className="sect-head" style={{ flexShrink: 0 }}>
        <h2>History Positions</h2>
        <span className="tag" style={{ marginLeft: "auto" }}>Closed & Failed</span>
      </div>

        <div className="scrollable" style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px', paddingBottom: '12px' }}>
      {positions.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mute)' }}>
          No historical positions found.
        </div>
      )}

      {positions.map((pos: any, idx: number) => {
        const openedAt = new Date(pos.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const isClosed = pos.status === 'CLOSED';
        const isFailed = pos.status === 'EXIT_FAILED' || pos.status === 'FAILED';
        const isExiting = pos.status === 'EXITING';
        
        let statusColor = "var(--amber)";
        if (isClosed) statusColor = "var(--mute)";
        if (isFailed) statusColor = "var(--red)";
        if (isExiting) statusColor = "#E0A82E";

        // LP POSITION HISTORY
        if (pos._type === 'LP') {
          const pair = `${pos.token0Symbol || 'TKN0'} / ${pos.token1Symbol || 'TKN1'}`;
          
          return (
            <article key={pos.id || idx} className={`pos ${isFailed ? 'out' : ''}`}>
              <div className="pos-top">
                <span className="pair">{pair}</span>
                <span className="tag" style={{ marginLeft: "8px", background: "#444", color: "#fff" }}>[LP]</span>
                {pos.source === 'ALPHA' && (
                  <span className="tag live" style={{ marginLeft: "8px", background: "#7D52F4", color: "#fff" }}>
                    [ALPHA]
                  </span>
                )}
                <span className="apr" style={{ color: statusColor }}>
                  {pos.status}
                </span>
              </div>
              
              <div className="pos-meta">${pos.entryValue} deployed · opened {openedAt}</div>
              
              <div className="bars" style={{ marginTop: "12px", borderTop: "1px dashed var(--b-3)", paddingTop: "12px" }}>
                <div className="bar">
                  <div className="bk"><span>FEES EARNED</span><span>${Number(pos.feesCollected || 0).toFixed(2)}</span></div>
                </div>
              </div>
              
              <div className="verdict" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {isClosed && (
                    <span className="warn" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      CLOSED
                    </span>
                  )}
                  {isFailed && (
                    <span className="warn" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
                      </svg>
                      FAILED
                    </span>
                  )}
                  {isExiting && (
                    <span className="warn" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: "#E0A82E" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      EXITING
                    </span>
                  )}
                </div>
                <div style={{ fontWeight: 'bold', color: pos.ilRunning < 0 ? "var(--red)" : "var(--green)" }}>
                  IL: ${Number(pos.ilRunning || 0).toFixed(2)}
                </div>
              </div>
            </article>
          );
        }

        // SPOT/TRENCH POSITION HISTORY
        let pnlText = "N/A";
        let pnlColor = "var(--mute)";
        if (pos.pnl !== null) {
          const pnlPercent = (pos.pnl * 100).toFixed(2);
          pnlText = `${pnlPercent}%`;
          if (pos.pnl > 0) pnlColor = "var(--green)";
          else if (pos.pnl < 0) pnlColor = "var(--red)";
        }

        return (
          <article key={pos.id || idx} className={`pos ${isFailed ? 'out' : ''}`}>
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
              <span className="apr" style={{ color: statusColor }}>
                {pos.status}
              </span>
            </div>
            <div className="pos-meta">Size: {pos.size} · opened {openedAt}</div>
            
            <div className="bars" style={{ marginTop: "12px", borderTop: "1px dashed var(--b-3)", paddingTop: "12px" }}>
              <div className="bar">
                <div className="bk"><span>ENTRY PRICE</span><span>{Number(pos.entryPrice).toExponential(4)}</span></div>
              </div>
              <div className="bar il">
                <div className="bk"><span>EXIT PRICE</span><span>{pos.exitPrice ? Number(pos.exitPrice).toExponential(4) : '-'}</span></div>
              </div>
            </div>
            
            <div className="verdict" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {isClosed && (
                  <>
                    <span className="warn" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      EXIT REASON:
                    </span> 
                    <span>{pos.exitReason || 'Manual'}</span>
                  </>
                )}
                {isFailed && (
                  <span className="warn" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    EXIT FAILED
                  </span>
                )}
              </div>
              <div style={{ fontWeight: 'bold', color: pnlColor }}>
                PNL: {pnlText}
              </div>
            </div>
          </article>
        );
      })}
      </div>
    </div>
  );
}
