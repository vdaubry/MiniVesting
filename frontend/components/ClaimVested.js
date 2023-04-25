import { useEffect, useState } from "react";
import { contractAddresses, contractAbi } from "../constants";
import {
  useNetwork,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { truncatedAmount } from "../utils/format";
import {
  handleFailureNotification,
  handleSuccessNotification,
} from "../utils/notifications";
import { useNotification } from "web3uikit";

export default function ClaimVested({ releasableAmount, onRelease }) {
  const { chain } = useNetwork();
  const { address: account } = useAccount();
  const dispatch = useNotification();

  let contractAddress;
  if (chain && contractAddresses[chain.id]) {
    const chainId = chain.id;
    contractAddress = contractAddresses[chainId]["contract"];
  }

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractAbi,
    functionName: "release",
    args: [account],
  });

  const { data, write: release } = useContractWrite({
    ...config,
  });

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    confirmations: 1,
    onError(error) {
      handleFailureNotification(dispatch, error.message);
    },
    onSuccess(data) {
      handleSuccessNotification(dispatch);
      onRelease();
    },
  });

  return (
    <>
      <div className="bg-gradient-to-br from-purple-600 to-blue-500 block max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-4">
        <p className="font-semibold text-white">
          You have {truncatedAmount(releasableAmount)} tokens unlocked !
        </p>

        {releasableAmount > 0 && (
          <button
            type="button"
            className="font-semibold text-lg text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 mt-8"
            disabled={!release || !(releasableAmount > 0)}
            onClick={() => release?.()}
          >
            {isLoading ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Claim now</div>
            )}
          </button>
        )}
      </div>
    </>
  );
}
