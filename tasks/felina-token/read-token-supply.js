const { task } = require("hardhat/config")

task("read-token-supply", "Reads the current supply of Felina tokens").setAction(
    async (_, { ethers }) => {
        const felinaToken = await ethers.getContract("FelinaToken")

        const totalSupply = await felinaToken.totalSupply()

        console.log(
            "\n",
            "\t",
            `📊 The current supply of tokens is ${ethers.utils.formatEther(
                totalSupply.toString()
            )} FEL tokens`,
            "\n"
        )
    }
)
