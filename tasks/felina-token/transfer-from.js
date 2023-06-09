const { task } = require("hardhat/config")
const {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../../helper-hardhat-config")

task(
    "transfer-from",
    "Calls the transferFrom method to transfer tokens to an account on behalf of the owner"
)
    .addParam("spender", "The address of the spender of tokens")
    .addParam("owner", "The address of the owner of the tokens")
    .addParam("to", "The address of the account to send Felina tokens")
    .addParam("value", "The amount of tokens to transfer")
    .setAction(async (taskArgs, { ethers }) => {
        const spender = await ethers.getSigner(taskArgs.spender)
        const owner = taskArgs.owner
        const to = taskArgs.to
        const value = ethers.utils.parseEther(taskArgs.value)
        const felinaToken = await ethers.getContract("SybilToken")
        const spenderConnected = felinaToken.connect(spender)

        const blockConfirmations = developmentChains.includes(network.name)
            ? 1
            : VERIFICATION_BLOCK_CONFIRMATIONS

        console.log(
            "\n",
            "\t",
            `📲 Transfering ${ethers.utils.formatEther(
                value
            )} Felina tokens to ${to} from ${owner}`,
            "\n"
        )

        const transactionRespone = await spenderConnected.transferFrom(owner, to, value)

        console.log("\t", "⏳ Waiting for block confirmations, please wait...")

        await transactionRespone.wait(blockConfirmations)

        console.log("\t", "✅ Tokens transfered", "\n")
    })
