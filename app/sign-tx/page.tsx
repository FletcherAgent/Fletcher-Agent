"use client";

import React, { useState, useEffect } from 'react';
import { createWalletClient, custom, type Hex } from 'viem';
import { useSearchParams } from 'next/navigation';
import { Modal } from '../../components/dashboard-v2/Modal';

import { Suspense } from 'react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

function SignTxContent() {
  const searchParams = useSearchParams();
  const to = searchParams?.get('to') as Hex;
  const data = searchParams?.get('data') as Hex;
  const value = searchParams?.get('value') || '0';

  const [address, setAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Not connected');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{isOpen: boolean, title: string, message: React.ReactNode}>({ isOpen: false, title: '', message: '' });

  const showModal = (title: string, message: React.ReactNode) => {
    setModalState({ isOpen: true, title, message });
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) setAddress(accounts[0]);
        else setAddress(null);
      });
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      showModal("Wallet Required", "Please install MetaMask or another Web3 wallet.");
      return;
    }
    try {
      const client = createWalletClient({
        transport: custom(window.ethereum)
      });
      const [account] = await client.requestAddresses();
      setAddress(account);
      setStatus('Connected');
    } catch (err: any) {
      console.error(err);
      setStatus(`Error connecting: ${err.message}`);
    }
  };

  const signTransaction = async () => {
    if (!address) {
      showModal("Wallet Required", "Please connect wallet first");
      return;
    }
    if (!to || !data) {
      showModal("Missing Parameters", "Missing 'to' or 'data' parameters in URL");
      return;
    }

    try {
      setStatus('Prompting wallet to sign...');
      const client = createWalletClient({
        account: address as Hex,
        transport: custom(window.ethereum!)
      });

      const hash = await client.sendTransaction({
        to,
        data,
        value: BigInt(value),
        account: address as Hex,
        chain: null // Rely on the wallet's current chain (should be Robinhood chain)
      });

      setTxHash(hash);
      setStatus('Transaction Submitted!');
    } catch (err: any) {
      console.error(err);
      let errorMessage = err.shortMessage || err.message || 'Unknown error';
      if (typeof errorMessage === 'string' && errorMessage.includes('User rejected')) {
        errorMessage = 'User rejected the request.';
      } else if (typeof errorMessage === 'string') {
        errorMessage = errorMessage.split('\n')[0];
      }
      setStatus(`Failed: ${errorMessage}`);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '600px', 
        background: 'rgba(24, 24, 24, 0.4)',
        border: '1px solid var(--line)',
        borderRadius: '12px',
        padding: '32px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'var(--disp)', fontSize: '28px', color: 'var(--ink)', marginBottom: '8px', letterSpacing: '0.05em' }}>
            SIGN LP TRANSACTION
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: '14px' }}>The Fletcher AI Agent has prepared an LP transaction for you.</p>
        </div>

        <div style={{ 
          background: '#0a0a0a', 
          border: '1px solid var(--line)',
          color: 'var(--green)', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '24px', 
          wordBreak: 'break-all',
          fontFamily: 'var(--mono)',
          fontSize: '13px',
          lineHeight: '1.8'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <span style={{ color: 'var(--faint)', display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>To</span>
              <span style={{ color: 'var(--ink)' }}>{to || 'Missing'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--faint)', display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Value</span>
              <span style={{ color: 'var(--ink)' }}>{value} wei</span>
            </div>
            <div>
              <span style={{ color: 'var(--faint)', display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Data</span>
              <span style={{ color: 'var(--dim)' }}>{data ? `${data.substring(0, 100)}...` : 'Missing'}</span>
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '16px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '8px',
          border: '1px solid var(--line)',
          marginBottom: '32px'
        }}>
          <div>
            <span style={{ color: 'var(--faint)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>Status</span>
            <span style={{ 
              color: status === 'Transaction Submitted!' ? 'var(--green)' : 
                     status.includes('Failed') || status.includes('Error') ? '#ff3366' : 'var(--ink)',
              fontSize: '14px',
              fontWeight: 500
            }}>
              {status}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          {address ? (
            <div>
              <div style={{ marginBottom: '24px', fontSize: '13px', color: 'var(--dim)' }}>
                Connected Wallet: <strong style={{ color: 'var(--ink)', background: '#111', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--line)' }}>{`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}</strong>
              </div>
              
              {!txHash ? (
                <button 
                  onClick={signTransaction}
                  className="btn-app"
                  style={{ width: '100%', padding: '16px', fontSize: '15px' }}
                >
                  EXECUTE TRANSACTION
                </button>
              ) : (
                <a 
                  href={`https://robinhoodchain.blockscout.com/tx/${txHash}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-app"
                  style={{ display: 'block', width: '100%', padding: '16px', fontSize: '14px', background: 'transparent', border: '1px solid var(--green)', color: 'var(--green)' }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    View on Blockscout
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px' }}>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </span>
                </a>
              )}
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              className="btn-app"
              style={{ width: '100%', padding: '16px', fontSize: '15px', background: '#222', color: 'var(--ink)' }}
            >
              CONNECT WALLET
            </button>
          )}
        </div>
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

export default function SignTxPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', fontFamily: 'sans-serif' }}>Loading transaction details...</div>}>
      <SignTxContent />
    </Suspense>
  );
}
