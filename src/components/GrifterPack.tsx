import { PixelCrown, PixelSparkle } from "./pixel/PixelIcons";

/**
 * Sealed GRIFTERS collectible pack — recurring packaging motif.
 * Pure CSS, light cream/mint/pink wrapper with a foil crimp top and bottom.
 */
export function GrifterPack({ className = "", scale = 1 }: { className?: string; scale?: number }) {
  return (
    <div
      className={`relative select-none ${className}`}
      style={{ width: 190 * scale, height: 260 * scale }}
      role="img"
      aria-label="Sealed GRIFTERS collectible pack — one digital collectible, identity sealed"
    >
      {/* crimped foil top */}
      <div
        className="absolute top-0 inset-x-0 h-[7%] border-2 border-ink/90"
        style={{
          background:
            "repeating-linear-gradient(90deg,#f4e7cd 0 6px,#fdfbf7 6px 12px,#e0f4e9 12px 18px)",
        }}
      />
      {/* body */}
      <div
        className="absolute inset-x-0 top-[6.5%] bottom-[6.5%] border-2 border-ink/90 flex flex-col items-center justify-between py-[9%] px-3"
        style={{
          background:
            "linear-gradient(165deg,#fdfbf7 0%,#f9dfe9 34%,#e9e4f8 62%,#e0f4e9 100%)",
          boxShadow: "6px 6px 0 0 rgba(42,42,51,0.12)",
        }}
      >
        <div className="pixel-checker absolute inset-0 opacity-40" aria-hidden />
        <div className="relative flex flex-col items-center gap-[6%] text-center h-full justify-center">
          <PixelCrown style={{ width: 44 * scale, height: 33 * scale }} className="text-gold" />
          <p className="font-pixel tracking-widest text-ink" style={{ fontSize: 15 * scale }}>
            GRIFTERS
          </p>
          <div className="w-3/4 border-t-2 border-dashed border-ink/30" />
          <p className="font-pixel text-ink-soft" style={{ fontSize: 7.5 * scale }}>
            1 DIGITAL COLLECTIBLE
          </p>
          <p className="font-pixel text-gold" style={{ fontSize: 7.5 * scale }}>
            IDENTITY SEALED
          </p>
          <p className="font-pixel" style={{ fontSize: 6.5 * scale, color: "var(--rh-green)" }}>
            ROBINHOOD CHAIN
          </p>
          <p className="font-pixel text-ink-soft" style={{ fontSize: 13 * scale }} aria-hidden>
            ?
          </p>
          <PixelSparkle style={{ width: 12 * scale, height: 12 * scale }} className="text-rh-green" />
        </div>
      </div>
      {/* crimped foil bottom */}
      <div
        className="absolute bottom-0 inset-x-0 h-[7%] border-2 border-ink/90"
        style={{
          background:
            "repeating-linear-gradient(90deg,#e0f4e9 0 6px,#fdfbf7 6px 12px,#f4e7cd 12px 18px)",
        }}
      />
    </div>
  );
}
