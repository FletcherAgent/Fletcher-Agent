"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <div className="nav-logo">
        FLETCHER<em>.</em>AGENT
      </div>
      <div className="nav-links">
        <Link href="#pipeline">Pipeline</Link>
        <Link href="#layers">Agents</Link>
        <Link href="#features">Features</Link>
        <Link href="#config">Docs</Link>
      </div>
      <button className="nav-platform-btn" onClick={() => alert("Platform coming soon")}>
        <div className="dot"></div>Live System
      </button>
    </nav>
  );
}
