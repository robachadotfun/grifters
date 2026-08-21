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
import { AUTO_WHITELIST_COLLECTIONS, COLLECTION, PREREVEAL } from "@/config/collection";
import { MINT_ABI, PHASE_TIMES } from "@/lib/mintAbi";
import { Countdown } from "./Countdown";
import { RobinhoodFeather } from "./RobinhoodMark";
import { PixelCrown, PixelSparkle, PixelWallet } from "./pixel/PixelIcons";

const EXPLORER = process.env.NEXT_PUBLIC_EXPLORER_URL || "https://robinhoodchain.blockscout.com";

function shortAddr(a?: string) {
  return a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "";
}

type ProofResult = {
  primary?: { proof: `0x${string}`[] };
  community?: { proof: `0x${string}`[] };
} | null;

const PHASE_TWEETS: Record<string, string> = {
  PRIMARY: `Through the velvet rope FIRST. 🎬\n\nPRIMARY access confirmed for the @griftersonchain mint — partner holders open the doors Aug 21, 17:00 UTC.\n\n2,222 sealed icons · $20 · Robinhood Chain\nhttps://www.grifters.market/mint`,
  COMMUNITY: `I'm on the list. 🎟️\n\nCOMMUNITY access confirmed for the @griftersonchain mint — whitelist doors open Aug 21, 18:00 UTC.\n\n2,222 sealed icons · $20 · Robinhood Chain\nhttps://www.grifters.market/mint`,
  PUBLIC: `No list, no problem. 👑\n\nDoors open for EVERYONE at the @griftersonchain mint — Aug 21, 19:00 UTC.\n\n2,222 sealed icons · $20 · Robinhood Chain\nhttps://www.grifters.market/mint`,
};

function PhaseBadge({ result }: { result: NonNullable<ProofResult> }) {
  const [tier, time, note] = result.primary
    ? ["PRIMARY", "17:00 UTC", "Partner holder — you mint first."]
    : result.community
      ? ["COMMUNITY", "18:00 UTC", "You're on the whitelist."]
      : ["PUBLIC", "19:00 UTC", "Not on the lists — public mint is open to everyone."];
  const featured = Boolean(result.primary || result.community);
  return (
    <div
      className={`mt-4 border-2 px-4 py-3.5 text-left ${featured ? "border-rh-green bg-rh-pale" : "border-ink/30 bg-white"}`}
      role="status"
    >
      <p className={`font-pixel text-[11px] ${featured ? "text-rh-green" : "text-ink"}`}>
        {featured ? "✓" : "•"} YOUR PHASE: {tier} — AUG 21, {time}
      </p>
      <p className="mt-1.5 font-pixel text-[9px] text-ink-soft leading-relaxed">{note.toUpperCase()}</p>
      <a
        href={`https://x.com/intent/tweet?text=${encodeURIComponent(PHASE_TWEETS[tier])}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-pixel mt-3 inline-flex items-center justify-center w-full min-h-[42px] px-4 font-pixel text-[10px] border-2 border-ink bg-ink text-white hover:bg-rh-green hover:border-rh-green transition-colors"
      >
        TWEET YOUR PHASE →
      </a>
    </div>
  );
}

/** Pre-mint eligibility check: auto-checks the connected wallet, or any
 *  pasted address — no wallet connection required. */
function EligibilityChecker({
  connectedAddress,
  connectedProofs,
  onConnect,
}: {
  connectedAddress?: `0x${string}`;
  connectedProofs: ProofResult;
  onConnect: () => void;
}) {
  const [input, setInput] = useState("");
  const [lookup, setLookup] = useState<{ addr: string; result: ProofResult } | "loading" | null>(null);

  const check = () => {
    const addr = input.trim();
    if (!/^0x[0-9a-fA-F]{40}$/.test(addr)) return;
    setLookup("loading");
    fetch(`/api/allowlist-proof?wallet=${addr}`)
      .then((r) => r.json())
      .then((j) => setLookup({ addr, result: j }))
      .catch(() => setLookup(null));
  };

  return (
    <div className="mt-8 mx-auto max-w-md text-left border-t-2 border-dashed border-ink/20 pt-6">
      <p className="font-pixel text-[10px] text-ink text-center mb-3">CHECK YOUR ACCESS NOW</p>
      {connectedAddress ? (
        connectedProofs === null ? (
          <p className="text-center font-pixel text-[9px] text-ink-soft">CHECKING {shortAddr(connectedAddress)}…</p>
        ) : (
          <PhaseBadge result={connectedProofs} />
        )
      ) : (
        <>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="0x… paste any wallet"
              spellCheck={false}
              className="flex-1 min-h-[46px] px-3 font-pixel text-[10px] bg-white border-2 border-ink/60 placeholder:text-ink/30 focus:border-rh-green focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && check()}
            />
            <button
              type="button"
              onClick={check}
              className="btn-pixel font-pixel text-[10px] px-4 border-2 border-ink bg-ink text-white hover:bg-rh-green hover:border-rh-green transition-colors"
            >
              CHECK
            </button>
          </div>
          {lookup === "loading" && <p className="mt-3 font-pixel text-[9px] text-ink-soft text-center">CHECKING…</p>}
          {lookup && lookup !== "loading" && lookup.result && <PhaseBadge result={lookup.result} />}
          <p className="mt-3 text-center font-pixel text-[8px] text-ink-soft">
            OR{" "}
            <button type="button" onClick={onConnect} className="underline text-rh-green">
              CONNECT YOUR WALLET
            </button>{" "}
            TO CHECK AUTOMATICALLY
          </p>
        </>
      )}
    </div>
  );
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

      {/* who the PRIMARY phase is for */}
      <div className="mb-8 border-2 border-ink/40 bg-white/80 px-5 py-4">
        <p className="font-pixel text-[9px] leading-relaxed">
          <span className="text-rh-green">PRIMARY (17:00)</span>{" "}
          <span className="text-ink">
            IS FOR HOLDERS OF THESE PARTNER NFT COLLECTIONS — HOLD ANY ONE OF THEM AND YOU MINT FIRST:
          </span>
        </p>
        <p className="mt-2.5 font-pixel text-[8px] text-ink-soft leading-relaxed">
          {AUTO_WHITELIST_COLLECTIONS.map((c, i) => (
            <span key={c.name}>
              {i > 0 && " · "}
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rh-green underline decoration-ink/20 underline-offset-2"
              >
                {c.name}
              </a>
            </span>
          ))}
        </p>
        <p className="mt-2.5 font-pixel text-[8px] text-ink-soft leading-relaxed">
          SNAPSHOT TAKEN — CONNECT THE WALLET THAT HOLDS THEM AND ACCESS IS AUTOMATIC.
          WHITELIST MINTS AT 18:00 · EVERYONE AT 19:00.
        </p>
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
              <EligibilityChecker connectedAddress={address} connectedProofs={proofs} onConnect={() => open({ view: "Connect" })} />
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
                    : "This wallet doesn't hold a partner NFT and isn't on the whitelist — PUBLIC mint opens 19:00 UTC. Everyone gets in."}
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
                <span>~$20 PER GRIFTER · 2,222 TOTAL</span>
              </div>
              {writeError && (
                <p className="mt-3 text-sm text-red-700 border-2 border-red-200 bg-red-50 px-3 py-2" role="alert">
                  Transaction failed or was rejected.{" "}
                  <button type="button" className="underline" onClick={() => reset()}>Try again</button>
                </p>
              )}
              {confirmed && (
                <div className="mt-3 border-2 border-rh-green/40 bg-rh-pale px-3 py-2.5" role="status">
                  <p className="font-pixel text-[10px] text-rh-green">MINTED ✓ — YOUR SEALED GRIFTERS ARE BELOW</p>
                  <a
                    href={`https://x.com/intent/tweet?text=${encodeURIComponent(`Just minted my sealed GRIFTERS. 🎬 Identity hidden until the reveal — assigned by real mined entropy on Robinhood Chain.\n\n@griftersonchain · $20 · minting NOW\nhttps://www.grifters.market/mint`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pixel mt-2.5 inline-flex items-center justify-center w-full min-h-[42px] px-4 font-pixel text-[10px] border-2 border-ink bg-ink text-white hover:bg-rh-green hover:border-rh-green transition-colors"
                  >
                    TWEET YOUR MINT →
                  </a>
                </div>
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
