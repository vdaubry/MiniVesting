import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { erc20Abi, contractAddresses, contractAbi } from "../constants";
import { useNetwork, useAccount, useContractRead } from "wagmi";
import { truncatedAmount, formatDate } from "../utils/format";
import ClaimVested from "./ClaimVested";
import VestingChart from "./VestingChart";

export default function VestingDetails() {
  const { chain } = useNetwork();
  const { address: account } = useAccount();

  let contractAddress, vestingTokenAddress;
  if (chain && contractAddresses[chain.id]) {
    const chainId = chain.id;
    contractAddress = contractAddresses[chainId]["contract"];
    vestingTokenAddress = contractAddresses[chainId]["vesting_token"];
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const { data: balanceFromCall } = useContractRead({
    address: vestingTokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account],
  });

  const { data: startDateFromCall } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: "start",
    args: [account],
  });

  const { data: cliffDateFromCall } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: "cliff",
    args: [account],
  });

  const { data: durationDateFromCall } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: "duration",
    args: [account],
  });

  const { data: vestingAmountFromCall } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: "amount",
    args: [account],
  });

  const { data: amountVestedFromCall } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: "vestedAmount",
    args: [currentTimestamp, account],
  });

  const { data: releasedAmountFromCall } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: "released",
    args: [account],
  });

  const { data: releasableAmountFromCall } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: "releasable",
    args: [account],
  });

  const balance = truncatedAmount(balanceFromCall);
  const startDate = startDateFromCall;
  const cliffDate =
    startDateFromCall &&
    cliffDateFromCall &&
    startDateFromCall.toNumber() + cliffDateFromCall.toNumber();
  const durationDate =
    startDateFromCall &&
    durationDateFromCall &&
    startDateFromCall.toNumber() + durationDateFromCall.toNumber();

  const releasableAmount = truncatedAmount(releasableAmountFromCall);
  const vestedAmount = truncatedAmount(amountVestedFromCall);

  return (
    <>
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm">
          <div>
            <h1 className="text-2xl md:text-4xl text-gray-900 font-extrabold mb-5">
              Your $VESTING breakdown
            </h1>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-blue-500 block max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <h5 className="mb-2 text-base font-bold tracking-tight text-white dark:text-white">
              Balance
            </h5>
            <p className="font-bold text-5xl text-white">{balance}</p>
          </div>

          <ClaimVested releasableAmount={releasableAmountFromCall} />

          <VestingChart
            startDate={startDate}
            cliffDate={cliffDate}
            durationDate={durationDate}
            vestingAmount={vestingAmountFromCall}
          />

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
                  <td className="px-6 py-4">{formatDate(startDateFromCall)}</td>
                </tr>
                <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Cliff
                  </th>
                  <td className="px-6 py-4">{formatDate(cliffDate)}</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    End date
                  </th>
                  <td className="px-6 py-4">{formatDate(durationDate)}</td>
                </tr>
                <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Total vesting
                  </th>
                  <td className="px-6 py-4">
                    {truncatedAmount(vestingAmountFromCall)}
                  </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Already vested
                  </th>
                  <td className="px-6 py-4">{vestedAmount}</td>
                </tr>
                <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Already released
                  </th>
                  <td className="px-6 py-4">
                    {truncatedAmount(releasedAmountFromCall)}
                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Releasable
                  </th>
                  <td className="px-6 py-4">{releasableAmount}</td>
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
