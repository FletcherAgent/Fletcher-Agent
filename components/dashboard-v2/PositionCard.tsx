import React from 'react';

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
        const openedAt = new Date(pos.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // --- LP POSITION RENDER ---
        if (pos._type === 'LP') {
          const isNight = pos.dayMode === false || pos.nightMode;
          const pair = `${pos.token0Symbol || 'TKN0'} / ${pos.token1Symbol || 'TKN1'}`;
          
          const MIN_TICK = -887220;
          const MAX_TICK = 887220;
          const totalTickRange = MAX_TICK - MIN_TICK;
          
          let rangeLeft = ((pos.tickLower - MIN_TICK) / totalTickRange) * 100;
          let rangeWidth = ((pos.tickUpper - pos.tickLower) / totalTickRange) * 100;
          
          // Clamp values to ensure UI doesn't break and text doesn't overlap
          rangeLeft = Math.max(0, Math.min(80, rangeLeft));
          rangeWidth = Math.max(20, Math.min(100 - rangeLeft, rangeWidth)); // Minimum 20% width to prevent text overlap
          
          const isWarning = pos.ilRunning > pos.feesCollected;
          const arrowColor = isWarning ? "#E0A82E" : "#38C172";
          const isFullRange = pos.tickLower < -800000;
          const head3Left = rangeLeft + (rangeWidth / 2);
          
          const now = Date.now();
          const createdTime = new Date(pos.createdAt).getTime();
          const msIn24h = 24 * 60 * 60 * 1000;
          const msSinceCreated = now - createdTime;
          const msToNextCollect = msIn24h - (msSinceCreated % msIn24h);
          const hoursLeft = Math.floor(msToNextCollect / (60 * 60 * 1000));
          const minsLeft = Math.floor((msToNextCollect % (60 * 60 * 1000)) / (60 * 1000));
          const secsLeft = Math.floor((msToNextCollect % (60 * 1000)) / 1000);
          const timeString = `${hoursLeft.toString().padStart(2, '0')}:${minsLeft.toString().padStart(2, '0')}:${secsLeft.toString().padStart(2, '0')}`;

          return (
            <article key={pos.id || idx} className={`pos ${isWarning ? 'out' : ''}`}>
              <div className="pos-top">
                <span className="pair">{pair}</span>
                <span className="tag" style={{ marginLeft: "8px", background: "#444", color: "#fff" }}>[LP]</span>
                <span className={`mode-b ${isNight ? 'night' : 'day'}`}>
                  {isNight ? 'NIGHT · SPRAY' : 'DAY · FULL RANGE'}
                </span>
                {pos.source === 'ALPHA' && (
                  <span className="tag live" style={{ marginLeft: "8px", background: "#7D52F4", color: "#fff" }}>
                    [ALPHA]
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
                <span className="apr" style={{ color: isWarning ? "var(--amber)" : "var(--green)" }}>
                  Active
                </span>
              </div>
              <div className="pos-meta" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>${pos.entryValue} deployed · opened {openedAt}</span>
                <span style={{ color: (pos.feesCollected + pos.ilRunning) >= 0 ? "var(--green)" : "var(--amber)", fontWeight: 600, fontSize: '11px' }}>
                  PNL: {(pos.feesCollected + pos.ilRunning) >= 0 ? '+' : ''}${(pos.feesCollected + pos.ilRunning).toFixed(2)}
                </span>
              </div>
              
              <div className="arrow">
                <div className="shaft"></div>
                <div className="range" style={{ left: `${rangeLeft}%`, width: `${rangeWidth}%` }}></div>
                <div className="fletch" style={{ left: `${rangeLeft}%` }}>
                  <svg width="14" height="18" viewBox="0 0 14 18"><path d="M2 0 L12 4 L12 8 L2 4 Z M2 6 L12 10 L12 14 L2 10 Z" fill={arrowColor} opacity=".85"/></svg>
                </div>
                <div className="fletch" style={{ left: `calc(${rangeLeft + rangeWidth}% - 14px)` }}>
                  <svg width="14" height="18" viewBox="0 0 14 18"><path d="M12 0 L2 4 L2 8 L12 4 Z M12 6 L2 10 L2 14 L12 10 Z" fill={arrowColor} opacity=".85"/></svg>
                </div>
                <div className="head" style={{ left: `${head3Left}%` }}>
                  <svg width="14" height="16" viewBox="0 0 14 16"><path d="M7 0 L14 8 L7 16 L7 11 L0 11 L0 5 L7 5 Z" fill="#E9E4D6"/></svg>
                </div>
                {isFullRange ? (
                  <>
                    <span className="rl" style={{ left: "2%" }}>FULL</span>
                    <span className="rl" style={{ left: "93%" }}>RANGE</span>
                  </>
                ) : (
                  <>
                    <span className="rl" style={{ left: `${rangeLeft}%` }}>{pos.tickLower}</span>
                    <span className="rl" style={{ left: `calc(${rangeLeft + rangeWidth}% - 10px)` }}>{pos.tickUpper}</span>
                  </>
                )}
              </div>
              
              <div className="bars">

                <div className="bar">
                  <div className="bk"><span>FEES COLLECTED</span><span>${Number(pos.feesCollected || 0).toFixed(2)}</span></div>
                  <div className="bt"><div className="bf" style={{ width: "50%" }}></div></div>
                </div>
                <div className="bar il">
                  <div className="bk"><span>IL ESTIMATE</span><span>${Number(pos.ilRunning || 0).toFixed(2)}</span></div>
                  <div className="bt"><div className="bf" style={{ width: "15%" }}></div></div>
                </div>
              </div>
              
              <div className="verdict">
                {isWarning ? (
                  <><span className="warn">▶ IL &gt; fee · warning</span> · monitoring · close if persists for 4h</>
                ) : (
                  <><span className="ok">▶ fee &gt; IL · compounding</span> · next auto-collect in {timeString}</>
                )}
              </div>
              
              <div className="pos-actions">
                <button>REBALANCE</button>
                <button>CLOSE</button>
              </div>
            </article>
          );
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
              <span>Size: {pos.size} · opened {openedAt}</span>
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
