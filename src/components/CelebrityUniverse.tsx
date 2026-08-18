import Image from "next/image";
import { GRIFTERS } from "@/config/collection";
import { Reveal } from "./Reveal";
import { PixelCrown, PixelSparkle } from "./pixel/PixelIcons";
import { PixelEdge, DecoField } from "./pixel/Decor";

const SPREAD = [
  { rotate: -4, lift: "lg:mt-16", z: 3 },
  { rotate: 3, lift: "lg:mt-0", z: 4 },
  { rotate: -1, lift: "lg:-mt-8", z: 5 },
  { rotate: 5, lift: "lg:mt-6", z: 2 },
  { rotate: -3, lift: "lg:mt-20", z: 1 },
];

export function CelebrityUniverse() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--lavender)" }}>
      <PixelEdge color="var(--cream)" />
      {/* the GRIFTERS archive environment */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <Image
          src="/generated/grifters/celebrity-vault.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.16] pixelated"
        />
      </div>
      <div className="relative grain py-16 sm:py-24">
        <DecoField seed={13} count={12} />
        <div className="mx-auto max-w-[96rem] px-4 sm:px-8">
          <Reveal>
            <div className="text-center mb-14 sm:mb-20">
              <p className="font-pixel text-[11px] text-rh-green mb-5 inline-flex items-center gap-2">
                <PixelCrown className="w-4 h-3 text-gold" /> THE UNIVERSE
              </p>
              <h2 className="font-bold tracking-[-0.03em] leading-[0.92] text-[clamp(3rem,7.5vw,6.5rem)]">
                2,222 pieces.
                <br />
                More than one icon.
              </h2>
            </div>
          </Reveal>

          {/* trading cards scattered across an editorial desk — wraps into
              overlapping rows now that the roster is bigger than one hand */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-4 lg:-mx-8 items-start">
            {GRIFTERS.map((g, i) => {
              const s = SPREAD[i % SPREAD.length];
              return (
                <Reveal key={g.id} delay={i * 0.08} variant="deal" className={`${s.lift}`} >
                  <figure
                    className="group relative w-[calc(50vw-2rem)] max-w-[380px] sm:w-72 lg:w-[380px] transition-all duration-300 ease-out hover:rotate-0 hover:-translate-y-3 hover:!z-20"
                    style={{ transform: `rotate(${s.rotate}deg)`, zIndex: s.z }}
                  >
                    <div
                      className="pixel-frame overflow-hidden"
                      style={{ boxShadow: `0 0 0 2px #fff, 0 0 0 4px rgba(42,42,51,.9), 10px 10px 0 0 ${g.accent}` }}
                    >
                      <div className="overflow-hidden aspect-square">
                        <Image
                          src={g.src}
                          alt={g.alt}
                          width={420}
                          height={420}
                          sizes="(max-width:768px) 48vw, 380px"
                          className="pixelated w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                        />
                      </div>
                      <figcaption className="px-4 py-3 border-t-2 border-ink/90 bg-white flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-base sm:text-lg leading-tight">{g.name}</p>
                          <p className="font-pixel text-[9px] text-gold mt-1">{g.archetype}</p>
                        </div>
                        <PixelSparkle className="w-4 h-4 text-rh-green opacity-0 group-hover:opacity-100 transition-opacity" />
                      </figcaption>
                    </div>
                  </figure>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.3}>
            <p className="mt-14 text-center font-pixel text-[10px] text-ink-soft">
              PARTICIPATING ICONS SHOWN · MORE COMBINATIONS THROUGHOUT THE COLLECTION
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
