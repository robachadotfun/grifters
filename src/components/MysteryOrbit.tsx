"use client";

import { PixelCrown, PixelDiamond, PixelQuestion, PixelStar, PixelTicket, PixelSparkle } from "./pixel/PixelIcons";

const ICONS = [PixelCrown, PixelDiamond, PixelQuestion, PixelStar, PixelTicket, PixelSparkle];

/**
 * Barely-there orbit of tiny collectible icons circling the sealed pack.
 * ~52s per rotation. Desktop only; disabled for reduced motion via CSS.
 */
export function MysteryOrbit({ radius = 150 }: { radius?: number }) {
  return (
    <div
      aria-hidden
      className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none orbit-ring"
      style={{ width: radius * 2, height: radius * 2 }}
    >
      {ICONS.map((Icon, i) => {
        const a = (i / ICONS.length) * Math.PI * 2;
        return (
          <span
            key={i}
            className="absolute orbit-item"
            style={{
              left: radius + Math.cos(a) * radius - 8,
              top: radius + Math.sin(a) * radius - 8,
            }}
          >
            <Icon className="w-4 h-4 text-ink/15" />
          </span>
        );
      })}
    </div>
  );
}
