"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Faint animated pixel path connecting the five steps, with a soft pastel
 * light pulse traveling the line roughly every 5 seconds.
 */
export function StepPath() {
  const reduced = useReducedMotion();
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 4"
      preserveAspectRatio="none"
      className="hidden lg:block absolute top-[64px] left-[8%] right-[8%] w-[84%] h-2"
      shapeRendering="crispEdges"
    >
      <defs>
        <linearGradient id="steppath" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#cde3f7" />
          <stop offset="0.3" stopColor="#e9e4f8" />
          <stop offset="0.55" stopColor="#f9dfe9" />
          <stop offset="0.8" stopColor="#e0f4e9" />
          <stop offset="1" stopColor="#e5cf9a" />
        </linearGradient>
      </defs>
      <line x1="0" y1="2" x2="100" y2="2" stroke="url(#steppath)" strokeWidth="1.6" strokeDasharray="2 1.4" opacity="0.7" />
      {!reduced && (
        <motion.rect
          y="0.6"
          width="3.5"
          height="2.8"
          fill="#fff"
          opacity="0.9"
          initial={{ x: -4 }}
          animate={{ x: 104 }}
          transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
        />
      )}
    </svg>
  );
}
