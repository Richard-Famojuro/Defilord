import React, { useEffect, useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useLendingPool } from '../hooks/useLendingPool';
import { ethers } from 'ethers';

export default function DefilordLanding() {
  const { account, connectWallet } = useWallet();
  const provider = window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null;

  const { depositUSDT, withdrawAll, getUserTotalBalance } = useLendingPool(provider);
  const usdtAddress = "0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557"; // Sepolia USDT

  const [balance, setBalance] = useState({ principal: "0", interest: "0" });

  useEffect(() => {
    if (account) {
      getUserTotalBalance(account).then(setBalance);
    }
  }, [account]);

  return (
    <main style={{
      backgroundColor: '#000',
      color: '#fff',
      height: '100vh',
      width: '100vw',
      fontFamily: 'sans-serif',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        maxWidth: '1200px',
        width: '100%',
        marginInline: 'auto',
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Defilord</h1>
        <button
          onClick={connectWallet}
          style={{
            border: '1px solid #fff',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            backgroundColor: 'transparent',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
        </button>
      </header>

      {/* Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1.5rem',
        maxWidth: '800px',
        marginInline: 'auto',
        marginBottom: '3rem',
        flexWrap: 'wrap',
      }}>
        {['Lend', 'Borrow', 'Strategies', 'Education', 'Portfolio'].map(item => (
          <button key={item} style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>{item}</button>
        ))}
      </nav>

      {/* Dashboard */}
      {account && (
        <section style={{
          maxWidth: '600px',
          margin: '0 auto 2rem auto',
          border: '1px solid #fff',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Your Lending Portfolio</h2>
          <p><strong>Principal:</strong> {balance.principal} USDT</p>
          <p><strong>Interest:</strong> {balance.interest} USDT</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => depositUSDT("100", usdtAddress)}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', color: '#000', borderRadius: '6px', cursor: 'pointer' }}
            >
              Deposit 100 USDT
            </button>
            <button
              onClick={withdrawAll}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', color: '#000', borderRadius: '6px', cursor: 'pointer' }}
            >
              Withdraw All
            </button>
          </div>
        </section>
      )}

      {/* Cards */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        marginInline: 'auto',
        marginBottom: '4rem',
        flexGrow: 1
      }}>
        <div style={{
          border: '1px solid #fff',
          padding: '1.5rem',
          borderRadius: '8px'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Lend</h2>
          <p>Borrowing without traditional collateral</p>
        </div>
        <div style={{
          border: '1px solid #fff',
          padding: '1.5rem',
          borderRadius: '8px'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Borrow</h2>
          <p>Access up to 85% of idle funds</p>
        </div>
        <div style={{
          border: '1px solid #fff',
          padding: '1.5rem',
          borderRadius: '8px'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Strategies</h2>
          <p>Up to 20% APY<br />Up to 50% APY<br />VIP strategies</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', paddingBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Defilord</h2>
        <p style={{ marginTop: '0.5rem' }}>Let’s all become the top 1% of the world</p>
        <em style={{ display: 'block', marginTop: '0.25rem' }}>Leveraging just makes sense</em>
      </footer>
    </main>
  );
}
