export default function Marquee() {
  const items = [
    "100ms Execution",
    "Zero Custody",
    "Uniswap V3",
    "Shared Risk Layer",
    "Exit Guard",
    "Volatility-Band Rebalancing",
    "Event-Listener Entry",
    "Robinhood Chain Native",
    "Active Range Manager",
    "100ms Execution",
    "Zero Custody",
    "Uniswap V3",
    "Shared Risk Layer",
    "Exit Guard",
    "Volatility-Band Rebalancing",
    "Event-Listener Entry",
    "Robinhood Chain Native",
    "Active Range Manager",
  ];

  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        {items.map((item, idx) => (
          <div key={idx} className="marquee-item">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
