"use client";
import { useState } from "react";

export default function Features() {
  const [activeFeat, setActiveFeat] = useState<number | null>(null);

  const toggleFeat = (idx: number) => {
    setActiveFeat(activeFeat === idx ? null : idx);
  };

  const features = [
    {
      num: "01",
      title: "Event-Listener Entry",
      desc: "No mempool sniping required.",
      more: "Listens to NOXA factory creation and Uniswap V3 PoolCreated events directly from the RPC to detect launches immediately."
    },
    {
      num: "02",
      title: "Exit Guard",
      desc: "Continuously re-simulates sell paths.",
      more: "If sell simulation starts failing or slippage blows past a ceiling (liquidity being pulled), it fires an emergency exit signal immediately."
    },
    {
      num: "03",
      title: "Zero Custody",
      desc: "Fletcher never holds your assets.",
      more: "Produces signals and unsigned EVM calldata. The wallet, vault, or custody partner signs and broadcasts."
    },
    {
      num: "04",
      title: "Shared Risk Layer",
      desc: "Institutional prop-desk risk module.",
      more: "Enforces 4-tier circuit breakers, portfolio heat caps, and fixed-fractional sizing at the code level. No signal can override the gate."
    },
    {
      num: "05",
      title: "Active Range LP",
      desc: "Dynamic Uniswap V3 concentrated liquidity.",
      more: "Sets active tick ranges based on realized volatility. Wider band in high-vol regimes, tighter to concentrate fees when calm."
    },
    {
      num: "06",
      title: "MCP Server",
      desc: "Native AI integration ready.",
      more: "Exposes read and signal tools for Claude/Copilot, returning unsigned txs to keep the zero-custody story intact."
    }
  ];

  return (
    <section id="features">
      <div className="wrap">
        <div className="feat-layout">
          <div>
            <div className="sec-label">Core Mechanics</div>
            <h2 className="sec-h2">Zero Custody.<br />Maximum<br />Alpha.</h2>
            <p className="sec-body">
              Fletcher is built for speed and safety. It combines real-time EVM event listeners, institutional risk controls, and Uniswap V3 active range management into a single autonomous pipeline.
            </p>
          </div>
          <div className="feat-side">
            <div className="feat-grid">
              {features.map((feat, idx) => {
                const isActive = activeFeat === idx;
                return (
                  <div
                    key={idx}
                    className={`feat-item ${isActive ? "active" : ""}`}
                    onClick={() => toggleFeat(idx)}
                  >
                    <div className="fi-num">{feat.num}</div>
                    <div className="fi-title">{feat.title}</div>
                    <p className="fi-desc">{feat.desc}</p>
                    <div className="fi-more" style={{ display: isActive ? "block" : "none" }}>
                      <div className="fi-more-text">{feat.more}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="fs-stat">
              <div className="fs-stat-n">100<em>ms</em></div>
              <div className="fs-stat-l">Block Time Precision</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
