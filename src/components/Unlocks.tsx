/* eslint-disable @next/next/no-img-element */
import { Reveal } from "./Reveal";
import { PixelSparkle, PixelCrown } from "./pixel/PixelIcons";
import { PixelEdge, DecoField } from "./pixel/Decor";

const TICKETS: { tag: string; title: string; desc: string; art: string; tint: string; rotate: number }[] = [
  { tag: "EVENTS", title: "Private events", desc: "Doors that don't have a public line.", art: "/generated/grifters/pass-event.webp", tint: "var(--blush)", rotate: -2 },
  { tag: "MEET", title: "Meet-and-greet opportunities", desc: "Face to face with the icon on your card.", art: "/generated/grifters/pass-meet.webp", tint: "var(--lavender)", rotate: 1.5 },
  { tag: "MEMORABILIA", title: "Signed & exclusive drops", desc: "Physical pieces with provenance.", art: "/generated/grifters/pass-memorabilia.webp", tint: "var(--champagne)", rotate: -1 },
  { tag: "EXPERIENCES", title: "Celebrity-related experiences", desc: "Moments money can't usually reach.", art: "/generated/grifters/pass-experience.webp", tint: "var(--sky)", rotate: 2 },
  { tag: "DIGITAL", title: "Private digital access", desc: "Content and channels for holders only.", art: "/generated/grifters/pass-digital.webp", tint: "var(--mint)", rotate: -1.5 },
];

function VipPass({ t, i }: { t: (typeof TICKETS)[number]; i: number }) {
  return (
    <div
      className="group relative border-2 border-ink/90 bg-white shadow-[8px_8px_0_0_rgba(42,42,51,0.1)] flex w-full max-w-md transition-all duration-300 hover:rotate-0 hover:-translate-y-2 hover:z-20"
      style={{ transform: `rotate(${t.rotate}deg)`, zIndex: 10 - i }}
    >
      {/* stub */}
      <div
        className="w-20 shrink-0 border-r-2 border-dashed border-ink/50 flex flex-col items-center justify-center gap-2.5 relative py-6"
        style={{ background: t.tint }}
      >
        <span aria-hidden className="absolute -top-[8px] right-[-8px] w-4 h-4 bg-[var(--cream)] border-2 border-ink/90 rounded-full" />
        <span aria-hidden className="absolute -bottom-[8px] right-[-8px] w-4 h-4 bg-[var(--cream)] border-2 border-ink/90 rounded-full" />
        <img src={t.art} alt="" aria-hidden loading="lazy" className="w-12 h-12 object-contain pixelated" />
        <span className="font-pixel text-[8px] rotate-180 [writing-mode:vertical-rl] tracking-widest">VIP · ADMIT 1</span>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between">
          <p className="font-pixel text-[10px] text-rh-green">{t.tag}</p>
          <PixelCrown className="w-4 h-3 text-gold opacity-40 group-hover:opacity-100 transition-opacity" />
        </div>
        <h3 className="mt-2 text-xl font-bold leading-snug">{t.title}</h3>
        <p className="mt-2 text-sm text-ink-soft leading-relaxed">{t.desc}</p>
        <div className="mt-4 pt-3 border-t border-dashed border-ink/20 flex justify-between font-pixel text-[8px] text-ink-soft">
          <span>GRIFTERS ACCESS</span>
          <span>Nº 2222-{String(i + 1).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
}

export function Unlocks() {
  return (
    <section id="unlocks" className="relative" style={{ background: "var(--mint)" }}>
      <PixelEdge color="var(--pearl)" />
      <div className="relative grain py-16 sm:py-24">
        <DecoField seed={23} count={11} />
        {/* the access key — symbol of unlockables */}
        <img
          src="/generated/grifters/grifters-key.webp"
          alt=""
          aria-hidden
          loading="lazy"
          className="hidden lg:block absolute right-[8%] top-24 w-24 opacity-80 pixelated animate-drift-a"
        />
        <div className="mx-auto max-w-[96rem] px-4 sm:px-8">
          <Reveal>
            <div className="text-center mb-14 sm:mb-20">
              <p className="font-pixel text-[11px] text-rh-green mb-5 inline-flex items-center gap-2">
                <PixelSparkle className="w-3 h-3" /> REAL WORLD UNLOCKS
              </p>
              <h2 className="font-bold tracking-[-0.03em] leading-[0.92] text-[clamp(3rem,7.5vw,6.5rem)]">
                Some pixels open
                <br />
                <span className="text-rh-green">real doors.</span>
              </h2>
              <p className="mt-6 text-xl text-ink-soft max-w-2xl mx-auto">
                Certain GRIFTERS rarities may unlock exclusive experiences tied to the
                celebrity represented by the NFT.
              </p>
            </div>
          </Reveal>

          {/* overlapping VIP passes */}
          <div className="flex flex-col items-center gap-5 sm:gap-3 lg:grid lg:grid-cols-2 lg:gap-x-10 lg:gap-y-6 lg:max-w-4xl lg:mx-auto">
            {TICKETS.map((t, i) => (
              <Reveal key={t.tag} delay={i * 0.07} className={`w-full flex ${i % 2 ? "justify-end lg:justify-start lg:ml-10" : "justify-start lg:-ml-4"} lg:w-auto`}>
                <VipPass t={t} i={i} />
              </Reveal>
            ))}
            <Reveal delay={0.4} className="w-full lg:w-auto flex justify-center">
              <div className="border-2 border-ink/30 border-dashed p-6 max-w-md bg-white/50">
                <p className="font-pixel text-[10px] text-ink-soft leading-relaxed">
                  EXACT UNLOCKS VARY BY NFT AND WILL BE DISCLOSED WITH THE COLLECTION
                  METADATA AND APPLICABLE TERMS.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
