import React from 'react';

export function TrackerSignals({ signals }: { signals: any[] }) {
  return (
    <div className="sect sect-fill" style={{ flex: '0 0 auto', paddingBottom: '0', marginBottom: '0' }}>
      <div className="sect-head" style={{ flexShrink: 0 }}>
        <h2>Tracker signals</h2>
        <span className="tag">LATEST {signals.length}</span>
      </div>
      <div className="scrollable" style={{ paddingBottom: "12px" }}>
      {signals.length === 0 && (
        <div style={{ padding: '1rem', color: 'var(--mute)' }}>No signals yet.</div>
      )}
      {signals.map((sig, idx) => {
        const timeStr = new Date(sig.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const isCopy = sig.source === 'COPYTRADE';
        const sourceLabel = isCopy ? (sig.copiedFrom?.slice(0,6) || 'wallet') : 'scout';

        return (
          <div className="v2-sig" key={sig.id || idx}>
            <span className="w">{sourceLabel}</span> signaled <b>{sig.tokenAddress.slice(0, 6)}...</b> · <span className="t">{timeStr}</span><br />
            {sig.passed ? (
              <span className="ok" style={{ color: "var(--green)" }}>evaluation PASS (score: {sig.score.toFixed(1)}) · executing</span>
            ) : (
              <span className="chase">evaluation SKIP (score: {sig.score.toFixed(1)})</span>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
}
