import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export const useWallet = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask not installed');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      localStorage.setItem('defilord-connected', 'true'); // ✅ Save connection state
    } catch (err) {
      console.error('Wallet connection failed:', err);
    }
  };

  const autoConnectWallet = async () => {
    try {
      const wasConnected = localStorage.getItem('defilord-connected');
      if (wasConnected && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
      }
    } catch (err) {
      console.error('Auto-connect failed:', err);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    localStorage.removeItem('defilord-connected'); // ✅ Clear session
  };

  // ✅ MetaMask event listener for account disconnect/switch
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet(); // fully disconnected
      } else {
        setAccount(accounts[0]);
        localStorage.setItem('defilord-connected', 'true');
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  return {
    account,
    connectWallet,
    autoConnectWallet,
    disconnectWallet, // ✅ now available in the UI
  };
};
