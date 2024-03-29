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
  log(`Deploy VESTING Manager with owner : ${deployer}`);

  const vesting = await ethers.getContract("Vesting", deployer);
  const arguments = [vesting.address];
  const vesting_manager = await deploy("VestingManager", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: waitBlockConfirmations,
    gasPrice: ethers.utils.parseUnits("200", "gwei"), //adjust if ProviderError: transaction underpriced
    gasLimit: 500000,
  });

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
    await verify(vesting_manager.address, arguments);
  }
  log("----------------------------------------------------");
};

module.exports.tags = ["all", "vesting_manager"];
