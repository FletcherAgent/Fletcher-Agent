'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoRefresh({ interval = 3000 }: { interval?: number }) {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(interval / 1000);

  useEffect(() => {
    // Countdown timer
    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : interval / 1000));
    }, 1000);

    // Sync timer
    const syncTimer = setInterval(() => {
      setIsSyncing(true);
      router.refresh();
      // Keep it spinning for a short while so it's visible
      setTimeout(() => setIsSyncing(false), 800);
    }, interval);
    
    return () => {
      clearInterval(countdownTimer);
      clearInterval(syncTimer);
    };
  }, [router, interval]);

  return (
    <>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '6px', 
        fontSize: '11px', 
        color: '#888',
        marginLeft: '12px',
        background: 'rgba(255,255,255,0.05)',
        padding: '2px 8px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <span style={{ 
          display: 'inline-block', 
          animation: isSyncing ? 'spin-slow 1s linear infinite' : 'none',
          opacity: isSyncing ? 1 : 0.5
        }}>
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </span>
        {isSyncing ? 'Syncing...' : `Synced (${timeLeft}s)`}
      </span>
    </>
  );
}
