export default function Safety() {
  return (
    <section id="safety">
      <div className="wrap">
        <div className="eyebrow reveal">Safety Layer</div>
        <h2 className="reveal">Confirm mode by default. Auto mode is earned.</h2>

        <div className="safety-grid">
          <div className="term reveal">
            <div className="row">
              <span className="k">MODE</span>
              <span className="v-true">CONFIRM</span>
            </div>
            <div className="row">
              <span className="k">DAILY_DRAWDOWN</span>
              <span className="v-true">15% MAX</span>
            </div>
            <div className="row">
              <span className="k">PORTFOLIO_HEAT</span>
              <span className="v-true">5 ACTIVE</span>
            </div>
            <div className="row">
              <span className="k">TRAILING_STOP</span>
              <span className="v-true">TRUE</span>
            </div>
            <div className="row">
              <span className="k">SNIPE_SIZE</span>
              <span>0.5% bps</span>
            </div>
            <div className="row">
              <span className="k">TIMEOUT</span>
              <span>5 MINUTES</span>
            </div>
          </div>
          <ul className="safety-list reveal">
            <li>Every snipe sends a Telegram push notification with Confirm / Reject buttons.</li>
            <li>Unconfirmed snipes expire automatically after 5 minutes to prevent stale execution.</li>
            <li>Risk Warden continuously calculates daily PnL and strictly enforces a 15% maximum drawdown.</li>
            <li>Guardian Protocol locks in profits with dynamic trailing stop-losses on all open positions.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
