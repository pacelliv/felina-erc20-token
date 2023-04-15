const { task } = require("hardhat/config")

task(
    "read-burning-amount",
    "Reads the amount tokens that are being burned by the contract"
).setAction(async (_, { ethers }) => {
    const felinaBurner = await ethers.getContract("FelinaBurner")

    const burningAmount = await felinaBurner.dailyBurnAmount()

    console.log(
        "\n",
        "\t",
        `🔥 The contract burns ${ethers.utils.formatEther(
            burningAmount.toString()
        )} SYL tokens every 24hrs`,
        "\n"
    )
})
