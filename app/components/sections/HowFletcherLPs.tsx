export default function HowFletcherLPs() {
  return (
    <section id="how-fletcher-lps">
      <div className="wrap">
        <div className="eyebrow reveal">LP Engine</div>
        <h2 className="reveal">Autonomous Liquidity Lifecycle</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', background: 'var(--line)', border: '1px solid var(--line)', marginTop: '64px' }} className="reveal">
          <div style={{ background: 'var(--bg)', padding: '40px 30px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '12px' }}>1. Screen<span style={{ color: 'var(--green)' }}>_</span></h3>
            <p style={{ color: 'var(--dim)', fontSize: '13.5px' }}>GMGN 24h filter: mcap &gt;$500K, vol &gt;$1M, utility meta, and strict launchpad blacklist.</p>
          </div>
          <div style={{ background: 'var(--bg)', padding: '40px 30px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '12px' }}>2. Deploy<span style={{ color: 'var(--green)' }}>_</span></h3>
            <p style={{ color: 'var(--dim)', fontSize: '13.5px' }}>NIGHT spray (max 3 concentrated pairs) and DAY full-range bigcap deployment.</p>
          </div>
          <div style={{ background: 'var(--bg)', padding: '40px 30px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '12px' }}>3. Compound<span style={{ color: 'var(--green)' }}>_</span></h3>
            <p style={{ color: 'var(--dim)', fontSize: '13.5px' }}>Fee auto-collect with compound engine capping at $2K per position from a $500 start.</p>
          </div>
          <div style={{ background: 'var(--bg)', padding: '40px 30px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '12px' }}>4. Exit<span style={{ color: 'var(--green)' }}>_</span></h3>
            <p style={{ color: 'var(--dim)', fontSize: '13.5px' }}>Strict &quot;fee vs IL&quot; rule. If Impermanent Loss outpaces fees for 4 consecutive hours, the position is closed.</p>
          </div>
        </div>
        
        <div className="reveal" style={{ marginTop: '32px', padding: '40px', background: 'var(--bg)', border: '1px solid var(--line)', textAlign: 'center' }}>
           <div style={{ color: 'var(--dim)', fontSize: '12px', letterSpacing: '0.1em', marginBottom: '16px', textTransform: 'uppercase' }}>Position Range Gauge</div>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--green)', fontSize: '24px' }}>
             <span>⤙</span>
             <span style={{ flex: 1, height: '1px', background: 'var(--green)', maxWidth: '200px' }}></span>
             <span>▲</span>
             <span style={{ flex: 1, height: '1px', background: 'var(--green)', maxWidth: '200px' }}></span>
             <span>⤚</span>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '460px', margin: '8px auto 0', fontSize: '11px', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
             <span>Lower Bound</span>
             <span>Current Price</span>
             <span>Upper Bound</span>
           </div>
        </div>
      </div>
    </section>
  );
}
