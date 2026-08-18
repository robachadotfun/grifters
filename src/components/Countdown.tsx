"use client";

import { useEffect, useState } from "react";

/** Live countdown to an ISO instant, pixel-styled. Renders nothing until
 *  mounted (avoids SSR/client clock mismatch); shows LIVE NOW at zero. */
export function Countdown({ to, className = "" }: { to: string; className?: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return null;
  const diff = new Date(to).getTime() - now;

  if (diff <= 0) {
    return (
      <span className={`font-pixel text-rh-green ${className}`}>LIVE NOW</span>
    );
  }

  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");

  const cells: { v: string; l: string }[] = [
    { v: pad(d), l: "DAYS" },
    { v: pad(h), l: "HRS" },
    { v: pad(m), l: "MIN" },
    { v: pad(s), l: "SEC" },
  ];

  return (
    <span className={`inline-flex items-end gap-2 ${className}`}>
      {cells.map((c, i) => (
        <span key={c.l} className="inline-flex items-end gap-2">
          <span className="inline-flex flex-col items-center gap-1">
            <span className="font-pixel text-lg sm:text-xl text-ink tabular-nums leading-none">{c.v}</span>
            <span className="font-pixel text-[7px] text-ink-soft">{c.l}</span>
          </span>
          {i < cells.length - 1 && (
            <span className="font-pixel text-lg text-ink-soft leading-none pb-3">:</span>
          )}
        </span>
      ))}
    </span>
  );
}
