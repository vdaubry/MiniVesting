import AppHeader from "@/components/AppHeader";
import VestingDetails from "@/components/VestingDetails";

export default function VestingApp() {
  /**************************************
   *
   * Smart contract function calls
   *
   **************************************/

  const { data: airdropClaimed } = useContractRead({
    address: airdropAddress,
    abi: usdcAbi,
    functionName: "allowance",
    args: [account, dcaAddress],
  });

  return (
    <>
      <AppHeader />
      <VestingDetails />
    </>
  );
}
