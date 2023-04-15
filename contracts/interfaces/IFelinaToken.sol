// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * Interfaces:
 * 1. All functions must be declared with an external visibility.
 * 2. Cannot declare state variables.
 * 3. Cannot declare a contructor.
 * 4. The functions cannot have any implementation.
 * 5. Can inherit from another interfaces.
 */

interface IFelinaToken {
    function transfer(address _to, uint256 _value) external returns (bool success);

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool success);

    function approve(address _spender, uint256 _value) external returns (bool success);

    function burn(uint256 _value) external returns (bool success);

    function burnFrom(address _from, uint256 _value) external returns (bool success);

    function setBlockReward(uint256 _blockReward) external returns (bool success);

    function increaseAllowance(
        address _spender,
        uint256 _addedValue
    ) external returns (bool success);

    function decreaseAllowance(
        address _spender,
        uint256 _subtractedValue
    ) external returns (bool success);

    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function totalSupply() external view returns (uint256);

    function balanceOf(address _account) external view returns (uint256 balance);

    function allowance(address _owner, address _spender) external view returns (uint256 remaining);

    function targetSupply() external view returns (uint256);

    function blockReward() external view returns (uint256);

    function decimals() external pure returns (uint8);
}
