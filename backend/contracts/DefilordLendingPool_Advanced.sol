// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DefilordLendingPool is ReentrancyGuard, Pausable, Ownable {
    IERC20 public immutable usdt;
    uint256 public fixedAPY = 500; // 5.00% in basis points
    uint256 public constant MAX_APY = 2000; // Max 20%
    uint256 public constant MIN_LOCKUP_DURATION = 7 days;
    uint256 public constant MAX_USER_DEPOSIT = 100_000 * 1e6; // max 100K USDT per user
    uint256 public totalDeposits;
    uint256 public depositCap = 1_000_000 * 1e6; // 1M USDT global cap

    struct DepositInfo {
        uint256 amount;
        uint256 depositTime;
    }

    mapping(address => DepositInfo[]) public deposits;
    mapping(address => uint256) public userTotalDeposited;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 interest);
    event APYChanged(uint256 newAPY);
    event CapUpdated(uint256 newCap);

    constructor(address _usdt) {
        require(_usdt != address(0), "Invalid USDT address");
        usdt = IERC20(_usdt);
    }

    function setAPY(uint256 _apy) external onlyOwner {
        require(_apy <= MAX_APY, "APY too high");
        fixedAPY = _apy;
        emit APYChanged(_apy);
    }

    function setDepositCap(uint256 _cap) external onlyOwner {
        depositCap = _cap;
        emit CapUpdated(_cap);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function deposit(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "Zero deposit");
        require(totalDeposits + amount <= depositCap, "Pool cap reached");
        require(userTotalDeposited[msg.sender] + amount <= MAX_USER_DEPOSIT, "User cap exceeded");

        require(usdt.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        deposits[msg.sender].push(DepositInfo({
            amount: amount,
            depositTime: block.timestamp
        }));

        userTotalDeposited[msg.sender] += amount;
        totalDeposits += amount;

        emit Deposited(msg.sender, amount);
    }

    function calculateInterest(DepositInfo memory info) internal view returns (uint256) {
        uint256 timeElapsed = block.timestamp - info.depositTime;
        uint256 yearlyInterest = (info.amount * fixedAPY) / 10000;
        return (yearlyInterest * timeElapsed) / 365 days;
    }

    function withdrawAll() external whenNotPaused nonReentrant {
        DepositInfo[] storage userDeposits = deposits[msg.sender];
        require(userDeposits.length > 0, "No deposits");

        uint256 totalWithdraw;
        uint256 totalInterest;

        for (uint i = 0; i < userDeposits.length; i++) {
            DepositInfo memory info = userDeposits[i];
            require(block.timestamp >= info.depositTime + MIN_LOCKUP_DURATION, "Locked");

            uint256 interest = calculateInterest(info);
            totalWithdraw += info.amount;
            totalInterest += interest;
        }

        delete deposits[msg.sender];
        totalDeposits -= totalWithdraw;
        userTotalDeposited[msg.sender] = 0;

        require(usdt.transfer(msg.sender, totalWithdraw + totalInterest), "Withdraw failed");
        emit Withdrawn(msg.sender, totalWithdraw, totalInterest);
    }

    function getUserDeposits(address user) external view returns (DepositInfo[] memory) {
        return deposits[user];
    }

    function getUserTotalBalance(address user) external view returns (uint256 principal, uint256 interest) {
        DepositInfo[] memory infos = deposits[user];
        for (uint i = 0; i < infos.length; i++) {
            principal += infos[i].amount;
            interest += calculateInterest(infos[i]);
        }
        return (principal, interest);
    }
}
