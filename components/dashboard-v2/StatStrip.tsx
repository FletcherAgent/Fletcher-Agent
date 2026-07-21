import React from 'react';

export function StatStrip({ metrics, lpPositions = [] }: { metrics?: any, lpPositions?: any[] }) {
  // Calculate dynamic totals from lpPositions
  const activePositions = lpPositions.filter(p => p.status === 'OPEN' || !p.status);
  
  let totalFees = 0;
  let totalIl = 0;
  let totalDeployed = 0;
  let allTimeHarvested = 0;
  
  activePositions.forEach(pos => {
    totalFees += pos.feesCollected || 0;
    totalIl += pos.ilRunning || 0;
    totalDeployed += pos.entryValue || 0;
  });

  lpPositions.forEach(pos => {
    allTimeHarvested += pos.feesCollected || 0;
  });

  const absIl = Math.abs(totalIl);
  const feeVsIlRatio = absIl > 0 ? (totalFees / absIl).toFixed(1) : (totalFees > 0 ? 'MAX' : '0.0');
  const isHealthy = totalFees >= absIl;
  const activeCount = activePositions.length;

  const cap = metrics?.maxPositionSize || 2000;
  
  return (
    <div className="strip">
      <div className="stat">
        <div className="k">TOTAL DEPLOYED</div>
        <div className="v">${totalDeployed.toFixed(2)}</div>
        <div className="sub">{activeCount} / 3 positions</div>
      </div>
      <div className="stat">
        <div className="k">FEES 24H</div>
        <div className="v"><span className={totalFees >= 0 ? "up" : ""}>+${totalFees.toFixed(2)}</span></div>
        <div className="sub">{totalDeployed > 0 ? ((totalFees / totalDeployed) * 100).toFixed(1) : '0.0'}% on deployed</div>
      </div>
      <div className="stat">
        <div className="k">HARVESTED (ALL TIME)</div>
        <div className="v">${allTimeHarvested.toFixed(2)}</div>
        <div className="sub">above ${cap >= 1000 ? `${cap/1000}K` : cap}/position cap</div>
      </div>
      <div className="stat">
        <div className="k">FEE vs IL (24H)</div>
        <div className="v"><span className={isHealthy ? "up" : ""}>{feeVsIlRatio}×</span></div>
        <div className="sub">{isHealthy ? 'fee > IL · hold' : 'IL > fee · warning'}</div>
      </div>
    </div>
  );
}
