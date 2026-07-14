"use client";
import { useRef, useEffect, useState } from "react";

const phases = [
  {
    id: "phase-1",
    label: "Phase 1",
    status: "live" as const,
    title: "Core Execution Engine",
    period: "Q2 2026",
    items: [
      { done: true,  text: "WebSocket Scout Agent — NOXA Factory & Uniswap V3 PoolCreated" },
      { done: true,  text: "Uniswap Universal Router v4 swap execution on Robinhood Chain" },
      { done: true,  text: "Risk Warden — 15% daily drawdown circuit breaker" },
      { done: true,  text: "Portfolio heat cap (max 5 concurrent positions)" },
      { done: true,  text: "Telegram Push Notifications + Confirm / Reject mode" },
      { done: true,  text: "Auto stop-loss & take-profit via Guardian Agent" },
    ],
  },
  {
    id: "phase-2",
    label: "Phase 2",
    status: "current" as const,
    title: "Alpha Copy-Trade Protocol",
    period: "Q3 2026",
    items: [
      { done: true,  text: "Alchemy Webhook Interceptor for real-time wallet surveillance" },
      { done: true,  text: "Smart Money tier system (Tier 1 / 2 / 3 wallets)" },
      { done: true,  text: "Universal Router v4 calldata decoder (V3_SWAP_EXACT_IN)" },
      { done: true,  text: "Router whitelist filter — blocks NFT & non-swap noise" },
      { done: true,  text: "Anti-farm guard — auto-demote wallets that flip < 2 min" },
      { done: false, text: "Dynamic pool fee detection (0.05% / 0.3% / 1% pools)" },
      { done: false, text: "On-chain P&L tracking per copied wallet" },
    ],
  },
  {
    id: "phase-3",
    label: "Phase 3",
    status: "upcoming" as const,
    title: "Intelligence Layer",
    period: "Q4 2026",
    items: [
      { done: false, text: "AI Sentiment Agent — X (Twitter) & on-chain signal fusion" },
      { done: false, text: "Autonomous wallet scoring & smart-money discovery" },
      { done: false, text: "Multi-wallet distributed copy-trading with bundle isolation" },
      { done: false, text: "LP Management Agent — auto-range rebalancing on Uniswap V4" },
      { done: false, text: "Web Dashboard with live P&L, signals & wallet analytics" },
    ],
  },
  {
    id: "phase-4",
    label: "Phase 4",
    status: "upcoming" as const,
    title: "Swarm Protocol",
    period: "2027",
    items: [
      { done: false, text: "Autonomous Smart Contract deployer for token launches" },
      { done: false, text: "Cross-chain execution bridge (Ethereum, Base, Arbitrum)" },
      { done: false, text: "DAO governance for strategy parameters" },
      { done: false, text: "Public API for third-party signal subscriptions" },
    ],
  },
];

const STATUS_META = {
  live:     { label: "LIVE",     color: "var(--green)", bg: "var(--green-dim)" },
  current:  { label: "BUILDING", color: "#5eb5f7",      bg: "rgba(0,150,255,.1)" },
  upcoming: { label: "UPCOMING", color: "var(--dim)",   bg: "rgba(138,138,138,.08)" },
};

export default function Roadmap() {
  const lineRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const { top, height } = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const entered = windowH - top;
      const pct = Math.min(1, Math.max(0, entered / (height + windowH * 0.4)));
      setProgress(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="roadmap" ref={sectionRef}>
      <div className="wrap">
        <div className="eyebrow reveal">Roadmap</div>
        <h2 className="reveal">The Evolution of Fletcher</h2>
        <p className="lede reveal">
          A systematic expansion from core execution to an autonomous, intelligence-driven trading swarm.
        </p>

        {/* Timeline container */}
        <div className="rm-timeline">
          {/* Vertical progress line */}
          <div className="rm-line-track">
            <div
              ref={lineRef}
              className="rm-line-fill"
              style={{ height: `${progress * 100}%` }}
            />
          </div>

          {phases.map((phase, i) => {
            const meta = STATUS_META[phase.status];
            const doneCount = phase.items.filter(x => x.done).length;
            const pct = Math.round((doneCount / phase.items.length) * 100);

            return (
              <div key={phase.id} className="rm-phase reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                {/* Node */}
                <div
                  className="rm-node"
                  style={{ borderColor: meta.color, background: phase.status !== "upcoming" ? meta.color : "var(--bg)" }}
                />

                {/* Card */}
                <div className="rm-card" style={{ borderColor: phase.status === "current" ? meta.color : "var(--line)" }}>
                  {/* Header */}
                  <div className="rm-card-head">
                    <div className="rm-phase-meta">
                      <span className="rm-phase-label">{phase.label}</span>
                      <span className="rm-period">{phase.period}</span>
                    </div>
                    <span
                      className="rm-badge"
                      style={{ color: meta.color, background: meta.bg, borderColor: meta.color + "44" }}
                    >
                      {meta.label}
                    </span>
                  </div>

                  <h3 className="rm-title">{phase.title}</h3>

                  {/* Progress bar */}
                  {phase.status !== "upcoming" && (
                    <div className="rm-progress-wrap">
                      <div className="rm-progress-track">
                        <div
                          className="rm-progress-bar"
                          style={{ width: `${pct}%`, background: meta.color }}
                        />
                      </div>
                      <span className="rm-pct" style={{ color: meta.color }}>{pct}%</span>
                    </div>
                  )}

                  {/* Feature list */}
                  <ul className="rm-list">
                    {phase.items.map((item, j) => (
                      <li key={j} className={`rm-item ${item.done ? "rm-done" : "rm-pending"}`}>
                        <span className="rm-check">
                          {item.done ? (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <span className="rm-dot" />
                          )}
                        </span>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
