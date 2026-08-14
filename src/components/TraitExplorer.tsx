"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GRIFTERS, RARITY_META, type Rarity } from "@/config/collection";
import { Reveal } from "./Reveal";
import { PixelGem, PixelSparkle, PixelCrown } from "./pixel/PixelIcons";
import { PixelEdge, DecoField } from "./pixel/Decor";

/** Conceptual NFT LAB — sample trait values, not final collection metadata. */
const LAYERS: { key: string; label: string; values: string[] }[] = [
  { key: "background", label: "BACKGROUND", values: ["Hollywood", "Paris", "Dubai", "Championship", "Premiere", "Clouds"] },
  { key: "outfit", label: "OUTFIT", values: ["Fur Coat", "Championship Jacket", "Red Carpet", "Suit", "Streetwear"] },
  { key: "eyewear", label: "EYEWEAR", values: ["Black Shades", "Pink Tint", "Reading Frames", "None"] },
  { key: "jewelry", label: "JEWELRY", values: ["Diamond Chain", "Pearl Set", "Heart Pendant", "Gold Cuban"] },
  { key: "accessory", label: "ACCESSORY", values: ["Tiara", "Handbag", "Gloves", "Halo"] },
  { key: "special", label: "SPECIAL", values: ["Camera Flash", "Sparkle Field", "Fan Bubble", "None"] },
];

const RARITIES: Rarity[] = ["COMMON", "RARE", "EPIC", "LEGENDARY"];

/** wardrobe prop shown beside the specimen when a category is explored */
const CATEGORY_PROPS: Record<string, string> = {
  background: "/generated/grifters/trait-halo.webp",
  outfit: "/generated/grifters/trait-tiara.webp",
  eyewear: "/generated/grifters/trait-glasses.webp",
  jewelry: "/generated/grifters/trait-chain.webp",
  accessory: "/generated/grifters/trait-handbag.webp",
  special: "/generated/grifters/trait-special.webp",
};

export function TraitExplorer() {
  const [sel, setSel] = useState<Record<string, number>>({ background: 1, outfit: 0, eyewear: 0, jewelry: 0, accessory: 0, special: 0 });
  const [rarity, setRarity] = useState<Rarity>("LEGENDARY");
  const [activeProp, setActiveProp] = useState<string | null>(null);

  const sum = Object.values(sel).reduce((a, b) => a + b, 0);
  const preview = GRIFTERS[sum % GRIFTERS.length];
  const rm = RARITY_META[rarity];

  return (
    <section className="relative" style={{ background: "var(--sky)" }}>
      <PixelEdge color="var(--pearl)" />
      {/* pale dressing-room environment */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <Image
          src="/generated/grifters/pixel-dressing-room.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.14] pixelated"
        />
      </div>
      <div className="relative grain py-16 sm:py-24">
        <DecoField seed={5} count={10} />
        <div className="mx-auto max-w-[96rem] px-4 sm:px-8">
          <Reveal>
            <div className="mb-12 sm:mb-16 max-w-3xl">
              <p className="font-pixel text-[11px] text-rh-green mb-3 flex items-center gap-2">
                <PixelSparkle className="w-3 h-3" /> THE LAB
              </p>
              <h2 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.03em] leading-[0.95]">
                Every icon has layers.
              </h2>
              <p className="mt-5 text-xl text-ink-soft max-w-xl leading-relaxed">
                The same celebrity can appear across the collection — no two Grifters
                share the same combination.
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-start">
            {/* large specimen */}
            <Reveal>
              <div className="relative mx-auto w-full max-w-2xl lg:sticky lg:top-28">
                <div
                  className="pixel-frame p-3 sm:p-4 transition-all duration-300"
                  style={{ boxShadow: `0 0 0 2px #fff, 0 0 0 4px rgba(42,42,51,.9), 16px 16px 0 0 ${rm.ring}` }}
                >
                  {/* wardrobe prop reveal */}
                  <AnimatePresence>
                    {activeProp && (
                      <motion.img
                        key={activeProp}
                        src={CATEGORY_PROPS[activeProp]}
                        alt=""
                        aria-hidden
                        initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.25 }}
                        className="absolute -top-8 -right-8 w-20 sm:w-24 z-20 pixelated pointer-events-none drop-shadow-[3px_3px_0_rgba(42,42,51,0.2)]"
                      />
                    )}
                  </AnimatePresence>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={preview.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Image
                        src={preview.src}
                        alt={preview.alt}
                        width={680}
                        height={680}
                        sizes="(max-width:640px) 92vw, 620px"
                        className="pixelated w-full aspect-square object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                  {/* animated metadata readout */}
                  <div className="mt-3 border-t-2 border-pearl pt-3 px-1 grid grid-cols-2 gap-y-1.5">
                    <span className="font-pixel text-[10px] text-ink-soft flex items-center gap-2">
                      <PixelCrown className="w-3.5 h-2.5 text-gold" /> LAB SPECIMEN
                    </span>
                    <motion.span
                      key={rarity}
                      initial={{ scale: 1.25 }}
                      animate={{ scale: 1 }}
                      className="font-pixel text-[11px] text-right inline-flex items-center justify-end gap-1.5"
                      style={{ color: rm.gem }}
                    >
                      <PixelGem facets={rm.density} className="w-4 h-3.5 animate-gem" />
                      {rm.label.toUpperCase()}
                    </motion.span>
                    <span className="font-pixel text-[10px] text-ink-soft">TRAITS SELECTED</span>
                    <motion.span key={sum} initial={{ scale: 1.25 }} animate={{ scale: 1 }} className="font-pixel text-[11px] text-right">
                      {String(Object.keys(sel).length).padStart(2, "0")} / 06
                    </motion.span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* cartridge selectors */}
            <Reveal delay={0.08}>
              <div className="space-y-7">
                {LAYERS.map((layer) => (
                  <div
                    key={layer.key}
                    onMouseEnter={() => setActiveProp(layer.key)}
                    onMouseLeave={() => setActiveProp(null)}
                  >
                    <p className="font-pixel text-[10px] text-ink-soft mb-2.5 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-rh-green" /> {layer.label}
                    </p>
                    <div className="flex flex-wrap gap-2.5" role="group" aria-label={layer.label}>
                      {layer.values.map((v, i) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSel((s) => ({ ...s, [layer.key]: i }))}
                          aria-pressed={sel[layer.key] === i}
                          className="cartridge font-pixel text-[10px] min-h-[44px] px-4 inline-flex items-center gap-2"
                        >
                          <PixelSparkle
                            className="w-2 h-2 shrink-0"
                            style={{ color: sel[layer.key] === i ? "var(--gold-soft)" : "var(--powder)" }}
                          />
                          {v.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div>
                  <p className="font-pixel text-[10px] text-ink-soft mb-2.5 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-gold" /> RARITY
                  </p>
                  <div className="flex flex-wrap gap-2.5" role="group" aria-label="Rarity">
                    {RARITIES.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRarity(r)}
                        aria-pressed={rarity === r}
                        className="cartridge font-pixel text-[10px] min-h-[44px] px-4 inline-flex items-center gap-2.5"
                      >
                        <PixelGem
                          facets={RARITY_META[r].density}
                          className="w-4 h-3.5"
                          style={{ color: rarity === r ? RARITY_META[r].ring : RARITY_META[r].gem }}
                        />
                        {RARITY_META[r].label.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="font-pixel text-[9px] text-ink-soft/80 leading-relaxed pt-2">
                  CONCEPT DEMO — SAMPLE TRAIT VALUES. FINAL TRAITS SHIP WITH COLLECTION METADATA.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
