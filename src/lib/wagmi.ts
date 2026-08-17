import { http } from "wagmi";
import { defineChain, type Chain } from "viem";
import { mainnet } from "wagmi/chains";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { COLLECTION } from "@/config/collection";

/** Reown project id — public by design (ships to the client). */
export const REOWN_PROJECT_ID = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "";

/**
 * Robinhood Chain parameters come exclusively from environment config.
 * Until they are supplied, wallet connection works against default chains
 * and minting stays gated behind the PRELAUNCH phase.
 */
export const robinhoodChain: Chain | null =
  COLLECTION.chainId && COLLECTION.rpcUrl
    ? defineChain({
        id: COLLECTION.chainId,
        name: COLLECTION.chainName,
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: { default: { http: [COLLECTION.rpcUrl] } },
        blockExplorers: COLLECTION.explorerUrl
          ? { default: { name: "Explorer", url: COLLECTION.explorerUrl } }
          : undefined,
      })
    : null;

/** Robinhood Chain is the only supported network once configured. */
export const networks = (robinhoodChain
  ? [robinhoodChain]
  : [mainnet]) as unknown as [AppKitNetwork, ...AppKitNetwork[]];

export const wagmiAdapter = new WagmiAdapter({
  projectId: REOWN_PROJECT_ID,
  networks,
  transports: Object.fromEntries(
    (networks as unknown as Chain[]).map((c) => [
      c.id,
      c.id === COLLECTION.chainId && COLLECTION.rpcUrl ? http(COLLECTION.rpcUrl) : http(),
    ]),
  ),
  ssr: true,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
