import { Reveal } from "./Reveal";
import { PixelSparkle, PixelCrown } from "./pixel/PixelIcons";
import { PixelEdge, DecoField } from "./pixel/Decor";

const MANIFEST_HASH = process.env.NEXT_PUBLIC_MANIFEST_HASH || null;
const REVEAL_CONTRACT = process.env.NEXT_PUBLIC_REVEAL_CONTRACT || null;
const EXPLORER = process.env.NEXT_PUBLIC_EXPLORER_URL || "https://robinhoodchain.blockscout.com";

/**
 * The DERP-conductor reveal, explained honestly (StonkPit copy
 * discipline: never "provably fair" / "unbiasable" / "VRF-grade").
 */
export function ProvablySealed() {
  return (
    <section id="provably-sealed" className="relative" style={{ background: "var(--rh-pale)" }}>
      <PixelEdge color="var(--pearl)" />
      <div className="relative grain py-16 sm:py-24">
        <DecoField seed={29} count={9} />
        <div className="mx-auto max-w-[96rem] px-4 sm:px-8">
          <Reveal>
            <div className="mb-12 max-w-3xl">
              <p className="font-pixel text-[11px] text-rh-green mb-3 flex items-center gap-2">
                <PixelSparkle className="w-3 h-3" /> THE REVEAL, ON-CHAIN
              </p>
              <h2 className="text-5xl sm:text-7xl font-bold tracking-[-0.03em] leading-[0.95]">
                Sealed by real
                <br />
                mining work.
              </h2>
              <p className="mt-6 text-xl text-ink-soft leading-relaxed">
                Which identity lands on which Grifter isn&apos;t decided by our server —
                it&apos;s decided by one word of entropy mined out of real proof-of-work
                on Robinhood Chain, via{" "}
                <a
                  href="https://stonkpit.xyz/#/conductor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-rh-green decoration-2 underline-offset-4 hover:text-rh-green transition-colors"
                >
                  StonkPit&apos;s DERP conductor
                </a>
                .
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
            {[
              {
                n: "01",
                t: "COMMIT",
                d: "Before any entropy exists, the full 2,222-identity list is hashed and the hash is locked into the reveal contract. We can never reorder it.",
              },
              {
                n: "02",
                t: "MINE",
                d: "One entropy word is produced by real miners doing real sha256 work after our request lands — folded across every live mine tape.",
              },
              {
                n: "03",
                t: "VERIFY",
                d: "The word assigns every identity through one pure function. We publish the manifest; anyone can recompute all 2,222 assignments forever.",
              },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="border-2 border-ink/90 bg-white p-7 h-full shadow-[8px_8px_0_0_rgba(46,189,107,0.15)]">
                  <p className="font-pixel text-[10px] text-gold">{s.n}</p>
                  <h3 className="mt-2 text-2xl font-bold">{s.t}</h3>
                  <p className="mt-3 text-sm text-ink-soft leading-relaxed">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-8 max-w-5xl border-2 border-ink/90 bg-white p-6 sm:p-7">
              <p className="font-pixel text-[10px] text-ink-soft mb-3 flex items-center gap-2">
                <PixelCrown className="w-4 h-3 text-gold" /> MANIFEST COMMITMENT
              </p>
              {MANIFEST_HASH ? (
                <code className="block font-pixel text-[10px] sm:text-[11px] text-rh-green break-all bg-cream border border-ink/20 px-4 py-3">
                  {MANIFEST_HASH}
                </code>
              ) : (
                <p className="font-pixel text-[10px] text-ink-soft">PUBLISHING WITH DEPLOYMENT</p>
              )}
              <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 font-pixel text-[9px] text-ink-soft">
                <span>
                  REVEAL CONTRACT:{" "}
                  {REVEAL_CONTRACT ? (
                    <a
                      href={`${EXPLORER}/address/${REVEAL_CONTRACT}?tab=contract`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rh-green underline underline-offset-2"
                    >
                      {REVEAL_CONTRACT.slice(0, 10)}…{REVEAL_CONTRACT.slice(-6)}
                    </a>
                  ) : (
                    <span className="text-gold">DEPLOYING</span>
                  )}
                </span>
                <span>ENTROPY: STONKPIT DERP CONDUCTOR · ROBINHOOD CHAIN</span>
              </div>
              <p className="mt-4 text-[13px] text-ink-soft leading-relaxed max-w-3xl">
                Honest fine print: the entropy is sealed by real mining work and economically
                secured — not VRF-grade. The sealed manifest (published with the reveal, hash
                committed on-chain first) is what makes the draw impossible for anyone,
                including us, to aim. Metadata file hosting is conventional; the assignment
                itself is the on-chain part.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
