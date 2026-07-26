"use client";

import React, { useState, useEffect } from 'react';
import { createWalletClient, custom, type Hex } from 'viem';
import { useSearchParams } from 'next/navigation';

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
      alert("Please install MetaMask or another Web3 wallet.");
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
      alert("Please connect wallet first");
      return;
    }
    if (!to || !data) {
      alert("Missing 'to' or 'data' parameters in URL");
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
      setStatus(`Failed to sign/send: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Sign LP Transaction</h1>
      <p>The AI Agent has prepared an LP transaction for you.</p>

      <div style={{ background: '#f5f5f5', color: '#000', padding: '16px', borderRadius: '8px', margin: '20px 0', wordBreak: 'break-all' }}>
        <strong>To:</strong> {to || 'Missing'}<br/>
        <strong>Value:</strong> {value} wei<br/>
        <strong>Data:</strong> {data ? `${data.substring(0, 50)}...` : 'Missing'}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong>Status:</strong> {status}
      </div>

      {address ? (
        <div>
          <p>Connected as: <strong>{address}</strong></p>
          {!txHash ? (
            <button 
              onClick={signTransaction}
              style={{ padding: '12px 24px', background: '#7D52F4', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Sign & Execute Transaction
            </button>
          ) : (
            <div style={{ color: 'green', marginTop: '12px' }}>
              Transaction Hash: <a href={`https://robinhoodchain.blockscout.com/tx/${txHash}`} target="_blank" rel="noreferrer">{txHash}</a>
            </div>
          )}
        </div>
      ) : (
        <button 
          onClick={connectWallet}
          style={{ padding: '12px 24px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Connect Wallet
        </button>
      )}
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
