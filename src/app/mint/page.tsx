import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MintExperience } from "@/components/MintExperience";
import { FloydMoment } from "@/components/FloydMoment";
import { WhitelistForm } from "@/components/WhitelistForm";
import { PixelCrown, PixelSparkle } from "@/components/pixel/PixelIcons";

export const metadata: Metadata = {
  title: "Mint — GRIFTERS",
  description:
    "Mint your sealed GRIFTERS on Robinhood Chain. Partner holders 17:00 UTC · Whitelist 18:00 · Public 19:00 — Aug 21. $20 per Grifter.",
};

export default function MintPage() {
  return (
    <>
      <Header />
      <main style={{ background: "var(--cream)" }}>
        <div className="pt-28 sm:pt-32 pb-4 text-center px-4">
          <p className="font-pixel text-[11px] text-rh-green mb-4 inline-flex items-center gap-2">
            <PixelCrown className="w-4 h-3 text-gold" /> THE MINT
          </p>
          <h1 className="font-bold tracking-[-0.04em] leading-[0.9] text-[clamp(3rem,9vw,6.5rem)] uppercase">
            Claim your seat.
          </h1>
          <p className="mt-5 text-xl text-ink-soft max-w-xl mx-auto">
            2,222 sealed icons. $20 each. Identity assigned by mined entropy —
            revealed after the curtain drops.
          </p>
        </div>
        <MintExperience />

        <p className="text-center -mt-10 pb-12">
          <a href="/gallery" className="font-pixel text-[10px] text-rh-green underline underline-offset-4 hover:text-ink">
            SEE WHO&apos;S ALREADY MINTED →
          </a>
        </p>

        <FloydMoment compact />

        {/* final whitelist — last call before the list locks on-chain */}
        <div id="final-whitelist" className="mx-auto max-w-3xl px-4 sm:px-8 pb-24">
          <div className="text-center mb-8">
            <p className="font-pixel text-[11px] text-rh-green mb-4 inline-flex items-center gap-2">
              <PixelSparkle className="w-3 h-3" /> LAST CALL
            </p>
            <h2 className="font-bold tracking-[-0.03em] leading-[0.95] text-4xl sm:text-6xl">
              Not on the list yet?
            </h2>
            <p className="mt-4 text-lg text-ink-soft max-w-xl mx-auto">
              The final whitelist is open until <strong>Aug 21, 15:00 UTC</strong> — get on
              it and mint at 18:00, an hour before the public. Then the list locks on-chain
              for good.
            </p>
          </div>
          <div className="border-4 border-ink/90" style={{ boxShadow: "14px 14px 0 0 rgba(201,162,75,0.3)" }}>
            <WhitelistForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
