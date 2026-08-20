"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  useAccount,
  useChainId,
  useSwitchChain,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { COLLECTION, PREREVEAL } from "@/config/collection";
import { MINT_ABI, PHASE_TIMES } from "@/lib/mintAbi";
import { Countdown } from "./Countdown";
import { RobinhoodFeather } from "./RobinhoodMark";
import { PixelCrown, PixelSparkle, PixelWallet } from "./pixel/PixelIcons";

const EXPLORER = process.env.NEXT_PUBLIC_EXPLORER_URL || "https://robinhoodchain.blockscout.com";

function shortAddr(a?: string) {
  return a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "";
}

/** The dedicated /mint experience: phase status, streamlined mint flow,
 *  and the connected wallet's minted Grifters (sealed until reveal). */
export function MintExperience() {
  const [qty, setQty] = useState(1);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const chainId = useChainId();
  const { switchChain, isPending: switching } = useSwitchChain();

  const hasContract = Boolean(COLLECTION.contractAddress && COLLECTION.chainId);
  const wrongNetwork = hasContract && isConnected && chainId !== COLLECTION.chainId;

  const { data: supplyData, refetch: refetchSupply } = useReadContract({
    address: COLLECTION.contractAddress ?? undefined,
    abi: MINT_ABI,
    functionName: "totalSupply",
    chainId: COLLECTION.chainId ?? undefined,
    query: { enabled: hasContract, refetchInterval: 12_000 },
  });
  const { data: priceWeiData } = useReadContract({
    address: COLLECTION.contractAddress ?? undefined,
    abi: MINT_ABI,
    functionName: "priceWei",
    chainId: COLLECTION.chainId ?? undefined,
    query: { enabled: hasContract },
  });
  const { data: mintedByData, refetch: refetchMintedBy } = useReadContract({
    address: COLLECTION.contractAddress ?? undefined,
    abi: MINT_ABI,
    functionName: "mintedBy",
    args: address ? [address] : undefined,
    chainId: COLLECTION.chainId ?? undefined,
    query: { enabled: hasContract && Boolean(address) },
  });

  const minted = supplyData ? Number(supplyData) : 0;
  const soldOut = minted >= COLLECTION.supply;
  const myCount = mintedByData ? Number(mintedByData) : 0;

  // proofs
  const [proofs, setProofs] = useState<{
    primary?: { proof: `0x${string}`[] };
    community?: { proof: `0x${string}`[] };
  } | null>(null);
  useEffect(() => {
    setProofs(null);
    if (!address) return;
    let alive = true;
    fetch(`/api/allowlist-proof?wallet=${address}`)
      .then((r) => r.json())
      .then((j) => alive && setProofs(j))
      .catch(() => alive && setProofs({}));
    return () => {
      alive = false;
    };
  }, [address]);

  const [nowSec, setNowSec] = useState(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    const id = setInterval(() => setNowSec(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const mintPath = useMemo(() => {
    if (nowSec >= PHASE_TIMES.public) return { fn: "mintPublic" as const, phase: "PUBLIC" };
    if (nowSec >= PHASE_TIMES.community && proofs?.community) return { fn: "mintCommunity" as const, phase: "COMMUNITY" };
    if (nowSec >= PHASE_TIMES.primary && proofs?.primary) return { fn: "mintPrimary" as const, phase: "PRIMARY" };
    return null;
  }, [nowSec, proofs]);
  const anyPhaseOpen = nowSec >= PHASE_TIMES.primary;

  const { writeContract, data: txHash, isPending: signing, error: writeError, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess: confirmed } = useWaitForTransactionReceipt({ hash: txHash });

  // wallet's token ids via Blockscout (best-effort; falls back to count)
  const [myTokens, setMyTokens] = useState<string[]>([]);
  const loadTokens = useCallback(() => {
    if (!address || !COLLECTION.contractAddress) return;
    fetch(`${EXPLORER}/api/v2/addresses/${address}/nft?type=ERC-721`, { headers: { accept: "application/json" } })
      .then((r) => r.json())
      .then((j: { items?: { id: string; token: { address: string } }[] }) => {
        const mine = (j.items ?? [])
          .filter((it) => it.token?.address?.toLowerCase() === COLLECTION.contractAddress!.toLowerCase())
          .map((it) => it.id);
        setMyTokens(mine.sort((a, b) => Number(a) - Number(b)));
      })
      .catch(() => {});
  }, [address]);
  useEffect(() => {
    setMyTokens([]);
    loadTokens();
  }, [address, loadTokens]);
  useEffect(() => {
    if (confirmed) {
      refetchSupply();
      refetchMintedBy();
      // indexer lags a few seconds behind the receipt
      const t1 = setTimeout(loadTokens, 4000);
      const t2 = setTimeout(loadTokens, 12000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [confirmed, loadTokens, refetchSupply, refetchMintedBy]);

  const totalCost = useMemo(() => {
    if (priceWeiData == null) return null;
    return ((Number(priceWeiData) * qty) / 1e18).toFixed(4);
  }, [priceWeiData, qty]);

  const onMint = () => {
    if (!mintPath || !COLLECTION.contractAddress || priceWeiData == null || soldOut) return;
    const value = BigInt(priceWeiData) * BigInt(qty);
    if (mintPath.fn === "mintPublic") {
      writeContract({
        address: COLLECTION.contractAddress,
        abi: MINT_ABI,
        functionName: "mintPublic",
        args: [BigInt(qty)],
        value,
        chainId: COLLECTION.chainId ?? undefined,
      });
    } else {
      const proof = (mintPath.fn === "mintCommunity" ? proofs?.community?.proof : proofs?.primary?.proof) ?? [];
      writeContract({
        address: COLLECTION.contractAddress,
        abi: MINT_ABI,
        functionName: mintPath.fn,
        args: [BigInt(qty), proof],
        value,
        chainId: COLLECTION.chainId ?? undefined,
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-8 pb-20">
      {/* phase rail */}
      <div className="grid grid-cols-3 gap-2.5 mb-8">
        {COLLECTION.phases.map((p, i) => {
          const opens = [PHASE_TIMES.primary, PHASE_TIMES.community, PHASE_TIMES.public][i];
          const live = nowSec >= opens;
          return (
            <div
              key={p.key}
              className={`border-2 px-3 py-3 text-center ${live ? "border-rh-green bg-rh-pale" : "border-ink/30 bg-white/70"}`}
            >
              <p className={`font-pixel text-[10px] ${live ? "text-rh-green" : "text-ink"}`}>
                {p.key} {live && "● LIVE"}
              </p>
              <p className="font-pixel text-[8px] text-ink-soft mt-1.5">{p.label}</p>
              <p className="font-pixel text-[9px] text-gold mt-1">{p.time}</p>
            </div>
          );
        })}
      </div>

      {/* terminal card */}
      <div className="border-4 border-ink/90 bg-white" style={{ boxShadow: "14px 14px 0 0 rgba(46,189,107,0.25)" }}>
        <div
          className="border-b-4 border-ink/90 px-6 py-4 flex items-center justify-between"
          style={{ background: "linear-gradient(90deg,var(--mint),var(--rh-pale),var(--mint))" }}
        >
          <span className="font-pixel text-sm tracking-widest flex items-center gap-2.5">
            <PixelCrown className="w-5 h-4 text-gold" /> MINT TERMINAL
          </span>
          <span className="font-pixel text-[10px] text-ink-soft">
            {minted.toLocaleString()} / 2,222
          </span>
        </div>

        <div className="p-6 sm:p-8">
          {!anyPhaseOpen ? (
            <div className="text-center py-6">
              <p className="font-pixel text-base text-ink">MINT PREMIERES AUG 21 · 17:00 UTC</p>
              {COLLECTION.mintDate && (
                <div className="mt-5">
                  <Countdown to={COLLECTION.mintDate} />
                </div>
              )}
              <p className="mt-4 text-base text-ink-soft">
                Partner holders first, whitelist at 18:00, everyone at 19:00.
              </p>
            </div>
          ) : soldOut ? (
            <div className="text-center py-6">
              <p className="font-pixel text-base">SOLD OUT — 2,222 / 2,222</p>
            </div>
          ) : !isConnected ? (
            <div className="text-center py-6">
              <p className="font-pixel text-[11px] text-ink-soft mb-5">STEP 1 — CONNECT YOUR WALLET</p>
              <button
                type="button"
                onClick={() => open({ view: "Connect" })}
                className="btn-pixel font-pixel text-sm min-h-[60px] px-8 border-2 border-ink bg-ink text-white hover:bg-rh-green hover:border-rh-green transition-colors inline-flex items-center gap-3"
              >
                <PixelWallet className="w-5 h-4" /> CONNECT WALLET
              </button>
            </div>
          ) : wrongNetwork ? (
            <div className="text-center py-6">
              <button
                type="button"
                onClick={() => COLLECTION.chainId && switchChain({ chainId: COLLECTION.chainId })}
                disabled={switching}
                className="btn-pixel font-pixel text-sm min-h-[60px] px-8 border-2 border-gold bg-champagne hover:bg-gold-soft transition-colors inline-flex items-center gap-3"
              >
                <RobinhoodFeather size={14} />
                {switching ? "SWITCHING..." : "SWITCH TO ROBINHOOD CHAIN"}
              </button>
            </div>
          ) : !mintPath ? (
            <div className="text-center py-6">
              <p className="font-pixel text-base text-ink">
                {proofs === null ? "CHECKING YOUR ACCESS..." : "YOUR PHASE HASN'T OPENED YET"}
              </p>
              {proofs !== null && (
                <p className="mt-3 text-base text-ink-soft">
                  {proofs?.community
                    ? "You're on the whitelist — COMMUNITY mint opens 18:00 UTC."
                    : "PUBLIC mint opens 19:00 UTC. Everyone gets in."}
                </p>
              )}
            </div>
          ) : (
            <div>
              <p className="mb-5 text-center font-pixel text-[11px] text-rh-green">
                ● {mintPath.phase} PHASE — YOU&apos;RE IN
              </p>
              <div className="flex items-center justify-center gap-5 mb-4">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="cartridge font-pixel text-2xl w-14 h-14" aria-label="Decrease quantity">−</button>
                <span className="font-pixel text-4xl w-24 text-center" aria-live="polite">{String(qty).padStart(2, "0")}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(50 - myCount, q + 1))} className="cartridge font-pixel text-2xl w-14 h-14" aria-label="Increase quantity">+</button>
              </div>
              <div className="flex justify-center gap-2.5 mb-6">
                {[1, 3, 5, 10].map((n) => (
                  <button key={n} type="button" onClick={() => setQty(n)} aria-pressed={qty === n} className="cartridge font-pixel text-[11px] w-11 h-11">{n}</button>
                ))}
              </div>
              <button
                type="button"
                onClick={onMint}
                disabled={signing || confirming}
                className="btn-pixel w-full font-pixel text-sm min-h-[64px] border-2 border-ink transition-colors disabled:opacity-70"
                style={{ background: "var(--rh-green)", color: "#10321f" }}
              >
                {signing ? "CHECK WALLET" : confirming ? "MINTING..." : `MINT ${qty} — ${totalCost ?? "…"} ETH`}
              </button>
              <div className="mt-3.5 flex justify-between font-pixel text-[10px] text-ink-soft">
                <span>{shortAddr(address)}</span>
                <span>~$20 PER GRIFTER · MAX 50/WALLET</span>
              </div>
              {writeError && (
                <p className="mt-3 text-sm text-red-700 border-2 border-red-200 bg-red-50 px-3 py-2" role="alert">
                  Transaction failed or was rejected.{" "}
                  <button type="button" className="underline" onClick={() => reset()}>Try again</button>
                </p>
              )}
              {confirmed && (
                <p className="mt-3 font-pixel text-[10px] text-rh-green border-2 border-rh-green/40 bg-rh-pale px-3 py-2.5" role="status">
                  MINTED ✓ — YOUR SEALED GRIFTERS ARE BELOW
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* your grifters */}
      {isConnected && (myCount > 0 || myTokens.length > 0) && (
        <div className="mt-12">
          <p className="font-pixel text-[11px] text-rh-green mb-5 flex items-center gap-2">
            <PixelSparkle className="w-3 h-3" /> YOUR GRIFTERS — {myCount} SEALED
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {(myTokens.length > 0 ? myTokens : Array.from({ length: myCount }, (_, i) => `?${i}`)).map((id) => (
              <a
                key={id}
                href={id.startsWith("?") ? undefined : `${EXPLORER}/token/${COLLECTION.contractAddress}/instance/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-frame p-1.5 bg-white block hover:-translate-y-1.5 transition-transform"
              >
                <Image src={PREREVEAL.src} alt={PREREVEAL.alt} width={400} height={400} className="pixelated aspect-square object-cover" />
                <div className="flex items-center justify-between px-2 py-2">
                  <span className="font-pixel text-[10px]">{id.startsWith("?") ? "GRIFTER" : `#${id}`}</span>
                  <span className="font-pixel text-[8px] text-gold">SEALED</span>
                </div>
              </a>
            ))}
          </div>
          <p className="mt-5 font-pixel text-[9px] text-ink-soft">
            IDENTITIES REVEAL AFTER MINT — ASSIGNED BY MINED ENTROPY, VERIFIABLE BY ANYONE.
          </p>
        </div>
      )}
    </div>
  );
}
