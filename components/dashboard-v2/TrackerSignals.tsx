import React from 'react';

export function TrackerSignals() {
  return (
    <div className="sect">
      <div className="sect-head">
        <h2>Tracker signals</h2>
        <span className="tag">7 WALLETS · 3 BUNDLES</span>
      </div>
      <div className="v2-sig">
        <span className="w">early-2</span> bought <b>TERMX</b> @ $410K mc · <span className="t">2m ago</span><br />
        <span className="ok" style={{ color: "var(--green)" }}>chase guard PASS (1.1×) · queued behind safety gate</span>
      </div>
      <div className="v2-sig">
        <span className="w">nachsol</span> bought <b>MEOWFI</b> @ $95K mc · <span className="t">18m ago</span><br />
        <span className="chase">chase guard SKIP · current mc 3.4× entry</span>
      </div>
      <div className="v2-sig">
        <span className="w">bundle-A ×3</span> confluence on <b>HOODSCAN</b> · <span className="t">41m ago</span><br />
        <span style={{ color: "var(--green)" }}>deduped → 1 signal · confidence HIGH</span>
      </div>
    </div>
  );
}
