import { PixelCrown, PixelSparkle } from "./pixel/PixelIcons";
import { PixelEdge } from "./pixel/Decor";
import { RobinhoodFeather } from "./RobinhoodMark";

export function Footer() {
  return (
    <footer className="bg-cream">
      <PixelEdge color="var(--rh-pale)" />
      {/* the universe ends where it began — pale Hollywood sunset */}
      <div aria-hidden className="relative h-32 sm:h-48 overflow-hidden border-b-2 border-ink/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/generated/grifters/footer-hollywood-sunset.webp"
          alt=""
          loading="lazy"
          className="w-full h-full object-cover object-bottom opacity-80 pixelated"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-transparent to-cream/60" />
      </div>
      <div className="mx-auto max-w-page px-4 sm:px-6 py-12 sm:py-14">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <PixelCrown className="w-7 h-6 text-gold" title="GRIFTERS crown" />
              <span className="font-pixel text-lg tracking-widest">GRIFTERS</span>
            </div>
            <p className="mt-3 font-pixel text-[10px] text-ink-soft">2,222 CELEBRITY ARTIFACTS</p>
            <p className="mt-4 font-pixel text-[9px] text-ink-soft inline-flex items-center gap-2">
              <RobinhoodFeather size={11} /> BUILT ON ROBINHOOD CHAIN
            </p>
          </div>

          <nav className="grid grid-cols-2 sm:grid-cols-3 gap-x-14 gap-y-3" aria-label="Footer">
            <div className="flex flex-col gap-3">
              <span className="font-pixel text-[9px] text-ink-soft">SITE</span>
              {[
                ["Collection", "#collection"],
                ["Lore", "#lore"],
                ["Mint", "#mint"],
                ["FAQ", "#faq"],
              ].map(([label, href]) => (
                <a key={href} href={href} className="text-sm hover:text-rh-green py-1">
                  {label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-pixel text-[9px] text-ink-soft">SOCIAL</span>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-rh-green py-1"
              >
                X
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-pixel text-[9px] text-ink-soft">LEGAL</span>
              <a href="/terms" className="text-sm hover:text-rh-green py-1">Terms</a>
              <a href="/privacy" className="text-sm hover:text-rh-green py-1">Privacy</a>
            </div>
          </nav>
        </div>

        <div className="mt-12 pt-6 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-pixel text-[10px] text-ink-soft inline-flex items-center gap-2">
            <PixelSparkle className="w-3 h-3 text-rh-green" />
            MADE FOR THE CULTURE. MINTED ONCHAIN.
          </p>
          <p className="text-xs text-ink-soft">© {new Date().getFullYear()} GRIFTERS</p>
        </div>
      </div>
    </footer>
  );
}
