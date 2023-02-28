const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

if (!developmentChains.includes(network.name)) {
  describe.skip;
} else {
  describe("vesting", () => {
    let deployer, airdrop;

    beforeEach(async () => {
      await deployments.fixture(["all"]);
      deployer = (await getNamedAccounts()).deployer;

      vesting = await ethers.getContract("Vesting", deployer);
      airdrop = await ethers.getContract("Airdrop", deployer);
    });

    describe("constructor", async () => {
      const expectedTotalSupply = ethers.utils.parseUnits(
        (150 * 10 ** 9).toString(),
        18
      ); // 150 billion (18 decimals)

      it("should update total supply", async () => {
        const totalSupply = await vesting.totalSupply();
        expect(totalSupply).to.equal(expectedTotalSupply);
      });

      it("should update name", async () => {
        const name = await vesting.name();
        expect(name).to.equal("My Vesting");
      });

      it("should update symbol", async () => {
        const symbol = await vesting.symbol();
        expect(symbol).to.equal("VESTING");
      });

      it("should mint all tokens to airdrop contract", async () => {
        const balance = await vesting.balanceOf(airdrop.address);
        expect(balance).to.equal(expectedTotalSupply);
      });
    });
  });
}
