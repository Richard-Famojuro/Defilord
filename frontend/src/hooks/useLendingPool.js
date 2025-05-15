import { useMemo } from 'react';
import { ethers } from 'ethers';
import LendingPoolABI from '../abis/LendingPoolCore.json'; // ✅ Updated ABI path

const CONTRACT_ADDRESS = "0x574c1594Fe8ba0422bb70128f02661405E3727A0"; // ✅ Updated Sepolia LendingPoolCore

export const useLendingPool = (provider) => {
  const contract = useMemo(() => {
    if (!provider) return null;
    try {
      const signer = provider.getSigner();
      return new ethers.Contract(CONTRACT_ADDRESS, LendingPoolABI.abi, signer);
    } catch (err) {
      console.error("Contract setup error:", err);
      return null;
    }
  }, [provider]);

  const depositUSDT = async (amount, usdtAddress) => {
    try {
      const signer = provider.getSigner();
      const usdt = new ethers.Contract(usdtAddress, [
        "function approve(address spender, uint256 amount) public returns (bool)"
      ], signer);

      const value = ethers.parseUnits(amount, 6); // USDT has 6 decimals
      await usdt.approve(CONTRACT_ADDRESS, value);
      const tx = await contract.deposit(value);
      await tx.wait();
    } catch (err) {
      console.error("Deposit error:", err);
      throw err;
    }
  };

  const withdrawAll = async () => {
    try {
      const tx = await contract.withdrawAll();
      await tx.wait();
    } catch (err) {
      console.error("Withdraw error:", err);
      throw err;
    }
  };

  const getUserTotalBalance = async (address) => {
    try {
      const [principal, interest] = await contract.getUserTotalBalance(address);
      return {
        principal: ethers.formatUnits(principal, 6),
        interest: ethers.formatUnits(interest, 6),
      };
    } catch (err) {
      console.error("Balance fetch error:", err);
      return { principal: "0", interest: "0" };
    }
  };

  return {
    contract,
    depositUSDT,
    withdrawAll,
    getUserTotalBalance,
  };
};

