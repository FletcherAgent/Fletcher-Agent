export default function Safety() {
  return (
    <section id="safety">
      <div className="wrap">
        <div className="eyebrow reveal">Safety Layer</div>
        <h2 className="reveal">Confirm mode by default. Auto mode is earned.</h2>

        <div className="safety-grid">
          <div className="term reveal">
            <div className="row">
              <span className="k">SAFETY_GATE</span>
              <span className="v-true">ACTIVE</span>
            </div>
            <div className="row">
              <span className="k">HONEYPOT_SIM</span>
              <span className="v-true">ROUND-TRIP PASSED</span>
            </div>
            <div className="row">
              <span className="k">RE_SIMULATION</span>
              <span className="v-true">DELAYED OK</span>
            </div>
            <div className="row">
              <span className="k">VETO_LOG</span>
              <span className="v-true">TRACKED</span>
            </div>
            <div className="row">
              <span className="k">DAILY_DRAWDOWN</span>
              <span className="v-true">15% MAX</span>
            </div>
            <div className="row">
              <span className="k">CHECKS_PASSED</span>
              <span>13 / 13</span>
            </div>
          </div>
          <ul className="safety-list reveal">
            <li>Strict 13-point Safety Gate screening before any capital deployment.</li>
            <li>Real-time honeypot round-trip simulation to verify token sellability.</li>
            <li>Delayed-honeypot re-simulation to catch dynamic taxes and time-locked rug pulls.</li>
            <li>Immutable Veto Log tracking all rejected pairs to optimize future capital allocation.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
