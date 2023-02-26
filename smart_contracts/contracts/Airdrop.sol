// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Airdrop is Ownable {
    mapping(address => bool) public s_addressToIsClaimed;
    IERC20 public s_tokenToAirdrop;
    uint256 public s_amountToAirdrop;

    /// @param _tokenToAirdrop : address of the token to airdrop
    /// @param _amountToAirdrop : amount of tokens to airdrop
    constructor(address _tokenToAirdrop, uint256 _amountToAirdrop) {
        s_tokenToAirdrop = IERC20(_tokenToAirdrop);
        s_amountToAirdrop = _amountToAirdrop;
    }

    /// @dev Claim tokens
    /// @param _investor : address of the investor
    function claim(address _investor) public onlyOwner {
        require(
            _investor != address(0),
            "Airdrop: _investor is the zero address"
        );
        require(
            s_addressToIsClaimed[_investor] == false,
            "Airdrop: _investor already claimed"
        );
        require(
            s_tokenToAirdrop.balanceOf(address(this)) >= s_amountToAirdrop,
            "Airdrop: not more tokens to airdrop"
        );

        s_addressToIsClaimed[_investor] = true;
        s_tokenToAirdrop.transfer(_investor, s_amountToAirdrop);
    }
}
