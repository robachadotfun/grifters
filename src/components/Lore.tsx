import Image from "next/image";
import { GRIFTERS } from "@/config/collection";
import { Reveal } from "./Reveal";
import { PixelTicket, PixelCamera, PixelStar, PixelFlash, PixelSparkle, PixelCrown } from "./pixel/PixelIcons";
import { PixelEdge, DecoField } from "./pixel/Decor";
import { ParallaxImg } from "./ParallaxImg";
import { PaparazziFlash } from "./PaparazziFlash";

const ERAS = ["POSTERS", "AUTOGRAPHS", "TRADING CARDS", "MAGAZINES", "GRIFTERS"];

/** Film strip loaded with cropped NFT portraits, crawling slowly. */
function FilmStrip() {
  const frames = [...GRIFTERS, ...GRIFTERS];
  const row = (key: string) => (
    <div key={key} className="flex shrink-0">
      {frames.map((g, i) => (
        <div key={`${key}-${i}`} className="w-40 sm:w-56 shrink-0 border-r-4 border-ink/90 relative overflow-hidden">
          <Image
            src={g.src}
            alt=""
            width={224}
            height={224}
            sizes="224px"
            className="pixelated w-full aspect-square object-cover scale-[1.45] origin-[55%_30%]"
          />
          {/* frame number */}
          <span className="absolute bottom-1 right-2 font-pixel text-[8px] text-cream/90">
            {String((i % 5) + 1).padStart(2, "0")}A
          </span>
        </div>
      ))}
    </div>
  );
  return (
    <div className="film-rail border-y-4 border-ink/90 bg-ink/90 py-2.5 overflow-hidden" aria-hidden>
      {/* sprocket holes */}
      <div className="flex gap-6 px-2 pb-2">
        {Array.from({ length: 60 }).map((_, i) => (
          <span key={i} className={`w-3.5 h-2.5 shrink-0 ${i % 10 === 4 ? "bg-mint" : "bg-cream"}`} />
        ))}
      </div>
      <div className="flex w-max animate-film overflow-hidden">
        {row("a")}
        {row("b")}
      </div>
      <div className="flex gap-6 px-2 pt-2">
        {Array.from({ length: 60 }).map((_, i) => (
          <span key={i} className="w-3.5 h-2.5 bg-cream shrink-0" />
        ))}
      </div>
    </div>
  );
}

export function Lore() {
  return (
    <section id="lore" className="relative overflow-hidden" style={{ background: "var(--cream)" }}>
      <PixelEdge color="var(--sky)" />
      <div className="relative grain pt-16 sm:pt-24 pb-0">
        <DecoField seed={9} count={14} />

        {/* paparazzi flash system */}
        <PaparazziFlash />

        <div aria-hidden className="absolute inset-0 pointer-events-none hidden sm:block">
          <PixelTicket className="absolute left-[5%] top-[14%] w-14 h-9 text-blush animate-float-slow" />
          <PixelCamera className="absolute right-[7%] top-[16%] w-12 h-10 text-powder animate-float" />
          <PixelStar className="absolute left-[12%] bottom-[30%] w-7 h-7 text-champagne animate-twinkle" />
          <PixelFlash className="absolute right-[14%] bottom-[38%] w-5 h-8 text-gold-soft animate-twinkle [animation-delay:1.4s]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-8 text-center">
          <Reveal>
            <p className="font-pixel text-[11px] text-rh-green mb-8 inline-flex items-center gap-2">
              <PixelCrown className="w-4 h-3 text-gold" /> THE LORE
            </p>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.88] text-[clamp(3.2rem,9vw,8rem)] uppercase">
              Fame was
              <br />
              always
              <br />
              <span className="text-gold">collectible.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-10 text-xl sm:text-2xl leading-relaxed text-ink max-w-3xl mx-auto">
              Posters. Magazine covers. Autographs. Trading cards.
              <br className="hidden sm:block" />
              Every generation collected its icons differently.
            </p>
            <p className="mt-5 text-xl sm:text-2xl font-semibold">
              GRIFTERS brings celebrity culture onchain.
            </p>
          </Reveal>

          {/* memorabilia timeline collage — physical → digital, drifting on scroll */}
          <Reveal delay={0.18} variant="develop">
            <div className="mt-12 pixel-frame p-1.5 max-w-4xl mx-auto">
              <ParallaxImg
                src="/generated/grifters/fame-history-collage.webp"
                alt="Pixel-art timeline of celebrity memorabilia: cinema tickets, magazines, film reel, autograph, VHS, trading card and a glowing digital collectible card"
                className="h-44 sm:h-64"
                imgClassName="h-full"
              />
            </div>
          </Reveal>

          {/* era timeline */}
          <Reveal delay={0.22}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-y-4">
              {ERAS.map((era, i) => (
                <span key={era} className="flex items-center">
                  <span
                    className={`font-pixel text-[10px] sm:text-xs px-3.5 py-2.5 border-2 ${
                      era === "GRIFTERS"
                        ? "border-ink bg-ink text-white shadow-[4px_4px_0_0_var(--gold)]"
                        : "border-ink/60 bg-white shadow-[3px_3px_0_0_rgba(42,42,51,0.12)]"
                    }`}
                  >
                    {era}
                  </span>
                  {i < ERAS.length - 1 && (
                    <span className="font-pixel text-rh-green text-sm px-2 sm:px-3" aria-hidden>
                      →
                    </span>
                  )}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.28}>
            <p className="mt-10 mb-14 text-base sm:text-lg text-ink-soft leading-relaxed max-w-2xl mx-auto">
              2,222 pixel artifacts built around participating cultural icons. Each
              Grifter combines identity, traits, rarity and access into a collectible
              made for the internet generation.
            </p>
          </Reveal>
        </div>

        {/* film strip full-bleed */}
        <Reveal delay={0.1}>
          <FilmStrip />
          <div className="mx-auto max-w-6xl px-4 sm:px-8 flex justify-between py-4 font-pixel text-[10px] text-ink-soft">
            <span className="flex items-center gap-2">
              <PixelSparkle className="w-3 h-3 text-gold" /> EXHIBIT 001 — THE ICON REEL
            </span>
            <span>BLOCK #PENDING · ROBINHOOD CHAIN</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
