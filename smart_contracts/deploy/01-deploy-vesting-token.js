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
  log(`Deploy VESTING with owner : ${deployer}`);

  const tokenSupply = ethers.utils.parseUnits((150 * 10 ** 9).toString(), 18); // 150 billion (18 decimals)
  const arguments = [deployer, tokenSupply];
  await deploy("Vesting", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: waitBlockConfirmations,
    gasPrice: ethers.utils.parseUnits("200", "gwei"), //adjust if ProviderError: transaction underpriced
    gasLimit: 500000,
  });

  const vestingToken = await ethers.getContract("Vesting", deployer);
  const balance = await vestingToken.balanceOf(deployer);
  console.log(`Deployer Got ${balance.toString()} tokens`);

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
    await verify(vestingToken.address, arguments);
  }
  log("----------------------------------------------------");
};

module.exports.tags = ["all", "vesting"];
