"use client";

import { useEffect, useRef } from "react";
import { PixelFlash, PixelSparkle } from "./pixel/PixelIcons";
import { Reveal } from "./Reveal";

declare global {
  interface Window {
    twttr?: { widgets: { load: (el?: HTMLElement) => void } };
  }
}

/** The champ pulled up: live embed of @FloydMayweather's real reply to
 *  @griftersonchain. The embed IS the receipt — copy stays factual
 *  ("replied"), never claims endorsement. */
export function FloydMoment({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = () => window.twttr?.widgets.load(ref.current ?? undefined);
    if (window.twttr) {
      load();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://platform.twitter.com/widgets.js";
    s.async = true;
    s.onload = load;
    document.body.appendChild(s);
  }, []);

  const embed = (
    <div ref={ref} className="mx-auto w-full max-w-[520px] [&_iframe]:!mx-auto">
      <blockquote className="twitter-tweet" data-theme="light" data-dnt="true">
        <a href="https://x.com/FloydMayweather/status/2090574052935237847">
          @FloydMayweather replied to @griftersonchain
        </a>
      </blockquote>
    </div>
  );

  if (compact) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-8 pb-14">
        <p className="text-center font-pixel text-[11px] text-ink mb-1 flex items-center justify-center gap-2">
          <PixelFlash className="w-4 h-4 text-gold" /> THE CHAMP PULLED UP
        </p>
        <p className="text-center font-pixel text-[8px] text-ink-soft mb-3">
          REAL REPLY · VERIFIED ACCOUNT · TAP TO SEE IT LIVE ON X
        </p>
        {embed}
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden" style={{ background: "var(--champagne)" }}>
      <div className="relative grain py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-8 text-center">
          <Reveal>
            <p className="font-pixel text-[11px] text-rh-green mb-4 inline-flex items-center gap-2">
              <PixelFlash className="w-4 h-4 text-gold" /> SPOTTED ON THE TIMELINE
            </p>
            <h2 className="font-bold tracking-[-0.03em] leading-[0.92] text-[clamp(2.6rem,6.5vw,5rem)]">
              The champ
              <br />
              <span className="text-rh-green">pulled up.</span>
            </h2>
            <p className="mt-5 text-lg text-ink-soft max-w-xl mx-auto">
              Floyd Mayweather replied to the final whitelist call. See it live —
              straight from his verified account.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8">{embed}</div>
            <p className="mt-4 font-pixel text-[8px] text-ink-soft inline-flex items-center gap-2">
              <PixelSparkle className="w-3 h-3 text-gold" /> REAL REPLY · EMBEDDED LIVE FROM X · NOT AN AD
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
