const networkConfig = {
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        subscriptionId: "4622",
    },
    31337: {
        name: "localhost",
    },
    80001: {
        name: "polygonMumbai",
        ethUsdPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
        subscriptionId: "3746",
    },
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        subscriptionId: "185",
    },
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6

// FelinaToken constructor arguments:
const TOKEN_NAME = "Felina"
const TOKEN_SYMBOL = "FEL"
const INITIAL_SUPPLY = "1000000000"
const TARGET_SUPPLY = "500000000"
const BLOCK_REWARD = "5"

// FelinaBurner constructor arguments:
const BURN_AMOUNT = "137000"
const BURNING_INTERVAL = "86400"

// Frontend and server files paths:
const FRONTEND_TOKEN_ABI = "../felina-explorer/src/constants/felinaTokenAbi.json"
const SERVER_TOKEN_ABI = "../felina-web3-backend/utils/constants/felinaTokenAbi.json"
const FRONTEND_TOKEN_ADDRESSES =
    "../felina-explorer/src/constants/felinaTokenContractAddresses.json"
const SERVER_TOKEN_ADDRESSES =
    "../felina-web3-backend/utils/constants/felinaTokenContractAddresses.json"
const FRONTEND_BURNER_ABI = "../felina-explorer/src/constants/felinaBurnerAbi.json"
const FRONTEND_BURNER_ADDRESSES =
    "../felina-explorer/src/constants/felinaBurnerContractAddresses.json"

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    TOKEN_NAME,
    TOKEN_SYMBOL,
    INITIAL_SUPPLY,
    BURN_AMOUNT,
    BURNING_INTERVAL,
    TARGET_SUPPLY,
    BLOCK_REWARD,
    SERVER_TOKEN_ABI,
    SERVER_TOKEN_ADDRESSES,
    FRONTEND_TOKEN_ABI,
    FRONTEND_TOKEN_ADDRESSES,
    FRONTEND_BURNER_ABI,
    FRONTEND_BURNER_ADDRESSES,
}
