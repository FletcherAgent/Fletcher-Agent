"use client";

import React, { useState } from "react";
import { useAccount, useSignMessage, useReadContract, useWriteContract } from "wagmi";
import { parseAbi } from "viem";
import { Modal } from "./Modal";

const parseError = (e: any): string => {
  const msg = e?.shortMessage || e?.message || String(e);
  if (msg.includes('User rejected the request')) return 'Transaction was rejected by the user in their wallet.';
  if (msg.includes('insufficient funds')) return 'Insufficient funds to complete this transaction.';
  return msg.split('\n')[0];
};

export function UserAgentSection({ agents, user, onRefresh }: { agents: any[], user: any, onRefresh: () => void }) {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);
  const [linkCode, setLinkCode] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{isOpen: boolean, title: string, message: React.ReactNode}>({ isOpen: false, title: '', message: '' });
  const [deployConfirmOpen, setDeployConfirmOpen] = useState(false);
  const [inputCapital, setInputCapital] = useState("500");
  const [copied, setCopied] = useState(false);
  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [withdrawConfirmOpen, setWithdrawConfirmOpen] = useState(false);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [depositAmount, setDepositAmount] = useState(agents?.[0]?.capital?.toString() || "500");
  const [depositConfirmOpen, setDepositConfirmOpen] = useState(false);

  const REQUIRED_BALANCE = 1000000;
  const FLETCH_CA = process.env.NEXT_PUBLIC_CA as `0x${string}`;
  const WETH_ADDRESS = (process.env.NEXT_PUBLIC_WETH_ADDRESS || '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2') as `0x${string}`;
  const { writeContractAsync } = useWriteContract();

  const { data: balanceData } = useReadContract({
    address: FLETCH_CA,
    abi: [{
      name: 'balanceOf',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ type: 'uint256' }],
    }],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  // FLETCH has 18 decimals
  const fletchBalance = balanceData ? Number(balanceData) / 1e18 : 0;
  const isWhitelisted = address?.toLowerCase() === "0x2e8ca95e429f34e6e876e078dcd8e51eb31645b9".toLowerCase();
  const isEligible = isWhitelisted || fletchBalance >= REQUIRED_BALANCE;
  const shortfall = isWhitelisted ? 0 : REQUIRED_BALANCE - fletchBalance;

  const showModal = (title: string, message: React.ReactNode) => {
    setModalState({ isOpen: true, title, message });
  };

  const agent = agents?.[0]; // Support single agent for MVP

  const { data: agentWethBalance, refetch: refetchAgentBalance } = useReadContract({
    address: WETH_ADDRESS,
    abi: [{
      name: 'balanceOf',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ type: 'uint256' }]
    }],
    functionName: 'balanceOf',
    args: agent ? [agent.smartAccountAddress as `0x${string}`] : undefined,
    query: { enabled: !!agent, staleTime: Infinity, refetchOnWindowFocus: false }
  });

  const isFunded = agentWethBalance ? (agentWethBalance as bigint) > BigInt(0) : false;

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
        if (data.mintInstruction) {
          try {
            setLoading(true);
            const txHash = await writeContractAsync({
              address: data.mintInstruction.contract,
              abi: parseAbi(['function register(string tokenURI)']),
              functionName: 'register',
              args: [data.mintInstruction.tokenURI]
            });
            
            // Confirm with backend
            await fetch(`${apiUrl}/api/agents/confirm-identity`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ agentId: data.agent.id, txHash })
            });

            showModal("Success", `Agent deployed successfully!\n\nSmart Account: ${data.agent.smartAccountAddress}\nIdentity NFT Minted: ${txHash}`);
          } catch (mintErr: any) {
            console.error("Mint failed:", mintErr);
            showModal("Warning", `Agent deployed but NFT minting failed or was rejected.\n\nSmart Account: ${data.agent.smartAccountAddress}`);
          }
        } else {
          showModal("Success", "Agent deployed successfully! Counterfactual address: " + data.agent.smartAccountAddress);
        }
        onRefresh();
      }
    } catch (e: any) {
      showModal("Deployment Failed", parseError(e));
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
      showModal("Linking Failed", parseError(e));
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!agent) return;
    try {
      setDepositConfirmOpen(false);
      setLoadingDeposit(true);
      const amountParsed = BigInt(Math.floor(parseFloat(depositAmount) * 1e18));
      const tx = await writeContractAsync({
        address: WETH_ADDRESS,
        abi: [{
          name: 'transfer',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          outputs: [{ type: 'bool' }]
        }],
        functionName: 'transfer',
        args: [agent.smartAccountAddress as `0x${string}`, amountParsed]
      });
      showModal("Deposit Initiated", `Transaction sent: ${tx}. Please wait a few seconds and click the 🔄 Refresh button.`);
    } catch(e: any) {
      showModal("Deposit Failed", parseError(e));
    } finally {
      setLoadingDeposit(false);
    }
  };

  const handleWithdraw = async () => {
    if (!agent) return;
    try {
      setWithdrawConfirmOpen(false);
      setLoadingWithdraw(true);
      
      const signature = await signMessageAsync({ message: "Withdraw Fletcher Agent Capital for my address: " + address });
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
      const res = await fetch(`${apiUrl}/api/agents/withdraw`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "x-wallet-address": address as string,
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({ signature, amount: "ALL" })
      });
      
      const data = await res.json();
      if (data.error) {
        showModal("Withdraw Failed", data.error);
      } else {
        showModal("Withdraw Initiated", `Your idle WETH capital has been transferred back to your wallet.\n\nTx Hash: ${data.txHash}`);
        onRefresh();
        refetchAgentBalance();
      }
    } catch (e: any) {
      showModal("Withdraw Failed", parseError(e));
    } finally {
      setLoadingWithdraw(false);
    }
  };

  if (!agent) {
    return (
      <div className="card" style={{ marginBottom: '20px', padding: '24px', textAlign: 'center', background: 'var(--panel-bg)' }}>
        <h3 style={{ marginBottom: '12px', fontSize: '20px' }}>Your Personal Fletcher Agent</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Deploy your zero-custody AI agent to automate trading and liquidity provision on Robinhood Chain.
          Requires Tier 1 (1,000,000 $FLETCH) balance.
        </p>
        {!isEligible && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid #ef4444', textAlign: 'left' }}>
            <strong>Insufficient Balance:</strong> You hold {fletchBalance.toLocaleString(undefined, {maximumFractionDigits: 2})} $FLETCH. You need {(shortfall).toLocaleString(undefined, {maximumFractionDigits: 2})} more $FLETCH to reach Tier 1.
          </div>
        )}

        <button 
          className="btn-primary"
          disabled={loading || !isEligible}
          onClick={() => setDeployConfirmOpen(true)}
          style={{ padding: '12px 24px', fontSize: '16px', background: isEligible ? 'var(--green)' : '#555', color: isEligible ? '#000' : '#888', border: 'none', borderRadius: '4px', cursor: isEligible ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
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
                  <li>Tier 1 (1,000,000 $FLETCH) balance</li>
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
        <Modal 
          isOpen={modalState.isOpen} 
          onClose={() => setModalState(s => ({ ...s, isOpen: false }))} 
          title={modalState.title} 
          message={modalState.message} 
        />
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        {/* Row 1: Agent Name & Refresh */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--green)' }}>
              <rect x="3" y="11" width="18" height="10" rx="2"></rect>
              <circle cx="12" cy="5" r="2"></circle>
              <path d="M12 7v4"></path>
              <line x1="8" y1="16" x2="8.01" y2="16"></line>
              <line x1="16" y1="16" x2="16.01" y2="16"></line>
            </svg>
            {agent.name}
            {agent.status === 'PENDING_FUNDING' && !isFunded ? (
              <span style={{ fontSize: '12px', padding: '2px 6px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '4px', border: '1px solid #f59e0b', marginLeft: '8px' }}>
                PENDING FUNDING
              </span>
            ) : user?.telegramChatId ? (
              <span style={{ fontSize: '12px', padding: '2px 6px', background: 'rgba(43,255,91,0.1)', color: 'var(--green)', borderRadius: '4px', border: '1px solid var(--green)', marginLeft: '8px' }}>
                ACTIVE
              </span>
            ) : (
              <span style={{ fontSize: '12px', padding: '2px 6px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '4px', border: '1px solid #f59e0b', marginLeft: '8px' }}>
                PENDING TELEGRAM
              </span>
            )}
            {agent.erc8004Id && (
              <a 
                href={`https://robinhoodchain.blockscout.com/tx/${agent.identityTxHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ fontSize: '12px', padding: '2px 6px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', borderRadius: '4px', border: '1px solid #a855f7', marginLeft: '8px', cursor: 'pointer', textDecoration: 'none' }} 
                title={`View Transaction: ${agent.identityTxHash}`}
              >
                FLETCH-ID #{agent.erc8004Id}
              </a>
            )}
          </h3>
          
          <button 
            onClick={async () => {
              setIsRefreshing(true);
              await refetchAgentBalance();
              setTimeout(() => setIsRefreshing(false), 500); // Give it a minimum spin time so user sees it
            }}
            disabled={isRefreshing}
            style={{ padding: '6px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid var(--line)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Refresh Balance"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }}>
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l5.67-5.67"/>
            </svg>
          </button>
        </div>

        {/* Row 2: Actions */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setWithdrawConfirmOpen(true)}
            disabled={loadingWithdraw}
            style={{ padding: '6px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid var(--line)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Withdraw Capital"
          >
            {loadingWithdraw ? (
              <span style={{ fontSize: '12px', padding: '0 4px' }}>...</span>
            ) : (
              <span style={{ fontSize: '12px', padding: '0 8px', fontWeight: 'bold' }}>Withdraw</span>
            )}
          </button>
          
          {agent.status === 'PENDING_FUNDING' && !isFunded && (
            <button 
              onClick={() => setDepositConfirmOpen(true)}
              style={{ padding: '6px 12px', background: 'var(--green)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}
            >
              Deposit Capital
            </button>
          )}
          
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
      </div>

      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Your Personal Fletcher Agent</h4>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '14px' }}>
        Deploy your zero-custody AI agent to automate trading and liquidity provision on Robinhood Chain.
        Requires Tier 1 (1,000,000 $FLETCH) balance.
      </p>

      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', overflow: 'hidden' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Smart Account (Zero-Custody)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <a 
              href={`https://robinhoodchain.blockscout.com/address/${agent.smartAccountAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-jetbrains-mono)', color: 'var(--green)', textDecoration: 'none', wordBreak: 'break-all' }}
              title="View on Robinhood Chain Explorer"
            >
              {agent.smartAccountAddress}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
            <div 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Copy Address"
              onClick={() => {
                navigator.clipboard.writeText(agent.smartAccountAddress);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? (
                <span style={{ fontSize: '10px', background: 'var(--green)', color: '#000', padding: '2px 4px', borderRadius: '4px' }}>Copied!</span>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, color: 'var(--green)' }}>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </div>
          </div>
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

      <Modal
        isOpen={withdrawConfirmOpen}
        onClose={() => setWithdrawConfirmOpen(false)}
        title="Confirm Withdraw"
        message={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <p style={{ margin: 0 }}>You are about to withdraw capital from your Fletcher Agent's Smart Account back to your main wallet.</p>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '6px', fontSize: '14px' }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#f59e0b' }}>Important Information:</div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)' }}>
                <li>This action will withdraw <strong>ALL IDLE WETH</strong> currently held in your Agent's Smart Account.</li>
                <li>WETH that is currently actively deployed in LP positions will <strong>NOT</strong> be withdrawn.</li>
                <li>You must sign a message in your wallet to authorize this action.</li>
              </ul>
            </div>

            <button 
              onClick={handleWithdraw}
              disabled={loadingWithdraw}
              style={{ padding: '12px', background: 'var(--red)', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              {loadingWithdraw ? "Processing..." : "Withdraw Idle WETH"}
            </button>
          </div>
        }
      />

      <Modal
        isOpen={depositConfirmOpen}
        onClose={() => setDepositConfirmOpen(false)}
        title="Deposit Capital"
        message={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <p style={{ margin: 0 }}>Enter the amount of WETH to transfer from your main wallet into the Fletcher Smart Account.</p>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '6px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: 'bold' }}>Amount:</span>
              <input 
                type="number" 
                value={depositAmount} 
                onChange={(e) => setDepositAmount(e.target.value)}
                style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid var(--line)', borderRadius: '4px', fontSize: '14px' }}
                placeholder="Enter WETH amount"
              />
              <span>WETH</span>
            </div>

            <button 
              onClick={handleDeposit}
              disabled={loadingDeposit || !depositAmount || parseFloat(depositAmount) <= 0}
              style={{ padding: '12px', background: 'var(--green)', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              {loadingDeposit ? "Depositing..." : "Confirm Deposit"}
            </button>
          </div>
        }
      />
    </div>
  );
}
