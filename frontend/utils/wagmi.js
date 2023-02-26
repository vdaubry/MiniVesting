import { mainnet, polygon, arbitrum, hardhat, goerli } from "wagmi/chains";
import { getDefaultClient } from "connectkit";
import { createClient } from "wagmi";

const chains = [hardhat, mainnet, polygon, arbitrum, goerli];

export const client = createClient(
  getDefaultClient({
    autoConnect: true,
    appName: "MiniVesting",
    chains,
  })
);
