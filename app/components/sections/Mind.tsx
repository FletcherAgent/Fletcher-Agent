"use client";

import { useEffect, useState } from "react";

export default function Mind() {
  const [activeTab, setActiveTab] = useState("feed");
  const [logs, setLogs] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);

  useEffect(() => {
    const fetchMindData = async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://fletcher-core-production-d4b8.up.railway.app";
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
        const res = await fetch(`${API_URL}/api/dashboard`, {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
          setPositions(data.positions || []);
        }
      } catch (e) {
        console.error("Failed to fetch mind data", e);
      }
    };
    fetchMindData();
    const intv = setInterval(fetchMindData, 5000);
    return () => clearInterval(intv);
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("swarm") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0,
      H = 0,
      cx = 0,
      cy = 0,
      R = 0;
    const NODES = 380,
      HUBS = 5;
    const nodes: any[] = [],
      hubs: any[] = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      cy = H / 2;
      R = Math.min(W, H) * 0.42;
    }
    resize();
    window.addEventListener("resize", resize);

    const GA = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < NODES; i++) {
      const y = 1 - (i / (NODES - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = GA * i;
      nodes.push({ x: Math.cos(th) * rad, y: y, z: Math.sin(th) * rad, tw: Math.random() * 6.28 });
    }
    for (let i = 0; i < HUBS; i++) {
      const a = Math.random() * 6.28,
        r = Math.random() * 0.22;
      hubs.push({
        x: Math.cos(a) * r,
        y: (Math.random() - 0.5) * 0.3,
        z: Math.sin(a) * r,
        ph: Math.random() * 6.28,
      });
    }

    const pulses: any[] = [];
    let t = 0;
    let reqId: number;
    function frame() {
      t++;
      ctx!.clearRect(0, 0, W, H);
      const rotY = t * 0.0022,
        rotX = 0.35 + 0.12 * Math.sin(t * 0.0011);
      const cy1 = Math.cos(rotY),
        sy1 = Math.sin(rotY);
      const cx1 = Math.cos(rotX),
        sx1 = Math.sin(rotX);

      function proj(p: any) {
        let x = p.x * cy1 - p.z * sy1,
          z = p.x * sy1 + p.z * cy1,
          y = p.y;
        let y2 = y * cx1 - z * sx1,
          z2 = y * sx1 + z * cx1;
        const per = 2.2 / (2.2 + z2);
        return { x: cx + x * R * per, y: cy + y2 * R * per, d: per };
      }

      const np = nodes.map(proj),
        hp = hubs.map(proj);

      ctx!.lineWidth = 0.4;
      for (let i = 0; i < NODES; i += 2) {
        const n = np[i],
          h = hp[i % HUBS];
        ctx!.strokeStyle = "rgba(255,255,255," + (0.025 * n.d).toFixed(3) + ")";
        ctx!.beginPath();
        ctx!.moveTo(n.x, n.y);
        ctx!.lineTo(h.x, h.y);
        ctx!.stroke();
      }
      ctx!.lineWidth = 0.6;
      for (let i = 0; i < HUBS; i++)
        for (let j = i + 1; j < HUBS; j++) {
          ctx!.strokeStyle = "rgba(43,255,91,0.10)";
          ctx!.beginPath();
          ctx!.moveTo(hp[i].x, hp[i].y);
          ctx!.lineTo(hp[j].x, hp[j].y);
          ctx!.stroke();
        }

      for (let i = 0; i < NODES; i++) {
        const n = np[i];
        let b = 0.28 * n.d + 0.12;
        if (!reduced) b *= 0.75 + 0.25 * Math.sin(nodes[i].tw + t * 0.025);
        ctx!.fillStyle = "rgba(225,225,225," + b.toFixed(3) + ")";
        const s = 1.6 * n.d;
        ctx!.fillRect(n.x - s / 2, n.y - s / 2, s, s);
      }

      if (!reduced && Math.random() < 0.06 && pulses.length < 7) {
        pulses.push({ h: Math.random() * HUBS | 0, n: Math.random() * NODES | 0, k: 0 });
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pl = pulses[i];
        pl.k += 0.025;
        if (pl.k >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const a = hp[pl.h],
          b2 = np[pl.n];
        const x = a.x + (b2.x - a.x) * pl.k,
          y = a.y + (b2.y - a.y) * pl.k;
        ctx!.fillStyle = "rgba(43,255,91," + (0.9 * (1 - pl.k)).toFixed(3) + ")";
        ctx!.beginPath();
        ctx!.arc(x, y, 1.8, 0, 6.28);
        ctx!.fill();
      }

      for (let i = 0; i < HUBS; i++) {
        const h = hp[i];
        const pulse = reduced ? 1 : 0.7 + 0.3 * Math.sin(hubs[i].ph + t * 0.05);
        const r = 4.2 * h.d * pulse;
        const g = ctx!.createRadialGradient(h.x, h.y, 0, h.x, h.y, r * 4);
        g.addColorStop(0, "rgba(43,255,91,0.35)");
        g.addColorStop(1, "rgba(43,255,91,0)");
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(h.x, h.y, r * 4, 0, 6.28);
        ctx!.fill();
        ctx!.fillStyle = "rgba(43,255,91," + (0.85 * pulse).toFixed(2) + ")";
        ctx!.beginPath();
        ctx!.arc(h.x, h.y, r, 0, 6.28);
        ctx!.fill();
      }

      if (!reduced) reqId = requestAnimationFrame(frame);
    }
    frame();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(reqId);
    };
  }, []);

  return (
    <section id="mind">
      <div className="wrap">
        <div className="eyebrow reveal">Swarm Mind</div>
        <h2 className="reveal">Watch the swarm think in real time</h2>
        <p className="lede reveal">
          Every dot is a pool or token under observation. The terminal streams the mesh's decisions as they happen.
        </p>

        <div className="mind-grid reveal">
          <div className="mind-viz">
            <canvas id="swarm"></canvas>
            <div className="viz-tag">
              <b>●</b> AGENT MESH&nbsp;&nbsp;·&nbsp;&nbsp;○ TOKENS UNDER WATCH
            </div>
          </div>
          <div className="mind-panel">
            <div className="mind-tabs">
              <button
                type="button"
                className={`mind-tab ${activeTab === "feed" ? "on" : ""}`}
                onClick={() => setActiveTab("feed")}
              >
                <span className="live-dot"></span>Live Terminal
              </button>
              <button
                type="button"
                className={`mind-tab ${activeTab === "lb" ? "on" : ""}`}
                onClick={() => setActiveTab("lb")}
              >
                Live Open Positions
              </button>
            </div>
            <div className="mind-body">
              {activeTab === "feed" && (
                <div className="feed scroll-area h-96" id="feed">
                  {logs.length === 0 ? (
                    <div className="empty-state" style={{ padding: '20px', color: '#666' }}>Awaiting terminal activity...</div>
                  ) : (
                    logs.slice(0, 50).map((l: any) => {
                      const timeStr = new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                      const levelColor = l.level === 'ERROR' ? '#ff3d00' : l.level === 'WARN' ? '#ffb300' : '#4facfe';
                      return (
                        <div key={l.id} className="feed-line">
                          <span className="ts">[{timeStr}]</span> <span className="ag" style={{ color: levelColor }}>{l.level}</span> {l.message}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
              {activeTab === "lb" && (
                <div className="lb scroll-area h-96" id="lb" style={{ display: "block" }}>
                  {positions.length === 0 ? (
                    <div className="empty-state" style={{ padding: '20px', color: '#666', textAlign: 'center' }}>No live positions currently open.</div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left' }}>Token</th>
                          <th style={{ textAlign: 'left' }}>Entry Price</th>
                          <th style={{ textAlign: 'center' }}>Source</th>
                          <th style={{ textAlign: 'right' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody id="lb-body">
                        {positions.map((p: any) => (
                          <tr key={p.id}>
                            <td style={{ textAlign: 'left' }}>
                              <div style={{ fontWeight: 600 }}>{p.tokenName ? `${p.tokenName} (${p.tokenSymbol})` : `${p.tokenAddress.substring(0,6)}...`}</div>
                            </td>
                            <td style={{ textAlign: 'left', fontFamily: 'monospace' }}>
                              {p.entryPrice ? p.entryPrice.toFixed(8) : '-'} WETH
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`badge badge-${p.source.toLowerCase()}`}>{p.source}</span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <span className="act enter">OPEN</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
