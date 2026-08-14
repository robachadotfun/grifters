import Image from "next/image";
import { PREREVEAL } from "@/config/collection";
import { Reveal } from "./Reveal";
import { PixelQuestion, PixelSparkle, PixelCrown } from "./pixel/PixelIcons";
import { PixelEdge, DecoField } from "./pixel/Decor";
import { Curtains } from "./Curtains";

const LOCKED = [
  { label: "ICON ···· ???", pos: "left-[-3.5rem] top-[10%] rotate-[-4deg]", delay: "0s" },
  { label: "TRAITS ·· LOCKED", pos: "right-[-4rem] top-[22%] rotate-[3deg]", delay: "1.2s" },
  { label: "RARITY ·· LOCKED", pos: "left-[-4.5rem] top-[42%] rotate-[2deg]", delay: "2.1s" },
  { label: "ACCESS ·· LOCKED", pos: "right-[-3.5rem] top-[56%] rotate-[-3deg]", delay: "0.6s" },
];

export function PreReveal() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--blush)" }}>
      <PixelEdge color="var(--mint)" />
      {/* premiere stage environment */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <Image
          src="/generated/grifters/reveal-stage.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30 pixelated"
        />
      </div>
      <Curtains />
      <div className="relative grain py-16 sm:py-24">
        <DecoField seed={29} count={10} />
        {/* identity-lock particles */}
        <div aria-hidden className="absolute inset-0 pointer-events-none hidden sm:block">
          <span className="absolute left-[12%] top-[16%] font-pixel text-sm text-ink/15 animate-float">???</span>
          <PixelCrown className="absolute right-[14%] top-[12%] w-6 h-5 text-gold/25 animate-float-slow" />
          <span className="absolute left-[8%] bottom-[20%] font-pixel text-[10px] text-ink/15 animate-float-slow">LOCKED</span>
          <PixelSparkle className="absolute right-[10%] bottom-[26%] w-4 h-4 text-gold/30 animate-twinkle" />
          <span className="absolute right-[22%] bottom-[10%] font-pixel text-[10px] text-ink/15 animate-float">ICON ?</span>
        </div>
        <div className="mx-auto max-w-[96rem] px-4 sm:px-8 grid lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-10 items-center">
          {/* mystery centerpiece */}
          <Reveal className="order-2 lg:order-1">
            <div className="relative mx-auto w-full max-w-2xl lg:max-w-3xl px-10 sm:px-16">
              <div
                className="pixel-frame p-3 sm:p-4 animate-float-slow relative overflow-visible"
                style={{ boxShadow: "0 0 0 2px #fff, 0 0 0 4px rgba(42,42,51,.9), 16px 16px 0 0 rgba(255,255,255,0.7)" }}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={PREREVEAL.src}
                    alt={PREREVEAL.alt}
                    width={720}
                    height={720}
                    sizes="(max-width:640px) 88vw, 620px"
                    className="pixelated w-full aspect-square object-cover"
                  />
                  {/* slow shimmer sweeping the veil every ~8s */}
                  <div className="shimmer-bar" style={{ animationDuration: "8.5s" }} aria-hidden />
                </div>
                <div className="flex items-center justify-between px-2 pt-4 pb-1">
                  <span className="font-pixel text-[11px] text-ink-soft">GRIFTER #????</span>
                  <span className="font-pixel text-[11px] text-gold">SEALED</span>
                </div>

                {/* floating locked metadata */}
                {LOCKED.map((c) => (
                  <span
                    key={c.label}
                    className={`hidden sm:inline-flex absolute ${c.pos} pixel-frame px-3 py-2 font-pixel text-[9px] text-ink-soft animate-float`}
                    style={{ animationDelay: c.delay }}
                    aria-hidden
                  >
                    {c.label}
                  </span>
                ))}
              </div>
              <PixelSparkle className="absolute -top-5 right-6 w-7 h-7 text-gold animate-twinkle" aria-hidden />
              <PixelSparkle className="absolute -bottom-4 left-4 w-5 h-5 text-powder animate-twinkle [animation-delay:1.5s]" aria-hidden />
            </div>
          </Reveal>

          <div className="order-1 lg:order-2 text-center lg:text-left">
            <Reveal>
              <p className="font-pixel text-[11px] text-rh-green mb-4 inline-flex items-center gap-2">
                <PixelQuestion className="w-3 h-4 text-gold" /> THE REVEAL
              </p>
              <h2 className="font-bold tracking-[-0.03em] leading-[0.9] text-[clamp(3rem,7vw,6rem)] uppercase">
                Identity
                <br />
                locked.
              </h2>
              <p className="mt-6 text-xl text-ink-soft max-w-md leading-relaxed mx-auto lg:mx-0">
                Your celebrity remains sealed until reveal. Nobody — not even us —
                knows which icon steps out from behind the curtain.
              </p>
              <ul className="mt-9 space-y-3.5 max-w-md mx-auto lg:mx-0 text-left">
                {[
                  "Mint a sealed Grifter",
                  "Hold through the countdown",
                  "Curtains open — icon, traits and rarity revealed",
                ].map((s, i) => (
                  <li key={s} className="flex items-center gap-4">
                    <span className="font-pixel text-[11px] w-9 h-9 shrink-0 border-2 border-ink bg-white shadow-[3px_3px_0_0_rgba(42,42,51,0.15)] inline-flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-lg">{s}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
