// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./VestingManager.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Airdrop is Ownable {
    mapping(address => bool) public s_addressToIsClaimed;
    IERC20 public immutable s_tokenToAirdrop;
    uint256 public immutable s_amountToAirdrop;
    VestingManager public immutable s_vestingManager;

    uint public constant CLIFF = 2 days; // 2 days
    uint public constant DURATION = 365 days; // 1 year

    /// @param _tokenToAirdrop : address of the token to airdrop
    /// @param _amountToAirdrop : amount of tokens to airdrop
    /// @param _vestingManager : address of the vesting manager
    constructor(
        address _tokenToAirdrop,
        uint256 _amountToAirdrop,
        address _vestingManager
    ) {
        s_tokenToAirdrop = IERC20(_tokenToAirdrop);
        s_amountToAirdrop = _amountToAirdrop;
        s_vestingManager = VestingManager(_vestingManager);
    }

    function initialize() public onlyOwner {
        s_tokenToAirdrop.approve(address(s_vestingManager), type(uint256).max);
    }

    /// @dev Claim tokens
    function claim() public {
        require(
            s_addressToIsClaimed[msg.sender] == false,
            "Airdrop already claimed"
        );
        require(
            s_tokenToAirdrop.balanceOf(address(this)) >= s_amountToAirdrop,
            "No more tokens to airdrop"
        );

        s_addressToIsClaimed[msg.sender] = true;
        s_vestingManager.addInvestor(
            msg.sender,
            s_amountToAirdrop,
            (block.timestamp - 30 days),
            CLIFF,
            DURATION
        );
    }

    /// @dev Check if address has claimed tokens
    /// @param _address : address to check
    function isClaimed(address _address) public view returns (bool) {
        return s_addressToIsClaimed[_address];
    }

    /// @dev Withdraw tokens
    function withdraw() public onlyOwner {
        s_tokenToAirdrop.transfer(
            msg.sender,
            s_tokenToAirdrop.balanceOf(address(this))
        );
    }
}
