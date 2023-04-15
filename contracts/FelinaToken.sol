// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FelinaToken.
 * @author Eugenio Pacelli Flores Voitier.
 * @notice This is a sample contract to create an ERC20 token.
 * @dev This token follows the ERC-20 standard as defined in the EIP.
 */

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract FelinaToken is Ownable {
    string private s_name;
    string private s_symbol;
    uint256 private s_blockReward;
    uint256 private s_totalSupply;
    uint8 private constant DECIMALS = 18;
    uint256 private immutable i_targetSupply;
    mapping(address => uint256) private s_balances;
    mapping(address => mapping(address => uint256)) private s_allowances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event Burn(address indexed _from, uint256 _value);

    error FelinaToken__ValueExceedsAllowance(uint256 value, uint256 remainingAllowance);
    error FelinaToken__AddressZero();
    error FelinaToken__SupplyDecreasedBelowTargetSupply();
    error FelinaToken__ValueExceedsAccountBalance(uint256 value, uint256 balance);
    error FelinaToken__Underflow(uint256 remainingAllowance, uint256 subtractedValue);

    /**
     * @dev Sets the values for {s_name}, {s_symbol}, {s_totalSupply}, {i_initialSupply}
     *  and {i_targetSupply}.
     *
     * The value of {DECIMALS} is 18.
     *
     * Allocates the entire initial supply to the creator of the token.
     */
    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _initialSupply,
        uint256 _targetSupply,
        uint256 _blockReward
    ) {
        s_name = _tokenName;
        s_symbol = _tokenSymbol;
        s_totalSupply = _initialSupply * 10 ** uint256(DECIMALS);
        i_targetSupply = _targetSupply * 10 ** uint256(DECIMALS);
        s_blockReward = _blockReward * 10 ** uint256(DECIMALS);
        s_balances[msg.sender] = s_totalSupply;
    }

    /**
     * @notice Moves `_value` tokens from caller's account to `_to` recipient.
     * Call this function ONLY to transfer tokens to an Externally Owned Account.
     * @param _to Address of the recipient.
     * @param _value Amount of tokens to be transferred.
     * @return success True in case of a successful transaction, false otherwise.
     */
    function transfer(address _to, uint256 _value) public returns (bool success) {
        _transfer(msg.sender, _to, _value);
        success = true;
    }

    /**
     * @notice Moves `_value` tokens to `_to` on behalf of `_from`. Then `_value` is
     * deducted from caller allowance. Call this function ONLY to transfer tokens to
     * a smart contract. CALLER MUST CONFIRM `_to` IS CAPABLE OF RECEIVING ERC20 TOKENS
     * OR ELSE THEY MAY BE PERMANENTLY LOST.
     * @dev Throws if `_value` exceeds `_spender` remaining allowance.
     * @param _from Account from which the tokens will be moved.
     * @param _to Address of the recipient of tokens.
     * @param _value Amount of tokens to be moved.
     * @return success True in case of a successful transaction, false otherwise.
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        if (_value > s_allowances[_from][msg.sender]) {
            revert FelinaToken__ValueExceedsAllowance(_value, s_allowances[_from][msg.sender]);
        }
        s_allowances[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        success = true;
    }

    /**
     * @notice Sets `_value` as the allowance for `_spender`. Allows `_spender` to spend
     * no more than `_value` tokens on your behalf.
     * @dev Calling this function to change the allowance brings the risk of a `_spender`
     * using both the old and new allowance by unfortunate transaction ordering. To
     * reduce the risk is recommended to first reduce the old allowance to zero and then
     * set a new allowance with the desire `_value`.
     * See: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     * @param _spender The address of the account authorized to spend.
     * @param _value Max amount of tokens allowed to spend.
     * @return success True in case of a successful transaction, false otherwise.
     */
    function approve(address _spender, uint256 _value) public returns (bool success) {
        _approve(msg.sender, _spender, _value);
        success = true;
    }

    /**
     * @notice Destroy `_value` tokens irreversibly.
     * @dev Throws if `_value` exceeds the balance of the account. Throws if `_value`
     * will decrease the supply below `i_targetSupply`.
     * @param _value Amount of tokens to destroy.
     * @return success True in case of a successful transaction, false otherwise.
     *
     * Emits a {Burn} event.
     */
    function burn(uint256 _value) public returns (bool success) {
        if (_value > s_balances[msg.sender]) {
            revert FelinaToken__ValueExceedsAccountBalance(_value, s_balances[msg.sender]);
        }
        uint256 newSupply = s_totalSupply - _value;
        if (newSupply < i_targetSupply) revert FelinaToken__SupplyDecreasedBelowTargetSupply();
        s_totalSupply -= _value;
        s_balances[msg.sender] -= _value;
        emit Burn(msg.sender, _value);
        success = true;
    }

    /**
     * @notice Destroy tokens irreversibly from another account.
     * @dev Throws if `_value` exceeds the balance of the account. Throws if
     * `_from` is address zero. Throws if target supply has been reached. Throws
     * if `_value` exceeds remaining allowance of the spender address.
     * @param _from Address of the account from which tokens will be destroyed.
     * @param _value Amount of token to destroy.
     * @return success True in case of a successful transaction, false otherwise.
     *
     * Emits a {Burn} event.
     */
    function burnFrom(address _from, uint256 _value) public returns (bool success) {
        if (_from == address(0)) revert FelinaToken__AddressZero();
        if (_value > s_balances[_from]) {
            revert FelinaToken__ValueExceedsAccountBalance(_value, s_balances[_from]);
        }
        if (_value > s_allowances[_from][msg.sender]) {
            revert FelinaToken__ValueExceedsAllowance(_value, s_allowances[_from][msg.sender]);
        }

        uint256 newSupply = s_totalSupply - _value;
        if (newSupply < i_targetSupply) revert FelinaToken__SupplyDecreasedBelowTargetSupply();

        s_balances[_from] -= _value;
        s_allowances[_from][msg.sender] -= _value;
        s_totalSupply -= _value;
        emit Burn(_from, _value);
        success = true;
    }

    /**
     * @notice Set the amount of tokens to reward validators for mining
     * transactions of the token.
     * @dev Throws if caller is not the token owner.
     * @param _blockReward Amount of tokens to reward.
     * @return success True in case of a successful transaction, false otherwise.
     */
    function setBlockReward(uint256 _blockReward) external onlyOwner returns (bool success) {
        s_blockReward = _blockReward * 10 ** uint256(DECIMALS);
        success = true;
    }

    /**
     * @notice Increases the allowance of a `_spender`.
     * @param _spender Address of the approved address to act on behalf of msg.sender.
     * @param _addedValue Amount to increase the allowance of the `_spender`.
     * @return success True in case of a successful transaction, false otherwise.
     */
    function increaseAllowance(
        address _spender,
        uint256 _addedValue
    ) public returns (bool success) {
        uint256 _currentAllowance = allowance(msg.sender, _spender);
        _approve(msg.sender, _spender, _currentAllowance + _addedValue);
        success = true;
    }

    /**
     * @notice Decreases the allowance of a `_spender`.
     * @dev Throws if the `_subtractedValue` will cause underflow.
     * @param _spender Address of the approved address to act on behalf of msg.sender.
     * @param _subtractedValue Amount to decrease the allowance of the `_spender`.
     * @return success True in case of a successful transaction, false otherwise.
     */
    function decreaseAllowance(
        address _spender,
        uint256 _subtractedValue
    ) public returns (bool success) {
        uint256 _currentAllowance = allowance(msg.sender, _spender);
        if (_currentAllowance < _subtractedValue) {
            revert FelinaToken__Underflow(_currentAllowance, _subtractedValue);
        }
        unchecked {
            _approve(msg.sender, _spender, _currentAllowance - _subtractedValue);
        }
        success = true;
    }

    /**
     * @notice Returns the name of the token.
     */
    function name() public view returns (string memory) {
        return s_name;
    }

    /**
     * @notice Returns the symbol of the token.
     */
    function symbol() public view returns (string memory) {
        return s_symbol;
    }

    /**
     * @notice Returns the current supply of the token.
     */
    function totalSupply() public view returns (uint256) {
        return s_totalSupply;
    }

    /**
     * @notice Reads the balance of an account.
     */
    function balanceOf(address _account) public view returns (uint256) {
        return s_balances[_account];
    }

    /**
     * @notice Returns the reamining allowance of tokens of an account.
     */
    function allowance(address _owner, address _spender) public view returns (uint256) {
        return s_allowances[_owner][_spender];
    }

    /**
     * @notice Returns the target supply of the tokens.
     */
    function targetSupply() public view returns (uint256) {
        return i_targetSupply;
    }

    /**
     *@notice Reads the block reward for the validators.
     */
    function blockReward() public view returns (uint256) {
        return s_blockReward;
    }

    /**
     * @notice Returns the number of decimals places of the token.
     */
    function decimals() public pure returns (uint8) {
        return DECIMALS;
    }

    /**
     * @notice Internal transfer, can only be called by the contract.
     * @dev Throws if `_to` is address zero. Throws if `_from` is address zero.
     * Throws if `_value` exceeds the balance of the account.
     * @param _from Address of the sender, must have balance at least of _value.
     * @param _to Address of the recipient, cannot be the zero address.
     * @param _value Amount of tokens.
     *
     * Emits a {Transfer} event.
     */
    function _transfer(address _from, address _to, uint256 _value) internal {
        if (_to == address(0)) revert FelinaToken__AddressZero();
        if (_from == address(0)) revert FelinaToken__AddressZero();
        if (_value > s_balances[_from]) {
            revert FelinaToken__ValueExceedsAccountBalance(_value, s_balances[_from]);
        }
        _beforeTokenTransfer(_from, _to);
        s_balances[_from] -= _value;
        s_balances[_to] += _value;
        emit Transfer(_from, _to, _value);
    }

    /**
     * @notice Sets the allowance for a `_spender`
     * @dev Throws if the `_owner` or `_spender` are the address zero. Internal
     * function, can only be called from within this contract.
     *
     * Emits a {Approval} event.
     */
    function _approve(address _owner, address _spender, uint256 _value) internal {
        if (_owner == address(0)) revert FelinaToken__AddressZero();
        if (_spender == address(0)) revert FelinaToken__AddressZero();
        s_allowances[_owner][_spender] = _value;
        emit Approval(_owner, _spender, _value);
    }

    /**
     * @dev This function does not throws. Checks if the coinbase
     * address should receive the block reward for mining a transaction
     * with FEL tokens.
     * @param _from The address of the sender.
     * @param _to The Address of the receipient.
     */
    function _beforeTokenTransfer(address _from, address _to) internal {
        if (
            _from != address(0) &&
            block.coinbase != address(0) &&
            _to != block.coinbase &&
            s_blockReward > 0
        ) {
            _transferBlockReward();
        }
    }

    /**
     * @notice Transfer the block reward to the validator.
     */
    function _transferBlockReward() internal {
        s_balances[owner()] -= s_blockReward;
        s_balances[block.coinbase] += s_blockReward;
        emit Transfer(owner(), block.coinbase, s_blockReward);
    }
}
