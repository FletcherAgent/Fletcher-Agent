"use client";

import { useEffect } from "react";

export default function Hero() {
  // Hero Canvas (Binfield)
  useEffect(() => {
    const canvas = document.getElementById("binfield") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0,
      H = 0,
      cx = 0,
      cy = 0,
      scale = 0;
    const isSmall = Math.min(screen.width, screen.height) < 760;
    const N = isSmall ? 4200 : 8000;
    const P = new Array(N);
    const FOV = 2.6;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W * 0.52;
      cy = H * 0.42;
      scale = Math.min(W, H) * 0.55;
      ctx!.fillStyle = "#000";
      ctx!.fillRect(0, 0, W, H);
    }
    resize();
    window.addEventListener("resize", resize);

    function gauss() {
      return (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2;
    }

    for (let i = 0; i < N; i++) {
      const ring = Math.random();
      let r;
      if (ring < 0.48) r = 0.18 + Math.abs(gauss()) * 0.3;
      else if (ring < 0.86) r = 0.3 + Math.random() * 0.78;
      else r = 0.95 + Math.random() * 0.5;
      P[i] = {
        r: r,
        th: Math.random() * Math.PI * 2,
        h: gauss() * 0.05 * (0.4 + r),
        sp: (0.0024 / (r + 0.1)) * (0.8 + Math.random() * 0.4),
        g: Math.random() < 0.14,
        tw: Math.random() * Math.PI * 2,
        arm: Math.random() < 0.5 ? 1 : -1,
      };
    }

    const ptr = { x: -9999, y: -9999, s: 0 };
    function setPtr(e: any) {
      const t = e.touches ? e.touches[0] : e;
      const rect = canvas.getBoundingClientRect();
      ptr.x = t.clientX - rect.left;
      ptr.y = t.clientY - rect.top;
      ptr.s = 1;
    }
    window.addEventListener("pointermove", setPtr, { passive: true });
    window.addEventListener("touchmove", setPtr, { passive: true });
    window.addEventListener("pointerleave", () => {
      ptr.s = 0;
    });

    let t = 0;
    let reqId: number;
    function frame() {
      t++;
      ctx!.fillStyle = "rgba(0,0,0,0.30)";
      ctx!.fillRect(0, 0, W, H);

      const tiltX = 1.1 + 0.38 * Math.sin(t * 0.0021);
      const rollZ = 0.34 * Math.sin(t * 0.0013 + 1.7);
      const cosX = Math.cos(tiltX),
        sinX = Math.sin(tiltX);
      const cosZ = Math.cos(rollZ),
        sinZ = Math.sin(rollZ);
      const swirl = 2.4 + 0.9 * Math.sin(t * 0.0009);

      for (let i = 0; i < N; i++) {
        const p = P[i];
        if (!reduced) p.th += p.sp;
        const a = p.th + p.arm * swirl * Math.log(p.r + 0.6);

        const x = Math.cos(a) * p.r;
        const z = Math.sin(a) * p.r;
        const y = p.h;
        const y1 = y * cosX - z * sinX;
        const z1 = y * sinX + z * cosX;
        const x2 = x * cosZ - y1 * sinZ;
        const y2 = x * sinZ + y1 * cosZ;
        const per = FOV / (FOV + z1);
        let sx = cx + x2 * scale * per;
        let sy = cy + y2 * scale * per;

        const dx = (sx - cx + scale * 0.02) / (scale * 0.085),
          dy = (sy - cy) / (scale * 0.075);
        if (dx * dx + dy * dy < 1) continue;

        if (ptr.s) {
          const mx = sx - ptr.x,
            my = sy - ptr.y,
            d2 = mx * mx + my * my;
          if (d2 < 16900) {
            const d = Math.sqrt(d2) || 1,
              f = ((130 - d) / 130) * 30;
            sx += (mx / d) * f;
            sy += (my / d) * f;
          }
        }

        let b = Math.max(0, 1 - (p.r - 0.18) * 0.95);
        b = b * b;
        b *= 0.55 + 0.45 * per * per;
        if (!reduced) b *= 0.7 + 0.3 * Math.sin(p.tw + t * 0.03);
        b = Math.min(1, b + 0.05);

        const s = p.r < 0.4 ? 1.5 : 1;
        if (p.g) {
          ctx!.fillStyle = "rgba(43,255,91," + (b * 0.85).toFixed(3) + ")";
        } else {
          const w = 210 + Math.floor(45 * b);
          ctx!.fillStyle = "rgba(" + w + "," + w + "," + w + "," + b.toFixed(3) + ")";
        }
        ctx!.fillRect(sx, sy, s, s);
      }

      const g1 = ctx!.createRadialGradient(cx, cy, scale * 0.05, cx, cy, scale * 0.26);
      g1.addColorStop(0, "rgba(255,255,255,0.20)");
      g1.addColorStop(0.45, "rgba(255,255,255,0.05)");
      g1.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.fillStyle = g1;
      ctx!.beginPath();
      ctx!.arc(cx, cy, scale * 0.26, 0, Math.PI * 2);
      ctx!.fill();

      const gx = cx + Math.sin(t * 0.004) * scale * 0.1;
      const g2 = ctx!.createRadialGradient(gx, cy, 0, gx, cy, scale * 0.5);
      g2.addColorStop(0, "rgba(43,255,91,0.030)");
      g2.addColorStop(1, "rgba(43,255,91,0)");
      ctx!.fillStyle = g2;
      ctx!.beginPath();
      ctx!.arc(gx, cy, scale * 0.5, 0, Math.PI * 2);
      ctx!.fill();

      if (!reduced) reqId = requestAnimationFrame(frame);
    }
    frame();
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", setPtr);
      window.removeEventListener("touchmove", setPtr);
      cancelAnimationFrame(reqId);
    };
  }, []);



  return (
    <div className="hero">
      <canvas id="binfield"></canvas>

      <div className="hero-copy">
        <h1>AUTONOMOUS LIQUIDITY ON ROBINHOOD CHAIN</h1>
        <p className="hero-sub">
          Fletcher manages concentrated liquidity positions on its own: screening pairs, deploying ranges, compounding fees, and exiting when impermanent loss outruns yield. Sniping and smart-money copy-trading ride on top. You hold the keys the entire time.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px' }}>
          <a href="/dashboard-v2" className="btn-app" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Open Dashboard</a>
          <a href="https://github.com/FletcherAgent" target="_blank" rel="noopener noreferrer" className="btn-app" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid #2bff5b', color: '#2bff5b' }}>View on Github</a>
        </div>
      </div>

      <div className="scroll-cue">⌄</div>
    </div>
  );
}
