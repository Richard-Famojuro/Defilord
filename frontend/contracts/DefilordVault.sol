
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DefilordVault {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function getGreeting() public pure returns (string memory) {
        return "Welcome to Defilord";
    }
}
