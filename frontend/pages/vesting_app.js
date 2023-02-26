import AppHeader from "@/components/AppHeader";
import VestingDetails from "@/components/VestingDetails";

import { useNetwork, useAccount, useContractRead } from "wagmi";
import { airdropAbi, contractAddresses } from "../constants";

export default function VestingApp() {
  const { chain } = useNetwork();
  const { address: account, isConnected } = useAccount();

  let airdropAddress;
  if (chain && contractAddresses[chain.id]) {
    const chainId = chain.id;
    airdropAddress = contractAddresses[chainId]["airdrop"];
  }

  /**************************************
   *
   * Smart contract function calls
   *
   **************************************/

  const { data: airdropClaimed } = useContractRead({
    address: airdropAddress,
    abi: airdropAbi,
    functionName: "isClaimed",
    args: [account],
  });

  return (
    <>
      <AppHeader />
      {airdropClaimed ? (
        <VestingDetails />
      ) : (
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm">
            <div className="bg-gradient-to-br from-purple-600 to-blue-500 block max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-4">
              <p className="text-2xl font-semibold text-white">
                You have not claimed your airdrop yet.
              </p>
              <button
                type="button"
                className="font-semibold text-lg text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 mt-8"
              >
                Claim now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
