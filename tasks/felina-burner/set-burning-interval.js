const { task } = require("hardhat/config")
const {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../../helper-hardhat-config")

task("set-burning-interval", "Sets a new interval to burn tokens")
    .addParam("interval", "The interval in seconds in which tokens will be burn")
    .setAction(async (taskArgs, { ethers }) => {
        const interval = taskArgs.interval
        const sybilBurner = await ethers.getContract("SybilBurner")

        const blockConfirmations = developmentChains.includes(network.name)
            ? 1
            : VERIFICATION_BLOCK_CONFIRMATIONS

        console.log("\n", "\t", `🔥 Setting ${interval} seconds as the new burning interval`, "\n")

        const transactionRespone = await sybilBurner.setBurningInterval(interval.toString())

        console.log("\t", "⏳ Waiting for block confirmations, please wait...")

        await transactionRespone.wait(blockConfirmations)

        console.log("\t", "✅ Burning interval set", "\n")
    })
