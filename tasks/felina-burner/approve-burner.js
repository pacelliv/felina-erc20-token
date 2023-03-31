const { task } = require("hardhat/config")
const {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../../helper-hardhat-config")

task("approve-burner", "Sets the allowance of tokens the burner contract will periodically burn")
    .addParam("allowance", "The amount of tokens allow to burn")
    .setAction(async (taskArgs, { ethers }) => {
        const value = ethers.utils.parseEther(taskArgs.allowance)
        const felinaToken = await ethers.getContract("FelinaToken")
        const felinaBurner = await ethers.getContract("FelinaBurner")

        const blockConfirmations = developmentChains.includes(network.name)
            ? 1
            : VERIFICATION_BLOCK_CONFIRMATIONS

        console.log(
            "\n",
            "\t",
            `🏧 Approving ${ethers.utils.formatEther(value)} tokens as allowance for ${
                felinaBurner.address
            }`
        )

        const transactionRespone = await felinaToken.approve(felinaBurner.address, value)

        console.log("\t", "⏳ Waiting for block confirmations, please wait...")

        await transactionRespone.wait(blockConfirmations)

        console.log("\t", "✅ Burner contract approved as a spender", "\n")
    })
