const { task } = require("hardhat/config")

task("blockTimestamp", "Prints the block timestamp").setAction(async (_, { ethers }) => {
    const [deployer, user1] = await ethers.getSigners()
    const sybilFaucet = await ethers.getContract("SybilFaucet")
    const user1Connected = sybilFaucet.connect(user1)
    console.log(user1.address)
    //await user1Connected.requestTokens()
    let newTime
    const time = await sybilFaucet.getLastTime(user1.address)
    console.log(time.toString())
    // const currentBlock = await ethers.provider.getBlockNumber()
    // const blockTimestamp = (await ethers.provider.getBlock(8459240)).timestamp
    // // console.log(blockTimestamp)
    // const date = new Date(blockTimestamp * 1000) // Date requires ms, whereas block.timestamp is in s
    // const seconds = date.getSeconds()
    // console.log(seconds)
    // 1675990110

    const timer = async () => {
        const newTime = await sybilFaucet.getLastTime(user1.address)
        console.log(Number(newTime.toString()) + 1 - Number(time).toString())
    }
    setInterval(async () => timer(), 1000)
})
