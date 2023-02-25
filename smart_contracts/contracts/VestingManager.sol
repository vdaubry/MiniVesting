// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract VestingManager is Ownable {
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

    event ERC20Released(address indexed s_tokenToVest, uint256 amount, address investor);

    /// @param _tokenToVest : address of the token to vest
    constructor(address _tokenToVest) {
        s_tokenToVest = IERC20(_tokenToVest);
    }
    
    function addInvestor(address _investor, uint256 _amount, uint256 _start, uint256 _cliff, uint256 _duration) public onlyOwner {
        require(_investor != address(0), "Vesting: _investor is the zero address");
        require(_amount > 0, "Vesting: _amount is 0");
        require(_cliff > _duration, "Vesting: _cliff is longer than _duration");

        s_addressToInvestorConfig[_investor] = InvestorConfig(_amount, _start, _cliff, _duration, 0);
        s_tokenToVest.transferFrom(msg.sender, address(this), _amount);
    }

    
     /// @dev Getter for the amount of releasable eth.
    function releasable(address investor) public view virtual returns (uint256) {
        return vestedAmount(uint64(block.timestamp), investor) - released(investor);
    }

    /**
     * @dev Calculates the amount of ether that has already vested. Default implementation is a linear vesting curve.
     */
    function vestedAmount(uint64 timestamp, address investor) public view virtual returns (uint256) {
        return _vestingSchedule(address(this).balance + released(investor), timestamp, investor);
    }

    /**
     * @dev Amount of token already released
     */
    function released(address investor) public view virtual returns (uint256) {
        return s_addressToInvestorConfig[investor].released;
    }

    /**
     * @dev Release the native token (ether) that have already vested.
     *
     * Emits a {EtherReleased} event.
     */
    function release(address investor) public virtual {
        uint256 unreleased = releasable(investor);
        require(unreleased > 0, "Vesting: no tokens are due");

        s_addressToInvestorConfig[investor].released = s_addressToInvestorConfig[investor].released + unreleased;
        s_tokenToVest.transferFrom(address(this), investor, unreleased);

        emit ERC20Released(address(s_tokenToVest), unreleased, investor);
    }

    /**
     * @dev Virtual implementation of the vesting formula. This returns the amount vested, as a function of time, for
     * an asset given its total historical allocation.
     */
    function _vestingSchedule(uint256 totalAllocation, uint64 timestamp, address investor) internal view virtual returns (uint256) {
        uint256 releaseStartTime = start(investor) + cliff(investor);
        if (timestamp < releaseStartTime) {
            return 0;
        } else if (timestamp > releaseStartTime + duration(investor)) {
            return totalAllocation;
        } else {
            return (totalAllocation * (timestamp - releaseStartTime)) / duration(investor);
        }
    }

    function start(address investor) public view virtual returns (uint256) {
        return s_addressToInvestorConfig[investor].start;
    }

    function cliff(address investor) public view virtual returns (uint256) {
        return s_addressToInvestorConfig[investor].cliff;
    }

    function duration(address investor) public view virtual returns (uint256) {
        return s_addressToInvestorConfig[investor].duration;
    }

    function amount(address investor) public view virtual returns (uint256) {
        return s_addressToInvestorConfig[investor].amount;
    }
}
