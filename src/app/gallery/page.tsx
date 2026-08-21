import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PixelCrown, PixelSparkle } from "@/components/pixel/PixelIcons";
import { COLLECTION, PREREVEAL } from "@/config/collection";
import { getMinted } from "@/lib/minted";

export const revalidate = 20;

export const metadata: Metadata = {
  title: "Gallery — GRIFTERS",
  description: "Every GRIFTERS minted so far on Robinhood Chain — sealed until the reveal.",
};

const EXPLORER = process.env.NEXT_PUBLIC_EXPLORER_URL || "https://robinhoodchain.blockscout.com";
const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

export default async function GalleryPage() {
  const { total, tokens, ownersKnown } = await getMinted();
  const owners = new Set(tokens.filter((t) => t.owner).map((t) => t.owner!.toLowerCase())).size;
  const soldOut = total >= COLLECTION.supply;
  const pct = Math.min(100, (total / COLLECTION.supply) * 100);

  return (
    <>
      <Header />
      <main style={{ background: "var(--cream)" }}>
        <div className="pt-28 sm:pt-32 pb-10 text-center px-4">
          <p className="font-pixel text-[11px] text-rh-green mb-4 inline-flex items-center gap-2">
            <PixelCrown className="w-4 h-3 text-gold" /> THE GALLERY · LIVE
          </p>
          <h1 className="font-bold tracking-[-0.04em] leading-[0.9] text-[clamp(3rem,9vw,6.5rem)] uppercase">
            {total.toLocaleString()} minted.
          </h1>
          <p className="mt-5 text-xl text-ink-soft max-w-xl mx-auto">
            {soldOut ? "Every seat is taken." : `${owners.toLocaleString()} wallets have claimed their seat.`}{" "}
            {ownersKnown >= total && owners > 0 ? `${owners.toLocaleString()} wallets. ` : ""}Every identity stays sealed until the reveal.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <div className="h-4 border-2 border-ink/80 bg-white overflow-hidden">
              <div className="h-full" style={{ width: `${pct}%`, background: "var(--rh-green)" }} />
            </div>
            <p className="mt-2 font-pixel text-[9px] text-ink-soft">
              {total.toLocaleString()} / {COLLECTION.supply.toLocaleString()} · {soldOut ? "SOLD OUT" : "UPDATES EVERY 30S"}
            </p>
          </div>
          {!soldOut && (
            <a
              href="/mint"
              className="btn-pixel mt-8 inline-flex items-center justify-center min-h-[52px] px-8 font-pixel text-xs border-2 border-ink transition-colors"
              style={{ background: "var(--rh-green)", color: "#10321f" }}
            >
              MINT YOURS →
            </a>
          )}
        </div>

        <div className="mx-auto max-w-[96rem] px-4 sm:px-8 pb-24">
          {tokens.length === 0 ? (
            <p className="text-center font-pixel text-[10px] text-ink-soft py-16">THE CARPET IS EMPTY — FOR NOW.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {tokens.map((t, i) => (
                <a
                  key={t.id}
                  href={`${EXPLORER}/token/${COLLECTION.contractAddress}/instance/${t.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-frame p-1.5 bg-white block hover:-translate-y-1.5 transition-transform"
                  style={{ transform: `rotate(${((i % 5) - 2) * 0.6}deg)` }}
                >
                  <Image
                    src={PREREVEAL.src}
                    alt={PREREVEAL.alt}
                    width={320}
                    height={320}
                    className="pixelated aspect-square object-cover"
                  />
                  <div className="flex items-center justify-between px-2 py-2">
                    <span className="font-pixel text-[10px]">#{t.id}</span>
                    <span className="font-pixel text-[8px] text-gold">SEALED</span>
                  </div>
                  <p className="px-2 pb-1.5 font-pixel text-[8px] text-ink-soft">{t.owner ? short(t.owner) : "—"}</p>
                </a>
              ))}
            </div>
          )}
          <p className="mt-10 text-center font-pixel text-[9px] text-ink-soft inline-flex w-full items-center justify-center gap-2">
            <PixelSparkle className="w-3 h-3 text-gold" /> IDENTITIES ASSIGNED BY MINED ENTROPY AT REVEAL · VERIFIABLE BY ANYONE
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
