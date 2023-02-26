const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

if (!developmentChains.includes(network.name)) {
  describe.skip;
} else {
  describe("Airdrop", () => {
    let deployer, airdrop, tokenSupply;

    beforeEach(async () => {
      await deployments.fixture(["all"]);
      deployer = (await getNamedAccounts()).deployer;

      airdrop = await ethers.getContract("Airdrop", deployer);
      vesting_token = await ethers.getContract("Vesting", deployer);

      tokenSupply = await vesting_token.totalSupply();
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
    });

    describe("claim", async () => {
      context("has enough tokens to airdrop", async () => {
        beforeEach(async () => {
          vesting_token.transfer(
            airdrop.address,
            await vesting_token.balanceOf(deployer)
          );
        });

        it("should revert if the caller has already claimed", async () => {
          await airdrop.claim();
          await expect(airdrop.claim()).to.be.revertedWith(
            "Airdrop already claimed"
          );
        });

        it("should transfer tokens to caller if the caller has not claimed", async () => {
          await airdrop.claim();
          const balance = await vesting_token.balanceOf(deployer);
          expect(balance).to.equal(await airdrop.s_amountToAirdrop());
        });
      });

      context("no more tokens to airdrop", async () => {
        beforeEach(async () => {
          await airdrop.withdraw();
        });

        it("should revert", async () => {
          await expect(airdrop.claim()).to.be.revertedWith(
            "No more tokens to airdrop"
          );
        });
      });
    });

    describe("isClaimed", async () => {
      beforeEach(async () => {
        vesting_token.transfer(
          airdrop.address,
          await vesting_token.balanceOf(deployer)
        );
      });

      it("should return false if the caller has not claimed", async () => {
        const claimed = await airdrop.isClaimed(deployer);
        expect(claimed).to.be.false;
      });

      it("should return true if the caller has claimed", async () => {
        await airdrop.claim();
        const claimed = await airdrop.isClaimed(deployer);
        expect(claimed).to.be.true;
      });
    });
  });
}
