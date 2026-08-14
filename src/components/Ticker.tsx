import { PixelSparkle } from "./pixel/PixelIcons";

const ITEMS = [
  "2,222 GRIFTERS",
  "HOLLYWOOD ONCHAIN",
  "REAL WORLD UNLOCKS",
  "ROBINHOOD CHAIN",
  "IDENTITY LOCKED",
  "REVEAL PENDING",
];

export function Ticker() {
  const row = (
    <>
      {ITEMS.map((t) => (
        <span key={t} className="inline-flex items-center gap-6 mx-3">
          <span className="font-pixel text-[11px] sm:text-xs text-ink whitespace-nowrap">{t}</span>
          <PixelSparkle className="w-3 h-3 text-rh-green shrink-0" />
        </span>
      ))}
    </>
  );

  return (
    <div
      className="border-y-2 border-ink/90 bg-rh-pale py-3.5 overflow-hidden ticker-mask"
      aria-label="Collection highlights ticker"
    >
      <div className="flex w-max animate-ticker" aria-hidden>
        <div className="flex items-center">{row}</div>
        <div className="flex items-center">{row}</div>
      </div>
    </div>
  );
}
