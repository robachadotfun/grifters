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
  /** USD display price per mint — null renders as TBA */
  mintPriceUsd: 0 as number | null,
  /** Mint premiere (primary phase opens) — ISO instant. Countdown targets this. */
  mintDate: "2026-08-21T17:00:00Z" as string | null,
  /** Phase schedule, all Aug 21 UTC. */
  phases: [
    { key: "PRIMARY", label: "PARTNER HOLDERS", time: "17:00 UTC" },
    { key: "COMMUNITY", label: "WHITELIST", time: "18:00 UTC" },
    { key: "PUBLIC", label: "EVERYONE", time: "19:00 UTC" },
  ],
  contractAddress: (process.env.NEXT_PUBLIC_GRIFTERS_CONTRACT || null) as
    | `0x${string}`
    | null,
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID
    ? Number(process.env.NEXT_PUBLIC_CHAIN_ID)
    : null,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || null,
  explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL || null,
  revealDate: null as string | null,
  maxPerWallet: 50 as number | null,
  phase: "PRELAUNCH" as MintPhase,
};

export type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY" | "ICONIC";

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
  {
    id: "hitmaker",
    src: "/nfts/grifter-hitmaker.png",
    alt: "Pixel-art Grifter: bearded rapper in a cream puffer jacket with a gold owl pendant against a powder-blue skyline",
    name: "DRAKE",
    archetype: "THE HITMAKER",
    traits: 12,
    rarity: "LEGENDARY",
    accent: "#D7E6F7",
  },
  {
    id: "starboy",
    src: "/nfts/grifter-starboy.png",
    alt: "Pixel-art Grifter: R&B singer in a scarlet blazer against a blush-pink dusk city",
    name: "ABEL",
    archetype: "THE STARBOY",
    traits: 11,
    rarity: "LEGENDARY",
    accent: "#F7D9DC",
  },
  {
    id: "popprince",
    src: "/nfts/grifter-popprince.png",
    alt: "Pixel-art Grifter: blonde pop star in a lavender hoodie and backwards cap against a lilac gradient",
    name: "JUSTIN",
    archetype: "THE POP PRINCE",
    traits: 10,
    rarity: "EPIC",
    accent: "#E6DCF8",
  },
  {
    id: "mogul",
    src: "/nfts/grifter-mogul.png",
    alt: "Pixel-art Grifter: beauty mogul with sleek black hair in a blush silk dress against a rose-pink gradient",
    name: "KYLIE",
    archetype: "THE MOGUL",
    traits: 11,
    rarity: "EPIC",
    accent: "#F9DCE7",
  },
  {
    id: "momager",
    src: "/nfts/grifter-momager.png",
    alt: "Pixel-art Grifter: matriarch in a white power suit with a flip phone against a champagne gradient",
    name: "KRIS",
    archetype: "THE MOMAGER",
    traits: 10,
    rarity: "EPIC",
    accent: "#F3E5C9",
  },
  {
    id: "runway",
    src: "/nfts/grifter-runway.png",
    alt: "Pixel-art Grifter: supermodel with a sleek ponytail and cat-eye sunglasses against an ivory runway",
    name: "KENDALL",
    archetype: "THE RUNWAY",
    traits: 9,
    rarity: "RARE",
    accent: "#EFEDE6",
  },
  {
    id: "empire",
    src: "/nfts/grifter-empire.png",
    alt: "Pixel-art Grifter: reality-TV empress with long black hair in a champagne bodysuit against a pearl-grey gradient",
    name: "KIM",
    archetype: "THE EMPIRE",
    traits: 12,
    rarity: "LEGENDARY",
    accent: "#E9E4DD",
  },
  {
    id: "visionary",
    src: "/nfts/grifter-visionary.png",
    alt: "Pixel-art Grifter: producer in shield sunglasses and a taupe sweatshirt against a sand-beige gradient",
    name: "YE",
    archetype: "THE VISIONARY",
    traits: 11,
    rarity: "LEGENDARY",
    accent: "#EDE2D2",
  },
  {
    id: "plug",
    src: "/nfts/grifter-plug.png",
    alt: "Pixel-art Grifter: producer in a black cap with an iced-out chain against an ice-blue gradient",
    name: "NAV",
    archetype: "THE PLUG",
    traits: 9,
    rarity: "RARE",
    accent: "#DCEAF5",
  },
  {
    id: "heartthrob",
    src: "/nfts/grifter-heartthrob.png",
    alt: "Pixel-art Grifter: quiffed heartthrob in a leather jacket against a mint gradient",
    name: "ZAYN",
    archetype: "THE HEARTTHROB",
    traits: 10,
    rarity: "EPIC",
    accent: "#DDF3E7",
  },
  {
    id: "songbird",
    src: "/nfts/grifter-songbird.png",
    alt: "Pixel-art Grifter: blonde singer-songwriter in a champagne sequin dress against a sky-blue gradient",
    name: "TAYLOR",
    archetype: "THE SONGBIRD",
    traits: 12,
    rarity: "LEGENDARY",
    accent: "#D9E9F8",
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
  { name: "DerpNotes", url: "https://opensea.io/collection/derpnotes" },
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
  ICONIC: {
    label: "Iconic · 1/1",
    bg: "linear-gradient(160deg,#FFF6DF,#F2DCA4)",
    ring: "#C9A24B",
    gem: "#A8842F",
    density: 5,
    unlockOdds: "22 gold editions — every unlock",
  },
};
