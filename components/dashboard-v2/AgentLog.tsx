import React from 'react';

interface AgentLogProps {
  logs: string[][];
}

export function AgentLog({ logs }: AgentLogProps) {
  return (
    <div className="sect">
      <div className="sect-head">
        <h2>Agent log</h2>
        <span className="tag live">STREAMING</span>
      </div>
      <div className="log" id="log">
        {logs.map((log, idx) => {
          const ts = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
          return (
            <div className="ln" key={idx}>
              <span className="ts">{ts}</span>
              <span className={log[0]}>{log[1]}</span> {log[2]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
