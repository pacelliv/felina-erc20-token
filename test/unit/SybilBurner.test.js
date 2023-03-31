const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { developmentChains, BURN_AMOUNT, BURNING_INTERVAL } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FelinaBurner Unit Tests", () => {
          const multiplier = 1e18
          let felinaBurner, deployer, interval, burnAmount
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              felinaToken = await ethers.getContract("FelinaToken")
              felinaBurner = await ethers.getContract("FelinaBurner")
              interval = await felinaBurner.getBurningInterval()
              burnAmount = await felinaBurner.getDailyBurnAmount()
              tokenAddress = await felinaBurner.getToken()
              tokenOwner = await felinaBurner.owner()
          })
          describe("constructor", () => {
              it("Sets the interval correctly", async () => {
                  assert.equal(interval.toString(), BURNING_INTERVAL)
              })
              it("Initializes the amount of tokens to burn correctly", async () => {
                  const amount = parseInt(BURN_AMOUNT) * multiplier
                  assert.equal(parseInt(burnAmount.toString()), Number(amount.toString()))
              })
              it("Initializes the instance of the token correctly", async () => {
                  assert.equal(tokenAddress, felinaToken.address)
              })
              it("Sets the owner correctly", async () => {
                  assert.equal(tokenOwner, deployer)
              })
          })

          describe("setBurningAmount", () => {
              it("Sets a new burning rate", async () => {
                  const transactionResponse = await felinaBurner.setBurningAmount("300000")
                  await transactionResponse.wait(1)
                  const burningAmount = await felinaBurner.getDailyBurnAmount()
                  assert.equal(burningAmount.toString(), ethers.utils.parseEther("300000"))
              })
              it("Should revert if an attacker tries to set a new burning rate", async () => {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnected = felinaBurner.connect(attacker)
                  await expect(attackerConnected.setBurningAmount("300000")).to.be.revertedWith(
                      "Ownable: caller is not the owner"
                  )
              })
          })

          describe("setBurningInterval", () => {
              it("Sets a new burning interval", async () => {
                  const transactionResponse = await felinaBurner.setBurningInterval("600")
                  await transactionResponse.wait(1)
                  const newBurningInterval = await felinaBurner.getBurningInterval()
                  assert.equal(newBurningInterval.toString(), "600")
              })
              it("Should revert if an attacker tries to set a new burning interval", async () => {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnected = felinaBurner.connect(attacker)
                  await expect(attackerConnected.setBurningInterval("600")).to.be.revertedWith(
                      "Ownable: caller is not the owner"
                  )
              })
          })

          describe("checkUpkeep", () => {
              it("Should return false if hasTimeElapsed is false and isTargetSupply is true", async () => {
                  const transactionResponse = await felinaToken.burn(
                      ethers.utils.parseEther("500000000")
                  )
                  await transactionResponse.wait(1)
                  const { upkeepNeeded } = await felinaBurner.callStatic.checkUpkeep([])
                  assert(!upkeepNeeded)
              })
              it("Should return false if hasTimeElapsed is false and isTargetSupply is false", async () => {
                  const { upkeepNeeded } = await felinaBurner.callStatic.checkUpkeep([])
                  assert(!upkeepNeeded)
              })
              it("Should return false if hasTimeElapsed is true and isTargetSupply is true", async () => {
                  const transactionResponse = await felinaToken.burn(
                      ethers.utils.parseEther("500000000")
                  )
                  await transactionResponse.wait(1)
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  const { upkeepNeeded } = await felinaBurner.callStatic.checkUpkeep([])
                  assert(!upkeepNeeded)
              })
              it("Should return true if hasTimeElapsed is true and isTargetSupply is false", async () => {
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  const { upkeepNeeded } = await felinaBurner.callStatic.checkUpkeep([])
                  assert(upkeepNeeded)
              })
          })

          describe("performUpkeep", () => {
              beforeEach(async () => {
                  const amount = ethers.utils.parseEther("500000")
                  const transactionResponse = await felinaToken.approve(
                      felinaBurner.address,
                      amount
                  )
                  await transactionResponse.wait(1)
              })
              it("Can only run if upkeepNeeded is true", async () => {
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  const tx = await felinaBurner.performUpkeep([])
                  assert(tx)
              })
              it("Runs and updates the total supply", async () => {
                  const initialSupply = await felinaToken.totalSupply()
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  const tx = await felinaBurner.performUpkeep([])
                  await tx.wait(1)
                  const endingSupply = await felinaToken.totalSupply()
                  const burntAmount = await felinaBurner.totalBurnt()
                  assert.equal(initialSupply.sub(burntAmount).toString(), endingSupply.toString())
              })
              it("Should revert if upkeepNeeded is false", async () => {
                  await expect(felinaBurner.performUpkeep([])).to.be.revertedWithCustomError(
                      felinaBurner,
                      "FelinaBurner__UpkeepNotNeeded"
                  )
              })
              it("Runs and resets the timestamp", async () => {
                  const startingTimestamp = await felinaBurner.getLastTimestamp()
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  const tx = await felinaBurner.performUpkeep([])
                  await tx.wait(1)
                  const endingTimestamp = await felinaBurner.getLastTimestamp()
                  assert(endingTimestamp > startingTimestamp)
              })
          })
      })
