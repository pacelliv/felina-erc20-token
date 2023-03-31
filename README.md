# ERC-20 Felina Token

### 🌟🌟 Live Demo: https://super-sun-3424.on.fleek.co/

### 💥💥 ipfs://Qmb83Coh2iWQCemnsbSb6cGHeM8vvg2DJwhom8HgBb28wJ

### ✨✨ Frontend repo [here](https://github.com/pacelliv/felina-hub)

### ⚡️⚡️ API repo [here](https://github.com/pacelliv/felina-api)

## Overview

An ERC-20 is the technical standard for fungible tokens in the Ethereum blockchain, a fungible token is interchangeable with another tokens. By following standards tokens have a property that makes them exactly the same.

### ERC-20 Content

The standard list a series of functions (called method in the ERC) and events that must be implemented in order for the token to be ERC-20 compliant. 

The functions are:

- `approve`: Allows an spender to withdraw tokens from a specific account, up to a specific amount.
- `transfer`: Execute the transfer of an amount of tokens from an account to another account.
- `balanceOf`: Reads the balance of tokens that an account holds.
- `allowance`: Returns a set number of tokens to a spender from an owner.
- `totalSupply`: Returns the current amount of tokens in circulation.
- `transferFrom`: Execute the transfer of tokens from a specific account to another account using the allowance of a spender.

The events are:

- `Approve`: A log of an approved event. Contains the account approved and its allowance.
- `Transfer`: A event triggered when a transfer is successful.

The following functions are not required but enhance token usability:

- `name`: The name of the token.
- `decimals`: Returns the number of decimals of the token.
- `symbol`: Reads the symbol of the token.

### Contracts of the project

- `FelinaToken.sol`: contract of the token, the initial supply is 1,000,000,000 tokens The supply will be  reduced every 24hrs by the burner contract until it reaches the target supply of to 500,000,000 tokens. This token is ERC-20 compliant.

- `FelinaBurner.sol`: Using [Chainlink Automation](https://chain.link/automation), this contract removes 137,000 tokens from circulation every 24hrs.

## Quick Start

Clone this repo and cd into the folder:

```
git clone https://github.com/PacelliV/erc-20-felina-token.git
cd erc-20-felina-token
```

Run `yarn` to install all the dependencies:
```
yarn
```

## Test Locally

### Compile

Compile the project, mocks and inherited contract with:
```
yarn hardhat compile
```

### Deploy

Deploy the project, mocks and inherited contract with:
```
yarn hardhat deploy
```

### Test

Extensive and comprehensive unit tests against the contracts of this project has been provided. Run:
```
yarn hardhat test
```

### Coverage

This project has a 100% of coverage over the functions of the contracts.

```
yarn hardhat coverage
```

## Testing on Sepolia

1. Set up environment variables:

You'll need to set your `RPC_URL_SEPOLIA` and `PRIVATE_KEY_A` as enviroment variables. You can add them to an `.env` file.

-   `PRIVATE_KEY`: The private key of your account (e.g. from [Metamask](https://metamask.io/)). <b>NOTE: IT IS RECOMMENDED TO CREATE A NEW ACCOUNT FOR TESTING PURPOSES AND NEVER USE AN ACCOUNT WITH REAL FUNDS.</b>
    -   You can learn how to export a private key [here](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key).
-   `RPC_URL_GOERLI`: I'ts the url of the goerli node you are working with. You can set up one for free in [Alchemy](https://www.alchemy.com/).

2. Get test ETH and LINK

Go to https://goerlifaucet.com/ or [faucets.chain.link](https://faucets.chain.link/) to get test ETH and LINK in your Metamask.

Once you've requested for LINK tokens, this are not visible by default on Metamask, in order to see the balance of this token you'll need to import it. [Read more about how to set up your wallet with LINK](https://docs.chain.link/resources/acquire-link/).

3. Deploy to Sepolia:
```
yarn hardhat deploy --network sepolia
```

4. Default values:

Some values has been provided as default for the contructors of the contracts, but you're welcome to change the ones that are not `immutable`.

5. Call the approve method to set `FelinaBurner.sol` as a spender of tokens, use the `approve-burner` task to set an allowance.

6. Register `FelinaBurner.sol` contract in Chainlink Automation.

The process of burning tokens in `FelinaBurner.sol` is automated with Chainlink Automation. In order for Chainlink Nodes to be checking for our contract to know if they have to call `performUpkeep` we need to create an upkeep.

[Read more to find extra information](https://docs.chain.link/docs/chainlink-automation/compatible-contracts/).

Go to [automation.chain.link](https://automation.chain.link/) and register a new upkeep. Choose `Custom logic` as the trigger mechanism for the upkeep and insert your `contract address`. Fund the upkeep with 8 LINK.

7. Once you registered the upkeep, `FelinaBurner.sol` will start burning 10,000 tokens every 24hrs. The upkeep will not run if the balance goes to zero, remember to check its balance from time to time.

## Estimate gas cost in USD

To get an USD estimation of gas cost, you'll need a `COINMARKETCAP_API_KEY` environment variable. You can get one for free from [CoinMarketCap](https://pro.coinmarketcap.com/account).

Then, uncomment the line coinmarketcap: `COINMARKETCAP_API_KEY`, in `hardhat.config.js` to get the USD estimation. Just note, everytime you run your tests it will use an API call, so it might make sense to have using coinmarketcap disabled until you need it. You can disable it by just commenting the line.

## Verify on Etherscan

If you deploy your contracts to a testnet or mainnet, you can verify them if you get an [API Key](https://etherscan.io/login?cmd=last) from Etherscan and set it as an environemnt variable with the name `ETHERSCAN_API_KEY`. You can pop it into your `.env` file as seen in the `.env.example`.

However, you also can manually verify with:

```
yarn hardhat verify <DEPLOYED_CONTRACT_ADDRESS> --constructor-args
```

In it's current state, if you have your api key set, it will auto verify contract deployed on Sepolia.

## Linting

To check linting / code formatting:

```
yarn lint
```

or, to fix:

```
yarn lint:fix
```

## Resources 📚

- [Hardhat docs](https://hardhat.org/docs)
- [ERC-20: Token Standard](https://eips.ethereum.org/EIPS/eip-20)
- [Chainlink Automation](https://chain.link/automation)
- [Ethers.js docs](https://docs.ethers.org/v5/) 

## Outro ⭐️

I hope you like this project and it ends up being useful to you. 👩🏻‍💻 👨🏻‍💻🎉 🎉