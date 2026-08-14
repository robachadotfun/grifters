import type { CSSProperties, ReactNode } from "react";
import {
  PixelCamera,
  PixelChain,
  PixelCrown,
  PixelDiamond,
  PixelFlash,
  PixelHeart,
  PixelPalm,
  PixelSparkle,
  PixelStar,
  PixelTicket,
} from "./PixelIcons";

/** Pixel-stepped boundary between two section backgrounds. */
export function PixelEdge({ color, className = "" }: { color: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={`pixel-edge ${className}`}
      style={{ "--edge": color } as CSSProperties}
    />
  );
}

const DECO_ICONS = [
  PixelStar,
  PixelCrown,
  PixelCamera,
  PixelTicket,
  PixelDiamond,
  PixelChain,
  PixelPalm,
  PixelSparkle,
  PixelHeart,
  PixelFlash,
];

/**
 * Deterministic scattering of very faint pixel motifs (3–12% opacity).
 * seed varies the arrangement per section.
 */
export function DecoField({ seed = 0, count = 10, className = "" }: { seed?: number; count?: number; className?: string }) {
  const items = Array.from({ length: count }, (_, i) => {
    const k = (i + 1) * (seed + 7) * 2654435761;
    const rnd = (n: number, mod: number) => Math.abs((k >> n) % mod);
    const Icon = DECO_ICONS[rnd(3, DECO_ICONS.length)];
    return {
      Icon,
      left: 2 + rnd(5, 96),
      top: 4 + rnd(9, 90),
      size: 14 + rnd(13, 26),
      opacity: 0.03 + rnd(17, 9) / 100,
      rotate: rnd(21, 4) * 90,
      key: i,
    };
  });
  return (
    <div aria-hidden className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {items.map(({ Icon, left, top, size, opacity, rotate, key }) => (
        <Icon
          key={key}
          className="absolute text-ink"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: size,
            height: size,
            opacity,
            transform: `rotate(${rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/** Section shell with tinted background, grain, deco + stepped top edge. */
export function Zone({
  id,
  bg,
  edgeFrom,
  seed,
  children,
  className = "",
  deco = true,
}: {
  id?: string;
  bg: string;
  edgeFrom?: string;
  seed?: number;
  children: ReactNode;
  className?: string;
  deco?: boolean;
}) {
  return (
    <section id={id} className="relative" style={{ background: bg }}>
      {edgeFrom && <PixelEdge color={edgeFrom} />}
      <div className={`relative grain ${className}`}>
        {deco && <DecoField seed={seed ?? 1} />}
        {children}
      </div>
    </section>
  );
}
