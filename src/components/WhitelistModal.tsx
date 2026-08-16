"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WhitelistForm } from "./WhitelistForm";
import { AutoWhitelist } from "./AutoWhitelist";

export const OPEN_WHITELIST_EVENT = "grifters:open-whitelist";

/** Dispatch from any component to open the whitelist modal. */
export function openWhitelist() {
  window.dispatchEvent(new Event(OPEN_WHITELIST_EVENT));
}

export function WhitelistModal() {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_WHITELIST_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_WHITELIST_EVENT, onOpen);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // focus the first field
    setTimeout(() => cardRef.current?.querySelector("input")?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Join the GRIFTERS whitelist"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-md my-8 border-4 border-ink/90 bg-white"
        style={{ boxShadow: "14px 14px 0 0 rgba(46,189,107,0.3)" }}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close whitelist form"
          className="absolute -top-4 -right-4 z-10 w-11 h-11 font-pixel text-sm border-2 border-ink bg-white hover:bg-blush transition-colors shadow-[3px_3px_0_0_rgba(42,42,51,0.3)]"
        >
          ✕
        </button>
        <WhitelistForm />
        <AutoWhitelist compact />
      </div>
    </div>
  );
}
