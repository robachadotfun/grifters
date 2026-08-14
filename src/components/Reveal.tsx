"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "fade" | "develop" | "deal" | "flash";

/**
 * Branded scroll reveals:
 * - fade: quiet default
 * - develop: element resolves from a soft unfocused state (photo developing)
 * - deal: card slides ~20px and rotates 2deg into place
 * - flash: brief brightness pop as it appears (camera flash)
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  variant = "fade",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  variant?: Variant;
}) {
  const reduced = useReducedMotion();

  const initial =
    variant === "develop"
      ? { opacity: 0, filter: "blur(6px) saturate(0.7)" }
      : variant === "deal"
        ? { opacity: 0, y: 20, x: -14, rotate: -2 }
        : variant === "flash"
          ? { opacity: 0, filter: "brightness(1.8)" }
          : { opacity: 0, y };

  const animate =
    variant === "develop"
      ? { opacity: 1, filter: "blur(0px) saturate(1)" }
      : variant === "deal"
        ? { opacity: 1, y: 0, x: 0, rotate: 0 }
        : variant === "flash"
          ? { opacity: 1, filter: "brightness(1)" }
          : { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={reduced ? false : initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: variant === "flash" ? 0.45 : 0.7, delay, ease: [0.21, 0.65, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}
