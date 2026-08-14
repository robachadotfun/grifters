/**
 * Composes the GRIFTERS Twitter/X profile picture and header
 * from existing local brand assets. Run: npx tsx scripts/generate-social.ts
 * Outputs: public/social/pfp.png (1024x1024), public/social/header.png (1500x500 @2x = 3000x1000)
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUB = path.join(process.cwd(), "public");
const OUT = path.join(PUB, "social");
fs.mkdirSync(OUT, { recursive: true });

const INK = "#2a2a33";

/** NFT framed like the site's collectible cards: white mat + ink border + accent shadow */
async function card(file: string, size: number, accent: string, rotate = 0) {
  const art = await sharp(path.join(PUB, "nfts", file))
    .resize(size, size, { kernel: "nearest" })
    .toBuffer();
  const mat = 14;
  const border = 5;
  const w = size + mat * 2;
  const framed = await sharp({
    create: { width: w + border * 2 + 10, height: w + border * 2 + 10, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      // accent offset shadow
      {
        input: await sharp({ create: { width: w + border * 2, height: w + border * 2, channels: 4, background: accent } }).png().toBuffer(),
        left: 10,
        top: 10,
      },
      // ink border
      {
        input: await sharp({ create: { width: w + border * 2, height: w + border * 2, channels: 4, background: INK } }).png().toBuffer(),
        left: 0,
        top: 0,
      },
      // white mat
      {
        input: await sharp({ create: { width: w, height: w, channels: 4, background: "#ffffff" } }).png().toBuffer(),
        left: border,
        top: border,
      },
      { input: art, left: border + mat, top: border + mat },
    ])
    .png()
    .toBuffer();
  if (!rotate) return framed;
  return sharp(framed).rotate(rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

async function pfp() {
  // flagship artwork, framed like a collectible card, crown badge on the mat
  const size = 1024;
  const border = 26;
  const inner = 14;
  const artSize = size - (border + inner) * 2;
  const art = await sharp(path.join(PUB, "nfts", "grifter-icon.png"))
    .resize(artSize, artSize, { kernel: "nearest" })
    .toBuffer();

  const crownBadge = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 16 16" shape-rendering="crispEdges">
  <rect width="16" height="16" fill="#ffffff"/>
  <rect width="16" height="16" fill="none" stroke="${INK}" stroke-width="1.6"/>
  <path fill="#c9a24b" d="M2 5h2v2h2V5h2V3h2v2h2v2h2V5h2v6H2z"/>
  <rect x="2" y="12" width="12" height="1" fill="${INK}" opacity="0.35"/>
</svg>`);

  await sharp({ create: { width: size, height: size, channels: 4, background: INK } })
    .composite([
      {
        input: await sharp({ create: { width: size - border * 2, height: size - border * 2, channels: 4, background: "#ffffff" } }).png().toBuffer(),
        left: border,
        top: border,
      },
      { input: art, left: border + inner, top: border + inner },
      // kept inside the circular-crop safe zone
      { input: await sharp(crownBadge).resize(132, 132).png().toBuffer(), left: size - 132 - 148, top: size - 132 - 100 },
    ])
    .png({ palette: true, quality: 100 })
    .toFile(path.join(OUT, "pfp.png"));
  console.log("pfp.png done (1024x1024)");
}

async function header() {
  // 1500x500 at 2x for crispness
  const W = 3000;
  const H = 1000;

  const bg = await sharp(path.join(PUB, "generated", "grifters", "hero-hollywood-world.png"))
    .resize(W, H, { fit: "cover", position: "south" })
    .modulate({ brightness: 1.04, saturation: 0.94 })
    .toBuffer();

  // soft wash so type stays readable on the left
  const wash = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="w" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fdfbf7" stop-opacity="0.92"/>
      <stop offset="0.42" stop-color="#fdfbf7" stop-opacity="0.55"/>
      <stop offset="0.7" stop-color="#fdfbf7" stop-opacity="0.05"/>
      <stop offset="1" stop-color="#fdfbf7" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#w)"/>
</svg>`);

  const star = (x: number, y: number, s: number, c: string, o = 1) =>
    `<path transform="translate(${x},${y}) scale(${s})" opacity="${o}" fill="${c}" d="M4 0h1v3h3v1h1v1H8v1H5v3H4V6H1V5H0V4h1V3h3z"/>`;

  const type = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" shape-rendering="crispEdges">
  <g transform="translate(150,0)">
    <path transform="translate(6,300) scale(7)" fill="#c9a24b" d="M0 5h2v2h2V5h2V3h2v2h2v2h2V5h2v6H0z"/>
    <path transform="translate(6,300) scale(7)" fill="${INK}" opacity="0.35" d="M0 12h14v1H0z"/>
    <text x="0" y="560" font-family="Helvetica, Arial, sans-serif" font-size="215" font-weight="800" fill="${INK}" letter-spacing="-8">GRIFTERS</text>
    <text x="6" y="668" font-family="Helvetica, Arial, sans-serif" font-size="72" font-weight="500" fill="${INK}">Hollywood, <tspan fill="#2ebd6b">minted.</tspan></text>
    <text x="8" y="775" font-family="Courier, monospace" font-size="41" font-weight="bold" fill="#6b6b78" letter-spacing="4">2,222 CELEBRITY COLLECTIBLES · ROBINHOOD CHAIN</text>
    <text x="8" y="860" font-family="Courier, monospace" font-size="36" font-weight="bold" fill="#c9a24b" letter-spacing="4">IDENTITY SEALED UNTIL REVEAL</text>
  </g>
  ${star(1420, 190, 5, "#c9a24b", 0.9)}
  ${star(1560, 700, 3.6, "#2ebd6b", 0.8)}
  ${star(2860, 160, 4.4, "#e7a6c4", 0.9)}
  ${star(2300, 90, 3, "#8fb8e8", 0.9)}
  ${star(2930, 760, 3.4, "#c9a24b", 0.85)}
</svg>`);

  const cards = await Promise.all([
    card("grifter-champion.png", 400, "#F3E5C9", -7),
    card("grifter-internet.png", 380, "#DDF3E7", 8),
    card("grifter-original.png", 350, "#FBE3D6", -10),
    card("grifter-icon.png", 500, "#F9DCE7", 3),
    card("prereveal.png", 330, "#E9E4F8", 10),
  ]);

  await sharp(bg)
    .composite([
      { input: wash, left: 0, top: 0 },
      // overlapping card fan on the right, edges bleeding out of frame
      { input: cards[2], left: 1610, top: 300 },
      { input: cards[0], left: 1850, top: 90 },
      { input: cards[1], left: 2550, top: 320 },
      { input: cards[4], left: 2760, top: 40 },
      { input: cards[3], left: 2130, top: 180 },
      { input: type, left: 0, top: 0 },
    ])
    .png({ palette: true, quality: 100 })
    .toFile(path.join(OUT, "header.png"));
  console.log("header.png done (3000x1000, upload at 1500x500)");
}

pfp().then(header).catch((e) => {
  console.error(e);
  process.exit(1);
});
