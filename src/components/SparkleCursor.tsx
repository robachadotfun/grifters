"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop-only four-point sparkle trail over hero artwork.
 * Disabled on touch devices and for reduced-motion users.
 */
export function SparkleCursor({ targetRef }: { targetRef: React.RefObject<HTMLElement> }) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    const layer = layerRef.current;
    if (!target || !layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let last = 0;
    const colors = ["#C9A24B", "#2EBD6B", "#8FB8E8", "#E7A6C4"];

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - last < 90) return;
      last = now;
      const rect = layer.getBoundingClientRect();
      const s = document.createElement("span");
      const size = 6 + Math.round(Math.random() * 8);
      const c = colors[Math.floor(Math.random() * colors.length)];
      s.style.cssText = `position:absolute;left:${e.clientX - rect.left}px;top:${e.clientY - rect.top}px;width:${size}px;height:${size}px;pointer-events:none;animation:sparkle-pop .7s ease-out forwards;`;
      s.innerHTML = `<svg viewBox="0 0 9 9" width="${size}" height="${size}" shape-rendering="crispEdges"><path fill="${c}" d="M4 0h1v3h3v1h1v1H8v1H5v3H4V6H1V5H0V4h1V3h3z"/></svg>`;
      layer.appendChild(s);
      setTimeout(() => s.remove(), 750);
    };

    target.addEventListener("mousemove", onMove);
    return () => target.removeEventListener("mousemove", onMove);
  }, [targetRef]);

  return <div ref={layerRef} aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none z-30" />;
}
