const { task } = require("hardhat/config")
const {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../../helper-hardhat-config")

task("set-burning-amount", "Sets a new amount of tokens to periodically burn")
    .addParam("amount", "The amount of tokens allow to burn")
    .setAction(async (taskArgs, { ethers }) => {
        const value = taskArgs.amount
        const felinaBurner = await ethers.getContract("FelinaBurner")

        const blockConfirmations = developmentChains.includes(network.name)
            ? 1
            : VERIFICATION_BLOCK_CONFIRMATIONS

        console.log("\n", "\t", `🔥 Setting ${value} tokens as the burning amount`)

        const transactionRespone = await felinaBurner.setBurningAmount(value)

        console.log("\t", "⏳ Waiting for block confirmations, please wait...")

        await transactionRespone.wait(blockConfirmations)

        console.log("\t", "✅ Burning amount set", "\n")
    })
