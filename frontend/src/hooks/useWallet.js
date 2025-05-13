import { useState } from 'react';
import { ethers } from 'ethers';

export const useWallet = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask not installed');

      const provider = new ethers.BrowserProvider(window.ethereum); // ✅ for v6
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
    } catch (err) {
      console.error('Wallet connection failed:', err);
    }
  };

  return { account, connectWallet };
};
