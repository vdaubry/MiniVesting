// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract VestingManager is Ownable {
    IERC20 public s_tokenToVest;
    mapping(address investor => InvestorConfig ) public s_addressToInvestorConfig;

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

    event ERC20Released(address indexed s_tokenToVest, uint256 amount, address investor);

    /// @param _tokenToVest : address of the token to vest
    constructor(address _tokenToVest) {
        s_tokenToVest = IERC20(_tokenToVest);
    }
    
    /// @dev Add an investor to the vesting contract
    /// @param _investor : address of the investor
    /// @param _amount : amount of tokens to vest
    /// @param _start : start time of the vesting period
    /// @param _cliff : cliff as seconds after start time
    /// @param _duration : duration as seconds after start time
    function addInvestor(address _investor, uint256 _amount, uint256 _start, uint256 _cliff, uint256 _duration) public onlyOwner {
        require(_investor != address(0), "Vesting: _investor is the zero address");
        require(_amount > 0, "Vesting: _amount is 0");

        s_addressToInvestorConfig[_investor] = InvestorConfig(_amount, _start, _cliff, _duration, 0);
        s_tokenToVest.transferFrom(msg.sender, address(this), _amount);
    }

    
     /// @dev Getter for the amount of releasable token.
     /// @param investor The address of the investor
    function releasable(address investor) public view virtual returns (uint256) {
        return vestedAmount(uint64(block.timestamp), investor) - released(investor);
    }

    /**
     * @dev Calculates the amount of token that has already vested. Default implementation is a linear vesting curve.
     * @param timestamp The timestamp at which the vested amount is calculated
     * @param investor The address of the investor
     */
    function vestedAmount(uint64 timestamp, address investor) public view virtual returns (uint256) {
        return _vestingSchedule(timestamp, investor);
    }

    /**
     * @dev Amount of token already released
     * @param investor The address of the investor
     *
     */
    function released(address investor) public view virtual returns (uint256) {
        return s_addressToInvestorConfig[investor].released;
    }

    /**
     * @dev Release the native token (token) that have already vested.
     * @param investor The address of the investor
     *
     * Emits a {tokenReleased} event.
     */
    function release(address investor) public virtual {
        uint256 unreleased = releasable(investor);
        require(unreleased > 0, "Vesting: no tokens are due");

        s_addressToInvestorConfig[investor].released = s_addressToInvestorConfig[investor].released + unreleased;
        s_tokenToVest.transfer(investor, unreleased);

        emit ERC20Released(address(s_tokenToVest), unreleased, investor);
    }

    /**
     * @dev Virtual implementation of the vesting formula. This returns the amount vested, as a function of time, for
     * an asset given its total historical allocation.
     * @param timestamp The timestamp at which the vested amount is calculated
     * @param investor The address of the investor
     */
    function _vestingSchedule(uint64 timestamp, address investor) internal view virtual returns (uint256) {
        uint256 totalAllocation = amount(investor);
        uint256 releaseStartTime = start(investor) + cliff(investor);
        if (timestamp < releaseStartTime) {
            return 0;
        } else if (timestamp > (releaseStartTime + duration(investor))) {
            return totalAllocation;
        } else {
            return (totalAllocation * (timestamp - releaseStartTime)) / duration(investor);
        }
    }

    /// @dev Getter for the start time of the vesting period
    /// @param investor The address of the investor
    function start(address investor) public view virtual returns (uint256) {
        return s_addressToInvestorConfig[investor].start;
    }

    /// @dev Getter for the cliff of the vesting period
    /// @param investor The address of the investor
    function cliff(address investor) public view virtual returns (uint256) {
        return s_addressToInvestorConfig[investor].cliff;
    }

    /// @dev Getter for the duration of the vesting period
    /// @param investor The address of the investor
    function duration(address investor) public view virtual returns (uint256) {
        return s_addressToInvestorConfig[investor].duration;
    }

    /// @dev Getter for the amount of tokens to vest
    /// @param investor The address of the investor
    function amount(address investor) public view virtual returns (uint256) {
        return s_addressToInvestorConfig[investor].amount;
    }

    /// @dev Getter for the investor config
    /// @param investor The address of the investor
    function getInvestorConfig(address investor) public view virtual returns (InvestorConfig memory) {
        return s_addressToInvestorConfig[investor];
    }
}
