const {
    developmentChains,
    BURN_AMOUNT,
    BURNING_INTERVAL,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    const felinaToken = await ethers.getContract("FelinaToken", deployer)
    const blockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    const felinaBurner = await deploy("FelinaBurner", {
        from: deployer,
        args: [BURN_AMOUNT, BURNING_INTERVAL, felinaToken.address],
        log: true,
        waitConfirmations: blockConfirmations,
    })

    log("--------------------------------------------------------------------")

    if (
        !developmentChains.includes(network.name) &&
        (process.env.POLYGONSCAN_API_KEY || process.env.ETHERSCAN_API_KEY)
    ) {
        await verify(felinaBurner.address, [BURN_AMOUNT, BURNING_INTERVAL, felinaToken.address])
        log("--------------------------------------------------------------------")
    }
}

module.exports.tags = ["all", "burner"]
