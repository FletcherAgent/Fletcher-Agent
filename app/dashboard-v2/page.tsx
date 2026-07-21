"use client";

import React, { useEffect, useState } from "react";
import "./dashboard.css"; // Import the CSS module

// Components
import { Topbar } from "../../components/dashboard-v2/Topbar";
import { StatStrip } from "../../components/dashboard-v2/StatStrip";
import { PositionCard } from "../../components/dashboard-v2/PositionCard";
import { SpotPositionCard } from "../../components/dashboard-v2/SpotPositionCard";
import { ScreeningFeed } from "../../components/dashboard-v2/ScreeningFeed";
import { TrackerSignals } from "../../components/dashboard-v2/TrackerSignals";
import { AgentLog } from "../../components/dashboard-v2/AgentLog";
import { Footer } from "../../components/dashboard-v2/Footer";

export default function DashboardV2() {
  const [blk, setBlk] = useState(2481395);
  
  // Real Data State
  const [data, setData] = useState<{
    wallets: any[];
    signals: any[];
    positions: any[];
    lpPositions: any[];
    logs: any[];
    metrics: any;
  } | null>(null);

  useEffect(() => {
    // Fetch real data from backend
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/dashboard`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fetchData();
    const dataInterval = setInterval(fetchData, 3000);

    // Block ticker
    const blkInterval = setInterval(() => {
      setBlk((prev) => prev + Math.floor(Math.random() * 4) + 2);
    }, 1200);

    return () => {
      clearInterval(dataInterval);
      clearInterval(blkInterval);
    };
  }, []);

  return (
    <div className="dashboard-v2-container">
      <Topbar blk={blk} />

      <main className="wrap">
        {/* LEFT: Agent Log */}
        <section className="col">
          <AgentLog logs={data?.logs || []} />
        </section>

        {/* MIDDLE: positions */}
        <section className="col">
          <StatStrip metrics={data?.metrics} lpPositions={data?.lpPositions || []} />
          <PositionCard lpPositions={data?.lpPositions || []} />
          <SpotPositionCard positions={data?.positions || []} />
        </section>

        {/* RIGHT: screening + signals */}
        <aside className="col">
          <ScreeningFeed wallets={data?.wallets || []} />
          <TrackerSignals signals={data?.signals || []} />
        </aside>
      </main>

      <Footer />
    </div>
  );
}
