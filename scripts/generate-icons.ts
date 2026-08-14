/**
 * Builds favicon, apple-touch-icon and the OG image from local assets.
 * Run after generate-assets.ts: npx tsx scripts/generate-icons.ts
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUB = path.join(process.cwd(), "public");

const CROWN = (size: number, bg: string) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 16 16" shape-rendering="crispEdges">
  <rect width="16" height="16" fill="${bg}"/>
  <path fill="#c9a24b" d="M2 5h2v2h2V5h2V3h2v2h2v2h2V5h2v6H2z"/>
  <rect x="2" y="12" width="12" height="1" fill="#2a2a33" opacity="0.35"/>
</svg>`;

async function icons() {
  await sharp(Buffer.from(CROWN(64, "#fdfbf7"))).png().toFile(path.join(PUB, "favicon.png"));
  await sharp(Buffer.from(CROWN(180, "#fdfbf7"))).png().toFile(path.join(PUB, "apple-touch-icon.png"));
  console.log("icons done");
}

async function og() {
  const nfts = ["grifter-icon.png", "grifter-champion.png", "grifter-internet.png"].map((f) =>
    path.join(PUB, "nfts", f),
  );
  if (!nfts.every((f) => fs.existsSync(f))) {
    console.log("NFT art missing — skipping OG image");
    return;
  }
  const W = 1200;
  const H = 630;
  const card = 380;
  const base = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fdfbf7"/>
      <stop offset="0.5" stop-color="#e3f0fb"/>
      <stop offset="1" stop-color="#f9dfe9"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <text x="64" y="300" font-family="Helvetica, Arial, sans-serif" font-size="120" font-weight="800" fill="#2a2a33" letter-spacing="-4">GRIFTERS</text>
  <text x="66" y="360" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="500" fill="#2ebd6b">Hollywood, minted.</text>
  <text x="66" y="420" font-family="Courier, monospace" font-size="22" fill="#6b6b78">2,222 TOTAL · ROBINHOOD CHAIN · CELEBRITY BACKED</text>
</svg>`;

  const frames = await Promise.all(
    nfts.map(async (f) => {
      const img = await sharp(f).resize(card, card, { kernel: "nearest" }).png().toBuffer();
      return sharp({
        create: { width: card + 16, height: card + 16, channels: 4, background: "#2a2a33" },
      })
        .composite([
          {
            input: await sharp({
              create: { width: card + 8, height: card + 8, channels: 4, background: "#ffffff" },
            }).png().toBuffer(),
            top: 4,
            left: 4,
          },
          { input: img, top: 8, left: 8 },
        ])
        .png()
        .toBuffer();
    }),
  );

  await sharp(Buffer.from(base))
    .composite([
      { input: frames[2], top: 150, left: 660 },
      { input: frames[1], top: 90, left: 760 },
      { input: frames[0], top: 120, left: 700 },
    ])
    .png()
    .toFile(path.join(PUB, "og.png"));
  console.log("og done");
}

icons().then(og).catch((e) => {
  console.error(e);
  process.exit(1);
});
