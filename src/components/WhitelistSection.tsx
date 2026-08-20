"use client";

import { Reveal } from "./Reveal";
import { GrifterPack } from "./GrifterPack";
import { PixelCrown, PixelSparkle } from "./pixel/PixelIcons";
import { PixelEdge, DecoField } from "./pixel/Decor";
import { WhitelistForm } from "./WhitelistForm";
import { AutoWhitelist } from "./AutoWhitelist";

export function WhitelistSection() {
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
                <PixelCrown className="w-4 h-3 text-gold" /> LAST CALL
              </p>
              <h2 className="font-bold tracking-[-0.03em] leading-[0.92] text-[clamp(2.8rem,6.5vw,5.5rem)]">
                The <span className="text-rh-green">final</span>
                <br />
                whitelist.
              </h2>
              <p className="mt-6 text-lg sm:text-xl text-ink-soft max-w-md mx-auto lg:mx-0 leading-relaxed">
                One last window before the doors open. Get on the final whitelist and
                mint at <strong>18:00 UTC</strong> — an hour before the public. Wallet,
                X handle, one tweet — we&apos;ve already written it for you.
              </p>
              <p className="mt-4 font-pixel text-[10px] text-gold">
                CLOSES AUG 21 · 15:00 UTC — THEN THE LIST LOCKS ON-CHAIN
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

          <Reveal delay={0.1}>
            <div className="border-4 border-ink/90" style={{ boxShadow: "12px 12px 0 0 rgba(46,189,107,0.2)" }}>
              <WhitelistForm />
            </div>
          </Reveal>
        </div>

        {/* partner communities — automatically whitelisted */}
        <div className="relative mx-auto max-w-6xl px-4 sm:px-8 mt-12">
          <Reveal delay={0.15}>
            <AutoWhitelist />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
