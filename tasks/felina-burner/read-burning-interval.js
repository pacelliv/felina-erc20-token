const { task } = require("hardhat/config")

task(
    "read-burning-interval",
    "Reads the interval in seconds in which tokens are being burned by the burner contract"
).setAction(async (_, { ethers }) => {
    const felinaBurner = await ethers.getContract("FelinaBurner")

    const burningAmount = await felinaBurner.burningInterval()

    console.log("\n", "\t", `🔥 Tokens are burned every ${burningAmount} seconds`, "\n")
})
