// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";

interface IFelinaToken {
    event Burn(address indexed _from, uint256 _value);

    function burnFrom(address _from, uint256 _value) external returns (bool success);

    function totalSupply() external view returns (uint256);
}

/**
 * @title FelinaBurner.
 * @author Eugenio Pacelli Flores Voitier.
 * @notice This is a sample contract to create an automated contract that periodically
 * burns an amount tokens of an ERC-20 compliant token.
 * @dev This contract implements Chainlink Automation.
 */

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract FelinaBurner is AutomationCompatibleInterface, Ownable {
    uint8 private constant DECIMALS = 18;
    uint256 private s_lastTimestamp;
    uint256 private s_dailyBurnAmount;
    uint256 private s_burningInterval;
    uint256 private s_totalBurnt;
    IFelinaToken private immutable i_felinaToken;

    error FelinaBurner__UpkeepNotNeeded();

    /**
     * @dev Sets the values for {s_lastTimestamp}, {s_dailyBurnAmount}, {s_burningInterval},
     * and {i_felinaToken}.
     *
     * Only {i_felinaToken} is immutable.
     */
    constructor(uint256 _burningRate, uint256 _interval, address _tokenAddress) {
        s_lastTimestamp = block.timestamp;
        s_dailyBurnAmount = _burningRate * 10 ** uint256(DECIMALS);
        s_burningInterval = _interval;
        i_felinaToken = IFelinaToken(_tokenAddress);
    }

    /**
     * @dev performUpkeep is the function the Chainlink nodes will call to kick off the
     * burning of tokens. This function can only be call if upkeepNeeded is true.
     */
    function performUpkeep(bytes calldata /*performData*/) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) revert FelinaBurner__UpkeepNotNeeded();
        i_felinaToken.burnFrom(owner(), s_dailyBurnAmount);
        s_totalBurnt = s_totalBurnt + s_dailyBurnAmount;
        s_lastTimestamp = block.timestamp;
    }

    /**
     * @dev Reads the last block.timestamp
     */
    function getLastTimestamp() external view returns (uint256) {
        return s_lastTimestamp;
    }

    /**
     * @dev Reads the daily burn amount of tokens by the contract
     */
    function getDailyBurnAmount() external view returns (uint256) {
        return s_dailyBurnAmount;
    }

    /**
     * @dev Reads the burning interval
     */
    function getBurningInterval() external view returns (uint256) {
        return s_burningInterval;
    }

    /**
     * @dev Reads the instance of FelinaToken.
     */
    function getToken() external view returns (IFelinaToken) {
        return i_felinaToken;
    }

    /**
     * @dev Reads the amount of tokens burn by the contract
     */
    function totalBurnt() external view returns (uint256) {
        return s_totalBurnt;
    }

    /**
     * @dev Reads the amount of decimals
     */
    function getDecimals() external pure returns (uint256) {
        return DECIMALS;
    }

    /**
     * @dev Sets the new amount tokens to be burned.
     * @param _newDailyBurnAmount Amount of tokens.
     */
    function setBurningAmount(uint256 _newDailyBurnAmount) public onlyOwner {
        s_dailyBurnAmount = _newDailyBurnAmount * 10 ** uint256(DECIMALS);
    }

    /**
     * @dev Sets the new burning interval.
     * @param _newBurningInterval The interval in seconds.
     */
    function setBurningInterval(uint256 _newBurningInterval) public onlyOwner {
        s_burningInterval = _newBurningInterval;
    }

    /**
     * @dev checkUpkeep is the function that the Chainlink Keepers nodes will call to know if
     * performUpKeep should be call by them. The Keepers will simulate off-chain the logic
     * inside this function.
     *
     * The following conditions must be true in order for `upKeepNeeded` to return true:
     * 1. Our time lock time should have passed.
     * 2. The target supply of tokens has not been reached
     * 3. Our subscription is funded with LINK.
     *
     * @return upkeepNeeded a boolean to indicate if the Keepers should call performUpkeep to
     * kick-off the burning the tokens.
     */
    function checkUpkeep(
        bytes memory /*checkData*/
    ) public view override returns (bool upkeepNeeded, bytes memory /*performData */) {
        bool hasTimeElapsed = (block.timestamp - s_lastTimestamp) > s_burningInterval;
        bool isTargetSupply = i_felinaToken.totalSupply() == 500000000 * 10 ** uint256(DECIMALS);
        upkeepNeeded = hasTimeElapsed && !isTargetSupply;
    }
}
