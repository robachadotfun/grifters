/* eslint-disable @next/next/no-img-element */
import { RARITY_META, type Rarity } from "@/config/collection";
import { Reveal } from "./Reveal";
import { PixelSparkle, PixelCrown } from "./pixel/PixelIcons";
import { PixelEdge, DecoField } from "./pixel/Decor";

const ORDER: Rarity[] = ["COMMON", "RARE", "EPIC", "LEGENDARY", "ICONIC"];

/** generated gemstone per tier with its idle-motion class */
const GEMS: Record<Rarity, { src: string; motion: string }> = {
  COMMON: { src: "/generated/grifters/gem-common.webp", motion: "" },
  RARE: { src: "/generated/grifters/gem-rare.webp", motion: "animate-glint" },
  EPIC: { src: "/generated/grifters/gem-epic.webp", motion: "animate-glint [animation-delay:2s]" },
  LEGENDARY: { src: "/generated/grifters/gem-legendary.webp", motion: "animate-foil" },
  ICONIC: { src: "/generated/grifters/ultra-crown.webp", motion: "animate-foil" },
};

export function RaritySection() {
  return (
    <section className="relative" style={{ background: "var(--pearl)" }}>
      <PixelEdge color="var(--lavender)" />
      <div className="relative grain py-16 sm:py-24">
        <DecoField seed={17} count={10} />
        <div className="mx-auto max-w-[96rem] px-4 sm:px-8">
          <Reveal>
            <div className="mb-12 sm:mb-16 max-w-2xl">
              <p className="font-pixel text-[11px] text-rh-green mb-3 flex items-center gap-2">
                <PixelSparkle className="w-3 h-3" /> RARITY
              </p>
              <h2 className="text-5xl sm:text-7xl font-bold tracking-[-0.03em] leading-[0.95]">
                Five tiers of shine.
              </h2>
              <p className="mt-5 text-xl text-ink-soft">
                Rarity shapes trait density and unlock eligibility — the ladder climbs
                from everyday icons to once-in-a-collection legends.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
            {ORDER.map((r, i) => {
              const m = RARITY_META[r];
              const legendary = r === "ICONIC";
              return (
                <Reveal key={r} delay={i * 0.08}>
                  <div
                    className={`relative border-2 border-ink/90 p-7 flex flex-col transition-transform duration-300 hover:-translate-y-2 ${
                      legendary
                        ? "lg:-mt-10 lg:pb-12 lg:scale-[1.06] overflow-hidden shadow-[12px_12px_0_0_rgba(201,162,75,0.4)] border-[3px]"
                        : "shadow-[8px_8px_0_0_rgba(42,42,51,0.08)]"
                    }`}
                    style={{
                      background: legendary
                        ? "linear-gradient(160deg,#FFFDF5,#F7EBCE 70%,#F0DFAE)"
                        : m.bg,
                    }}
                  >
                    {legendary && (
                      <>
                        {/* foil shimmer sweep */}
                        <div className="shimmer-bar opacity-70" aria-hidden />
                        <PixelSparkle className="absolute top-4 right-4 w-5 h-5 text-gold animate-twinkle" />
                        <PixelCrown className="absolute top-3 left-6 w-9 h-7 text-gold" />
                      </>
                    )}
                    <img
                      src={GEMS[r].src}
                      alt={`${m.label} rarity gemstone`}
                      loading="lazy"
                      className={`${legendary ? "w-16 h-16" : "w-14 h-14"} object-contain pixelated ${GEMS[r].motion}`}
                    />
                    {legendary && (
                      <img
                        src="/generated/grifters/grifters-key.webp"
                        alt=""
                        aria-hidden
                        loading="lazy"
                        className="absolute bottom-16 right-5 w-10 opacity-60 pixelated animate-float-slow"
                      />
                    )}
                    <h3 className={`mt-6 font-bold ${legendary ? "text-3xl text-gold" : "text-2xl"}`}>{m.label}</h3>

                    <div className="mt-5">
                      <p className="font-pixel text-[9px] text-ink-soft mb-2">TRAIT DENSITY</p>
                      <div className="flex gap-1.5" aria-label={`Trait density ${m.density} of 4`}>
                        {[1, 2, 3, 4].map((n) => (
                          <span
                            key={n}
                            className="w-5 h-5 border-2 border-ink/70"
                            style={{ background: n <= m.density ? m.gem : "rgba(255,255,255,0.6)" }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 flex-1">
                      <p className="font-pixel text-[9px] text-ink-soft mb-2">UNLOCK POTENTIAL</p>
                      <p className="text-base font-medium">{m.unlockOdds}</p>
                    </div>

                    <p className="mt-6 font-pixel text-[9px]" style={{ color: m.gem }}>
                      {legendary ? "★ ONCE-IN-A-COLLECTION" : `TIER ${"◆".repeat(m.density)}`}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.25}>
            <p className="mt-10 font-pixel text-[10px] text-ink-soft max-w-2xl">
              RARITY DESCRIBES COLLECTIBLE ATTRIBUTES ONLY — IT IS NOT A PROMISE OF VALUE.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
