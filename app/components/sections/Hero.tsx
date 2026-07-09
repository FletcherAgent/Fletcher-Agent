"use client";
import { useEffect, useRef } from "react";

export default function Hero() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    
    // Dynamic import to avoid SSR issues
    import("d3").then((d3) => {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); // Clear previous render on hot reload

      function resize() {
        const parent = svgRef.current?.parentElement;
        const W = parent?.clientWidth || window.innerWidth;
        const H = parent?.clientHeight || 600;
        svg.attr("width", W).attr("height", H);
        return { W, H };
      }

      let { W, H } = resize();
      const opacityFactor = 1;
      const palette = ["#39FF14", "#00FF41", "#00FF00", "#32CD32", "#7CFC00", "#ADFF2F", "#FFFFFF"];
      const nodes = Array.from({ length: 22 }, (_, i) => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: 2 + Math.random() * 4,
        color: palette[i % palette.length],
        p: Math.random() * Math.PI * 2,
      }));

      const gL = svg.append("g");
      const gD = svg.append("g");
      const MAX = 190;
      let animationFrameId: number;

      function step() {
        nodes.forEach((n) => {
          n.x += n.vx;
          n.y += n.vy;
          n.p += 0.016;
          if (n.x < -20 || n.x > W + 20) n.vx *= -1;
          if (n.y < -20 || n.y > H + 20) n.vy *= -1;
        });

        const edges = [];
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[j].x - nodes[i].x;
            const dy = nodes[j].y - nodes[i].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < MAX) edges.push({ s: nodes[i], t: nodes[j], d });
          }
        }

        const lines = gL.selectAll("line").data(edges);
        lines
          .enter()
          .append("line")
          .merge(lines as any)
          .attr("x1", (e) => e.s.x)
          .attr("y1", (e) => e.s.y)
          .attr("x2", (e) => e.t.x)
          .attr("y2", (e) => e.t.y)
          .attr("stroke", (e) => e.s.color)
          .attr("stroke-width", 0.7)
          .attr("opacity", (e) => (1 - e.d / MAX) * opacityFactor * 0.5);
        lines.exit().remove();

        const circles = gD.selectAll("circle").data(nodes);
        circles
          .enter()
          .append("circle")
          .merge(circles as any)
          .attr("cx", (n) => n.x)
          .attr("cy", (n) => n.y)
          .attr("r", (n) => n.r + Math.sin(n.p) * 0.8)
          .attr("fill", (n) => n.color)
          .attr("opacity", (n) => opacityFactor * (0.45 + Math.sin(n.p) * 0.18));
        circles.exit().remove();

        animationFrameId = requestAnimationFrame(step);
      }

      animationFrameId = requestAnimationFrame(step);

      window.addEventListener("resize", () => {
        const dims = resize();
        W = dims.W;
        H = dims.H;
      });

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", resize);
      };
    });
  }, []);

  return (
    <section id="hero">
      <svg id="hero-canvas" ref={svgRef}></svg>
      <div className="hero-inner">
        <div className="hero-tag">Core Alpha</div>
        <h1 className="hero-h1">
          The<br />
          <span>Fletcher</span><br />
          Agent
        </h1>
        <p className="hero-sub">
          The first fully autonomous AI agent acting as an active range manager on Uniswap V3 and executing strategies on Robinhood Chain 24/7. Event-listener based, zero custody.
        </p>
        <div className="hero-actions">
          <button className="btn-neon" onClick={() => alert("Platform coming soon")}>
            ⚡ View Live Network
          </button>
          <a href="#config" className="btn-ghost">Read Documentation</a>
        </div>
        <div className="hero-meta">
          <div className="hero-stat">
            <div className="hs-n">19</div>
            <div className="hs-l">Agents</div>
          </div>
          <div className="hero-stat">
            <div className="hs-n">6</div>
            <div className="hs-l">Layers</div>
          </div>
          <div className="hero-stat">
            <div className="hs-n">100<span>ms</span></div>
            <div className="hs-l">Execution</div>
          </div>
          <div className="hero-stat">
            <div className="hs-n">EVM</div>
            <div className="hs-l">Native</div>
          </div>
        </div>
      </div>
    </section>
  );
}
