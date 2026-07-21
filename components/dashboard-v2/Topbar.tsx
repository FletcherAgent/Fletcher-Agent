import React from 'react';

interface TopbarProps {
  blk: number;
  tradingMode?: string;
}

export function Topbar({ blk, tradingMode = "SEMI" }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="wordmark">
        <a href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.PNG" alt="Fletcher Logo" style={{ height: '32px', objectFit: 'contain' }} />
          <span style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }}>FLETCHER<span className="tick" style={{ color: '#2bff5b' }}>.</span></span>
        </a>
      </div>
      <div className="chainpill">
        <span className="dot"></span>
        ROBINHOOD CHAIN · 4663 · <span>#{blk.toLocaleString()}</span>
      </div>
      <div className="spacer"></div>
      <div className="modes" role="tablist" aria-label="Autonomy mode">
        <button role="tab" aria-selected={tradingMode === 'MANUAL'} className={tradingMode === 'MANUAL' ? 'on' : ''}>MANUAL</button>
        <button role="tab" aria-selected={tradingMode === 'SEMI'} className={tradingMode === 'SEMI' ? 'on' : ''}>SEMI</button>
        <button role="tab" aria-selected={tradingMode === 'FULL'} className={tradingMode === 'FULL' ? 'on' : ''}>FULL</button>
      </div>
      <div className="tier">TIER 2 · 2.4M $FLETCH</div>
      <div className="addr">0x7e3B…a3ad</div>
    </header>
  );
}
