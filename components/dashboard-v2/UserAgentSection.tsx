"use client";

import React, { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { Modal } from "./Modal";

export function UserAgentSection({ agents, user, onRefresh }: { agents: any[], user: any, onRefresh: () => void }) {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);
  const [linkCode, setLinkCode] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{isOpen: boolean, title: string, message: React.ReactNode}>({ isOpen: false, title: '', message: '' });
  const [deployConfirmOpen, setDeployConfirmOpen] = useState(false);
  const [inputCapital, setInputCapital] = useState("500");
  const [copied, setCopied] = useState(false);

  const showModal = (title: string, message: React.ReactNode) => {
    setModalState({ isOpen: true, title, message });
  };

  const agent = agents?.[0]; // Support single agent for MVP

  const handleDeployAgent = async () => {
    try {
      setDeployConfirmOpen(false);
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
        body: JSON.stringify({ signature, capital: inputCapital || "0", strategy: "NIGHT_MODE" })
      });
      
      const data = await res.json();
      if (data.error) {
        showModal("Error", data.error);
      } else {
        showModal("Success", "Agent deployed successfully! Counterfactual address: " + data.agent.smartAccountAddress);
        onRefresh();
      }
    } catch (e: any) {
      showModal("Deployment Failed", e.message);
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
        showModal("Error", data.error);
      } else {
        setLinkCode(data.code);
      }
    } catch (e: any) {
      showModal("Linking Failed", e.message);
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
          onClick={() => setDeployConfirmOpen(true)}
          style={{ padding: '12px 24px', fontSize: '16px', background: 'var(--green)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? "Deploying..." : "Deploy Agent"}
        </button>

        <Modal 
          isOpen={modalState.isOpen} 
          onClose={() => setModalState(s => ({ ...s, isOpen: false }))} 
          title={modalState.title} 
          message={modalState.message} 
        />
        
        <Modal
          isOpen={deployConfirmOpen}
          onClose={() => setDeployConfirmOpen(false)}
          title="Confirm Deployment"
          message={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <p style={{ margin: 0 }}>Deploy your zero-custody AI agent to automate trading and liquidity provision on Robinhood Chain.</p>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '6px', fontSize: '14px' }}>
                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Requirements:</div>
                <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)' }}>
                  <li>Tier 1 (2,500,000 $FLETCH) balance</li>
                  <li>Connected Web3 wallet to sign the deployment message</li>
                </ul>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '6px', fontSize: '14px' }}>
                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Deployment Guide:</div>
                <ol style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)' }}>
                  <li>Click "Confirm & Deploy" below</li>
                  <li>Sign the message in your wallet to verify ownership</li>
                  <li>Fletcher will securely set up a dedicated Smart Account for your agent</li>
                  <li>You will receive your agent's zero-custody address</li>
                  <li>After deployment, click "Link Telegram" to activate and command your agent</li>
                </ol>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '6px', fontSize: '14px' }}>
                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Allocated Capital (WETH):</div>
                <input 
                  type="number" 
                  value={inputCapital}
                  onChange={(e) => setInputCapital(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line)', color: '#fff', borderRadius: '4px', fontFamily: 'var(--font-jetbrains-mono)' }}
                  placeholder="e.g. 1.5"
                  min="0"
                  step="0.01"
                />
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  This amount will be allocated to your agent's zero-custody smart account upon deployment.
                </div>
              </div>
              <button 
                onClick={handleDeployAgent}
                style={{ padding: '12px', background: 'var(--green)', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}
              >
                Confirm & Deploy
              </button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--green)' }}>
            <rect x="3" y="11" width="18" height="10" rx="2"></rect>
            <circle cx="12" cy="5" r="2"></circle>
            <path d="M12 7v4"></path>
            <line x1="8" y1="16" x2="8.01" y2="16"></line>
            <line x1="16" y1="16" x2="16.01" y2="16"></line>
          </svg>
          {agent.name}
          {user?.telegramChatId ? (
            <span style={{ fontSize: '12px', padding: '2px 6px', background: 'rgba(43,255,91,0.1)', color: 'var(--green)', borderRadius: '4px', border: '1px solid var(--green)', marginLeft: '8px' }}>
              ACTIVE
            </span>
          ) : (
            <span style={{ fontSize: '12px', padding: '2px 6px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '4px', border: '1px solid #f59e0b', marginLeft: '8px' }}>
              PENDING
            </span>
          )}
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

      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Your Personal Fletcher Agent</h4>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '14px' }}>
        Deploy your zero-custody AI agent to automate trading and liquidity provision on Robinhood Chain.
        Requires Tier 1 (2,500,000 $FLETCH) balance.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Smart Account (Zero-Custody)</div>
          <div 
            style={{ fontFamily: 'var(--font-jetbrains-mono)', color: 'var(--green)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Click to copy full address"
            onClick={() => {
              navigator.clipboard.writeText(agent.smartAccountAddress);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {agent.smartAccountAddress.slice(0,6)}...{agent.smartAccountAddress.slice(-4)}
            {copied ? (
              <span style={{ fontSize: '10px', background: 'var(--green)', color: '#000', padding: '2px 4px', borderRadius: '4px' }}>Copied!</span>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Allocated Capital</div>
          <div style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>{agent.capital} WETH</div>
        </div>
      </div>

      {linkCode && (
        <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(0,136,204,0.1)', border: '1px solid #0088cc', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>To complete linking, send this code to <b>@Fletcher_MasterBot</b> on Telegram:</p>
          <div style={{ fontSize: '24px', letterSpacing: '2px', fontWeight: 'bold', fontFamily: 'var(--font-jetbrains-mono)', color: '#0088cc', textAlign: 'center' }}>
            /link {linkCode}
          </div>
        </div>
      )}

      <Modal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState(s => ({ ...s, isOpen: false }))} 
        title={modalState.title} 
        message={modalState.message} 
      />
    </div>
  );
}
