import React from 'react';

export function ScreeningFeed() {
  return (
    <div className="sect">
      <div className="sect-head">
        <h2>Screening feed</h2>
        <span className="tag">GMGN 24H · META: UTILITY</span>
      </div>
      <div className="feeditem">
        <span className="sym">TERMX/WETH</span>
        <span className="fk">$1.8M mc · $4.2M vol</span>
        <span className="score">92</span>
        <button className="fbtn">PROPOSE</button>
      </div>
      <div className="feeditem">
        <span className="sym">HOODSCAN/USDC</span>
        <span className="fk">$920K mc · $1.6M vol</span>
        <span className="score">87</span>
        <button className="fbtn">PROPOSE</button>
      </div>
      <div className="feeditem">
        <span className="sym">AGNTFI/WETH</span>
        <span className="fk">$640K mc · $1.1M vol</span>
        <span className="score mid">71</span>
        <button className="fbtn">PROPOSE</button>
      </div>
      <div className="feeditem" style={{ opacity: 0.45 }}>
        <span className="sym">FLAPX/WETH</span>
        <span className="fk">blocked · flap.fun origin</span>
        <span className="score" style={{ color: "var(--red)" }}>VETO</span>
      </div>
    </div>
  );
}
