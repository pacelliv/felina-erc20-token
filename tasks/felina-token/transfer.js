const { task } = require("hardhat/config")
const {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../../helper-hardhat-config")

task("transfer", "Calls the transfer method to send tokens to an account")
    .addParam("to", "The address of the account to send Felina tokens")
    .addParam("value", "The amount of tokens to transfer")
    .setAction(async (taskArgs, { ethers }) => {
        const account = taskArgs.to
        const value = ethers.utils.parseEther(taskArgs.value)
        const felinaToken = await ethers.getContract("FelinaToken")

        const blockConfirmations = developmentChains.includes(network.name)
            ? 1
            : VERIFICATION_BLOCK_CONFIRMATIONS

        console.log(
            "\n",
            "\t",
            `📲 Transfering ${ethers.utils.formatEther(value)} Felina tokens to ${account}`
        )

        const transactionRespone = await felinaToken.transfer(account, value, {
            gasLimit: 100000,
        })

        console.log("\t", "⏳ Waiting for block confirmations, please wait...")

        await transactionRespone.wait(blockConfirmations)

        console.log("\t", "✅ Tokens transfered", "\n")
    })
