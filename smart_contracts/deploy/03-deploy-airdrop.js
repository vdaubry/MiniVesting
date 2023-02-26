const { network, ethers } = require("hardhat");
const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  /***********************************
   *
   * Deploy smart contract
   *
   ************************************/

  log("---------------------------------");
  log(`Deploy Airdrop with owner : ${deployer}`);

  const vestingToken = await ethers.getContract("Vesting", deployer);
  const tokenSupply = await vestingToken.totalSupply();
  const amountToAirdrop = tokenSupply.div(100_000); // 0.001% of total supply
  const arguments = [vestingToken.address, amountToAirdrop];
  const airdrop = await deploy("Airdrop", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  });

  vestingToken.transfer(airdrop.address, tokenSupply);

  /***********************************
   *
   * Verify the deployment
   *
   ************************************/
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(airdrop.address, arguments);
  }
  log("----------------------------------------------------");
};

module.exports.tags = ["all", "airdrop"];
