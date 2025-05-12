import { ethers } from "hardhat";

async function main() {
  const usdtAddress = "0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557";

  const LendingPool = await ethers.getContractFactory("DefilordLendingPool");
  const pool = await LendingPool.deploy(usdtAddress);

  await pool.waitForDeployment();

  console.log("✅ Defilord Lending Pool deployed to:", await pool.getAddress());
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
