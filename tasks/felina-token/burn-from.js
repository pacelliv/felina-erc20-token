const { task } = require("hardhat/config")
const {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../../helper-hardhat-config")

task(
    "burn-from",
    "Calls the burnFrom method to remove tokens from circulation on behalf of the owner"
)
    .addParam("spender", "The address of the spender of tokens")
    .addParam("owner", "The address of the owner of the tokens")
    .addParam("value", "The amount of tokens to burn")
    .setAction(async (taskArgs, { ethers }) => {
        const spender = await ethers.getSigner(taskArgs.spender)
        const owner = taskArgs.owner
        const value = ethers.utils.parseEther(taskArgs.value)
        const felinaToken = await ethers.getContract("FelinaToken")
        const spenderConnected = felinaToken.connect(spender)

        const blockConfirmations = developmentChains.includes(network.name)
            ? 1
            : VERIFICATION_BLOCK_CONFIRMATIONS

        console.log(
            "\n",
            "\t",
            `🔥 Burning ${ethers.utils.formatEther(value)} Felina tokens from ${owner}`
        )

        const transactionRespone = await spenderConnected.burnFrom(owner, value)

        console.log("\t", "⏳ Waiting for block confirmations, please wait...")

        await transactionRespone.wait(blockConfirmations)

        console.log("\t", "✅ Burn completed", "\n")
    })
