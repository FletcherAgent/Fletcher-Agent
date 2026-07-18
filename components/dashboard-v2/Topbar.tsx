import React from 'react';

interface TopbarProps {
  blk: number;
}

export function Topbar({ blk }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="wordmark">
        <a href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <img src="/logo.PNG" alt="Fletcher Logo" style={{ height: '32px', objectFit: 'contain' }} />
        </a>
      </div>
      <div className="chainpill">
        <span className="dot"></span>
        ROBINHOOD CHAIN · 4663 · <span>#{blk.toLocaleString()}</span>
      </div>
      <div className="spacer"></div>
      <div className="modes" role="tablist" aria-label="Autonomy mode">
        <button role="tab" aria-selected="false">MANUAL</button>
        <button role="tab" aria-selected="true" className="on">SEMI</button>
        <button role="tab" aria-selected="false">FULL</button>
      </div>
      <div className="tier">TIER 2 · 2.4M $FLETCH</div>
      <div className="addr">0x7e3B…a3ad</div>
    </header>
  );
}
