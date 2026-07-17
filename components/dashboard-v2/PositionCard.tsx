import React from 'react';

export function PositionCard({ head3Left }: { head3Left: number }) {
  return (
    <div className="sect">
      <div className="sect-head">
        <h2>Open positions</h2>
        <span className="tag live">● LIVE</span>
        <span className="tag" style={{ marginLeft: "auto" }}>CAP $2K / POS · MAX 3</span>
      </div>

      {/* Position 1 : NIGHT concentrated, in range */}
      <article className="pos">
        <div className="pos-top">
          <span className="pair">HOODAI / WETH</span>
          <span className="mode-b night">NIGHT · SPRAY</span>
          <span className="apr">+31.2%</span>
        </div>
        <div className="pos-meta">$2,000 deployed · opened 22:14 WIB · utility / AI agent · NOXA graduated</div>
        <div className="arrow" id="arw1">
          <div className="shaft"></div>
          <div className="range" style={{ left: "22%", width: "46%" }}></div>
          <div className="fletch" style={{ left: "22%" }}>
            <svg width="14" height="18" viewBox="0 0 14 18"><path d="M2 0 L12 4 L12 8 L2 4 Z M2 6 L12 10 L12 14 L2 10 Z" fill="#38C172" opacity=".85"/></svg>
          </div>
          <div className="fletch" style={{ left: "calc(68% - 14px)" }}>
            <svg width="14" height="18" viewBox="0 0 14 18"><path d="M12 0 L2 4 L2 8 L12 4 Z M12 6 L2 10 L2 14 L12 10 Z" fill="#38C172" opacity=".85"/></svg>
          </div>
          <div className="head" style={{ left: "51%" }}>
            <svg width="14" height="16" viewBox="0 0 14 16"><path d="M7 0 L14 8 L7 16 L7 11 L0 11 L0 5 L7 5 Z" fill="#E9E4D6"/></svg>
          </div>
          <span className="rl" style={{ left: "22%" }}>0.0184</span>
          <span className="rl" style={{ left: "64%" }}>0.0291</span>
        </div>
        <div className="bars">
          <div className="bar"><div className="bk"><span>FEE RATE / HR</span><span>$26.10</span></div><div className="bt"><div className="bf" style={{ width: "78%" }}></div></div></div>
          <div className="bar il"><div className="bk"><span>IL RATE / HR</span><span>$4.90</span></div><div className="bt"><div className="bf" style={{ width: "15%" }}></div></div></div>
        </div>
        <div className="verdict"><span className="ok">▶ fee &gt; IL · compounding</span> · next auto-collect in 00:41:12</div>
        <div className="pos-actions"><button>REBALANCE</button><button>CLOSE</button></div>
      </article>

      {/* Position 2 : DAY full range */}
      <article className="pos">
        <div className="pos-top">
          <span className="pair">RWAX / USDC</span>
          <span className="mode-b day">DAY · FULL RANGE</span>
          <span className="apr">+12.8%</span>
        </div>
        <div className="pos-meta">$2,000 deployed · opened 11:03 WIB · utility / RWA · vol 24h $2.7M</div>
        <div className="arrow">
          <div className="shaft"></div>
          <div className="range" style={{ left: "2%", width: "96%" }}></div>
          <div className="fletch" style={{ left: "2%" }}>
            <svg width="14" height="18" viewBox="0 0 14 18"><path d="M2 0 L12 4 L12 8 L2 4 Z M2 6 L12 10 L12 14 L2 10 Z" fill="#38C172" opacity=".85"/></svg>
          </div>
          <div className="fletch" style={{ left: "calc(98% - 14px)" }}>
            <svg width="14" height="18" viewBox="0 0 14 18"><path d="M12 0 L2 4 L2 8 L12 4 Z M12 6 L2 10 L2 14 L12 10 Z" fill="#38C172" opacity=".85"/></svg>
          </div>
          <div className="head" style={{ left: "44%" }}>
            <svg width="14" height="16" viewBox="0 0 14 16"><path d="M7 0 L14 8 L7 16 L7 11 L0 11 L0 5 L7 5 Z" fill="#E9E4D6"/></svg>
          </div>
          <span className="rl" style={{ left: "2%" }}>FULL</span>
          <span className="rl" style={{ left: "93%" }}>RANGE</span>
        </div>
        <div className="bars">
          <div className="bar"><div className="bk"><span>FEE RATE / HR</span><span>$11.40</span></div><div className="bt"><div className="bf" style={{ width: "52%" }}></div></div></div>
          <div className="bar il"><div className="bk"><span>IL RATE / HR</span><span>$1.10</span></div><div className="bt"><div className="bf" style={{ width: "5%" }}></div></div></div>
        </div>
        <div className="verdict"><span className="ok">▶ fee &gt; IL · hold</span> · scheduled close 21:00 WIB · harvest on close</div>
        <div className="pos-actions"><button>CLOSE</button></div>
      </article>

      {/* Position 3 : near range edge, warning */}
      <article className="pos out">
        <div className="pos-top">
          <span className="pair">CASHCAT / WETH</span>
          <span className="mode-b night">NIGHT · SPRAY</span>
          <span className="apr" style={{ color: "var(--amber)" }}>+18.9%</span>
        </div>
        <div className="pos-meta">$1,910 deployed · opened 22:16 WIB · meme (legacy runner) · exception approved via /lpmeta</div>
        <div className="arrow">
          <div className="shaft"></div>
          <div className="range" style={{ left: "30%", width: "40%" }}></div>
          <div className="fletch" style={{ left: "30%" }}>
            <svg width="14" height="18" viewBox="0 0 14 18"><path d="M2 0 L12 4 L12 8 L2 4 Z M2 6 L12 10 L12 14 L2 10 Z" fill="#E0A82E" opacity=".85"/></svg>
          </div>
          <div className="fletch" style={{ left: "calc(70% - 14px)" }}>
            <svg width="14" height="18" viewBox="0 0 14 18"><path d="M12 0 L2 4 L2 8 L12 4 Z M12 6 L2 10 L2 14 L12 10 Z" fill="#E0A82E" opacity=".85"/></svg>
          </div>
          <div className="head" id="head3" style={{ left: `${head3Left}%` }}>
            <svg width="14" height="16" viewBox="0 0 14 16"><path d="M7 0 L14 8 L7 16 L7 11 L0 11 L0 5 L7 5 Z" fill="#E9E4D6"/></svg>
          </div>
          <span className="rl" style={{ left: "30%" }}>0.00071</span>
          <span className="rl" style={{ left: "66%" }}>0.00112</span>
        </div>
        <div className="bars">
          <div className="bar"><div className="bk"><span>FEE RATE / HR</span><span>$14.70</span></div><div className="bt"><div className="bf" style={{ width: "60%" }}></div></div></div>
          <div className="bar il"><div className="bk"><span>IL RATE / HR</span><span>$9.80</span></div><div className="bt"><div className="bf" style={{ width: "42%" }}></div></div></div>
        </div>
        <div className="verdict"><span className="warn">▲ price near range edge · rebalance proposed → sent to Telegram</span></div>
        <div className="pos-actions"><button>REBALANCE</button><button>CLOSE</button></div>
      </article>
    </div>
  );
}
