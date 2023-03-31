const { task } = require("hardhat/config")

task("read-account-allowance", "Reads the remaining allowance of a spender")
    .addParam("spender", "The address of the account you want to query")
    .addParam("owner", "The address of the owner of the tokens")
    .setAction(async (taskArgs, { ethers }) => {
        const spender = taskArgs.spender
        const owner = taskArgs.owner

        const felinaToken = await ethers.getContract("FelinaToken")

        const allowance = await felinaToken.allowance(owner, spender)

        console.log(
            "\n",
            "\t",
            `💵 The remaining allowance for ${spender} is ${ethers.utils.formatEther(
                allowance.toString()
            )} FEL tokens`,
            "\n"
        )
    })
