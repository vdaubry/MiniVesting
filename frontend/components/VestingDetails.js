import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { erc20Abi, contractAddresses } from "../constants";
import { useNetwork, useAccount, useContractRead } from "wagmi";

export default function VestingDetails() {
  const { chain } = useNetwork();
  const { address: account, isConnected } = useAccount();

  let contractAddress, vestingTokenAddress;
  if (chain && contractAddresses[chain.id]) {
    const chainId = chain.id;
    contractAddress = contractAddresses[chainId]["contract"];
    vestingTokenAddress = contractAddresses[chainId]["vesting_token"];
  }

  const { data: balanceFromCall } = useContractRead({
    address: vestingTokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account],
  });

  const balance = balanceFromCall
    ? ethers.utils.formatUnits(balanceFromCall.toString(), 18)
    : 0;

  return (
    <>
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm">
          <div>
            <h1 className="text-2xl md:text-4xl text-gray-900 font-extrabold mb-5">
              Your $VESTING breakdown
            </h1>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-blue-500 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <h5 className="mb-2 text-base font-bold tracking-tight text-white dark:text-white">
              Balance
            </h5>
            <p className="font-bold text-5xl text-white">{balance}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-blue-500 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-4">
            <p className="font-semibold text-white">
              Your {balance} vested tokens have been unlocked !
            </p>
            <button
              type="button"
              className="font-semibold text-lg text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 mt-8"
            >
              Claim now
            </button>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs">
                <tr>
                  <th scope="col" className="px-6 py-3"></th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Start date
                  </th>
                  <td className="px-6 py-4">02/01/2020</td>
                </tr>
                <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Cliff
                  </th>
                  <td className="px-6 py-4">02/01/2020</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    End date
                  </th>
                  <td className="px-6 py-4">02/01/2020</td>
                </tr>
                <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Total vesting
                  </th>
                  <td className="px-6 py-4">kjb</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Already vested
                  </th>
                  <td className="px-6 py-4"></td>
                </tr>
                <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Already released
                  </th>
                  <td className="px-6 py-4"></td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Releasable
                  </th>
                  <td className="px-6 py-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 flex flex-col items-center"></div>
    </>
  );
}
