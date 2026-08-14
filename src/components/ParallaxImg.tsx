"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Image with a very gentle scroll parallax (max ~20px), plus optional
 * counter-moving crops layered on top for a multi-plane feel.
 */
export function ParallaxImg({
  src,
  alt,
  className = "",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div className="h-full" style={reduced ? undefined : { y, scale: 1.05 }}>
        <Image
          src={src}
          alt={alt}
          width={1536}
          height={1024}
          sizes="(max-width:1024px) 92vw, 1100px"
          className={`pixelated w-full object-cover ${imgClassName}`}
        />
      </motion.div>
    </div>
  );
}
