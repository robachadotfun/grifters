import { Reveal } from "./Reveal";
import { PixelEdge, DecoField } from "./pixel/Decor";
import { StepPath } from "./StepPath";

const STEPS = [
  { n: "01", t: "CONNECT", d: "Connect your wallet.", c: "var(--powder)" },
  { n: "02", t: "MINT", d: "Choose your quantity.", c: "var(--lavender)" },
  { n: "03", t: "SEALED", d: "Your icon stays hidden.", c: "var(--mint)" },
  { n: "04", t: "REVEAL", d: "Discover your celebrity.", c: "var(--blush)" },
  { n: "05", t: "UNLOCK", d: "Eligible NFTs may include access.", c: "var(--champagne)" },
];

export function HowItWorks() {
  return (
    <section className="relative" style={{ background: "var(--cream)" }}>
      <PixelEdge color="var(--rh-pale)" />
      <div className="relative grain py-12 sm:py-16">
        <DecoField seed={37} count={9} />
        <div className="mx-auto max-w-[96rem] px-4 sm:px-8">
          <Reveal>
            <h2 className="text-5xl sm:text-7xl font-bold tracking-[-0.03em] mb-14 sm:mb-20 text-center">
              How it works.
            </h2>
          </Reveal>
          <div className="relative max-w-7xl mx-auto">
            {/* animated pastel path connecting the steps */}
            <StepPath />
            <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-12">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.08}>
                  <li className="relative text-center">
                    <span
                      className="font-pixel text-[5.5rem] sm:text-[7rem] block leading-none select-none"
                      style={{ color: s.c, textShadow: "4px 4px 0 rgba(42,42,51,0.12)" }}
                    >
                      {s.n}
                    </span>
                    <h3 className="font-pixel text-base mt-5 text-ink">{s.t}</h3>
                    <p className="mt-2 text-base text-ink-soft leading-relaxed">{s.d}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
