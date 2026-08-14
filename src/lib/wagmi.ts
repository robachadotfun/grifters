import { http, createConfig, injected } from "wagmi";
import { mainnet } from "wagmi/chains";
import { defineChain, type Chain } from "viem";
import { COLLECTION } from "@/config/collection";

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

const chains = robinhoodChain ? ([robinhoodChain, mainnet] as const) : ([mainnet] as const);

export const wagmiConfig = createConfig({
  chains: chains as unknown as readonly [Chain, ...Chain[]],
  connectors: [injected()],
  transports: Object.fromEntries(
    (chains as readonly Chain[]).map((c) => [
      c.id,
      c.id === COLLECTION.chainId && COLLECTION.rpcUrl ? http(COLLECTION.rpcUrl) : http(),
    ]),
  ),
  ssr: true,
});
