import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter, usePathname } from 'next/navigation';

interface TopbarProps {
  blk: number;
  tradingMode?: string;
  dataMode?: string;
  onToggleDataMode?: () => void;
}

export function Topbar({ blk, tradingMode = "SEMI", dataMode = "DRY_RUN", onToggleDataMode }: TopbarProps) {
  const { address, isConnected, isDisconnected } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If user connects wallet and is on public dashboard, redirect to their private dashboard
    if (isConnected && address && pathname === '/dashboard') {
      router.push(`/dashboard/${address}`);
    }
    // If user disconnects wallet and is on private dashboard, redirect to public dashboard
    if (isDisconnected && pathname.startsWith('/dashboard/') && pathname !== '/dashboard') {
      router.push('/dashboard');
    }
  }, [isConnected, isDisconnected, address, pathname, router]);

  // Autonomy mode is managed by Telegram bot, UI is read-only.

  return (
    <header className="topbar">
      <div className="wordmark">
        <a href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.PNG" alt="Fletcher Logo" style={{ height: '32px', objectFit: 'contain' }} />
          <span style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }}>FLETCHER<span className="tick" style={{ color: '#2bff5b' }}>.</span></span>
        </a>
      </div>
      <div className="chainpill">
        <span className="dot"></span>
        ROBINHOOD CHAIN · 4663 · <span>#{blk.toLocaleString()}</span>
      </div>
      <div className="spacer"></div>
      <div className="modes" role="tablist" aria-label="Autonomy mode">
        <button role="tab" aria-selected={tradingMode === 'MANUAL'} className={tradingMode === 'MANUAL' ? 'on' : ''} style={{ cursor: 'default' }}>MANUAL</button>
        <button role="tab" aria-selected={tradingMode === 'SEMI'} className={tradingMode === 'SEMI' ? 'on' : ''} style={{ cursor: 'default' }}>SEMI</button>
        <button role="tab" aria-selected={tradingMode === 'FULL'} className={tradingMode === 'FULL' ? 'on' : ''} style={{ cursor: 'default' }}>FULL</button>
      </div>
      <div className="spacer"></div>
      <div 
        onClick={onToggleDataMode}
        className={`chainpill ${dataMode === 'LIVE' ? 'live-mode' : 'dry-mode'}`} 
        style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'bold', background: dataMode === 'LIVE' ? 'var(--green)' : '#2563EB', color: dataMode === 'LIVE' ? '#000' : '#fff', padding: '4px 10px' }}>
        <span>{dataMode}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="17 1 21 5 17 9"></polyline>
          <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
          <polyline points="7 23 3 19 7 15"></polyline>
          <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
        </svg>
      </div>
      <div style={{ paddingLeft: '16px' }}>
        <ConnectButton />
      </div>
    </header>
  );
}
