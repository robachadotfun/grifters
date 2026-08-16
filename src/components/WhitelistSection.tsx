"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Reveal } from "./Reveal";
import { GrifterPack } from "./GrifterPack";
import { PixelCrown, PixelSparkle, PixelWallet } from "./pixel/PixelIcons";
import { PixelEdge, DecoField } from "./pixel/Decor";

const TWEET_TEXT = encodeURIComponent(
  "Fame was always collectible. 👑\n\n2,222 pixel celebrity collectibles, sealed on Robinhood Chain. Identity hidden until reveal.\n\nGRIFTERS is coming. @grifters\n",
);

type Phase = "FORM" | "SUBMITTING" | "DONE";

export function WhitelistSection() {
  const { address, isConnected } = useAccount();
  const [wallet, setWallet] = useState("");
  const [twitter, setTwitter] = useState("");
  const [tweetUrl, setTweetUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("FORM");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPhase("SUBMITTING");
    try {
      const res = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: wallet.trim(), twitter: twitter.trim(), tweetUrl: tweetUrl.trim(), website: "" }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || "Something went wrong — try again.");
      setPhase("DONE");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong — try again.");
      setPhase("FORM");
    }
  };

  const input =
    "w-full min-h-[52px] px-4 font-pixel text-[12px] bg-white border-2 border-ink/80 placeholder:text-ink/30 focus:border-rh-green focus:outline-none transition-colors";

  return (
    <section id="whitelist" className="relative overflow-hidden" style={{ background: "var(--sky)" }}>
      <PixelEdge color="var(--pearl)" />
      <div className="relative grain py-14 sm:py-20">
        <DecoField seed={47} count={10} />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-8 grid lg:grid-cols-[1fr_460px] gap-12 items-center">
          {/* pitch */}
          <div className="text-center lg:text-left">
            <Reveal>
              <p className="font-pixel text-[11px] text-rh-green mb-4 inline-flex items-center gap-2">
                <PixelCrown className="w-4 h-3 text-gold" /> THE LIST
              </p>
              <h2 className="font-bold tracking-[-0.03em] leading-[0.92] text-[clamp(2.8rem,6.5vw,5.5rem)]">
                The carpet has
                <br />
                a <span className="text-rh-green">guest list.</span>
              </h2>
              <p className="mt-6 text-lg sm:text-xl text-ink-soft max-w-md mx-auto lg:mx-0 leading-relaxed">
                Get whitelisted before mint opens. Drop your wallet, your X handle,
                and — if you want to move up the carpet — a tweet about GRIFTERS.
              </p>
              <div className="mt-7 hidden lg:flex items-center gap-5">
                <div className="animate-float-slow">
                  <GrifterPack scale={0.55} />
                </div>
                <ul className="space-y-2.5 font-pixel text-[10px] text-ink-soft">
                  <li className="flex items-center gap-2"><PixelSparkle className="w-3 h-3 text-rh-green" /> WHITELIST = EARLY MINT ACCESS</li>
                  <li className="flex items-center gap-2"><PixelSparkle className="w-3 h-3 text-gold" /> 2,222 SEALED IDENTITIES</li>
                  <li className="flex items-center gap-2"><PixelSparkle className="w-3 h-3 text-ink/40" /> FREE TO JOIN</li>
                </ul>
              </div>
            </Reveal>
          </div>

          {/* form / success */}
          <Reveal delay={0.1}>
            {phase === "DONE" ? (
              <div className="relative border-4 border-ink/90 bg-white p-8 text-center" style={{ boxShadow: "12px 12px 0 0 rgba(46,189,107,0.25)" }}>
                <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <PixelSparkle
                      key={i}
                      className="absolute animate-twinkle"
                      style={{
                        left: `${(i * 41) % 100}%`,
                        top: `${(i * 67) % 100}%`,
                        width: 8 + (i % 3) * 4,
                        height: 8 + (i % 3) * 4,
                        color: ["#C9A24B", "#2EBD6B", "#8FB8E8", "#E7A6C4"][i % 4],
                        animationDelay: `${(i % 5) * 0.3}s`,
                      }}
                    />
                  ))}
                </div>
                <PixelCrown className="w-12 h-9 text-gold mx-auto" />
                <h3 className="mt-4 text-3xl font-bold tracking-tight">YOU&apos;RE ON THE LIST.</h3>
                <p className="mt-3 font-pixel text-[10px] text-rh-green">WHITELISTED FOR EARLY MINT ACCESS</p>
                <p className="mt-4 text-sm text-ink-soft leading-relaxed">
                  We&apos;ll see you on the carpet. Identity stays sealed until reveal.
                </p>
                <a
                  href={`https://x.com/intent/tweet?text=${TWEET_TEXT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pixel mt-6 inline-flex items-center justify-center min-h-[48px] px-6 font-pixel text-[11px] border-2 border-ink bg-ink text-white hover:bg-rh-green hover:border-rh-green transition-colors"
                >
                  SHARE ON X
                </a>
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="border-4 border-ink/90 bg-white p-6 sm:p-8"
                style={{ boxShadow: "12px 12px 0 0 rgba(46,189,107,0.2)" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-pixel text-sm tracking-widest flex items-center gap-2.5">
                    <PixelCrown className="w-5 h-4 text-gold" /> JOIN THE WHITELIST
                  </span>
                  <span className="font-pixel text-[9px] text-rh-green">FREE</span>
                </div>

                <label className="block mb-4">
                  <span className="font-pixel text-[10px] text-ink-soft flex items-center justify-between mb-2">
                    WALLET ADDRESS *
                    {isConnected && address && wallet !== address && (
                      <button
                        type="button"
                        onClick={() => setWallet(address)}
                        className="cartridge font-pixel text-[9px] px-2.5 py-1.5 inline-flex items-center gap-1.5"
                      >
                        <PixelWallet className="w-3.5 h-3" /> USE CONNECTED
                      </button>
                    )}
                  </span>
                  <input
                    className={input}
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    placeholder="0x…"
                    required
                    spellCheck={false}
                    autoComplete="off"
                  />
                </label>

                <label className="block mb-4">
                  <span className="font-pixel text-[10px] text-ink-soft block mb-2">X USERNAME *</span>
                  <input
                    className={input}
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="@yourhandle"
                    required
                    spellCheck={false}
                    autoComplete="off"
                  />
                </label>

                <label className="block mb-2">
                  <span className="font-pixel text-[10px] text-ink-soft block mb-2">YOUR TWEET ABOUT GRIFTERS</span>
                  <input
                    className={input}
                    value={tweetUrl}
                    onChange={(e) => setTweetUrl(e.target.value)}
                    placeholder="https://x.com/…/status/…"
                    spellCheck={false}
                    autoComplete="off"
                  />
                </label>
                <p className="font-pixel text-[9px] text-ink-soft/80 mb-5 leading-relaxed">
                  OPTIONAL — BUT ICONS WHO TWEET WALK THE CARPET FIRST.{" "}
                  <a
                    href={`https://x.com/intent/tweet?text=${TWEET_TEXT}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rh-green underline"
                  >
                    TWEET NOW →
                  </a>
                </p>

                {/* honeypot */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                {error && (
                  <p role="alert" className="mb-4 text-sm text-red-700 border-2 border-red-200 bg-red-50 px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={phase === "SUBMITTING"}
                  className="btn-pixel w-full font-pixel text-sm min-h-[56px] border-2 border-ink transition-colors disabled:opacity-60"
                  style={{ background: "var(--rh-green)", color: "#10321f" }}
                >
                  {phase === "SUBMITTING" ? "JOINING..." : "GET WHITELISTED"}
                </button>
                <p className="mt-3 text-center font-pixel text-[8px] text-ink-soft">
                  IDENTITY SEALED UNTIL REVEAL · NO PAYMENT · NO SIGNATURE REQUIRED
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
