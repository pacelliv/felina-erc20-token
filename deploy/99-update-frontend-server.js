const { ethers, network } = require("hardhat")
const fs = require("fs")
const {
    FRONTEND_TOKEN_ABI,
    SERVER_TOKEN_ABI,
    FRONTEND_TOKEN_ADDRESSES,
    SERVER_TOKEN_ADDRESSES,
    FRONTEND_BURNER_ABI,
    FRONTEND_BURNER_ADDRESSES,
} = require("../helper-hardhat-config")
require("dotenv").config()

module.exports = async () => {
    const UPDATE_FRONTEND = false
    let felinaToken, felinaBurner, chainId

    if (UPDATE_FRONTEND) {
        console.log("Updating frontend and server folders...")

        felinaToken = await ethers.getContract("FelinaToken")
        felinaBurner = await ethers.getContract("FelinaBurner")
        chainId = network.config.chainId

        await updateAbiFiles()
        await updateFrontendTokenAddressesFile()
        await updateServerTokenAddressesFile()
        await updateFrontendBurnerAddressesFile()

        console.log("Frontend and server folders updated!")
    }

    async function updateAbiFiles() {
        fs.writeFileSync(
            FRONTEND_TOKEN_ABI,
            felinaToken.interface.format(ethers.utils.FormatTypes.json)
        )
        fs.writeFileSync(
            SERVER_TOKEN_ABI,
            felinaToken.interface.format(ethers.utils.FormatTypes.json)
        )
        fs.writeFileSync(
            FRONTEND_BURNER_ABI,
            felinaBurner.interface.format(ethers.utils.FormatTypes.json)
        )
    }

    async function updateFrontendTokenAddressesFile() {
        const currentTokenAddresses = JSON.parse(fs.readFileSync(FRONTEND_TOKEN_ADDRESSES, "utf8"))

        if (chainId in currentTokenAddresses) {
            if (!currentTokenAddresses[chainId].includes(felinaToken.address)) {
                currentTokenAddresses[chainId].push(felinaToken.address)
            }
        } else {
            currentTokenAddresses[chainId] = [felinaToken.address]
        }

        fs.writeFileSync(FRONTEND_TOKEN_ADDRESSES, JSON.stringify(currentTokenAddresses))
    }

    async function updateServerTokenAddressesFile() {
        const currentTokenAddresses = JSON.parse(fs.readFileSync(SERVER_TOKEN_ADDRESSES, "utf8"))

        if (chainId in currentTokenAddresses) {
            if (!currentTokenAddresses[chainId].includes(felinaToken.address)) {
                currentTokenAddresses[chainId].push(felinaToken.address)
            }
        } else {
            currentTokenAddresses[chainId] = [felinaToken.address]
        }

        fs.writeFileSync(SERVER_TOKEN_ADDRESSES, JSON.stringify(currentTokenAddresses))
    }

    async function updateFrontendBurnerAddressesFile() {
        const currentBurnerAddresses = JSON.parse(
            fs.readFileSync(FRONTEND_BURNER_ADDRESSES, "utf8")
        )

        if (chainId in currentBurnerAddresses) {
            if (!currentBurnerAddresses[chainId].includes(felinaBurner.address)) {
                currentBurnerAddresses[chainId].push(felinaBurner.address)
            }
        } else {
            currentBurnerAddresses[chainId] = [felinaBurner.address]
        }

        fs.writeFileSync(FRONTEND_BURNER_ADDRESSES, JSON.stringify(currentBurnerAddresses))
    }
}

module.exports.tags = ["all"]
