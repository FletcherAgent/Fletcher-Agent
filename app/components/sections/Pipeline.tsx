"use client";
import { useState } from "react";

export default function Pipeline() {
  const [openStep, setOpenStep] = useState<number | null>(null);

  const toggleStep = (idx: number) => {
    setOpenStep(openStep === idx ? null : idx);
  };

  const steps = [
    {
      num: "STEP 01",
      icon: "SC",
      title: "Scout / Detection",
      desc: "Watches Robinhood Chain events.",
      details: ["NOXA factory creation", "Uniswap V3 PoolCreated", "Graduation events"],
    },
    {
      num: "STEP 02",
      icon: "EV",
      title: "Evaluation",
      desc: "Scores the candidate launch.",
      details: ["Deployer tx history", "Honeypot sim via eth_call", "Holder distribution"],
    },
    {
      num: "STEP 03",
      icon: "RW",
      title: "Risk Warden",
      desc: "Shared Risk Layer enforcement.",
      details: ["Fixed-fractional sizing", "Portfolio heat cap", "Hard risk gate"],
    },
    {
      num: "STEP 04",
      icon: "TR",
      title: "Trader Execution",
      desc: "Submits transaction to Router.",
      details: ["Unsigned EVM calldata", "Zero-custody signature", "Gas optimization"],
    },
    {
      num: "STEP 05",
      icon: "GD",
      title: "Guardian Monitor",
      desc: "Exit Guard & safety monitors.",
      details: ["Re-simulate sell paths", "TP / SL triggers", "Emergency exits"],
    },
    {
      num: "STEP 06",
      icon: "LP",
      title: "LP Manager",
      desc: "Active Range management.",
      details: ["Volatility-band rebalancing", "Fee auto-compounding", "Impermanent Loss monitor"],
    },
  ];

  return (
    <section id="pipeline">
      <div className="wrap">
        <div className="pipeline-hd">
          <div className="sec-label">Architecture</div>
          <h2 className="sec-h2">The Fletcher<br />Pipeline</h2>
          <p className="sec-body">
            End-to-end data flow from on-chain event detection to active liquidity management on Uniswap V3. No mempool racing, purely event-driven execution.
          </p>
        </div>
        <div className="pipe-grid">
          {steps.map((step, idx) => {
            const isOpen = openStep === idx;
            return (
              <div
                key={idx}
                className={`pipe-step ${isOpen ? "pipe-step-active" : ""}`}
                onClick={() => toggleStep(idx)}
              >
                <span className="pipe-num">{step.num}</span>
                <div className="pipe-icon">{step.icon}</div>
                <div className="pipe-title" style={isOpen ? { color: "#fff" } : {}}>
                  {step.title}
                </div>
                <p className="pipe-desc" style={isOpen ? { color: "rgba(255,255,255,0.7)" } : {}}>
                  {step.desc}
                </p>
                <div className={`pipe-expand ${isOpen ? "open" : ""}`}>
                  <div className="pipe-expand-body">
                    <ul className="pe-list">
                      {step.details.map((detail, dIdx) => (
                        <li key={dIdx}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
