const {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    TOKEN_NAME,
    TOKEN_SYMBOL,
    INITIAL_SUPPLY,
    TARGET_SUPPLY,
    BLOCK_REWARD,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    const blockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    const args = [TOKEN_NAME, TOKEN_SYMBOL, INITIAL_SUPPLY, TARGET_SUPPLY, BLOCK_REWARD]

    const felinaToken = await deploy("FelinaToken", {
        from: deployer,
        args,
        log: true,
        waitConfirmations: blockConfirmations,
    })
    log("--------------------------------------------------------------------")

    if (
        !developmentChains.includes(network.name) &&
        (process.env.POLYGONSCAN_API_KEY || process.env.ETHERSCAN_API_KEY)
    ) {
        await verify(felinaToken.address, args)
        log("--------------------------------------------------------------------")
    }
}

module.exports.tags = ["all", "token"]
