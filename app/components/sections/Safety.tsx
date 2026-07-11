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
              <span className="k">AUTO_COMPOUND</span>
              <span className="v-true">TRUE</span>
            </div>
            <div className="row">
              <span className="k">DYNAMIC_REBALANCE</span>
              <span className="v-true">TRUE</span>
            </div>
            <div className="row">
              <span className="k">HONEYPOT_CHECK</span>
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
            <li>Guardian Agent verifies contract source via Blockscout API before passing the signal.</li>
            <li>Impermanent Loss logic calculates HODL parity and auto-adjusts Uniswap V3 tick ranges.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
