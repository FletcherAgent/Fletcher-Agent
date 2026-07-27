"use client";

import React, { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";

export function UserAgentSection({ agents, user, onRefresh }: { agents: any[], user: any, onRefresh: () => void }) {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);
  const [linkCode, setLinkCode] = useState<string | null>(null);

  const agent = agents?.[0]; // Support single agent for MVP

  const handleDeployAgent = async () => {
    try {
      setLoading(true);
      // Optional: require signing a message to prove ownership
      const signature = await signMessageAsync({ message: "Deploy Fletcher Agent for my address: " + address });
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
      const res = await fetch(`${apiUrl}/api/agents/deploy`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "x-wallet-address": address as string,
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({ signature, capital: "500", strategy: "NIGHT_MODE" })
      });
      
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert("Agent deployed successfully! Counterfactual address: " + data.agent.smartAccountAddress);
        onRefresh();
      }
    } catch (e: any) {
      alert("Deployment failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkTelegram = async () => {
    try {
      setLoading(true);
      const signature = await signMessageAsync({ message: "Link Telegram for my address: " + address });
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
      const res = await fetch(`${apiUrl}/api/user/link-telegram`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "x-wallet-address": address as string,
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({ signature })
      });
      
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setLinkCode(data.code);
      }
    } catch (e: any) {
      alert("Linking failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!agent) {
    return (
      <div className="card" style={{ marginBottom: '20px', padding: '24px', textAlign: 'center', background: 'var(--panel-bg)' }}>
        <h3 style={{ marginBottom: '12px', fontSize: '20px' }}>Your Personal Fletcher Agent</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Deploy your zero-custody AI agent to automate trading and liquidity provision on Robinhood Chain.
          Requires Tier 1 (2,500,000 $FLETCH) balance.
        </p>
        <button 
          className="btn-primary"
          disabled={loading}
          onClick={handleDeployAgent}
          style={{ padding: '12px 24px', fontSize: '16px', background: 'var(--green)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? "Deploying..." : "Deploy Agent"}
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: '20px', padding: '24px', background: 'var(--panel-bg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🤖 {agent.name}
          <span style={{ fontSize: '12px', padding: '2px 6px', background: 'rgba(43,255,91,0.1)', color: 'var(--green)', borderRadius: '4px', border: '1px solid var(--green)' }}>
            ACTIVE
          </span>
        </h3>
        
        {!user?.telegramChatId ? (
          <button 
            onClick={handleLinkTelegram}
            disabled={loading}
            style={{ padding: '6px 12px', background: '#0088cc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}
          >
            {loading ? "Generating..." : "Link Telegram"}
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0088cc', fontWeight: 'bold', fontSize: '14px' }}>
            ✓ Linked to @{user.telegramUsername}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Smart Account (Zero-Custody)</div>
          <div style={{ fontFamily: 'var(--font-jetbrains-mono)', color: 'var(--green)' }}>
            {agent.smartAccountAddress.slice(0,6)}...{agent.smartAccountAddress.slice(-4)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Allocated Capital</div>
          <div style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>${agent.capital}</div>
        </div>
      </div>

      {linkCode && (
        <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(0,136,204,0.1)', border: '1px solid #0088cc', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>To complete linking, send this code to <b>@FletcherRhcBot</b> on Telegram:</p>
          <div style={{ fontSize: '24px', letterSpacing: '2px', fontWeight: 'bold', fontFamily: 'var(--font-jetbrains-mono)', color: '#0088cc', textAlign: 'center' }}>
            /link {linkCode}
          </div>
        </div>
      )}
    </div>
  );
}
