/**
 * Whitelist hype graphic v2 — "5,500+ ON THE GUEST LIST" as the name in
 * lights on a pixel art-deco marquee. Backdrop generated with gpt-image-1,
 * marquee frame + bulbs + all text drawn as crisp SVG.
 *
 * Usage: npx tsx scripts/generate-wl-marquee.ts "5,500+"
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const COUNT = process.argv[2] ?? "5,500+";
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) throw new Error("OPENAI_API_KEY missing");

const OUT = path.join(process.cwd(), "public/social");
const W = 1600;
const H = 900;
const INK = "#2a2a33";
const GOLD = "#c9a24b";
const MINT = "#2ebd6b";
const GREY = "#6b6b78";

const WORLD = `Premium light-theme pixel-art illustration belonging to a luxury Hollywood collectible universe, clean intentional pixel clusters, sophisticated editorial composition, soft pastel palette of warm ivory, cream, powder blue, pale cyan, mint green, blush pink, lavender and champagne gold, subtle retro digital texture, crisp pixel edges, high-end NFT art direction, no people, no characters, no dark backgrounds, no cyberpunk, no neon, no readable text`;

const BG = {
  file: "wl-marquee-bg.png",
  prompt: `${WORLD}. Wide dreamy pastel evening sky over Hollywood: peach and blush gradient with powder-blue clouds, two pale crossing searchlight beams rising from below, silhouettes of pale lavender palm trees along the bottom edge, tiny white four-point camera-flash sparkles scattered in the sky, the faintest champagne glow at the horizon, a few tiny floating mint-green accent squares. The middle of the sky stays calm and soft so a large sign can sit there. Never dark, luminous, low contrast, background-quality.`,
};

async function generate() {
  const dest = path.join(OUT, BG.file);
  if (fs.existsSync(dest)) {
    console.log(`skip (exists): ${BG.file}`);
    return dest;
  }
  console.log(`generating ${BG.file}…`);
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1", prompt: BG.prompt, size: "1536x1024", quality: "high", n: 1 }),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 300)}`);
  const j = (await res.json()) as { data: { b64_json: string }[] };
  fs.writeFileSync(dest, Buffer.from(j.data[0].b64_json, "base64"));
  return dest;
}

/** Rows of marquee bulbs along a rectangle edge. */
function bulbs(x: number, y: number, w: number, h: number, step = 46, r = 9) {
  const out: string[] = [];
  let i = 0;
  const bulb = (bx: number, by: number) => {
    const lit = i++ % 2 === 0;
    return `<circle cx="${bx}" cy="${by}" r="${r}" fill="${lit ? "#ffe9a8" : "#fffdf6"}" stroke="${GOLD}" stroke-width="3"/>` +
      (lit ? `<circle cx="${bx}" cy="${by}" r="${r + 7}" fill="#ffe9a8" opacity="0.28"/>` : "");
  };
  for (let bx = x + step / 2; bx < x + w; bx += step) out.push(bulb(bx, y));
  for (let by = y + step; by < y + h - step / 2; by += step) out.push(bulb(x + w, by));
  for (let bx = x + w - step / 2; bx > x; bx -= step) out.push(bulb(bx, y + h));
  for (let by = y + h - step; by > y + step / 2; by -= step) out.push(bulb(x, by));
  return out.join("");
}

function svg() {
  // marquee board
  const mw = 1080;
  const mh = 470;
  const mx = (W - mw) / 2;
  const my = 130;
  const mid = W / 2;
  // chevron crest above the board
  const crest = `
    <g fill="${GOLD}">
      <rect x="${mid - 14}" y="${my - 84}" width="28" height="52"/>
      <rect x="${mid - 52}" y="${my - 62}" width="24" height="30"/>
      <rect x="${mid + 28}" y="${my - 62}" width="24" height="30"/>
      <rect x="${mid - 90}" y="${my - 44}" width="20" height="12"/>
      <rect x="${mid + 70}" y="${my - 44}" width="20" height="12"/>
    </g>`;
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="board" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fffef9"/>
      <stop offset="100%" stop-color="#fdf6e6"/>
    </linearGradient>
    <linearGradient id="frame" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e3c98a"/>
      <stop offset="50%" stop-color="#c9a24b"/>
      <stop offset="100%" stop-color="#b08a3a"/>
    </linearGradient>
  </defs>

  <!-- soft glow behind the whole sign -->
  <ellipse cx="${mid}" cy="${my + mh / 2}" rx="720" ry="360" fill="#fffdf6" opacity="0.45"/>

  ${crest}

  <!-- frame: outer gold, stepped pixel corners via layered rects -->
  <rect x="${mx - 26}" y="${my - 26}" width="${mw + 52}" height="${mh + 52}" fill="url(#frame)"/>
  <rect x="${mx - 26}" y="${my - 26}" width="${mw + 52}" height="10" fill="#f2dfae"/>
  <rect x="${mx - 12}" y="${my - 12}" width="${mw + 24}" height="${mh + 24}" fill="#8a6d2e"/>
  <rect x="${mx}" y="${my}" width="${mw}" height="${mh}" fill="url(#board)"/>

  <!-- bulbs on the frame midline -->
  ${bulbs(mx - 19, my - 19, mw + 38, mh + 38)}

  <!-- board content -->
  <g text-anchor="middle">
    <text x="${mid}" y="${my + 78}" font-family="Courier, monospace" font-size="30" font-weight="bold" fill="${GOLD}" letter-spacing="12">NOW APPEARING</text>
    <rect x="${mid - 210}" y="${my + 100}" width="420" height="4" fill="#eadfc2"/>
    <text x="${mid}" y="${my + 300}" font-family="Helvetica, Arial, sans-serif" font-size="230" font-weight="800" fill="${INK}" letter-spacing="-6">${COUNT}</text>
    <text x="${mid}" y="${my + 382}" font-family="Courier, monospace" font-size="44" font-weight="bold" fill="${MINT}" letter-spacing="14">ON THE GUEST LIST</text>
    <rect x="${mid - 210}" y="${my + 412}" width="420" height="4" fill="#eadfc2"/>
  </g>

  <!-- hanging sign posts down to footer -->
  <rect x="${mx + 60}" y="${my + mh + 26}" width="10" height="60" fill="${GOLD}" opacity="0.6"/>
  <rect x="${mx + mw - 70}" y="${my + mh + 26}" width="10" height="60" fill="${GOLD}" opacity="0.6"/>

  <!-- footer strip -->
  <rect y="${H - 150}" width="${W}" height="150" fill="#fffdf6" opacity="0.72"/>
  <g text-anchor="middle">
    <text x="${mid}" y="${H - 92}" font-family="Courier, monospace" font-size="30" font-weight="bold" fill="${GREY}" letter-spacing="6">2,222 GRIFTERS · COMING SOON ON ROBINHOOD CHAIN</text>
    <text x="${mid}" y="${H - 44}" font-family="Courier, monospace" font-size="30" font-weight="bold" fill="${GOLD}" letter-spacing="6">@GRIFTERSONCHAIN · GRIFTERS.MARKET</text>
  </g>
</svg>`;
}

async function main() {
  const bg = await generate();
  const base = await sharp(bg).resize(W, H, { fit: "cover", kernel: "nearest" }).toBuffer();
  await sharp(base)
    .composite([{ input: Buffer.from(svg()) }])
    .png()
    .toFile(path.join(OUT, "wl-marquee.png"));
  console.log("wrote wl-marquee.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
