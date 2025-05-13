import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import LendingPoolABI from '../abis/DefilordLendingPool.json';

const CONTRACT_ADDRESS = "0xF68C7c4E53dFC211Dcd7DAE5745806d528Eb1921"; // Sepolia deployment

export const useLendingPool = (provider) => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (!provider) return;
    const signer = provider.getSigner();
    const instance = new ethers.Contract(CONTRACT_ADDRESS, LendingPoolABI.abi, signer);
    setContract(instance);
  }, [provider]);

  const depositUSDT = async (amount, usdtAddress) => {
    const signer = provider.getSigner();
    const usdt = new ethers.Contract(usdtAddress, [
      "function approve(address spender, uint256 amount) public returns (bool)"
    ], signer);
    const value = ethers.parseUnits(amount, 6);
    await usdt.approve(CONTRACT_ADDRESS, value);
    const tx = await contract.deposit(value);
    await tx.wait();
  };

  const withdrawAll = async () => {
    const tx = await contract.withdrawAll();
    await tx.wait();
  };

  const getUserTotalBalance = async (address) => {
    const [principal, interest] = await contract.getUserTotalBalance(address);
    return {
      principal: ethers.formatUnits(principal, 6),
      interest: ethers.formatUnits(interest, 6),
    };
  };

  return {
    contract,
    depositUSDT,
    withdrawAll,
    getUserTotalBalance,
  };
};
