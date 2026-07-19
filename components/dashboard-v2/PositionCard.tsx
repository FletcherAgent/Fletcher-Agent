import React from 'react';

export function PositionCard({ lpPositions }: { lpPositions: any[] }) {
  return (
    <div className="sect">
      <div className="sect-head">
        <h2>Open positions</h2>
        <span className="tag live">● LIVE</span>
        <span className="tag" style={{ marginLeft: "auto" }}>CAP $2K / POS · MAX 3</span>
      </div>

      {lpPositions.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mute)' }}>
          No open positions currently.
        </div>
      )}

      {lpPositions.map((pos: any, idx: number) => {
        const isNight = pos.dayMode === false || pos.nightMode;
        const pair = `${pos.token0Symbol || 'TKN0'} / ${pos.token1Symbol || 'TKN1'}`;
        const openedAt = new Date(pos.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Calculate exact visual range relative to Uniswap V3 absolute bounds
        const MIN_TICK = -887220;
        const MAX_TICK = 887220;
        const totalTickRange = MAX_TICK - MIN_TICK;
        
        let rangeLeft = ((pos.tickLower - MIN_TICK) / totalTickRange) * 100;
        let rangeWidth = ((pos.tickUpper - pos.tickLower) / totalTickRange) * 100;
        
        // Ensure it stays within visual bounds and is at least 2% wide to be visible
        rangeLeft = Math.max(0, Math.min(98, rangeLeft));
        rangeWidth = Math.max(2, Math.min(100 - rangeLeft, rangeWidth));
        const isWarning = pos.ilRunning > pos.feesCollected;
        const arrowColor = isWarning ? "#E0A82E" : "#38C172";
        const head3Left = rangeLeft + (rangeWidth / 2);

        return (
          <article key={pos.id || idx} className={`pos ${isWarning ? 'out' : ''}`}>
            <div className="pos-top">
              <span className="pair">{pair}</span>
              <span className={`mode-b ${isNight ? 'night' : 'day'}`}>
                {isNight ? 'NIGHT · SPRAY' : 'DAY · FULL RANGE'}
              </span>
              {pos.source === 'ALPHA' && (
                <span className="tag live" style={{ marginLeft: "8px", background: "#7D52F4", color: "#fff" }}>
                  ★ ALPHA
                </span>
              )}
              <span className="apr" style={{ color: isWarning ? "var(--amber)" : "var(--green)" }}>
                Active
              </span>
            </div>
            <div className="pos-meta">${pos.entryValue} deployed · opened {openedAt} WIB</div>
            
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
              {rangeWidth > 90 ? (
                <>
                  <span className="rl" style={{ left: "2%" }}>FULL</span>
                  <span className="rl" style={{ left: "93%" }}>RANGE</span>
                </>
              ) : (
                <>
                  <span className="rl" style={{ left: `${rangeLeft}%` }}>{pos.tickLower}</span>
                  <span className="rl" style={{ left: `${rangeLeft + rangeWidth - 4}%` }}>{pos.tickUpper}</span>
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
                <><span className="ok">▶ fee &gt; IL · compounding</span> · next auto-collect in 00:41:12</>
              )}
            </div>
            
            <div className="pos-actions">
              <button>REBALANCE</button>
              <button>CLOSE</button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
