"use client";

import { useEffect, useRef } from "react";

/**
 * 2,222 dots arranged into the number "2222".
 * Canvas-rendered for performance; dots activate as mint count rises.
 */

// 5x7 bitmap of the digit 2
const TWO = [
  "11111",
  "00001",
  "00001",
  "11111",
  "10000",
  "10000",
  "11111",
];

const SUB = 4; // 4x4 dots per bitmap cell → 35 cells * 16 = 560 dots per digit
const DIGIT_GAP = 2; // cells between digits

function buildDots(): { x: number; y: number }[] {
  const dots: { x: number; y: number }[] = [];
  for (let d = 0; d < 4; d++) {
    const xOff = d * (5 + DIGIT_GAP) * SUB;
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 5; c++) {
        if (TWO[r][c] !== "1") continue;
        for (let sy = 0; sy < SUB; sy++) {
          for (let sx = 0; sx < SUB; sx++) {
            dots.push({ x: xOff + c * SUB + sx, y: r * SUB + sy });
          }
        }
      }
    }
  }
  // 4 digits * 560 = 2240 → trim deterministically to exactly 2222
  return dots.slice(0, 2222);
}

const DOTS = buildDots();
const GRID_W = (5 * 4 + DIGIT_GAP * 3) * SUB; // width in dot units
const GRID_H = 7 * SUB;

export function SupplyViz({ minted }: { minted: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth;
    const unit = cssW / GRID_W;
    const cssH = GRID_H * unit;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.height = `${cssH}px`;
    ctx.scale(dpr, dpr);

    const size = Math.max(unit * 0.72, 1);
    ctx.clearRect(0, 0, cssW, cssH);
    DOTS.forEach((dot, i) => {
      ctx.fillStyle = i < minted ? "#2ebd6b" : "rgba(205,227,247,0.9)";
      ctx.fillRect(dot.x * unit, dot.y * unit, size, size);
    });
  }, [minted]);

  return (
    <div
      role="img"
      aria-label={`${minted.toLocaleString()} of 2,222 minted, visualized as a grid of 2,222 pixels forming the number 2222`}
    >
      <canvas ref={ref} className="w-full block" />
      <div className="flex justify-between mt-3 font-pixel text-[10px] text-ink-soft">
        <span>{minted.toLocaleString()} MINTED</span>
        <span>1 PIXEL = 1 GRIFTER</span>
        <span>2,222 TOTAL</span>
      </div>
    </div>
  );
}
