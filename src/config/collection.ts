/**
 * Central collection configuration.
 * Values not supplied by the project remain null and render as "TBA"
 * or gated states — never invent chain values, prices or dates.
 */

export type MintPhase =
  | "PRELAUNCH"
  | "LIVE"
  | "SOLD_OUT"
  | "REVEAL_PENDING"
  | "REVEALED";

export const COLLECTION = {
  name: "GRIFTERS",
  supply: 2222,
  chainName: "Robinhood Chain",
  /** ETH string, e.g. "0.05" — null renders as TBA */
  mintPrice: null as string | null,
  contractAddress: (process.env.NEXT_PUBLIC_GRIFTERS_CONTRACT || null) as
    | `0x${string}`
    | null,
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID
    ? Number(process.env.NEXT_PUBLIC_CHAIN_ID)
    : null,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || null,
  explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL || null,
  revealDate: null as string | null,
  maxPerWallet: null as number | null,
  phase: "PRELAUNCH" as MintPhase,
};

export type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";

/**
 * Sample display metadata for the supplied artwork.
 * DEV NOTE: replaceable placeholder metadata for layout purposes only —
 * swap with real collection metadata before launch.
 */
export interface GrifterCard {
  id: string;
  src: string;
  alt: string;
  name: string;
  archetype: string;
  traits: number;
  rarity: Rarity;
  accent: string; // card glow tint
}

export const GRIFTERS: GrifterCard[] = [
  {
    id: "icon",
    src: "/nfts/grifter-icon.png",
    alt: "Pixel-art Grifter: blonde socialite in a pink fur coat, tiara and halo against a pale blue Paris skyline",
    name: "PARIS",
    archetype: "THE ICON",
    traits: 12,
    rarity: "LEGENDARY",
    accent: "#F9DCE7",
  },
  {
    id: "champion",
    src: "/nfts/grifter-champion.png",
    alt: "Pixel-art Grifter: champion boxer in a black and gold jacket with gold chains against a golden background",
    name: "FLOYD",
    archetype: "THE CHAMPION",
    traits: 11,
    rarity: "LEGENDARY",
    accent: "#F3E5C9",
  },
  {
    id: "original",
    src: "/nfts/grifter-original.png",
    alt: "Pixel-art Grifter: red-haired starlet in pink sunglasses against a peach Hollywood sunset",
    name: "LINDSAY",
    archetype: "THE ORIGINAL",
    traits: 10,
    rarity: "EPIC",
    accent: "#FBE3D6",
  },
  {
    id: "internet",
    src: "/nfts/grifter-internet.png",
    alt: "Pixel-art Grifter: dark-haired woman in glasses and a black blazer against a mint skyline",
    name: "MIA",
    archetype: "THE INTERNET",
    traits: 12,
    rarity: "EPIC",
    accent: "#DDF3E7",
  },
  {
    id: "legacy",
    src: "/nfts/grifter-legacy.png",
    alt: "Pixel-art Grifter: elegant woman in a cream gown and sunglasses against a lavender background",
    name: "CAITLYN",
    archetype: "THE LEGACY",
    traits: 9,
    rarity: "RARE",
    accent: "#E6E1F7",
  },
];

/**
 * Communities whose holders are automatically whitelisted (snapshot taken).
 * Edit this list as partnerships are confirmed.
 */
export const AUTO_WHITELIST_COLLECTIONS = [
  "H00dle",
  "Monkeyhood",
  "Gremlin Cartel",
  "Quotrons",
  "Spritehood Wisps",
  "Stackers",
  "Broker Punks",
  "Script Kiddies",
  "Robinhood Kitties",
  "Bulls Runners",
  "Yardkeepers",
  "Zaibatsu Wagies",
  "Nakamigos",
  "Normies",
  "Good Vibes Club",
  "Funkari",
  "Cash Cats",
  "RH Machines",
  "OnchainHoodies",
  "NPC",
  "Pyopyopyo",
  "Chain Mancers",
  "Pitboys",
  "Stonkbrokers",
];

export const PREREVEAL = {
  src: "/nfts/prereveal.png",
  alt: "Pre-reveal Grifter: a glamorous pixel silhouette behind translucent pearl curtains with a golden question mark",
};

export const RARITY_META: Record<
  Rarity,
  { label: string; bg: string; ring: string; gem: string; density: number; unlockOdds: string }
> = {
  COMMON: {
    label: "Common",
    bg: "linear-gradient(160deg,#F0F7FE,#CDE3F7)",
    ring: "#A8C6EF",
    gem: "#6E9FE0",
    density: 1,
    unlockOdds: "Digital unlocks",
  },
  RARE: {
    label: "Rare",
    bg: "linear-gradient(160deg,#F0FBF5,#DDF3E7)",
    ring: "#8FD4AE",
    gem: "#2EBD6B",
    density: 2,
    unlockOdds: "Digital + drops",
  },
  EPIC: {
    label: "Epic",
    bg: "linear-gradient(160deg,#F4F0FE,#E4DCF8)",
    ring: "#C3AEE8",
    gem: "#9B79D8",
    density: 3,
    unlockOdds: "Access eligible",
  },
  LEGENDARY: {
    label: "Legendary",
    bg: "linear-gradient(160deg,#FFFBF0,#F7EBCE)",
    ring: "#E0C377",
    gem: "#C9A24B",
    density: 4,
    unlockOdds: "Experience eligible",
  },
};
