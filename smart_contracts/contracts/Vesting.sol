// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Vesting is ERC20, Ownable {
    IERC20 private s_tokenToVest;
    mapping(address investor => InvestorConfig ) s_addressToInvestorConfig;

    /// @dev amount : number of tokens vested for a given investor
    /// @dev start : start time of the vesting period
    /// @dev cliff : cliff as seconds after start time
    /// @dev duration : duration as seconds after start time
    /// @dev released : number of tokens already released for a given investor
    struct InvestorConfig {
        uint256 amount;
        uint256 start;
        uint256 cliff;
        uint256 duration;
        uint256 released;
    }

    /// @param _tokenToVest : address of the token to vest
    constructor(address _tokenToVest) ERC20("My Vesting", "VESTING") {
        s_tokenToVest = IERC20(_tokenToVest);
    }
    
    function addInvestor(address _investor, uint256 _amount, uint256 _start, uint256 _cliff, uint256 _duration) public onlyOwner {
        require(_investor != address(0), "Vesting: _investor is the zero address");
        require(_amount > 0, "Vesting: _amount is 0");
        require(_cliff > _duration, "Vesting: _cliff is longer than _duration");

        s_addressToInvestorConfig[_investor] = InvestorConfig(_amount, _start, _cliff, _duration, 0);
        s_tokenToVest.transferFrom(msg.sender, address(this), _amount);
    }

    
}
