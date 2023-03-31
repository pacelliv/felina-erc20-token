const { expect, assert } = require("chai")
const { getNamedAccounts, ethers, deployments, network } = require("hardhat")
const {
    developmentChains,
    INITIAL_SUPPLY,
    TOKEN_NAME,
    TOKEN_SYMBOL,
    TARGET_SUPPLY,
    BLOCK_REWARD,
} = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FelinaToken Unit Tests", () => {
          const multiplier = 1e18
          let felinaToken, deployer, user1, felinaTokenUser1
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              user1 = (await getNamedAccounts()).user1
              await deployments.fixture(["token"])
              felinaToken = await ethers.getContract("FelinaToken", deployer)
          })

          describe("constructor", () => {
              it("Mints the correct amount of tokens", async () => {
                  const totalSupply = await felinaToken.totalSupply()
                  const supply = parseInt(INITIAL_SUPPLY) * multiplier
                  assert.equal(parseInt(totalSupply.toString()), Number(supply.toString()))
              })
              it("Sets the name and the symbol correctly", async () => {
                  expect(await felinaToken.name()).to.equal(TOKEN_NAME)
                  expect(await felinaToken.symbol()).to.equal(TOKEN_SYMBOL)
              })
              it("Allocates the total supply to the creator", async () => {
                  assert.equal(
                      (await felinaToken.totalSupply()).toString(),
                      (await felinaToken.balanceOf(deployer)).toString()
                  )
              })
              it("Sets the block reward correctly", async () => {
                  const blockReward = await felinaToken.getBlockReward()
                  assert.equal(blockReward.toString(), parseInt(BLOCK_REWARD) * multiplier)
              })
          })

          describe("transfers", () => {
              it("Should allow to transfer tokens", async () => {
                  const value = ethers.utils.parseEther("10")
                  const transactionResponse = await felinaToken.transfer(user1, value.toString())
                  await transactionResponse.wait(1)
                  expect((await felinaToken.balanceOf(user1)).toString()).to.equal(value.toString())
              })
              it("Should emit event on transfering tokens", async () => {
                  const value = ethers.utils.parseEther("10")
                  await expect(felinaToken.transfer(user1, value.toString()))
                      .to.emit(felinaToken, "Transfer")
                      .withArgs(deployer, user1, value)
              })
              it("Should transfer the block reward and updates the balances", async () => {
                  const initialDeployerBalance = await felinaToken.balanceOf(deployer)
                  const value = ethers.utils.parseEther("10")
                  const transactionResponse = await felinaToken.transfer(user1, value.toString())
                  await transactionResponse.wait(1)
                  const amountTransfered = ethers.utils.parseEther("15")
                  const coinbaseAddress = await network.provider.send("eth_coinbase")
                  const coinbaseBalance = await felinaToken.balanceOf(coinbaseAddress)
                  const endingDeployerBalance = await felinaToken.balanceOf(deployer)
                  assert.equal(coinbaseBalance.toString(), parseInt(BLOCK_REWARD) * multiplier)
                  assert.equal(
                      endingDeployerBalance.toString(),
                      initialDeployerBalance.sub(amountTransfered).toString()
                  )
              })
              it("Should not send reward to coinbase address if reward is zero", async () => {
                  const setBlockRewardTxResponse = await felinaToken.setBlockReward("0")
                  await setBlockRewardTxResponse.wait(1)
                  const initialDeployerBalance = await felinaToken.balanceOf(deployer)
                  const value = ethers.utils.parseEther("10")
                  const transactionResponse = await felinaToken.transfer(user1, value.toString())
                  await transactionResponse.wait(1)
                  const coinbase = await network.provider.send("eth_coinbase")
                  const coinbaseBalance = await felinaToken.balanceOf(coinbase)
                  const endingDeployerBalance = await felinaToken.balanceOf(deployer)
                  assert.equal(coinbaseBalance.toString(), 0)
                  assert.equal(
                      endingDeployerBalance.toString(),
                      initialDeployerBalance.sub(value).toString()
                  )
              })
          })

          describe("allowances", () => {
              const value = (20 * multiplier).toString()
              beforeEach(async () => {
                  felinaTokenUser1 = await ethers.getContract("FelinaToken", user1)
              })
              it("Should approve other addresses to spend tokens", async () => {
                  const tokensToSpend = ethers.utils.parseEther("10")
                  await felinaToken.approve(user1, tokensToSpend)
                  const tokenUser1 = await ethers.getContract("FelinaToken", user1)
                  await tokenUser1.transferFrom(deployer, user1, tokensToSpend)
                  expect((await tokenUser1.balanceOf(user1)).toString()).to.equal(
                      tokensToSpend.toString()
                  )
              })
              it("Should emit event on approval", async () => {
                  const tokensToSpend = ethers.utils.parseEther("10")
                  await expect(felinaToken.approve(user1, tokensToSpend))
                      .to.emit(felinaToken, "Approval")
                      .withArgs(deployer, user1, tokensToSpend)
              })
              it("Set the allowance correctly", async () => {
                  await felinaToken.approve(user1, value)
                  const allowance = await felinaToken.allowance(deployer, user1)
                  assert.equal(allowance.toString(), value)
              })
              it("Won't allow spender to go over the allowance", async () => {
                  await felinaToken.approve(user1, value)
                  await expect(
                      felinaTokenUser1.transferFrom(deployer, user1, (40 * multiplier).toString())
                  ).to.be.revertedWith("FEL: Value exceeds the remaining allowance")
              })
          })

          describe("increaseAllowance", () => {
              const allowance = ethers.utils.parseEther("10")
              beforeEach(async () => {
                  const transactionResponse = await felinaToken.approve(user1, allowance)
                  await transactionResponse.wait(1)
              })
              it("Increases the allowance granted by the caller to the spender", async () => {
                  const transactionResponse = await felinaToken.increaseAllowance(user1, allowance)
                  await transactionResponse.wait(1)
                  const user1Allowance = await felinaToken.allowance(deployer, user1)
                  assert.equal(user1Allowance.toString(), ethers.utils.parseEther("20").toString())
              })

              it("Emits event on increasing the allowance", async () => {
                  await expect(felinaToken.increaseAllowance(user1, allowance))
                      .to.emit(felinaToken, "Approval")
                      .withArgs(deployer, user1, ethers.utils.parseEther("20").toString())
              })
          })

          describe("decreaseAllowance", () => {
              const allowance = ethers.utils.parseEther("20")
              const substractedValue = ethers.utils.parseEther("5")
              beforeEach(async () => {
                  const transactionResponse = await felinaToken.approve(user1, allowance)
                  await transactionResponse.wait(1)
              })
              it("Decreases the allowance granted by the caller to the spender", async () => {
                  const transactionResponse = await felinaToken.decreaseAllowance(
                      user1,
                      substractedValue
                  )
                  await transactionResponse.wait(1)
                  const user1Allowance = await felinaToken.allowance(deployer, user1)
                  assert.equal(user1Allowance.toString(), ethers.utils.parseEther("15").toString())
              })
              it("Emits event on decreasing the allowance", async () => {
                  await expect(felinaToken.decreaseAllowance(user1, substractedValue))
                      .to.emit(felinaToken, "Approval")
                      .withArgs(deployer, user1, ethers.utils.parseEther("15").toString())
              })
              it("Should revert if the substracted value exceeds the allowance", async () => {
                  await expect(
                      felinaToken.decreaseAllowance(user1, ethers.utils.parseEther("50"))
                  ).to.be.revertedWith("FEL: Cannot decrease allowance to a negative value")
              })
          })

          describe("burn", () => {
              it("Allows to burn", async () => {
                  const amount = ethers.utils.parseEther("20")
                  const initialTotalSupply = await felinaToken.totalSupply()
                  await felinaToken.burn(amount)
                  const endingTotalSupply = await felinaToken.totalSupply()
                  expect(endingTotalSupply.toString()).to.equal(
                      initialTotalSupply.sub(amount).toString()
                  )
              })
              it("Emits event on burn", async () => {
                  const amount = ethers.utils.parseEther("20")
                  await expect(felinaToken.burn(amount))
                      .to.emit(felinaToken, "Burn")
                      .withArgs(deployer, amount)
              })
              it("Should revert is the target supply has been reached", async () => {
                  await felinaToken.burn(ethers.utils.parseEther("500000000"))
                  await expect(felinaToken.burn(ethers.utils.parseEther("500"))).to.be.revertedWith(
                      "FEL: Cannot burn more tokens"
                  )
              })
          })

          describe("BurnFrom", () => {
              let felinaTokenUser1, tokensToSpend
              beforeEach(async () => {
                  tokensToSpend = ethers.utils.parseEther("100")
                  await felinaToken.approve(user1, tokensToSpend)
                  felinaTokenUser1 = await ethers.getContract("FelinaToken", user1)
              })
              it("Allows to burn from another account", async () => {
                  const initialTotalSupply = await felinaToken.totalSupply()
                  await felinaTokenUser1.burnFrom(deployer, tokensToSpend)
                  const endingTotalSupply = await felinaToken.totalSupply()
                  assert.equal(
                      endingTotalSupply.toString(),
                      initialTotalSupply.sub(tokensToSpend).toString()
                  )
              })
              it("Won't allow to burn more than the allowance", async () => {
                  await expect(
                      felinaTokenUser1.burnFrom(deployer, ethers.utils.parseEther("200"))
                  ).to.be.revertedWith("FEL: Value exceeds the remaining allowance")
              })
              it("Should revert if the target supply has been reached", async () => {
                  await felinaToken.burn(ethers.utils.parseEther("500000000"))
                  await expect(
                      felinaTokenUser1.burnFrom(deployer, tokensToSpend)
                  ).to.be.revertedWith("FEL: Cannot burn more tokens")
              })
          })

          describe("decimals", () => {
              it("Fetch the amount of decimals of the token", async () => {
                  const decimals = await felinaToken.decimals()
                  assert.equal(decimals, 18)
              })
          })

          describe("getTargetSupply", () => {
              it("Should return the target supply of tokens", async () => {
                  const targetSupply = await felinaToken.getTargetSupply()
                  assert.equal(targetSupply.toString(), ethers.utils.parseEther(TARGET_SUPPLY))
              })
          })
      })
