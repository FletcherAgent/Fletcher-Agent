import React from 'react';

export function ScreeningFeed({ wallets }: { wallets: any[] }) {
  return (
    <div className="sect sect-fill" style={{ flex: '0 1 auto', paddingBottom: '0', marginBottom: '12px', maxHeight: '50%' }}>
      <div className="sect-head" style={{ flexShrink: 0 }}>
        <h2>Screening feed</h2>
        <span className="tag">GMGN 24H · AI DETECTED</span>
      </div>
      <div className="scrollable" style={{ display: 'flex', flexDirection: 'column', paddingRight: '4px', paddingBottom: '12px' }}>
      {wallets.length === 0 && (
        <div style={{ padding: '1rem', color: 'var(--mute)' }}>No active screening data.</div>
      )}
      {wallets.map((wallet, idx) => {
        const addr = wallet.address.slice(0, 6) + '...' + wallet.address.slice(-4);
        const name = wallet.label || addr;
        const volDesc = `Tier ${wallet.tier} · ${wallet.winRate ? `${wallet.winRate}% WR` : 'New'}`;
        const score = wallet.status === 'ACTIVE' ? (wallet.winRate ? Math.round(wallet.winRate) : 'NEW') : 'VETO';
        
        return (
          <div className="feeditem" key={wallet.id || idx} style={wallet.status !== 'ACTIVE' ? { opacity: 0.45 } : {}}>
            <span className="sym">{name}</span>
            <span className="fk">{volDesc}</span>
            <span className={`score ${wallet.status !== 'ACTIVE' ? 'mid' : ''}`} style={wallet.status !== 'ACTIVE' ? { color: "var(--red)" } : {}}>
              {score}
            </span>
            {wallet.status === 'ACTIVE' && <button className="fbtn">PROPOSE</button>}
          </div>
        );
      })}
      </div>
    </div>
  );
}
