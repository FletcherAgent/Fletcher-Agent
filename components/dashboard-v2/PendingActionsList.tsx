"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { Modal } from "./Modal";

export function PendingActionsList() {
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const [actions, setActions] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{isOpen: boolean, title: string, message: React.ReactNode}>({ isOpen: false, title: '', message: '' });

  const showModal = (title: string, message: React.ReactNode) => {
    setModalState({ isOpen: true, title, message });
  };

  const fetchActions = async () => {
    if (!address) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
      const res = await fetch(`${apiUrl}/api/agents/pending-actions?wallet=${address}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      const data = await res.json();
      setActions(data.actions || []);
    } catch (e) {
      console.error("Failed to fetch pending actions", e);
    }
  };

  useEffect(() => {
    fetchActions();
    const interval = setInterval(fetchActions, 5000);
    return () => clearInterval(interval);
  }, [address]);

  const handleApprove = async (action: any) => {
    try {
      setLoadingId(action.id);
      
      // 1. Ask wallet to sign and broadcast the transaction
      const payload = action.payload;
      const txHash = await sendTransactionAsync({
        to: payload.to as `0x${string}`,
        data: payload.calldata as `0x${string}`,
        value: payload.value ? BigInt(payload.value) : undefined,
      });

      // 2. Notify backend of successful execution
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
      await fetch(`${apiUrl}/api/agents/execute-action`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({ actionId: action.id, txHash })
      });

      showModal("Transaction Approved", `Hash: ${txHash.slice(0, 10)}...`);
      fetchActions();
    } catch (e: any) {
      showModal("Transaction Failed", e.message);
    } finally {
      setLoadingId(null);
    }
  };

  if (!isConnected || actions.length === 0) return null;

  return (
    <div className="card" style={{ marginBottom: '20px', padding: '24px', background: 'var(--panel-bg)', border: '1px solid var(--border)' }}>
      <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--orange)' }}></span>
        Pending Approvals ({actions.length})
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {actions.map((action) => {
          const payload = action.payload;
          const isLoading = loadingId === action.id;

          return (
            <div key={action.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-light)' }}>{payload.type}</span>
                  <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                    {payload.token0Symbol}/{payload.token1Symbol}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Size: ${payload.entryValueUsd || '?'} | Fee: {payload.feeTier / 10000}%
                </div>
              </div>
              <div>
                <button 
                  onClick={() => handleApprove(action)}
                  disabled={isLoading}
                  style={{ padding: '8px 16px', background: 'var(--green)', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {isLoading ? 'Confirming...' : 'Approve Tx'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState(s => ({ ...s, isOpen: false }))} 
        title={modalState.title} 
        message={modalState.message} 
      />
    </div>
  );
}
