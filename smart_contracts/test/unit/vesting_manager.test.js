const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

if (!developmentChains.includes(network.name)) {
  describe.skip;
} else {
  describe("VestingManager", () => {
    let deployer, vesting, vesting_manager, investorConfig, initialBalance;

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
      const cliff = 60 * 60 * 24 * 30 * 1000; // 30 days
      const duration = 60 * 60 * 24 * 365 * 1000; // 365 days

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

      it("should transfer tokens to vesting manager", async () => {
        const initialDeployerBalance = await vesting_token.balanceOf(deployer);
        const investedAmount = ethers.utils.parseUnits("100", 18);

        await vesting_manager.addInvestor(
          deployer,
          investedAmount,
          start,
          cliff,
          duration
        );

        const balance = await vesting_token.balanceOf(vesting_manager.address);
        expect(balance).to.equal(investedAmount);

        const finalDeployerBalance = await vesting_token.balanceOf(deployer);
        expect(finalDeployerBalance).to.equal(
          initialDeployerBalance.sub(investedAmount)
        );
      });
    });

    describe("vestedAmount", async () => {
      const investedAmount = ethers.utils.parseUnits("730", 18);
      const start = new Date("2022-06-13").getTime();
      const cliff = 60 * 60 * 24 * 30 * 1000; // 30 days
      const duration = 60 * 60 * 24 * 365 * 1000; // 365 days

      beforeEach(async () => {
        await vesting_manager.addInvestor(
          deployer,
          investedAmount,
          start,
          cliff,
          duration
        );
      });

      it("should return 0 when current time is before start", async () => {
        const now = new Date("2022-01-01").getTime();

        const vestedAmount = await vesting_manager.vestedAmount(now, deployer);

        expect(vestedAmount).to.equal(0);
      });

      it("should return 0 when current time is before cliff", async () => {
        const now = new Date("2022-07-12").getTime();

        const vestedAmount = await vesting_manager.vestedAmount(now, deployer);

        expect(vestedAmount).to.equal(0);
      });

      it("should return token 1 day after cliff", async () => {
        const now = new Date("2022-07-14").getTime();

        const vestedAmount = await vesting_manager.vestedAmount(now, deployer);

        expect(vestedAmount).to.equal(ethers.utils.parseUnits("2", 18));
      });

      it("should return token 30 days after cliff", async () => {
        const now = new Date("2022-08-13").getTime();

        const vestedAmount = await vesting_manager.vestedAmount(now, deployer);

        expect(vestedAmount).to.equal(ethers.utils.parseUnits("62", 18));
      });

      it("should return all tokens after vested period is over", async () => {
        const now = new Date("2023-07-13").getTime();

        const vestedAmount = await vesting_manager.vestedAmount(now, deployer);

        expect(vestedAmount).to.equal(investedAmount);
      });
    });

    describe("release", async () => {
      const investedAmount = ethers.utils.parseUnits("730", 18);
      const start = new Date("2022-06-13").getTime();
      const cliff = 60 * 60 * 24 * 30 * 1000; // 30 days
      const duration = 60 * 60 * 24 * 365 * 1000; // 365 days

      beforeEach(async () => {
        await vesting_manager.addInvestor(
          deployer,
          investedAmount,
          start,
          cliff,
          duration
        );
      });

      context("when investor has not released any token", async () => {
        context("when no tokens are due", async () => {
          it("should revert ", async () => {
            await time.increaseTo(new Date("2022-06-13").getTime());

            await expect(vesting_manager.release(deployer)).to.be.revertedWith(
              "Vesting: no tokens are due"
            );
          });
        });

        context("when tokens are due", async () => {
          beforeEach(async () => {
            await time.increaseTo(new Date("2022-08-13").getTime());
            initialBalance = await vesting_token.balanceOf(deployer);
            await vesting_manager.release(deployer);
            investorConfig = await vesting_manager.getInvestorConfig(deployer);
          });

          it("updates investor total released tokens ", async () => {
            expect(investorConfig.released).to.equal("62000000023148148148");
          });

          it("transfers tokens to investor", async () => {
            const currentBalance = await vesting_token.balanceOf(deployer);
            expect(currentBalance).to.equal(
              initialBalance.add(investorConfig.released)
            );
          });
        });
      });
    });
  });
}
