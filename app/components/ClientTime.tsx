"use client";

import { useEffect, useState } from "react";

export default function ClientTime({ timestamp }: { timestamp: string | Date }) {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    setTimeStr(new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, [timestamp]);

  return <>{timeStr}</>;
}
