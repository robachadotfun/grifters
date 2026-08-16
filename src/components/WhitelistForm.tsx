"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { PixelCrown, PixelSparkle, PixelWallet } from "./pixel/PixelIcons";

const SITE = "https://www.grifters.market";

/**
 * Pre-written tweet pool — every visitor gets a random one, and every tweet
 * carries the site link so X unfurls the GRIFTERS premiere card as a graphic.
 */
const TWEETS = [
  `Fame was always collectible. 👑\n\n2,222 pixel celebrity collectibles, sealed on Robinhood Chain. Identity hidden until reveal.\n\n@griftersonchain is coming.\n${SITE}`,
  `The cameras caught something. 📸\n\n2,222 identities sealed in packs on Robinhood Chain. Nobody knows which icon they'll pull.\n\n@griftersonchain\n${SITE}`,
  `Hollywood, minted. 👑\n\nPixel icons, rare traits, real-world unlocks — and every identity stays sealed until reveal.\n\n@griftersonchain\n${SITE}`,
  `Beyond the rope, already. 🎟️\n\nJust joined the @griftersonchain whitelist — 2,222 sealed icons coming to Robinhood Chain.\n\n${SITE}`,
  `Posters. Autographs. Trading cards. Now packs. 👑\n\nEvery generation collected its icons — @griftersonchain brings them onchain.\n\n${SITE}`,
  `Some pixels open real doors. 🚪✨\n\n2,222 celebrity collectibles with real-world unlocks, sealed until reveal on Robinhood Chain.\n\n@griftersonchain\n${SITE}`,
  `I'm on the guest list. 👑\n\n@griftersonchain — 2,222 sealed celebrity icons on Robinhood Chain. Which one will you pull?\n\n${SITE}`,
  `Identity sealed. Reveal pending. 🤫\n\nThe most fun mint mechanic I've seen — you don't know your icon until the curtain opens.\n\n@griftersonchain\n${SITE}`,
];

export function pickTweet() {
  return encodeURIComponent(TWEETS[Math.floor(Math.random() * TWEETS.length)]);
}

type Phase = "FORM" | "SUBMITTING" | "DONE";

/** The whitelist form + success state — shared by the landing section and the hero modal. */
export function WhitelistForm() {
  const { address, isConnected } = useAccount();
  const [wallet, setWallet] = useState("");
  const [twitter, setTwitter] = useState("");
  const [tweetUrl, setTweetUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("FORM");
  const [error, setError] = useState<string | null>(null);
  // one random pre-written tweet per visitor (stable for the session)
  const [tweetText] = useState(() => pickTweet());

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
          href={`https://x.com/intent/tweet?text=${pickTweet()}`}
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

      <div className="mb-4 border-2 border-dashed border-rh-green/50 bg-rh-pale/50 p-3.5">
        <p className="font-pixel text-[10px] text-ink mb-2.5">STEP 1 — POST YOUR TWEET (ONE CLICK)</p>
        <a
          href={`https://x.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pixel inline-flex items-center justify-center w-full min-h-[46px] px-4 font-pixel text-[11px] border-2 border-ink bg-ink text-white hover:bg-rh-green hover:border-rh-green transition-colors"
        >
          TWEET ABOUT GRIFTERS →
        </a>
        <p className="mt-2 font-pixel text-[8px] text-ink-soft leading-relaxed">
          WE WROTE IT FOR YOU — JUST HIT POST, THEN COPY YOUR TWEET&apos;S LINK.
        </p>
      </div>

      <label className="block mb-5">
        <span className="font-pixel text-[10px] text-ink-soft block mb-2">STEP 2 — PASTE YOUR TWEET LINK *</span>
        <input
          className={input}
          value={tweetUrl}
          onChange={(e) => setTweetUrl(e.target.value)}
          placeholder="https://x.com/…/status/…"
          required
          spellCheck={false}
          autoComplete="off"
        />
      </label>

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
