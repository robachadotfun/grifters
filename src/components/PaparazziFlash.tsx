"use client";

import { useEffect, useRef, useState } from "react";
import { PixelSparkle } from "./pixel/PixelIcons";

/**
 * Ambient paparazzi flash system: brief soft flashes at random 8–18s intervals,
 * occasionally leaving a four-point pixel star near the flash point.
 * Respects prefers-reduced-motion. Renders nothing on the server.
 */
export function PaparazziFlash({ className = "" }: { className?: string }) {
  const [flash, setFlash] = useState<{ x: number; y: number; star: boolean; id: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    const schedule = () => {
      const wait = 8000 + Math.random() * 10000;
      timer.current = setTimeout(() => {
        if (!alive) return;
        setFlash({
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 70,
          star: Math.random() < 0.45,
          id: Date.now(),
        });
        setTimeout(() => alive && setFlash(null), 1400);
        schedule();
      }, wait);
    };
    schedule();
    return () => {
      alive = false;
      clearTimeout(timer.current);
    };
  }, []);

  if (!flash) return null;
  return (
    <div aria-hidden className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <div
        key={flash.id}
        className="absolute w-40 h-40 rounded-full bg-white blur-3xl flashbulb"
        style={{ left: `${flash.x}%`, top: `${flash.y}%`, opacity: 0.55 }}
      />
      {flash.star && (
        <PixelSparkle
          className="absolute w-4 h-4 text-gold-soft"
          style={{
            left: `${flash.x + 4}%`,
            top: `${flash.y + 5}%`,
            animation: "sparkle-pop 1.2s ease-out 0.15s both",
          }}
        />
      )}
    </div>
  );
}
