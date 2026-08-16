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
 * Edit this list as partnerships are confirmed. OpenSea slugs verified 2026-08.
 *
 * NOTE (internal): holder eligibility is enforced at mint time — when the user
 * connects their wallet on mint day, the mint flow checks holdings and routes
 * holders straight into the whitelisted mint. No pre-registration needed.
 */
export const AUTO_WHITELIST_COLLECTIONS: { name: string; url: string }[] = [
  { name: "H00dle", url: "https://opensea.io/collection/h00dle" },
  { name: "Monkeyhood", url: "https://opensea.io/collection/monkeyhood" },
  { name: "Gremlin Cartel", url: "https://opensea.io/collection/gremlin-cartel" },
  { name: "Quotrons", url: "https://opensea.io/collection/quotrons" },
  { name: "Spritehood Wisps", url: "https://opensea.io/collection/spritehood-wisps" },
  { name: "Stackers", url: "https://opensea.io/collection/stackersxyz" },
  { name: "Broker Punks", url: "https://opensea.io/collection/broker-punks-nft" },
  { name: "Script Kiddies", url: "https://opensea.io/collection/script-kiddies" },
  { name: "Robinhood Kitties", url: "https://opensea.io/collection/robinhood-kitties" },
  { name: "Bulls Runners", url: "https://opensea.io/collection/bulls-runners" },
  { name: "Yardkeepers", url: "https://opensea.io/collection/yardkeepers" },
  { name: "Zaibatsu Wagies", url: "https://opensea.io/collection/zaibatsu-wagies" },
  { name: "Nakamigos", url: "https://opensea.io/collection/nakamigos" },
  { name: "Normies", url: "https://opensea.io/collection/normies" },
  { name: "Good Vibes Club", url: "https://opensea.io/collection/good-vibes-club" },
  { name: "Funkari", url: "https://opensea.io/collection/funkari-nft" },
  { name: "Cash Cats", url: "https://opensea.io/collection/cash-cats-nft" },
  { name: "RH Machines", url: "https://opensea.io/collection/rh-machines" },
  { name: "OnchainHoodies", url: "https://opensea.io/collection/hoodies-onchain" },
  { name: "NPC", url: "https://opensea.io/collection/npc-nft" },
  { name: "Pyopyopyo", url: "https://opensea.io/collection/pyopyopyo" },
  { name: "Chain Mancers", url: "https://opensea.io/collection/chain-mancers" },
  { name: "Pitboys", url: "https://opensea.io/collection/pitboys" },
  { name: "Stonkbrokers", url: "https://opensea.io/collection/stonkbrokersnft" },
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
