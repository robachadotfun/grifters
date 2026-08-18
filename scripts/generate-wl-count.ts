/**
 * Whitelist-count hype graphics for X — two variants, same pixel-Hollywood
 * design system as the rest of the social kit. Backgrounds generated with
 * gpt-image-1, all text composited as crisp SVG (never generated).
 *
 * Usage: npx tsx scripts/generate-wl-count.ts <count>
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const COUNT = process.argv[2] ?? "2,518";
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) throw new Error("OPENAI_API_KEY missing");

const OUT = path.join(process.cwd(), "public/social");
const W = 1600;
const H = 900;
const INK = "#2a2a33";
const GOLD = "#c9a24b";
const MINT = "#2ebd6b";

const WORLD = `Premium light-theme pixel-art illustration belonging to a luxury Hollywood collectible universe, clean intentional pixel clusters, sophisticated editorial composition, soft pastel palette of warm ivory, cream, powder blue, pale cyan, mint green, blush pink, lavender and champagne gold, subtle retro digital texture, crisp pixel edges, high-end NFT art direction, no people, no characters, no dark backgrounds, no cyberpunk, no neon, no readable text`;

const BACKDROPS = [
  {
    file: "wl-count-bg-a.png",
    prompt: `${WORLD}. Wide dreamy scene outside a pale art-deco Hollywood theater at golden hour: a blush-pink red carpet running from the bottom center into the distance, champagne-gold stanchions with soft pink velvet ropes lining both sides, pale palm trees, tiny white four-point camera-flash sparkles in the warm cream sky, faint searchlight beams. The center of the composition stays calm, empty and very pale so a large headline can sit there. Extremely low contrast, luminous, background-quality.`,
  },
  {
    file: "wl-count-bg-b.png",
    prompt: `${WORLD}. Interior of a pale luxury guest-list lobby: soft ivory walls with art-deco trim, a long champagne-gold velvet-rope line curving gently across the lower third, small glass display cases at the far edges, gentle spotlight cones from above, faint mint accent lighting strips, tiny floating sparkles. The upper-center of the image stays calm, empty and near-white so a large headline can sit there. Extremely low contrast, dreamy, background-quality.`,
  },
];

async function generate(prompt: string, file: string) {
  const dest = path.join(OUT, file);
  if (fs.existsSync(dest)) {
    console.log(`skip (exists): ${file}`);
    return dest;
  }
  console.log(`generating ${file}…`);
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1", prompt, size: "1536x1024", quality: "high", n: 1 }),
  });
  if (!res.ok) throw new Error(`${file}: ${res.status} ${(await res.text()).slice(0, 300)}`);
  const j = (await res.json()) as { data: { b64_json: string }[] };
  fs.writeFileSync(dest, Buffer.from(j.data[0].b64_json, "base64"));
  return dest;
}

/** Variant A — carpet scene, headline straight on the sky. */
function svgA() {
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <g text-anchor="middle">
    <text x="${W / 2}" y="150" font-family="Courier, monospace" font-size="34" font-weight="bold" fill="${GOLD}" letter-spacing="10">GRIFTERS · THE GUEST LIST</text>
    <text x="${W / 2}" y="420" font-family="Helvetica, Arial, sans-serif" font-size="300" font-weight="800" fill="${INK}" letter-spacing="-6">${COUNT}</text>
    <text x="${W / 2}" y="510" font-family="Courier, monospace" font-size="52" font-weight="bold" fill="${MINT}" letter-spacing="16">WHITELISTED</text>
    <text x="${W / 2}" y="590" font-family="Courier, monospace" font-size="30" font-weight="bold" fill="#6b6b78" letter-spacing="6">AND THE ROPE IS STILL OPEN</text>
    <text x="${W / 2}" y="836" font-family="Courier, monospace" font-size="26" font-weight="bold" fill="#6b6b78" letter-spacing="5">2,222 GRIFTERS · ROBINHOOD CHAIN</text>
    <text x="${W / 2}" y="876" font-family="Courier, monospace" font-size="26" font-weight="bold" fill="${GOLD}" letter-spacing="5">@GRIFTERSONCHAIN · GRIFTERS.MARKET</text>
  </g>
  <!-- soft halo behind the number so it pops on any backdrop -->
</svg>`;
}

/** Halo layer under the text — a soft white radial glow. */
function haloA() {
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="g" cx="50%" cy="42%" r="46%">
    <stop offset="0%" stop-color="#fffdf6" stop-opacity="0.92"/>
    <stop offset="60%" stop-color="#fffdf6" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="#fffdf6" stop-opacity="0"/>
  </radialGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect y="790" width="${W}" height="110" fill="#fffdf6" opacity="0.55"/>
</svg>`;
}

/** Variant B — holographic ticket card (matches the sealed-pack card style). */
function svgB() {
  const cw = 640;
  const ch = 700;
  const cx = (W - cw) / 2;
  const cy = (H - ch) / 2 + 10;
  const mid = W / 2;
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="holo" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f3e8ff"/><stop offset="45%" stop-color="#fdeef4"/>
      <stop offset="100%" stop-color="#e4f7ee"/>
    </linearGradient>
  </defs>
  <rect x="${cx - 10}" y="${cy - 10}" width="${cw + 20}" height="${ch + 20}" fill="#fffdf6" opacity="0.9"/>
  <rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" fill="url(#holo)"/>
  <rect x="${cx}" y="${cy}" width="${cw}" height="26" fill="#dff2ec"/>
  <rect x="${cx}" y="${cy + ch - 26}" width="${cw}" height="26" fill="#dff2ec"/>
  ${Array.from({ length: 16 }, (_, i) => `<rect x="${cx + i * 40 + 8}" y="${cy}" width="20" height="26" fill="#fffdf6"/><rect x="${cx + i * 40 + 8}" y="${cy + ch - 26}" width="20" height="26" fill="#fffdf6"/>`).join("")}
  <g text-anchor="middle">
    <!-- pixel crown -->
    <g fill="${GOLD}">
      <rect x="${mid - 42}" y="${cy + 66}" width="84" height="20"/>
      <rect x="${mid - 42}" y="${cy + 50}" width="14" height="16"/>
      <rect x="${mid - 7}" y="${cy + 44}" width="14" height="22"/>
      <rect x="${mid + 28}" y="${cy + 50}" width="14" height="16"/>
    </g>
    <text x="${mid}" y="${cy + 160}" font-family="Courier, monospace" font-size="30" font-weight="bold" fill="#6b6b78" letter-spacing="10">GUEST LIST STATUS</text>
    <text x="${mid}" y="${cy + 350}" font-family="Helvetica, Arial, sans-serif" font-size="180" font-weight="800" fill="${INK}" letter-spacing="-4">${COUNT}</text>
    <text x="${mid}" y="${cy + 425}" font-family="Courier, monospace" font-size="38" font-weight="bold" fill="${MINT}" letter-spacing="10">WHITELISTED</text>
    <text x="${mid}" y="${cy + 500}" font-family="Courier, monospace" font-size="26" font-weight="bold" fill="${GOLD}" letter-spacing="6">BEYOND THE ROPE, ALREADY</text>
    <text x="${mid}" y="${cy + 580}" font-family="Courier, monospace" font-size="24" font-weight="bold" fill="#6b6b78" letter-spacing="4">2,222 GRIFTERS · ROBINHOOD CHAIN</text>
    <text x="${mid}" y="${cy + 622}" font-family="Courier, monospace" font-size="24" font-weight="bold" fill="${GOLD}" letter-spacing="4">@GRIFTERSONCHAIN · GRIFTERS.MARKET</text>
  </g>
</svg>`;
}

async function main() {
  const [bgA, bgB] = await Promise.all(BACKDROPS.map((b) => generate(b.prompt, b.file)));

  const baseA = await sharp(bgA).resize(W, H, { fit: "cover", kernel: "nearest" }).toBuffer();
  await sharp(baseA)
    .composite([
      { input: Buffer.from(haloA()) },
      { input: Buffer.from(svgA()) },
    ])
    .png()
    .toFile(path.join(OUT, "wl-count-option-1.png"));
  console.log("wrote wl-count-option-1.png");

  const baseB = await sharp(bgB).resize(W, H, { fit: "cover", kernel: "nearest" }).toBuffer();
  await sharp(baseB)
    .composite([{ input: Buffer.from(svgB()) }])
    .png()
    .toFile(path.join(OUT, "wl-count-option-2.png"));
  console.log("wrote wl-count-option-2.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
