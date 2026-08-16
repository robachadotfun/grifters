"use client";

import Link from "next/link";
import { useState } from "react";
import { PixelCrown } from "./pixel/PixelIcons";
import { ConnectButton } from "./ConnectButton";

const NAV = [
  { href: "#collection", label: "Collection" },
  { href: "#lore", label: "Lore" },
  { href: "#unlocks", label: "Unlocks" },
  { href: "#mint", label: "Mint" },
  { href: "#whitelist", label: "Whitelist" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-page px-4 sm:px-6 pt-3 sm:pt-4">
        <div className="flex items-center justify-between gap-3 border-2 border-ink/90 bg-white/80 backdrop-blur-md px-3 sm:px-5 py-2.5 shadow-[6px_6px_0_0_rgba(42,42,51,0.07)]">
          <Link href="#top" className="flex items-center gap-2.5 min-h-[44px]" aria-label="GRIFTERS home">
            <PixelCrown className="w-6 h-5 text-gold" title="GRIFTERS crown" />
            <span className="font-pixel text-sm sm:text-base tracking-widest">GRIFTERS</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6" aria-label="Main">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`font-pixel text-[11px] py-2 hover:text-rh-green transition-colors ${
                  n.label === "Mint" ? "text-rh-green" : "text-ink"
                }`}
              >
                {n.label.toUpperCase()}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ConnectButton className="hidden sm:block" />
            <button
              type="button"
              className="md:hidden min-h-[44px] min-w-[44px] border-2 border-ink bg-white font-pixel text-[11px]"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? "✕" : "≡"}
            </button>
          </div>
        </div>

        {open && (
          <nav
            className="md:hidden mt-2 border-2 border-ink bg-white/95 backdrop-blur-md p-4 flex flex-col gap-1 shadow-[6px_6px_0_0_rgba(42,42,51,0.07)]"
            aria-label="Mobile"
          >
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="font-pixel text-xs py-3 border-b border-pearl last:border-0 hover:text-rh-green"
              >
                {n.label.toUpperCase()}
              </a>
            ))}
            <ConnectButton className="mt-3 w-full" />
          </nav>
        )}
      </div>
    </header>
  );
}
