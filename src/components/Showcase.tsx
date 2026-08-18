"use client";

import Image from "next/image";
import { useRef, useCallback } from "react";
import { GRIFTERS } from "@/config/collection";
import { Reveal } from "./Reveal";
import { PixelSparkle, PixelCrown } from "./pixel/PixelIcons";
import { PixelEdge, DecoField } from "./pixel/Decor";
import { PaparazziFlash } from "./PaparazziFlash";

const LAYOUT: { i: number; size: number; rotate: number; crop?: boolean; lift?: string }[] = [
  { i: 0, size: 470, rotate: -2, lift: "mt-0" },
  { i: 3, size: 340, rotate: 3, lift: "mt-16" },
  { i: 5, size: 560, rotate: -1, lift: "mt-4" },
  { i: 2, size: 280, rotate: 4, crop: true, lift: "mt-24" },
  { i: 10, size: 470, rotate: -3, lift: "mt-8" },
  { i: 6, size: 370, rotate: 2, lift: "mt-20" },
  { i: 1, size: 290, rotate: -4, crop: true, lift: "mt-2" },
  { i: 15, size: 520, rotate: 1, lift: "mt-12" },
  { i: 8, size: 350, rotate: -3, lift: "mt-20" },
  { i: 11, size: 480, rotate: 2, lift: "mt-4" },
  { i: 7, size: 300, rotate: 4, crop: true, lift: "mt-24" },
  { i: 12, size: 540, rotate: -1, lift: "mt-8" },
  { i: 4, size: 360, rotate: 3, lift: "mt-16" },
  { i: 13, size: 460, rotate: -2, lift: "mt-2" },
  { i: 9, size: 320, rotate: 2, lift: "mt-20" },
  { i: 14, size: 500, rotate: -3, lift: "mt-10" },
];

function Card({ i, size, rotate, crop, lift, idx }: (typeof LAYOUT)[number] & { idx: number }) {
  const g = GRIFTERS[i % GRIFTERS.length];
  const serial = `ICON ${String(41 + idx * 173 + i * 7).padStart(4, "0")}`;
  return (
    <figure
      className={`group relative shrink-0 snap-center transition-transform duration-300 ease-out hover:-translate-y-2.5 hover:rotate-0 ${lift}`}
      style={{ transform: `rotate(${rotate}deg)`, width: `min(${size}px, 78vw)` }}
    >
      <div
        className="pixel-frame overflow-hidden"
        style={{ boxShadow: `0 0 0 2px #fff, 0 0 0 4px rgba(42,42,51,.9), 10px 10px 0 0 ${g.accent}` }}
      >
        <div className="overflow-hidden aspect-square">
          <Image
            src={g.src}
            alt={g.alt}
            width={size}
            height={size}
            sizes={`${size}px`}
            draggable={false}
            className={`pixelated w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05] ${
              crop ? "scale-[1.7] origin-[62%_28%] group-hover:scale-[1.78]" : ""
            }`}
          />
        </div>
        {/* metadata plate on hover */}
        <figcaption className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 border-t-2 border-ink/90 px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-1">
          <span className="font-pixel text-[9px] text-ink-soft">{serial}</span>
          <span className="font-pixel text-[9px] text-right text-gold">{g.rarity}</span>
          <span className="font-pixel text-[11px]">{g.name}</span>
          <span className="font-pixel text-[9px] text-right text-ink-soft self-center">{g.traits} TRAITS</span>
        </figcaption>
      </div>
    </figure>
  );
}

/** Pointer-drag with momentum for the horizontal rail (mouse drag; touch stays native). */
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ down: false, startX: 0, startLeft: 0, vel: 0, lastX: 0, lastT: 0, raf: 0 });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(state.current.raf);
    state.current = { ...state.current, down: true, startX: e.clientX, startLeft: el.scrollLeft, vel: 0, lastX: e.clientX, lastT: performance.now() };
    el.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const s = state.current;
    const el = ref.current;
    if (!s.down || !el) return;
    el.scrollLeft = s.startLeft - (e.clientX - s.startX);
    const now = performance.now();
    const dt = now - s.lastT || 1;
    s.vel = (s.lastX - e.clientX) / dt;
    s.lastX = e.clientX;
    s.lastT = now;
  }, []);

  const onPointerUp = useCallback(() => {
    const s = state.current;
    const el = ref.current;
    if (!s.down || !el) return;
    s.down = false;
    let v = s.vel * 16;
    const glide = () => {
      if (Math.abs(v) < 0.5) return;
      el.scrollLeft += v;
      v *= 0.94;
      s.raf = requestAnimationFrame(glide);
    };
    glide();
  }, []);

  return { ref, onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp };
}

export function Showcase() {
  const drag = useDragScroll();
  return (
    <section id="collection" className="relative overflow-hidden" style={{ background: "var(--pearl)" }}>
      <PixelEdge color="var(--cream)" />
      {/* pixel photo-studio environment behind the gallery */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <Image
          src="/generated/grifters/collection-studio-background.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20 pixelated"
        />
      </div>
      <div className="relative grain pt-14 sm:pt-20 pb-16 sm:pb-20">
        <DecoField seed={3} count={12} />
        <PaparazziFlash />
        <div className="mx-auto max-w-[96rem] px-4 sm:px-8">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-4 mb-10 sm:mb-12">
              <div>
                <p className="font-pixel text-[11px] text-rh-green mb-3 flex items-center gap-2">
                  <PixelSparkle className="w-3 h-3" /> THE COLLECTION
                </p>
                <h2 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.03em] leading-[0.95]">
                  Meet the Grifters.
                </h2>
                <p className="mt-4 text-xl sm:text-2xl text-ink-soft">Icons. Eras. Traits. One collection.</p>
              </div>
              <p className="font-pixel text-[11px] text-ink-soft flex items-center gap-2">
                <PixelCrown className="w-4 h-3 text-gold" /> 2,222 PIECES · 1 UNIVERSE · DRAG →
              </p>
            </div>
          </Reveal>
        </div>

        {/* oversized editorial rail — cards alternate scale + escape the fold */}
        <Reveal delay={0.08}>
          <div
            ref={drag.ref}
            onPointerDown={drag.onPointerDown}
            onPointerMove={drag.onPointerMove}
            onPointerUp={drag.onPointerUp}
            onPointerCancel={drag.onPointerCancel}
            className="flex gap-8 sm:gap-12 items-start overflow-x-auto pb-10 pt-4 px-4 sm:px-[max(2rem,calc((100vw-96rem)/2+2rem))] [scrollbar-width:thin] cursor-grab active:cursor-grabbing select-none"
            role="list"
            aria-label="Grifters gallery"
          >
            {LAYOUT.map((c, idx) => (
              <Card key={idx} {...c} idx={idx} />
            ))}
            <div className="shrink-0 self-center pl-4 pr-10">
              <a href="#mint" className="btn-pixel font-pixel text-xs inline-flex items-center min-h-[52px] px-6 border-2 border-ink bg-white hover:bg-mint whitespace-nowrap">
                MINT YOURS →
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
