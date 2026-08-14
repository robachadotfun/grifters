# GRIFTERS — 2,222 Celebrity NFTs

Production website for the GRIFTERS collection: 2,222 pixel-art celebrity collectibles on Robinhood Chain. Light-theme "Pixel Hollywood" editorial design.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · wagmi v3 / viem · TanStack Query

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve production build
```

## Configuration

All collection/chain settings live in [src/config/collection.ts](src/config/collection.ts) and environment variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GRIFTERS_CONTRACT` | Mint contract address — mint UI stays gated ("Mint opening soon") until set |
| `NEXT_PUBLIC_CHAIN_ID` / `NEXT_PUBLIC_RPC_URL` / `NEXT_PUBLIC_EXPLORER_URL` | Robinhood Chain params. Defaults use the official testnet values from [docs.robinhood.com/chain](https://docs.robinhood.com/chain/connecting) (chain id 46630) |
| `OPENAI_API_KEY` | Server-side only; used by the asset generation script. Never shipped to the browser |

Mint phase is controlled by `COLLECTION.phase`: `PRELAUNCH · LIVE · SOLD_OUT · REVEAL_PENDING · REVEALED`. Mint price and reveal date render as TBA until real values are configured — nothing is invented.

Sample display metadata (names/traits/rarity on cards) is placeholder layout data in `collection.ts` — replace with real collection metadata before launch.

## Assets

- `public/nfts/` — collection artwork + pre-reveal art
- `public/generated/` — supporting pixel graphics (hero environment, lore divider, chain graphic)
- `public/generated/grifters/` — the full world-building system (31 assets): section environments (Hollywood panorama, photo studio, dressing room, memorabilia collage, archive vault, premiere stage, pixel financial district, showroom, clouds, sunset) and transparent props (rarity gems, access-pass art, trait wardrobe pieces, the gold key, floating collectibles, success rays). All served as optimized WebP (~2.6 MB total)
- `public/brand/` — **official Robinhood feather logo**, fetched from Robinhood's CDN (chain docsite) and the chain explorer favicon. Do not recolor or redraw.

Regenerate missing assets (skips existing files, fails gracefully without a key):

```bash
npx tsx scripts/generate-assets.ts   # artwork via OpenAI Images API
npx tsx scripts/generate-icons.ts    # favicon, apple-touch-icon, OG image
```

## Web3

- Wallet connect (injected), network detect + switch to Robinhood Chain, quantity select, simulate-free `mint(uint256)` write, pending/confirm states, explorer link, pack-tear success animation.
- No transactions are ever faked. With no contract configured the terminal shows "Mint opening soon".
- Minted supply reads `totalSupply()` live and drives the 2,222-pixel supply visualization.

## Notes

- `image-rendering: pixelated` keeps NFT art crisp at all sizes.
- All motion respects `prefers-reduced-motion`.
- SEO: OpenGraph/Twitter metadata, sitemap, robots, OG image composed from collection art.
