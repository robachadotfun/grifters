"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";

export function shortAddr(a?: string) {
  return a ? `${a.slice(0, 4)}...${a.slice(-3)}` : "";
}

export function ConnectButton({ className = "" }: { className?: string }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cls = `font-pixel text-[11px] min-h-[44px] px-4 border-2 border-ink bg-white hover:bg-blush transition-colors ${className}`;

  if (!mounted) {
    return (
      <button type="button" className={cls} aria-hidden>
        CONNECT WALLET
      </button>
    );
  }

  if (isConnected) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        className={cls}
        title="Disconnect wallet"
      >
        {shortAddr(address)}
      </button>
    );
  }

  const injectedConnector = connectors[0];
  return (
    <button
      type="button"
      onClick={() => injectedConnector && connect({ connector: injectedConnector })}
      disabled={isPending || !injectedConnector}
      className={cls}
      aria-label="Connect wallet"
    >
      {isPending ? "CONNECTING..." : "CONNECT WALLET"}
    </button>
  );
}
