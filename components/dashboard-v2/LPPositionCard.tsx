import React, { useEffect, useState } from 'react';

export function LPPositionCard({ initialPos, idx }: { initialPos: any, idx: number }) {
  const [pos, setPos] = useState(initialPos);
  const [currentTick, setCurrentTick] = useState<number | null>(null);

  useEffect(() => {
    // WebSocket for real-time tick updates
    let ws: WebSocket;
    if (pos.pool && pos.tradingMode !== 'DRY_RUN') {
      const wsUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/^http/, 'ws');
      ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        ws.send(JSON.stringify({ action: 'subscribe', pool: pos.pool }));
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'Swap' && data.pool.toLowerCase() === pos.pool.toLowerCase()) {
            setCurrentTick(data.tick);
          }
        } catch (e) {}
      };
    }

    // API Polling for fee/il updates
    const pollApi = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
        const res = await fetch(`${apiUrl}/api/lp/${pos.id}`, {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPos((p: any) => ({ ...p, feesCollected: data.feesCollected, ilRunning: data.ilRunning, status: data.status, edgeBufferPct: data.edgeBufferPct }));
        }
      } catch (e) {}
    };

    const interval = setInterval(pollApi, 15000); // 15 seconds

    return () => {
      if (ws) ws.close();
      clearInterval(interval);
    };
  }, [pos.pool, pos.id, pos.tradingMode]);

  const openedAt = pos.createdAt ? new Date(pos.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '00:00';
  const isNight = pos.dayMode === false || pos.nightMode;
  const pair = `${pos.token0Symbol || 'TKN0'} / ${pos.token1Symbol || 'TKN1'}`;
  
  const MIN_TICK = -887220;
  const MAX_TICK = 887220;
  
  const rangeLeft = 10;
  const rangeWidth = 80;
  
  let headLeft = rangeLeft + (rangeWidth / 2); 
  if (currentTick !== null) {
    const tickRange = pos.tickUpper - pos.tickLower;
    if (tickRange > 0) {
      const percentage = (currentTick - pos.tickLower) / tickRange;
      headLeft = rangeLeft + (percentage * rangeWidth);
    }
    headLeft = Math.max(rangeLeft, Math.min(rangeLeft + rangeWidth, headLeft));
  }

  // Dynamic warning color based on edgeBufferPct
  const edgeBufferPct = pos.edgeBufferPct || 15;
  const rangeWidthTicks = pos.tickUpper - pos.tickLower;
  const bufferTicks = (rangeWidthTicks * edgeBufferPct) / 100;
  
  let isWarning = pos.ilRunning > pos.feesCollected; // Default warning
  
  if (currentTick !== null) {
    if (currentTick < pos.tickLower + bufferTicks || currentTick > pos.tickUpper - bufferTicks) {
      isWarning = true; // Amber if near edge
    } else {
      isWarning = false;
    }
  }

  const arrowColor = isWarning ? "#E0A82E" : "#38C172";
  const isFullRange = pos.tickLower < -800000;
  
  const now = Date.now();
  const createdTime = new Date(pos.createdAt).getTime();
  const msIn24h = 24 * 60 * 60 * 1000;
  const msSinceCreated = now - createdTime;
  const msToNextCollect = msIn24h - (msSinceCreated % msIn24h);
  const hoursLeft = Math.floor(msToNextCollect / (60 * 60 * 1000));
  const minsLeft = Math.floor((msToNextCollect % (60 * 60 * 1000)) / (60 * 1000));
  const secsLeft = Math.floor((msToNextCollect % (60 * 1000)) / 1000);
  const timeString = `${hoursLeft.toString().padStart(2, '0')}:${minsLeft.toString().padStart(2, '0')}:${secsLeft.toString().padStart(2, '0')}`;

  const entryValue = pos.entryValue || 1;
  const feesWidth = Math.min(100, Math.max(0, ((pos.feesCollected || 0) / entryValue) * 100));
  const ilWidth = Math.min(100, Math.max(0, (Math.abs(pos.ilRunning || 0) / entryValue) * 100));
  
  const daysOpen = pos.createdAt ? Math.max(0.1, (now - new Date(pos.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0.1;
  const feeEarnedPct = ((pos.feesCollected || 0) / entryValue) * 100;

  return (
    <article className={`pos ${isWarning ? 'out' : ''}`}>
      <div className="pos-top">
        <span className="pair">{pair}</span>
        <span className="tag" style={{ marginLeft: "8px", background: "#444", color: "#fff" }}>[LP]</span>
        <span className={`mode-b ${isNight ? 'night' : 'day'}`}>
          {isNight ? 'NIGHT · SPRAY' : 'DAY · FULL RANGE'}
        </span>
        <span className="tag" style={{ marginLeft: "8px", background: "#333", color: "#ddd" }}>
          v3 · {pos.feeTier / 10000}%
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
        <span>${pos.entryValue} deployed · opened {openedAt} · {Math.floor(daysOpen)}d ago · {feeEarnedPct.toFixed(2)}% fees</span>
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
        <div className="head" style={{ left: `${headLeft}%`, transition: 'left 0.3s ease-out' }}>
          {currentTick !== null && (
            <span style={{
              position: 'absolute',
              top: '-18px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '10px',
              color: '#E9E4D6',
              whiteSpace: 'nowrap',
              fontFamily: 'monospace',
              fontWeight: 600
            }}>
              {currentTick}
            </span>
          )}
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
          <div className="bt"><div className="bf" style={{ width: `${feesWidth}%` }}></div></div>
        </div>
        <div className="bar il">
          <div className="bk"><span>IL ESTIMATE</span><span>{pos.ilRunning === 0 ? "n/a (no IL yet)" : `$${Number(pos.ilRunning || 0).toFixed(2)}`}</span></div>
          <div className="bt"><div className="bf" style={{ width: `${ilWidth}%` }}></div></div>
        </div>
      </div>
      
      <div className="verdict">
        {isWarning ? (
          <><span className="warn">▶ {currentTick !== null ? 'PRICE NEAR EDGE' : 'IL > fee'} · warning</span> · monitoring · close if persists for 4h</>
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
