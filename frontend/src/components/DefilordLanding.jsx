import React from 'react';
import { useWallet } from '../hooks/useWallet'; // Make sure this file exists

export default function DefilordLanding() {
  const { account, connectWallet } = useWallet();

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
