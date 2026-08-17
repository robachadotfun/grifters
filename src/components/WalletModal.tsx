"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { formatEther } from "viem";
import { COLLECTION } from "@/config/collection";
import { RobinhoodFeather } from "./RobinhoodMark";
import { PixelCrown, PixelSparkle, PixelWallet } from "./pixel/PixelIcons";
import { openWhitelist } from "./WhitelistModal";

/**
 * Custom account popup — balance is read directly from the Robinhood Chain RPC
 * via wagmi (Reown's balance indexer doesn't cover Robinhood Chain).
 */
export function WalletModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);
  const [wlStatus, setWlStatus] = useState<"checking" | "in" | "out">("checking");

  const { data: bal, isLoading: balLoading } = useBalance({
    address,
    chainId: COLLECTION.chainId ?? undefined,
    query: { enabled: Boolean(open && address), refetchInterval: 20_000 },
  });

  useEffect(() => {
    if (!open || !address) return;
    let alive = true;
    setWlStatus("checking");
    fetch(`/api/whitelist?wallet=${address}`)
      .then((r) => r.json())
      .then((j) => alive && setWlStatus(j.whitelisted ? "in" : "out"))
      .catch(() => alive && setWlStatus("out"));
    return () => {
      alive = false;
    };
  }, [open, address]);

  const close = useCallback(() => {
    setCopied(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  if (!open || !address) return null;

  const balText = balLoading
    ? "···"
    : bal
      ? `${Number(formatEther(bal.value)).toLocaleString(undefined, { maximumFractionDigits: 5 })} ${bal.symbol}`
      : "0 ETH";

  const explorer = COLLECTION.explorerUrl
    ? `${COLLECTION.explorerUrl.replace(/\/$/, "")}/address/${address}`
    : null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Your wallet"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="relative w-full max-w-sm border-4 border-ink/90 bg-white" style={{ boxShadow: "14px 14px 0 0 rgba(46,189,107,0.3)" }}>
        <button
          type="button"
          onClick={close}
          aria-label="Close wallet"
          className="absolute -top-4 -right-4 z-10 w-11 h-11 font-pixel text-sm border-2 border-ink bg-white hover:bg-blush transition-colors shadow-[3px_3px_0_0_rgba(42,42,51,0.3)]"
        >
          ✕
        </button>

        <div className="p-6">
          <p className="font-pixel text-sm tracking-widest flex items-center gap-2.5 mb-5">
            <PixelWallet className="w-5 h-4 text-ink" /> YOUR WALLET
          </p>

          {/* address + copy */}
          <div className="flex items-center gap-2 mb-5">
            <code className="flex-1 font-pixel text-[11px] px-3 py-3 bg-cream border-2 border-ink/25 truncate">
              {address.slice(0, 10)}…{address.slice(-8)}
            </code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(address);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="cartridge font-pixel text-[9px] px-3 min-h-[44px]"
            >
              {copied ? "COPIED ✓" : "COPY"}
            </button>
          </div>

          {/* balance from the Robinhood RPC */}
          <div className="border-2 border-ink/90 bg-rh-pale/60 p-4 text-center mb-4">
            <p className="font-pixel text-[9px] text-ink-soft flex items-center justify-center gap-2">
              <RobinhoodFeather size={10} /> ROBINHOOD CHAIN BALANCE
            </p>
            <p className="font-pixel text-2xl mt-2 text-ink" aria-live="polite">{balText}</p>
          </div>

          {/* whitelist status */}
          <div className="border-2 border-ink/25 bg-cream/70 px-4 py-3 mb-5 flex items-center justify-between">
            <span className="font-pixel text-[9px] text-ink-soft">WHITELIST</span>
            {wlStatus === "checking" ? (
              <span className="font-pixel text-[10px] text-ink-soft">CHECKING···</span>
            ) : wlStatus === "in" ? (
              <span className="font-pixel text-[10px] text-rh-green flex items-center gap-1.5">
                <PixelCrown className="w-3.5 h-2.5 text-gold" /> ON THE LIST ✓
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  close();
                  openWhitelist();
                }}
                className="font-pixel text-[10px] text-gold underline underline-offset-2 hover:text-rh-green"
              >
                NOT YET — JOIN →
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {explorer && (
              <a
                href={explorer}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pixel font-pixel text-[10px] min-h-[46px] inline-flex items-center justify-center px-3 border-2 border-ink bg-white hover:bg-mint transition-colors"
              >
                EXPLORER ↗
              </a>
            )}
            <button
              type="button"
              onClick={() => {
                disconnect();
                close();
              }}
              className={`btn-pixel font-pixel text-[10px] min-h-[46px] px-3 border-2 border-ink bg-ink text-white hover:bg-blush hover:text-ink transition-colors ${explorer ? "" : "col-span-2"}`}
            >
              DISCONNECT
            </button>
          </div>

          <p className="mt-4 text-center font-pixel text-[8px] text-ink-soft flex items-center justify-center gap-1.5">
            <PixelSparkle className="w-2 h-2 text-rh-green" /> LIVE FROM THE ROBINHOOD CHAIN RPC
          </p>
        </div>
      </div>
    </div>
  );
}
