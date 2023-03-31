const { task } = require("hardhat/config")

task("read-account-balance", "Reads the balance of Felina tokens in an account")
    .addParam("account", "The address of the account you want to query")
    .setAction(async (taskArgs, { ethers }) => {
        const account = taskArgs.account

        const felinaToken = await ethers.getContract("FelinaToken")

        const balance = await felinaToken.balanceOf(account)

        console.log(
            "\n",
            "\t",
            `💰 The balance of ${account} is ${ethers.utils.formatEther(
                balance.toString()
            )} FEL tokens`,
            "\n"
        )
    })
