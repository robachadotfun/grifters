import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Silkscreen } from "next/font/google";
import "./globals.css";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://grifters.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "GRIFTERS — 2,222 Celebrity NFTs",
  description:
    "GRIFTERS is a collection of 2,222 pixel-art celebrity collectibles on Robinhood Chain, combining iconic traits, rarity and unlockable experiences.",
  keywords: ["GRIFTERS", "NFT", "Robinhood Chain", "pixel art", "celebrity collectibles"],
  openGraph: {
    title: "GRIFTERS — 2,222 Celebrity NFTs",
    description:
      "Hollywood, minted. 2,222 pixel-art celebrity collectibles on Robinhood Chain with iconic traits, rarity and unlockable experiences.",
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
    title: "GRIFTERS — 2,222 Celebrity NFTs",
    description:
      "Hollywood, minted. 2,222 pixel-art celebrity collectibles on Robinhood Chain.",
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
