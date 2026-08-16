"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useChainId,
  useConnect,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseEther } from "viem";
import { COLLECTION, GRIFTERS, PREREVEAL } from "@/config/collection";
import { MINT_ABI } from "@/lib/mintAbi";
import { shortAddr } from "./ConnectButton";
import { Reveal } from "./Reveal";
import { SupplyViz } from "./SupplyViz";
import { GrifterPack } from "./GrifterPack";
import { PixelCrown, PixelSparkle, PixelWallet, PixelStar } from "./pixel/PixelIcons";
import { PixelEdge, DecoField } from "./pixel/Decor";
import { RobinhoodFeather } from "./RobinhoodMark";
import { MysteryOrbit } from "./MysteryOrbit";
import { PixelDiamond } from "./pixel/PixelIcons";

function MintSuccess({ hash, onClose }: { hash?: string; onClose: () => void }) {
  const explorer =
    hash && COLLECTION.explorerUrl ? `${COLLECTION.explorerUrl.replace(/\/$/, "")}/tx/${hash}` : null;
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Mint successful"
    >
      {/* paparazzi flash */}
      <div aria-hidden className="absolute inset-0 bg-white flashbulb pointer-events-none" />
      {/* pixel confetti */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 26 }).map((_, i) => (
          <PixelSparkle
            key={i}
            className="absolute animate-twinkle"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: 8 + (i % 3) * 4,
              height: 8 + (i % 3) * 4,
              color: ["#C9A24B", "#2EBD6B", "#8FB8E8", "#E7A6C4"][i % 4],
              animationDelay: `${(i % 7) * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative pixel-frame max-w-sm w-full p-6 text-center bg-white overflow-hidden">
        {/* the pack tears open, revealing the sealed grifter */}
        <div className="relative mx-auto w-52 h-64">
          {/* particle burst as the pack tears */}
          {Array.from({ length: 8 }).map((_, i) => (
            <PixelSparkle
              key={i}
              className="burst-sparkle absolute z-20"
              style={{
                left: `${50 + 42 * Math.cos((i * Math.PI) / 4)}%`,
                top: `${50 + 42 * Math.sin((i * Math.PI) / 4)}%`,
                width: 12 + (i % 3) * 4,
                height: 12 + (i % 3) * 4,
                color: ["#C9A24B", "#2EBD6B", "#8FB8E8", "#E7A6C4"][i % 4],
                animationDelay: "1.05s",
              }}
              aria-hidden
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center animate-pack-tear z-10">
            <GrifterPack scale={0.95} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center animate-pack-reveal">
            {/* pastel starburst behind the revealed pack */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/generated/grifters/mint-success-rays.webp"
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-contain animate-rays pixelated"
            />
            <Image
              src={PREREVEAL.src}
              alt={PREREVEAL.alt}
              width={280}
              height={280}
              className="relative pixelated w-48 aspect-square object-cover border-2 border-ink"
            />
          </div>
        </div>
        <h3 className="mt-4 text-3xl font-bold tracking-tight">YOU GOT A GRIFTER.</h3>
        <p className="mt-2 font-pixel text-[10px] text-ink-soft">IDENTITY SEALED UNTIL REVEAL.</p>
        <div className="mt-6 flex gap-2 justify-center flex-wrap">
          {explorer && (
            <a
              href={explorer}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pixel font-pixel text-[10px] min-h-[44px] inline-flex items-center px-4 border-2 border-ink bg-white hover:bg-mint"
            >
              VIEW TRANSACTION
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="btn-pixel font-pixel text-[10px] min-h-[44px] px-4 border-2 border-ink bg-ink text-white hover:bg-rh-green hover:border-rh-green"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

export function MintSection() {
  const [qty, setQty] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const chainId = useChainId();
  const { switchChain, isPending: switching } = useSwitchChain();

  const hasContract = Boolean(COLLECTION.contractAddress && COLLECTION.chainId);
  const wrongNetwork = hasContract && isConnected && chainId !== COLLECTION.chainId;

  const { data: supplyData } = useReadContract({
    address: COLLECTION.contractAddress ?? undefined,
    abi: MINT_ABI,
    functionName: "totalSupply",
    chainId: COLLECTION.chainId ?? undefined,
    query: { enabled: hasContract, refetchInterval: 15_000 },
  });
  const minted = supplyData ? Number(supplyData) : 0;
  const soldOut = minted >= COLLECTION.supply;

  const { writeContract, data: txHash, isPending: signing, error: writeError, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess: confirmed } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (confirmed) setShowSuccess(true);
  }, [confirmed]);

  const mintLive = COLLECTION.phase === "LIVE" && hasContract && !soldOut;
  const price = COLLECTION.mintPrice;

  const totalCost = useMemo(() => {
    if (!price) return null;
    return (Number(price) * qty).toString();
  }, [price, qty]);

  const onMint = () => {
    if (!mintLive || !COLLECTION.contractAddress) return;
    writeContract({
      address: COLLECTION.contractAddress,
      abi: MINT_ABI,
      functionName: "mint",
      args: [BigInt(qty)],
      value: price ? parseEther((Number(price) * qty).toString() as `${number}`) : undefined,
      chainId: COLLECTION.chainId ?? undefined,
    });
  };

  return (
    <section id="mint" className="relative overflow-hidden" style={{ background: "var(--pearl)" }}>
      <PixelEdge color="var(--cream)" />
      {/* premium showroom environment */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <Image
          src="/generated/grifters/mint-room.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.18] pixelated"
        />
      </div>
      <div className="relative grain py-12 sm:py-16">
        <DecoField seed={41} count={12} />
        {/* sparse drifting mint particles */}
        <div aria-hidden className="absolute inset-0 pointer-events-none hidden sm:block">
          {Array.from({ length: 9 }).map((_, i) => {
            const Icon = i % 3 === 0 ? PixelDiamond : i % 3 === 1 ? PixelSparkle : PixelStar;
            return (
              <Icon
                key={i}
                className="absolute animate-particle"
                style={{
                  left: `${8 + ((i * 37) % 86)}%`,
                  top: `${12 + ((i * 53) % 72)}%`,
                  width: 8 + (i % 3) * 3,
                  height: 8 + (i % 3) * 3,
                  color: ["#2ebd6b", "#c9a24b", "#8fb8e8"][i % 3],
                  opacity: 0.4,
                  animationDelay: `${(i % 6) * 1.3}s`,
                }}
              />
            );
          })}
        </div>

        {/* ambient mint glow behind the machine */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70rem] h-[46rem] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(46,189,107,0.15), transparent 65%)" }}
        />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-8">
          <Reveal>
            <div className="text-center mb-10">
              <p className="font-pixel text-[11px] text-rh-green mb-5 inline-flex items-center gap-2">
                <PixelCrown className="w-4 h-3 text-gold" /> THE MINT
              </p>
              <h2 className="font-bold tracking-[-0.03em] leading-[0.9] text-[clamp(3rem,8vw,7rem)] uppercase">
                Own a piece
                <br />
                of the culture.
              </h2>
            </div>
          </Reveal>

          {/* ——— the GRIFTERS machine, floaters hugging its edges ——— */}
          <Reveal delay={0.1} variant="flash">
            <div className="relative">
            <div aria-hidden className="absolute inset-0 pointer-events-none hidden xl:block">
              {GRIFTERS.slice(0, 4).map((g, i) => (
                <div
                  key={g.id}
                  className={`absolute w-40 pixel-frame p-1.5 ${i % 2 ? "animate-float" : "animate-float-slow"}`}
                  style={{
                    left: i < 2 ? "-13rem" : undefined,
                    right: i >= 2 ? "-13rem" : undefined,
                    top: i % 2 ? undefined : `${6 + i * 4}%`,
                    bottom: i % 2 ? `${8 + (i - 1) * 3}%` : undefined,
                    transform: `rotate(${i % 2 ? 6 : -6}deg)`,
                    opacity: 0.9,
                  }}
                >
                  <Image src={g.src} alt="" width={160} height={160} className="pixelated aspect-square object-cover" />
                </div>
              ))}
              <div className="absolute right-[-9rem] top-[38%] rotate-[8deg] animate-float-slow opacity-90">
                <GrifterPack scale={0.55} />
              </div>
            </div>
            <div
              className="relative border-4 border-ink/90 bg-white"
              style={{ boxShadow: "16px 16px 0 0 rgba(46,189,107,0.2), 0 40px 90px -30px rgba(42,42,51,0.35)" }}
            >
              {/* marquee top plate */}
              <div
                className="border-b-4 border-ink/90 px-6 py-4 flex items-center justify-between"
                style={{ background: "linear-gradient(90deg,var(--mint),var(--rh-pale),var(--mint))" }}
              >
                <span className="font-pixel text-sm sm:text-lg tracking-widest flex items-center gap-3">
                  <PixelCrown className="w-5 h-4 text-gold" /> GRIFTERS MINT TERMINAL
                </span>
                <span className="hidden sm:flex items-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <PixelStar key={i} className="w-3.5 h-3.5 text-gold animate-twinkle" style={{ animationDelay: `${i * 0.5}s` }} />
                  ))}
                </span>
              </div>

              <div className="p-6 sm:p-10 grid lg:grid-cols-[230px_1fr] gap-8 lg:gap-10 items-start">
                {/* sealed pack — the thing you're minting */}
                <div className="relative flex flex-col items-center gap-4 lg:pt-2">
                  <MysteryOrbit radius={150} />
                  <div className="animate-float-slow">
                    <GrifterPack scale={1.05} />
                  </div>
                  <p className="font-pixel text-[8px] text-ink-soft text-center leading-relaxed">
                    EVERY MINT DISPENSES
                    <br />1 SEALED GRIFTER
                  </p>
                </div>

                <div>
                {/* stats row — punched metal plate look */}
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {[
                    { dt: "SUPPLY", dd: "2,222", cls: "" },
                    { dt: "NETWORK", dd: "", chain: true, cls: "" },
                    { dt: "PRICE", dd: price ? `${price} ETH` : "TBA", cls: "text-gold" },
                    { dt: "MINTED", dd: `${minted.toLocaleString()} / 2,222`, cls: "text-rh-green" },
                  ].map((s) => (
                    <div key={s.dt} className="border-2 border-ink/20 bg-cream px-3 py-3 text-center">
                      <dt className="font-pixel text-[8px] text-ink-soft">{s.dt}</dt>
                      {s.chain ? (
                        <dd className="mt-2 flex items-center justify-center gap-1.5">
                          <RobinhoodFeather size={11} />
                          <span className="font-pixel text-[10px] text-rh-green leading-tight">ROBINHOOD</span>
                        </dd>
                      ) : (
                        <dd className={`font-pixel mt-1.5 ${s.dt === "MINTED" ? "text-sm sm:text-base pt-1" : "text-lg sm:text-xl"} ${s.cls}`}>{s.dd}</dd>
                      )}
                    </div>
                  ))}
                </dl>

                {/* controls */}
                <div className="mt-2">
                  {!mounted ? null : COLLECTION.phase === "PRELAUNCH" || !hasContract ? (
                    <div className="text-center border-2 border-dashed border-ink/30 py-9 px-4 bg-cream/60">
                      <p className="font-pixel text-base text-ink">MINT OPENING SOON</p>
                      <p className="mt-2.5 text-base text-ink-soft">
                        Follow the drop — minting goes live on Robinhood Chain.
                      </p>
                      <a
                        href="#whitelist"
                        className="btn-pixel mt-5 inline-flex items-center justify-center min-h-[52px] px-7 font-pixel text-xs border-2 border-ink transition-colors"
                        style={{ background: "var(--rh-green)", color: "#10321f" }}
                      >
                        JOIN THE WHITELIST ↓
                      </a>
                    </div>
                  ) : soldOut ? (
                    <div className="text-center border-2 border-ink py-9 px-4 bg-champagne/60">
                      <p className="font-pixel text-base">SOLD OUT — 2,222 / 2,222</p>
                      <p className="mt-2.5 text-base text-ink-soft">Every Grifter has found a wallet.</p>
                    </div>
                  ) : !isConnected ? (
                    <button
                      type="button"
                      onClick={() => connectors[0] && connect({ connector: connectors[0] })}
                      className="btn-pixel w-full font-pixel text-sm min-h-[60px] border-2 border-ink bg-ink text-white hover:bg-rh-green hover:border-rh-green transition-colors inline-flex items-center justify-center gap-3"
                    >
                      <PixelWallet className="w-5 h-4" /> CONNECT WALLET TO MINT
                    </button>
                  ) : wrongNetwork ? (
                    <button
                      type="button"
                      onClick={() => COLLECTION.chainId && switchChain({ chainId: COLLECTION.chainId })}
                      disabled={switching}
                      className="btn-pixel w-full font-pixel text-sm min-h-[60px] border-2 border-gold bg-champagne hover:bg-gold-soft transition-colors inline-flex items-center justify-center gap-3"
                    >
                      <RobinhoodFeather size={14} />
                      {switching ? "SWITCHING..." : "SWITCH TO ROBINHOOD CHAIN"}
                    </button>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center gap-5 mb-4">
                        <button
                          type="button"
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          className="cartridge font-pixel text-2xl w-16 h-16"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="font-pixel text-4xl w-24 text-center" aria-live="polite">
                          {String(qty).padStart(2, "0")}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty((q) => Math.min(COLLECTION.maxPerWallet ?? 10, q + 1))}
                          className="cartridge font-pixel text-2xl w-16 h-16"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      {/* quick selectors */}
                      <div className="flex justify-center gap-2.5 mb-6" role="group" aria-label="Quick quantity">
                        {[1, 2, 3, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setQty(n)}
                            aria-pressed={qty === n}
                            className="cartridge font-pixel text-[11px] w-11 h-11"
                          >
                            {n}
                          </button>
                        ))}
                        {COLLECTION.maxPerWallet && (
                          <button
                            type="button"
                            onClick={() => setQty(COLLECTION.maxPerWallet!)}
                            aria-pressed={qty === COLLECTION.maxPerWallet}
                            className="cartridge font-pixel text-[11px] px-3 h-11"
                          >
                            MAX
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={onMint}
                        disabled={signing || confirming}
                        className="btn-pixel w-full font-pixel text-sm min-h-[64px] border-2 border-ink text-ink transition-colors disabled:opacity-70"
                        style={{ background: "var(--rh-green)", color: "#10321f" }}
                      >
                        {signing ? "CHECK WALLET" : confirming ? (
                          <span className="inline-flex items-center gap-2">
                            MINTING
                            {[0, 1, 2].map((d) => (
                              <span key={d} className="w-2 h-2 bg-ink inline-block animate-twinkle" style={{ animationDelay: `${d * 0.3}s` }} />
                            ))}
                          </span>
                        ) : "MINT GRIFTER"}
                      </button>
                      <div className="mt-3.5 flex justify-between font-pixel text-[10px] text-ink-soft">
                        <span>{shortAddr(address)}</span>
                        <span>2,222 TOTAL · IDENTITY SEALED UNTIL REVEAL</span>
                        {totalCost && <span>TOTAL {totalCost} ETH</span>}
                      </div>
                      {writeError && (
                        <p className="mt-3 text-sm text-red-700 border-2 border-red-200 bg-red-50 px-3 py-2" role="alert">
                          Transaction failed or was rejected.{" "}
                          <button type="button" className="underline" onClick={() => reset()}>
                            Try again
                          </button>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* supply visualization — supporting content beneath the controls */}
                <div className="mt-9 pt-7 border-t-2 border-pearl">
                  <p className="font-pixel text-[8px] text-ink-soft mb-3 text-center">2,222 TOTAL SUPPLY</p>
                  <SupplyViz minted={minted} />
                </div>
                </div>
              </div>

              {/* dispense slot */}
              <div className="border-t-4 border-ink/90 px-6 py-3 flex items-center justify-between bg-cream">
                <span className="font-pixel text-[9px] text-ink-soft">IDENTITY REMAINS SEALED UNTIL REVEAL</span>
                <span aria-hidden className="w-28 h-3 bg-ink/80" style={{ boxShadow: "inset 0 2px 0 rgba(0,0,0,0.4)" }} />
              </div>
            </div>
            </div>
          </Reveal>
        </div>
      </div>

      {showSuccess && <MintSuccess hash={txHash} onClose={() => { setShowSuccess(false); reset(); }} />}
    </section>
  );
}
