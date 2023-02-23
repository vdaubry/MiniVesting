// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vesting is ERC20, Ownable {
    constructor(address owner, uint256 amount) ERC20("My Vesting", "VESTING") {
        _mint(owner, amount);
    }
}
