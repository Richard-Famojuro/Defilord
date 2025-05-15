// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IVaultManager {
    function allocateToVault(address vault, uint256 amount) external;
}

contract LendingPoolCore is Ownable {
    IERC20 public immutable usdt;
    IVaultManager public vaultManager;

    uint256 public totalDeposits;
    uint256 public constant RESERVE_RATIO = 30; // 30%

    struct DepositInfo {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => DepositInfo[]) public deposits;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event VaultRequested(address indexed vault, uint256 amount);

    constructor(address _usdt, address _vaultManager) {
        usdt = IERC20(_usdt);
        vaultManager = IVaultManager(_vaultManager);
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "Zero deposit");
        require(usdt.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        deposits[msg.sender].push(DepositInfo(amount, block.timestamp));
        totalDeposits += amount;

        emit Deposited(msg.sender, amount);
    }

    function withdrawAll() external {
        DepositInfo[] storage userDeposits = deposits[msg.sender];
        require(userDeposits.length > 0, "Nothing to withdraw");

        uint256 totalUserAmount;

        for (uint i = 0; i < userDeposits.length; i++) {
            totalUserAmount += userDeposits[i].amount;
        }

        delete deposits[msg.sender];
        totalDeposits -= totalUserAmount;

        require(usdt.transfer(msg.sender, totalUserAmount), "Withdraw failed");
        emit Withdrawn(msg.sender, totalUserAmount);
    }

    function getUserTotalBalance(address user) external view returns (uint256 principal, uint256 interest) {
        DepositInfo[] memory userDeposits = deposits[user];
        for (uint i = 0; i < userDeposits.length; i++) {
            principal += userDeposits[i].amount;
        }

        // Placeholder: interest would be from reward logic
        interest = 0;
    }

    function requestVaultAllocation(address vault, uint256 amount) external onlyOwner {
        require(amount <= availableForVault(), "Not enough reserve");
        usdt.approve(address(vaultManager), amount);
        vaultManager.allocateToVault(vault, amount);

        emit VaultRequested(vault, amount);
    }

    function availableForVault() public view returns (uint256) {
        return (totalDeposits * (100 - RESERVE_RATIO)) / 100;
    }
}
