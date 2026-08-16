"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { PixelQuestion } from "./pixel/PixelIcons";
import { PixelEdge, DecoField } from "./pixel/Decor";

const ITEMS: { q: string; a: string }[] = [
  {
    q: "What is GRIFTERS?",
    a: "GRIFTERS is a collection of 2,222 pixel-art celebrity collectibles on Robinhood Chain.",
  },
  { q: "How many GRIFTERS exist?", a: "2,222." },
  {
    q: "Can celebrities repeat?",
    a: "Yes. A celebrity can appear across multiple NFTs while individual pieces differ through traits, backgrounds, clothing, accessories, rarity and other metadata.",
  },
  {
    q: "When will NFTs reveal?",
    a: "The reveal date will be announced. Every NFT stays sealed behind the pre-reveal artwork until then.",
  },
  {
    q: "What are unlockables?",
    a: "Eligible rarities may contain additional digital or real-world experiences associated with the participating celebrity. Exact eligibility and terms will be disclosed with the relevant NFT.",
  },
  { q: "Which chain is GRIFTERS on?", a: "Robinhood Chain." },
  {
    q: "Is every NFT identical?",
    a: "No. NFTs use different combinations of traits and rarity.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative" style={{ background: "var(--rh-pale)" }}>
      <PixelEdge color="var(--sky)" />
      {/* faint pixel clouds */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/generated/grifters/faq-clouds.webp"
          alt=""
          loading="lazy"
          className="w-full h-full object-cover object-bottom opacity-25 pixelated"
        />
      </div>
      <div className="relative grain py-16 sm:py-24 mx-auto max-w-3xl px-4 sm:px-6">
        <DecoField seed={43} count={8} />
        <Reveal>
          <div className="text-center mb-12">
            <p className="font-pixel text-[11px] text-rh-green mb-4 inline-flex items-center gap-2">
              <PixelQuestion className="w-3 h-4 text-gold" /> QUESTIONS
            </p>
            <h2 className="text-5xl sm:text-7xl font-bold tracking-tight">FAQ</h2>
          </div>
        </Reveal>

        <div className="space-y-3">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.04}>
                <div className="border-2 border-ink/90 bg-white shadow-[5px_5px_0_0_rgba(42,42,51,0.06)]">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="w-full min-h-[56px] flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-cream transition-colors"
                  >
                    <span className="font-semibold text-base sm:text-lg">{item.q}</span>
                    <span className="font-pixel text-sm text-rh-green shrink-0" aria-hidden>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  <div
                    id={`faq-${i}`}
                    hidden={!isOpen}
                    className="px-5 pb-5 text-ink-soft leading-relaxed"
                  >
                    {item.a}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

