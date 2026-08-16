"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { PixelCrown, PixelSparkle, PixelWallet } from "./pixel/PixelIcons";

export const TWEET_TEXT = encodeURIComponent(
  "Fame was always collectible. 👑\n\n2,222 pixel celebrity collectibles, sealed on Robinhood Chain. Identity hidden until reveal.\n\nGRIFTERS is coming. @griftersonchain\n",
);

type Phase = "FORM" | "SUBMITTING" | "DONE";

/** The whitelist form + success state — shared by the landing section and the hero modal. */
export function WhitelistForm() {
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

  if (phase === "DONE") {
    return (
      <div className="relative bg-white p-8 text-center">
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
    );
  }

  return (
    <form onSubmit={submit} className="bg-white p-6 sm:p-8">
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
  );
}
