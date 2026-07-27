import React from 'react';

interface AgentLogProps {
  logs: any[];
  title?: string;
  streamLabel?: string;
}

export function AgentLog({ logs, title = "Agent log", streamLabel = "STREAMING" }: AgentLogProps) {
  return (
    <div className="sect sect-fill">
      <div className="sect-head">
        <h2>{title}</h2>
        <span className="tag live">{streamLabel}</span>
      </div>
      <div className="log" id="log">
        {logs.length === 0 && (
          <div style={{ padding: '1rem', color: 'var(--mute)' }}>No logs available.</div>
        )}
        {logs.map((log, idx) => {
          const ts = new Date(log.createdAt).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const levelClass = log.level === 'WARN' || log.level === 'ERROR' ? 'warn' : 'ok';
          let agentName = "[SYSTEM]";
          if (log.message.startsWith('[')) {
            agentName = log.message.substring(0, log.message.indexOf(']') + 1);
          }
          const msgClean = log.message.replace(agentName, '').trim();

          return (
            <div className="ln" key={log.id || idx}>
              <span className="ts">{ts}</span>
              <span className={levelClass}>{agentName}</span> {msgClean}
            </div>
          );
        })}
      </div>
    </div>
  );
}
