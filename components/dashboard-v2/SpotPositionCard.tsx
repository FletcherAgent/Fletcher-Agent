import React from 'react';

export function SpotPositionCard({ positions }: { positions: any[] }) {
  return (
    <div className="sect" style={{ marginTop: "1rem" }}>
      <div className="sect-head">
        <h2>History Positions</h2>
        <span className="tag" style={{ marginLeft: "auto" }}>Closed & Failed</span>
      </div>

      <div className="scrollable" style={{ paddingBottom: "12px", maxHeight: "1070px" }}>
        {positions.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mute)' }}>
          No historical positions found.
        </div>
      )}

      {positions.map((pos: any, idx: number) => {
        const openedAt = new Date(pos.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const isClosed = pos.status === 'CLOSED';
        const isFailed = pos.status === 'EXIT_FAILED' || pos.status === 'FAILED';
        
        let statusColor = "var(--amber)";
        if (isClosed) statusColor = "var(--mute)";
        if (isFailed) statusColor = "var(--red)";

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
                <div>
                  {isClosed && <><span className="warn">▶ CLOSED</span></>}
                  {isFailed && <span className="warn">▶ FAILED</span>}
                </div>
                <div style={{ fontWeight: 'bold', color: pos.ilRunning > 0 ? "var(--red)" : "var(--green)" }}>
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
              <div>
                {isClosed && <><span className="warn">▶ EXIT REASON:</span> {pos.exitReason || 'Manual'}</>}
                {isFailed && <span className="warn">▶ EXIT FAILED</span>}
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
