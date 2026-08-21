"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { COLLECTION, GRIFTERS, type GrifterCard } from "@/config/collection";
import { PixelSparkle, PixelPalm, PixelFlash, PixelCrown, PixelStar } from "./pixel/PixelIcons";
import { SparkleCursor } from "./SparkleCursor";
import { RobinhoodFeather } from "./RobinhoodMark";
import { PaparazziFlash } from "./PaparazziFlash";
import { openWhitelist } from "./WhitelistModal";
import { Countdown } from "./Countdown";

function HeroCard({
  g,
  className,
  sizes,
  priority,
  mx,
  my,
  rotate = 0,
  parallax = 1,
}: {
  g: GrifterCard;
  className?: string;
  sizes: string;
  priority?: boolean;
  mx: ReturnType<typeof useSpring>;
  my: ReturnType<typeof useSpring>;
  rotate?: number;
  parallax?: number;
}) {
  const [hover, setHover] = useState(false);
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={`absolute ${className}`}
      style={reduced ? { rotate } : { x: mx, y: my, rotate, scale: parallax }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={reduced ? undefined : { rotate: 0, scale: parallax * 1.02, y: -8 }}
      transition={{ type: "spring", stiffness: 170, damping: 17 }}
    >
      <div
        className="pixel-frame p-2 sm:p-3"
        style={{ boxShadow: `0 0 0 2px #fff, 0 0 0 4px rgba(42,42,51,.9), 12px 12px 0 0 ${g.accent}` }}
      >
        <Image
          src={g.src}
          alt={g.alt}
          width={640}
          height={640}
          priority={priority}
          sizes={sizes}
          className="pixelated block aspect-square object-cover"
        />
        <div
          className={`absolute left-1/2 -translate-x-1/2 -bottom-6 transition-all duration-200 z-20 ${
            hover ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
          }`}
          aria-hidden={!hover}
        >
          <div className="pixel-frame px-3.5 py-2 flex items-center gap-3 whitespace-nowrap">
            <PixelCrown className="w-3.5 h-2.5 text-gold shrink-0" />
            <span className="font-pixel text-[10px] text-ink">{g.name}</span>
            <span className="font-pixel text-[10px] text-ink-soft">{g.traits} TRAITS</span>
            <span className="font-pixel text-[10px] text-gold">{g.rarity}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  const areaRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x1 = useSpring(rawX, { stiffness: 60, damping: 20 });
  const y1 = useSpring(rawY, { stiffness: 60, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 16);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 12);
  };

  const [main, second, third, fourth, fifth] = GRIFTERS;

  return (
    <section id="top" className="relative overflow-hidden min-h-svh flex flex-col" aria-label="Introduction">
      {/* BACK layer — generated Hollywood world (desktop + mobile crops) */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/generated/grifters/hero-hollywood-world.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55 pixelated hidden sm:block"
        />
        <Image
          src="/generated/grifters/hero-hollywood-world-mobile.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55 pixelated sm:hidden"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/60 via-transparent to-cream" />
      </div>

      {/* ambient paparazzi flash system */}
      <PaparazziFlash />

      {/* MID layer — floating generated collectible props (desktop only) */}
      <div aria-hidden className="absolute inset-0 pointer-events-none hidden lg:block">
        {/* eslint-disable @next/next/no-img-element */}
        <img src="/generated/grifters/pixel-camera.webp" alt="" loading="lazy"
          className="absolute left-[9%] top-[64%] w-16 opacity-70 animate-drift-a pixelated" />
        <img src="/generated/grifters/pixel-film-reel.webp" alt="" loading="lazy"
          className="absolute left-[30%] top-[12%] w-14 opacity-60 animate-drift-b pixelated [animation-delay:2s]" />
        <img src="/generated/grifters/pixel-champagne.webp" alt="" loading="lazy"
          className="absolute right-[6%] top-[24%] w-12 opacity-60 animate-drift-a pixelated [animation-delay:4s]" />
        <img src="/generated/grifters/pixel-vip-ticket.webp" alt="" loading="lazy"
          className="absolute right-[38%] bottom-[6%] w-16 opacity-60 animate-drift-b pixelated [animation-delay:1s]" />
        {/* eslint-enable @next/next/no-img-element */}
      </div>

      {/* MID layer — small pixel motifs */}
      <div aria-hidden className="absolute inset-0 pointer-events-none hidden sm:block">
        <PixelPalm className="absolute left-[3%] top-[26%] w-14 h-14 text-powder animate-float-slow" />
        <PixelFlash className="absolute left-[13%] top-[54%] w-5 h-8 text-gold-soft animate-twinkle" />
        <PixelSparkle className="absolute left-[24%] top-[18%] w-4 h-4 text-blush animate-twinkle" />
        <PixelSparkle className="absolute right-[20%] top-[20%] w-5 h-5 text-powder animate-twinkle [animation-delay:1.2s]" />
        <PixelSparkle className="absolute right-[34%] top-[74%] w-3.5 h-3.5 text-gold-soft animate-twinkle [animation-delay:2s]" />
        <PixelStar className="absolute left-[42%] top-[10%] w-4 h-4 text-champagne animate-twinkle [animation-delay:.6s]" />
        <PixelCrown className="absolute right-[44%] top-[86%] w-6 h-5 text-gold/30 animate-float-slow" />
      </div>

      <div
        ref={areaRef}
        onMouseMove={onMove}
        className="relative flex-1 mx-auto w-full max-w-[96rem] px-4 sm:px-8 pt-28 sm:pt-32 pb-12 grid lg:grid-cols-[1fr_1.15fr] gap-8 lg:gap-0 items-center"
      >
        <SparkleCursor targetRef={areaRef} />

        {/* editorial copy — oversized */}
        <div className="relative z-20 lg:pr-0">
          <h1 className="font-bold tracking-[-0.05em] leading-[0.82] text-[clamp(4.6rem,12.5vw,11.5rem)] text-ink whitespace-nowrap">
            GRIFTERS
          </h1>
          <p className="mt-4 sm:mt-6 text-3xl sm:text-5xl font-medium tracking-tight">
            Hollywood, <span className="text-rh-green">minted.</span>
          </p>
          <p className="mt-5 font-pixel text-[11px] sm:text-xs text-ink-soft flex items-center gap-2 flex-wrap">
            <span>2,222 CELEBRITY COLLECTIBLES ·</span>
            <RobinhoodFeather size={12} className="inline-block" />
            <span>ROBINHOOD CHAIN</span>
          </p>
          <div className="mt-4 inline-block border-2 border-ink/80 bg-white/90 px-5 py-3.5"
            style={{ boxShadow: "6px 6px 0 0 rgba(46,189,107,0.25)" }}>
            <p className="font-pixel text-[10px] sm:text-[11px] flex items-center gap-2 flex-wrap">
              <span className="text-gold">SOLD OUT · 2,222 / 2,222</span>
              <span className="text-ink-soft">·</span>
              <span className="text-rh-green">REVEAL AUG 22 · 18:00 UTC</span>
            </p>
            <p className="mt-2 font-pixel text-[9px] text-ink-soft">
              PARTNERS 17:00 · WHITELIST 18:00 · PUBLIC 19:00 UTC
            </p>
            {COLLECTION.revealDate && (
              <div className="mt-2.5">
                <Countdown to={COLLECTION.revealDate} />
              </div>
            )}
          </div>
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => openWhitelist()}
              className="btn-pixel font-pixel text-xs sm:text-sm min-h-[52px] inline-flex items-center px-8 border-2 border-ink transition-colors hover:brightness-105"
              style={{ background: "var(--rh-green)", color: "#10321f" }}
            >
              JOIN THE WHITELIST
            </button>
            <a
              href="#collection"
              className="btn-pixel font-pixel text-xs sm:text-sm min-h-[52px] inline-flex items-center px-8 bg-white/90 border-2 border-ink hover:bg-blush transition-colors"
            >
              EXPLORE
            </a>
          </div>
          <p className="mt-8 hidden sm:flex items-center gap-2.5 font-pixel text-[10px] text-ink-soft">
            <PixelCrown className="w-4 h-3 text-gold" />
            RARE TRAITS · SEALED IDENTITIES · REAL-WORLD UNLOCKS
          </p>
        </div>

        {/* aggressive overlapping stack — artwork dominates */}
        <div className="relative h-[480px] sm:h-[620px] lg:h-[46rem] select-none lg:-mr-8">
          {/* partially escaping edge cards */}
          <HeroCard g={fourth} mx={x1} my={y1} rotate={7} parallax={0.94} sizes="(max-width:640px) 30vw, 240px"
            className="w-[34%] sm:w-56 right-[-12%] sm:right-[-7%] top-[-2%] opacity-90 z-[1]" />
          <HeroCard g={fifth} mx={x1} my={y1} rotate={-7} parallax={0.94} sizes="(max-width:640px) 30vw, 230px"
            className="w-[32%] sm:w-52 left-[-7%] sm:left-[-3%] bottom-[2%] opacity-90 z-[1]" />
          {/* medium depth cards */}
          <HeroCard g={second} mx={x1} my={y1} rotate={-4} parallax={0.97} sizes="(max-width:640px) 44vw, 320px"
            className="w-[46%] sm:w-80 right-[0%] sm:right-[2%] bottom-[6%] z-[2] animate-float-slow" />
          <HeroCard g={third} mx={x1} my={y1} rotate={3} parallax={0.97} sizes="(max-width:640px) 42vw, 300px"
            className="w-[44%] sm:w-72 left-[1%] top-[0%] z-[2] animate-float" />
          {/* dominant hero card */}
          <HeroCard g={main} mx={x1} my={y1} priority rotate={-1}
            sizes="(max-width:640px) 78vw, (max-width:1024px) 58vw, 580px"
            className="w-[78%] sm:w-[64%] lg:w-[580px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10" />
        </div>
      </div>

      {/* scroll hint */}
      <div aria-hidden className="relative pb-5 hidden lg:flex justify-center">
        <span className="font-pixel text-[10px] text-ink-soft animate-float">▼ ENTER THE UNIVERSE</span>
      </div>
    </section>
  );
}
