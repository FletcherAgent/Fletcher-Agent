import React from 'react';

export function StatStrip() {
  return (
    <div className="strip">
      <div className="stat">
        <div className="k">TOTAL DEPLOYED</div>
        <div className="v">$5,910</div>
        <div className="sub">3 / 3 positions</div>
      </div>
      <div className="stat">
        <div className="k">FEES 24H</div>
        <div className="v"><span className="up">+$1,204</span></div>
        <div className="sub">+20.4% on deployed</div>
      </div>
      <div className="stat">
        <div className="k">HARVESTED (ALL TIME)</div>
        <div className="v">$3,847</div>
        <div className="sub">above $2K/position cap</div>
      </div>
      <div className="stat">
        <div className="k">FEE vs IL (24H)</div>
        <div className="v"><span className="up">4.7×</span></div>
        <div className="sub">fee &gt; IL · hold</div>
      </div>
    </div>
  );
}
