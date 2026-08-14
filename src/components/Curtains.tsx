"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Soft curtain edges framing a section; they ease slightly outward
 * as the section enters the viewport — anticipation, never a full reveal.
 */
export function Curtains() {
  const reduced = useReducedMotion();
  const side = (dir: 1 | -1) => (
    <motion.div
      aria-hidden
      className={`absolute inset-y-0 w-16 sm:w-28 pointer-events-none ${dir === -1 ? "left-0" : "right-0"}`}
      initial={reduced ? undefined : { x: 0 }}
      whileInView={reduced ? undefined : { x: dir * 10 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 2.4, ease: "easeOut" }}
      style={{
        background: `linear-gradient(${dir === -1 ? "90deg" : "270deg"}, rgba(231,166,196,0.55), rgba(249,223,233,0.25) 55%, transparent)`,
      }}
    >
      {/* pixel scallop edge */}
      <div
        className={`absolute inset-y-0 ${dir === -1 ? "right-0" : "left-0"} w-3`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(231,166,196,0.5) 0 14px, transparent 14px 28px)",
        }}
      />
    </motion.div>
  );
  return (
    <>
      {side(-1)}
      {side(1)}
    </>
  );
}
