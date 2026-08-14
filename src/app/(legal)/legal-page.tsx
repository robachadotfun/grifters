import Link from "next/link";
import type { ReactNode } from "react";
import { PixelCrown } from "@/components/pixel/PixelIcons";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-24">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-12" aria-label="Back to GRIFTERS home">
          <PixelCrown className="w-6 h-5 text-gold" />
          <span className="font-pixel text-sm tracking-widest">GRIFTERS</span>
        </Link>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">{title}</h1>
        <div className="space-y-5 text-ink-soft leading-relaxed">{children}</div>
        <Link href="/" className="inline-block mt-12 font-pixel text-[11px] border-2 border-ink bg-white px-4 py-3 hover:bg-blush">
          ← BACK TO SITE
        </Link>
      </div>
    </main>
  );
}
