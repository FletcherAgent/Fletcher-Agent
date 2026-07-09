import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="foot-inner">
        <div className="foot-logo">
          FLETCHER<em>.</em>AGENT
        </div>
        <div className="foot-links">
          <Link href="#">Platform</Link>
          <Link href="#pipeline">Pipeline</Link>
          <Link href="#layers">Agents</Link>
          <Link href="#strategies">Strategies</Link>
          <Link href="#config">Docs</Link>
        </div>
        <div className="foot-copy">
          Autonomous EVM Agent · Robinhood Chain
        </div>
      </div>
    </footer>
  );
}
