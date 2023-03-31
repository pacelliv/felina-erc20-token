const { assert } = require("chai")
const {
    developmentChains,
    TOKEN_NAME,
    TOKEN_SYMBOL,
    INITIAL_SUPPLY,
} = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FelinaToken Staging Test", () => {
          const multiplier = 1e18
          let felinaToken, deployer, value
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              felinaToken = await ethers.getContract("FelinaToken", deployer)
              value = ethers.utils.parseEther("20")
          })

          describe("constructor", () => {
              it("Gets the correct name, symbol and totalSupply", async () => {
                  const name = await felinaToken.name()
                  const symbol = await felinaToken.symbol()
                  const totalSupply = await felinaToken.totalSupply()
                  const supply = parseInt(INITIAL_SUPPLY) * multiplier
                  assert.equal(TOKEN_NAME, name)
                  assert.equal(TOKEN_SYMBOL, symbol)
                  assert.equal(parseInt(totalSupply.toString()), Number(supply.toString()))
              })
          })

          describe("transfer and get the balance", () => {
              it("Transfer tokens to a new account and updates the balances", async () => {
                  const initialDeployerBalance = await felinaToken.balanceOf(deployer)
                  const initialRecipientBalance = await felinaToken.balanceOf(
                      "0xa4D65B468642BA258238a2d5175e8d9807eebc84"
                  )
                  const transactionResponse = await felinaToken.transfer(
                      "0xa4D65B468642BA258238a2d5175e8d9807eebc84",
                      value
                  )
                  await transactionResponse.wait(1)
                  const endingDeployerBalance = await felinaToken.balanceOf(deployer)
                  const endingRecipientBalance = await felinaToken.balanceOf(
                      "0xa4D65B468642BA258238a2d5175e8d9807eebc84"
                  )

                  assert.equal(
                      endingRecipientBalance.toString(),
                      initialRecipientBalance.add(value).toString()
                  )
                  assert.equal(
                      endingDeployerBalance.toString(),
                      initialDeployerBalance.sub(value).toString()
                  )
              })
          })
      })
