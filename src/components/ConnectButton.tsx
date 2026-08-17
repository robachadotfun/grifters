"use client";

import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useEffect, useState } from "react";

export function shortAddr(a?: string) {
  return a ? `${a.slice(0, 4)}...${a.slice(-3)}` : "";
}

/** Pixel-styled trigger for the Reown AppKit modal — the only wallet entry point. */
export function ConnectButton({ className = "" }: { className?: string }) {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
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

  return (
    <button
      type="button"
      onClick={() => open(isConnected ? { view: "Account" } : { view: "Connect" })}
      className={cls}
      aria-label={isConnected ? "Wallet account" : "Connect wallet"}
    >
      {isConnected ? shortAddr(address) : "CONNECT WALLET"}
    </button>
  );
}
