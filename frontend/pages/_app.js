import "@/styles/globals.css";

import { ConnectKitProvider } from "connectkit";
import { NotificationProvider } from "web3uikit";
import { WagmiConfig } from "wagmi";
import { client } from "../utils/wagmi";

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
