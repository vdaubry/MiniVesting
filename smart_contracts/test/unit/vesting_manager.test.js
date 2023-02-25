const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

if (!developmentChains.includes(network.name)) {
  describe.skip;
} else {
  describe("VestingManager", () => {
    let deployer, vesting, vesting_manager;

    beforeEach(async () => {
      await deployments.fixture(["all"]);
      deployer = (await getNamedAccounts()).deployer;

      vesting_token = await ethers.getContract("Vesting", deployer);
      vesting_manager = await ethers.getContract("VestingManager", deployer);

      await vesting_token.approve(
        vesting_manager.address,
        ethers.constants.MaxInt256
      );
    });

    describe("constructor", async () => {
      it("should update vesting contract", async () => {
        const vested_token = await vesting_manager.s_tokenToVest();
        expect(vested_token).to.equal(vesting_token.address);
      });
    });

    describe("addInvestor", async () => {
      const start = new Date("2022-06-13").getTime();
      const cliff = 60 * 60 * 24 * 30; // 30 days
      const duration = 60 * 60 * 24 * 365; // 365 days

      it("should add investor config", async () => {
        const investedAmount = ethers.utils.parseUnits("100", 18);

        await vesting_manager.addInvestor(
          deployer,
          investedAmount,
          start,
          cliff,
          duration
        );

        const investorConfig = await vesting_manager.getInvestorConfig(
          deployer
        );

        expect(investorConfig.amount).to.equal(investedAmount);
        expect(investorConfig.start).to.equal(start);
        expect(investorConfig.cliff).to.equal(cliff);
        expect(investorConfig.duration).to.equal(duration);
        expect(investorConfig.released).to.equal(0);
      });

      it("should revert when amount is zero", async () => {
        const investedAmount = ethers.utils.parseUnits("0", 18);

        await expect(
          vesting_manager.addInvestor(
            deployer,
            investedAmount,
            start,
            cliff,
            duration
          )
        ).to.be.revertedWith("Vesting: _amount is 0");
      });
    });
  });
}
