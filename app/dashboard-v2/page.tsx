"use client";

import React, { useEffect, useState } from "react";
import "./dashboard.css"; // Import the CSS module

// Components
import { Topbar } from "../../components/dashboard-v2/Topbar";
import { StatStrip } from "../../components/dashboard-v2/StatStrip";
import { PositionCard } from "../../components/dashboard-v2/PositionCard";
import { ScreeningFeed } from "../../components/dashboard-v2/ScreeningFeed";
import { TrackerSignals } from "../../components/dashboard-v2/TrackerSignals";
import { AgentLog } from "../../components/dashboard-v2/AgentLog";
import { Footer } from "../../components/dashboard-v2/Footer";

export default function DashboardV2() {
  const [blk, setBlk] = useState(2481395);
  const [head3Left, setHead3Left] = useState(66);
  const [logs, setLogs] = useState([
    ["ok", "[GUARDIAN]", "sell re-sim PASS · 3/3 positions"],
    ["ok", "[LP-ENGINE]", "collected $38.20 fees HOODAI/WETH → compounded"],
    ["veto", "[SAFETY]", "VETO 0xa41f…c2 · sell simulation reverted · blacklisted"],
    ["ok", "[TRACKER]", "early-2 BUY detected · TERMX · chase 1.1×"],
    ["warn", "[GUARDIAN]", "CASHCAT/WETH price 91% through range · rebalance proposed"],
    ["ok", "[SCREEN]", "4 pairs pass filter · meta=utility · flap.fun excluded"],
    ["ok", "[RISK]", "portfolio heat 34% · within cap"],
  ]);

  useEffect(() => {
    // Block ticker
    const blkInterval = setInterval(() => {
      setBlk((prev) => prev + Math.floor(Math.random() * 4) + 2);
    }, 1200);

    // Arrowhead drift
    let p = 66, dir = 1;
    const arrowInterval = setInterval(() => {
      p += dir * (Math.random() * 1.4);
      if (p > 68) dir = -1;
      if (p < 60) dir = 1;
      setHead3Left(p);
    }, 2500);

    // Log lines generator
    const logInterval = setInterval(() => {
      const possibleLines = [
        ["ok", "[LP-ENGINE]", "fee vs IL check · 3/3 hold"],
        ["ok", "[TRACKER]", "block scan · 7 wallets · no new tx"],
        ["ok", "[GUARDIAN]", "sell re-sim PASS · 3/3 positions"],
        ["warn", "[SCREEN]", "AGNTFI holder concentration 27% · score penalty"],
        ["ok", "[RISK]", "heat 34% · LP $5.9K + trench $0"],
        ["ok", "[LP-ENGINE]", "collected $12.44 fees RWAX/USDC → compounded"],
      ];
      const l = possibleLines[Math.floor(Math.random() * possibleLines.length)];
      setLogs((prevLogs) => {
        const newLogs = [l, ...prevLogs];
        return newLogs.slice(0, 30);
      });
    }, 4000);

    return () => {
      clearInterval(blkInterval);
      clearInterval(arrowInterval);
      clearInterval(logInterval);
    };
  }, []);

  return (
    <div className="dashboard-v2-container">
      <Topbar blk={blk} />

      <main className="wrap">
        {/* LEFT: positions */}
        <section className="col">
          <StatStrip />
          <PositionCard head3Left={head3Left} />
        </section>

        {/* RIGHT: screening + signals + log */}
        <aside className="col">
          <ScreeningFeed />
          <TrackerSignals />
          <AgentLog logs={logs} />
        </aside>
      </main>

      <Footer />
    </div>
  );
}
