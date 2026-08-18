import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Silkscreen } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { Providers } from "./providers";

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const pixel = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "GRIFTERS — 2,222 Celebrity NFTs",
  description:
    "GRIFTERS is a collection of 2,222 pixel-art celebrity collectibles on Robinhood Chain. Minting Aug 21 at 18:00 UTC — $20 per Grifter.",
  keywords: ["GRIFTERS", "NFT", "Robinhood Chain", "pixel art", "celebrity collectibles"],
  openGraph: {
    title: "GRIFTERS — 2,222 Celebrity NFTs",
    description:
      "Hollywood, minted. 2,222 pixel-art celebrity collectibles on Robinhood Chain. Minting Aug 21 at 18:00 UTC — $20 per Grifter.",
    url: SITE_URL,
    siteName: "GRIFTERS",
    images: [
      {
        url: "/og.png",
        width: 2400,
        height: 1260,
        alt: "GRIFTERS — Hollywood, minted. 2,222 pixel-art celebrity collectibles on Robinhood Chain, shown as a fan of collectible cards on a pastel premiere red carpet.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@griftersonchain",
    creator: "@griftersonchain",
    title: "GRIFTERS — 2,222 Celebrity NFTs",
    description:
      "Hollywood, minted. 2,222 pixel-art celebrity collectibles on Robinhood Chain. Minting Aug 21 · 18:00 UTC · $20.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#fdfbf7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${pixel.variable}`}>
      <body className="font-sans bg-cream text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
