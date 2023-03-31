const { task } = require("hardhat/config")
require("dotenv").config()

task("transfer-logs", "Collects all the logs for the Transfer event of an ERC20").setAction(
    async (_, { ethers }) => {
        const felinaToken = await ethers.getContract("FelinaToken")
        const currentBlock = await ethers.provider.getBlockNumber()
        const provider = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_RPC_URL)
        const filter = {
            address: felinaToken.address,
            topics: [ethers.utils.id("Transfer(address,address,uint256)")],
            fromBlock: currentBlock - 1000000,
            toBlock: currentBlock,
        }

        const logs = await provider.getLogs(filter)

        const parsedLogs = logs.map((log) => felinaToken.interface.parseLog(log))

        console.log(parsedLogs[0])
    }
)
