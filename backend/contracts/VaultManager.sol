// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IExternalVault {
    function deposit(uint256 amount) external;
    function withdraw(uint256 amount) external;
    function harvest() external returns (uint256);
}

contract VaultManager is Ownable {
    IERC20 public immutable usdt;
    address public lendingPoolCore;

    mapping(address => bool) public whitelistedVaults;

    event VaultAllocated(address indexed vault, uint256 amount);
    event RewardsHarvested(address indexed vault, uint256 reward);
    event PositionLiquidated(address indexed vault, uint256 amount);
    event LendingPoolSet(address indexed pool);
    event VaultWhitelisted(address indexed vault, bool status);

    modifier onlyLendingPool() {
        require(msg.sender == lendingPoolCore, "Not authorized");
        _;
    }

    constructor(address _usdt, address _initialOwner) {
        require(_usdt != address(0), "Invalid USDT address");
        usdt = IERC20(_usdt);
        transferOwnership(_initialOwner);
    }

    function setLendingPool(address _core) external onlyOwner {
        require(_core != address(0), "Zero address");
        lendingPoolCore = _core;
        emit LendingPoolSet(_core);
    }

    function whitelistVault(address vault, bool approved) external onlyOwner {
        whitelistedVaults[vault] = approved;
        emit VaultWhitelisted(vault, approved);
    }

    function allocateToVault(address vault, uint256 amount) external onlyLendingPool {
        require(whitelistedVaults[vault], "Vault not allowed");
        require(usdt.transfer(vault, amount), "Transfer failed");

        IExternalVault(vault).deposit(amount);
        emit VaultAllocated(vault, amount);
    }

    function harvestRewards(address vault) external onlyOwner {
        require(whitelistedVaults[vault], "Vault not allowed");
        uint256 rewards = IExternalVault(vault).harvest();
        emit RewardsHarvested(vault, rewards);
    }

    function liquidatePosition(address vault, uint256 amount) external onlyOwner {
        require(whitelistedVaults[vault], "Vault not allowed");

        IExternalVault(vault).withdraw(amount);
        emit PositionLiquidated(vault, amount);
    }
}
