import { ethers } from "hardhat";

interface OwnableLike {
  transferOwnership(newOwner: string): Promise<any>;
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying contracts with:", deployer.address);

  const usdtAddress = "0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557"; // ✅ Sepolia USDT

  // 1. Deploy VaultManager
  const VaultManager = await ethers.getContractFactory("VaultManager");
  const vaultManager = await VaultManager.deploy(usdtAddress, deployer.address);
  await vaultManager.waitForDeployment();
  const vaultManagerAddress = await vaultManager.getAddress();
  console.log("✅ VaultManager deployed to:", vaultManagerAddress);

  // 2. Deploy LendingPoolCore
  const LendingPoolCore = await ethers.getContractFactory("LendingPoolCore");
  const lendingPool = await LendingPoolCore.deploy(usdtAddress, vaultManagerAddress);
  await lendingPool.waitForDeployment();
  const lendingPoolAddress = await lendingPool.getAddress();
  console.log("✅ LendingPoolCore deployed to:", lendingPoolAddress);

  // 3. Transfer VaultManager ownership to LendingPoolCore
  const vaultManagerOwnable = vaultManager as unknown as OwnableLike;
  const tx = await vaultManagerOwnable.transferOwnership(lendingPoolAddress);
  await tx.wait();
  console.log("🔐 VaultManager ownership transferred to LendingPoolCore");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
