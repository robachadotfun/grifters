import { PixelSparkle } from "./pixel/PixelIcons";

const ITEMS = [
  "2,222 ICONS",
  "IDENTITY SEALED",
  "PIXEL CULTURE",
  "ROBINHOOD CHAIN",
  "RARITY",
  "ACCESS",
  "HOLLYWOOD ONCHAIN",
];

/** Second, quieter mid-page ticker. */
export function Ribbon() {
  const row = (
    <>
      {ITEMS.map((t) => (
        <span key={t} className="inline-flex items-center gap-5 mx-2.5">
          <span className="font-pixel text-[10px] text-ink-soft whitespace-nowrap">{t}</span>
          <PixelSparkle className="w-2.5 h-2.5 text-gold-soft shrink-0" />
        </span>
      ))}
    </>
  );
  return (
    <div className="border-y-2 border-ink/15 bg-champagne/40 py-2.5 overflow-hidden ticker-mask" aria-label="Collection ribbon">
      <div className="flex w-max animate-ticker [animation-duration:72s]" aria-hidden>
        <div className="flex items-center">{row}</div>
        <div className="flex items-center">{row}</div>
      </div>
    </div>
  );
}
