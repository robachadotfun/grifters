"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { useState, type ReactNode } from "react";
import { wagmiAdapter, wagmiConfig, networks, REOWN_PROJECT_ID } from "@/lib/wagmi";

/** Reown AppKit modal — the only wallet connection on the platform.
 *  Initialized at module scope (server + client) so hooks work under SSR. */
if (REOWN_PROJECT_ID) {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId: REOWN_PROJECT_ID,
    networks,
    defaultNetwork: networks[0],
    enableNetworkSwitch: true,
    metadata: {
      name: "GRIFTERS",
      description: "2,222 pixel celebrity collectibles on Robinhood Chain.",
      url: "https://www.grifters.market",
      icons: ["https://www.grifters.market/apple-touch-icon.png"],
    },
    themeMode: "light",
    themeVariables: {
      "--w3m-accent": "#2ebd6b",
      "--w3m-color-mix": "#fdfbf7",
      "--w3m-color-mix-strength": 20,
      "--w3m-font-family": "monospace",
      "--w3m-border-radius-master": "1px",
    },
    features: { analytics: true, email: false, socials: false },
  });
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
