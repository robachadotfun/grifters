"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { GRIFTERS } from "@/config/collection";
import { Reveal } from "./Reveal";
import { PixelSparkle } from "./pixel/PixelIcons";
import { PixelEdge, DecoField } from "./pixel/Decor";
import { RobinhoodFeather } from "./RobinhoodMark";

const BLOCKS = [
  { x: 0, y: 42, c: "var(--mint)" },
  { x: 14, y: 18, c: "#fff" },
  { x: 28, y: 55, c: "var(--sky)" },
  { x: 42, y: 30, c: "var(--rh-pale)" },
  { x: 56, y: 62, c: "#fff" },
  { x: 70, y: 24, c: "var(--mint)" },
  { x: 84, y: 48, c: "var(--champagne)" },
];

/** Animated pixel chain network — blocks link up as the section enters view. */
function ChainNetwork() {
  const reduced = useReducedMotion();
  const thumbs = GRIFTERS.slice(0, 3);

  return (
    <div className="relative h-72 sm:h-96" role="img" aria-label="Animated pixel network of blocks linking up on Robinhood Chain">
      <svg viewBox="0 0 100 80" className="absolute inset-0 w-full h-full" shapeRendering="crispEdges" aria-hidden>
        {/* links */}
        {BLOCKS.slice(0, -1).map((b, i) => {
          const n = BLOCKS[i + 1];
          return (
            <motion.line
              key={i}
              x1={b.x + 6}
              y1={b.y + 5}
              x2={n.x + 6}
              y2={n.y + 5}
              stroke="#2ebd6b"
              strokeWidth="1.1"
              strokeDasharray="2.2 1.6"
              initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.7 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.35 + i * 0.22 }}
            />
          );
        })}
        {/* transaction pulses traveling the links */}
        {!reduced &&
          [0, 2, 4].map((seg, i) => {
            const a = BLOCKS[seg];
            const b = BLOCKS[seg + 1];
            return (
              <motion.rect
                key={`pulse-${seg}`}
                width="1.6"
                height="1.6"
                fill="#2ebd6b"
                initial={{ x: a.x + 5, y: a.y + 4, opacity: 0 }}
                animate={{ x: [a.x + 5, b.x + 5], y: [a.y + 4, b.y + 4], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.2, delay: 1.5 + i * 1.4, repeat: Infinity, repeatDelay: 3.5, ease: "linear" }}
              />
            );
          })}
        {/* blocks */}
        {BLOCKS.map((b, i) => (
          <motion.g
            key={i}
            initial={reduced ? undefined : { opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.22 }}
          >
            <rect x={b.x} y={b.y} width="12" height="10" fill={b.c} stroke="#2a2a33" strokeWidth="0.8" />
            <rect x={b.x + 2} y={b.y + 2} width="3" height="2" fill="#2ebd6b" opacity="0.7" />
            <rect x={b.x + 7} y={b.y + 5} width="3" height="2" fill="#8fb8e8" opacity="0.7" />
          </motion.g>
        ))}
      </svg>

      {/* NFT thumbnails traveling through the chain */}
      {!reduced &&
        thumbs.map((g, i) => (
          <motion.div
            key={g.id}
            className="absolute w-12 h-12 sm:w-16 sm:h-16 border-2 border-ink/90 bg-white p-0.5 shadow-[3px_3px_0_0_rgba(42,42,51,0.15)]"
            style={{ top: `${[46, 18, 66][i]}%` }}
            initial={{ left: "-10%", opacity: 0 }}
            whileInView={{ left: "104%", opacity: [0, 1, 1, 1, 0] }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 13 + i * 4, delay: i * 3.4, repeat: Infinity, ease: "linear" }}
            aria-hidden
          >
            <Image src={g.src} alt="" width={64} height={64} className="pixelated w-full h-full object-cover" />
          </motion.div>
        ))}
    </div>
  );
}

export function ChainSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--rh-pale)" }}>
      <PixelEdge color="var(--blush)" />
      <div className="relative grain py-16 sm:py-24">
        <DecoField seed={31} count={9} />
        <div className="mx-auto max-w-[96rem] px-4 sm:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal>
              <p className="font-pixel text-[11px] text-rh-green mb-4 inline-flex items-center gap-2.5">
                <RobinhoodFeather size={14} /> THE CHAIN
              </p>
              <h2 className="font-bold tracking-[-0.03em] leading-[0.92] text-[clamp(3rem,7vw,6rem)]">
                Hollywood meets
                <br />
                <span className="text-rh-green">Robinhood Chain.</span>
              </h2>
              <p className="mt-6 text-xl text-ink-soft max-w-md leading-relaxed">
                GRIFTERS lives on Robinhood Chain. Every mint, trait and unlock is an
                onchain artifact — held in your wallet, verifiable by anyone.
              </p>
              <div className="mt-9 flex flex-wrap gap-3 font-pixel text-[10px]">
                {["ONCHAIN METADATA", "WALLET NATIVE", "VERIFIABLE RARITY"].map((t) => (
                  <span key={t} className="cartridge px-3.5 py-2.5 inline-flex items-center gap-2">
                    <PixelSparkle className="w-2.5 h-2.5 text-rh-green" />
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-8 flex items-center gap-2.5 font-pixel text-[9px] text-ink-soft">
                <RobinhoodFeather size={10} />
                OFFICIAL NETWORK ·{" "}
                <a
                  href="https://docs.robinhood.com/chain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-rh-green"
                >
                  DOCS
                </a>{" "}
                ·{" "}
                <a
                  href="https://explorer.testnet.chain.robinhood.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-rh-green"
                >
                  EXPLORER
                </a>
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="pixel-frame p-2 bg-white/70">
              <div className="relative overflow-hidden">
                {/* generated financial-district environment beneath the live network */}
                <Image
                  src="/generated/grifters/robinhood-pixel-city.webp"
                  alt=""
                  fill
                  sizes="(max-width:1024px) 92vw, 700px"
                  className="object-cover opacity-90 pixelated"
                />
                <ChainNetwork />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
