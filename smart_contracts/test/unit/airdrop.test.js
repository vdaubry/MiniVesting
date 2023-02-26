const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

if (!developmentChains.includes(network.name)) {
  describe.skip;
} else {
  describe.only("Airdrop", () => {
    let deployer, airdrop, tokenSupply;

    beforeEach(async () => {
      await deployments.fixture(["all"]);
      deployer = (await getNamedAccounts()).deployer;

      airdrop = await ethers.getContract("Airdrop", deployer);
      vesting_token = await ethers.getContract("Vesting", deployer);

      tokenSupply = await vesting_token.totalSupply();
      vesting_token.transfer(airdrop.address, tokenSupply);
    });

    describe("constructor", async () => {
      it("should set token address", async () => {
        const token = await airdrop.s_tokenToAirdrop();
        expect(token).to.equal(vesting_token.address);
      });

      it("should set amount to airdrop", async () => {
        const expectedAmount = tokenSupply.div(100_000);
        const amount = await airdrop.s_amountToAirdrop();
        expect(amount).to.equal(expectedAmount);
      });

      it("should transfer token supply to airdrop contract", async () => {
        const balance = await vesting_token.balanceOf(airdrop.address);
        expect(balance).to.equal(tokenSupply);
      });
    });
  });
}
