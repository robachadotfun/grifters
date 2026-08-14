/**
 * Builds the social share (OpenGraph/Twitter) imagery:
 * 1. Generates a cinematic premiere backdrop via OpenAI (skipped if present).
 * 2. Composes public/og.png (2400x1260 → served for 1200x630 cards) with
 *    collection artwork and HTML-crisp typography.
 * Run: npx tsx scripts/generate-og.ts   (needs OPENAI_API_KEY only for step 1)
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUB = path.join(process.cwd(), "public");
const BACKDROP = path.join(PUB, "generated", "grifters", "og-premiere.png");
const INK = "#2a2a33";

async function ensureBackdrop() {
  if (fs.existsSync(BACKDROP)) {
    console.log("backdrop exists — skipping generation");
    return;
  }
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.log("no OPENAI_API_KEY — composing over existing hero world instead");
    return;
  }
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey: key });
  const prompt = `Premium light-theme pixel-art illustration, luxury Hollywood collectible universe, chunky crisp pixel clusters, soft pastel palette of warm ivory, cream, powder blue, mint green, blush pink, lavender and champagne gold. A glamorous movie-premiere scene at golden hour: a blush-pink carpet leading toward a soft glowing theater entrance in the distant center-right, champagne-gold velvet rope stanchions along the carpet, tiny white four-point camera flash sparkles in the air, pale palm trees framing the edges, soft pixel clouds, faint Hollywood hills skyline, subtle mint-green digital accent squares floating. The LEFT HALF of the image stays calm, pale and empty for text overlay. No people, no characters, no text, no dark areas, extremely luminous and low contrast.`;
  console.log("generating og-premiere backdrop...");
  const res = await client.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1536x1024",
    quality: "high",
    n: 1,
  });
  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error("no image data");
  fs.writeFileSync(BACKDROP, Buffer.from(b64, "base64"));
  await sharp(BACKDROP).webp({ quality: 70, effort: 6 }).toFile(BACKDROP.replace(/\.png$/, ".webp"));
  console.log("backdrop saved");
}

async function card(file: string, size: number, accent: string, rotate = 0) {
  const art = await sharp(path.join(PUB, "nfts", file)).resize(size, size, { kernel: "nearest" }).toBuffer();
  const mat = 12;
  const border = 5;
  const w = size + mat * 2;
  const framed = await sharp({
    create: { width: w + border * 2 + 12, height: w + border * 2 + 12, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: await sharp({ create: { width: w + border * 2, height: w + border * 2, channels: 4, background: accent } }).png().toBuffer(), left: 12, top: 12 },
      { input: await sharp({ create: { width: w + border * 2, height: w + border * 2, channels: 4, background: INK } }).png().toBuffer(), left: 0, top: 0 },
      { input: await sharp({ create: { width: w, height: w, channels: 4, background: "#ffffff" } }).png().toBuffer(), left: border, top: border },
      { input: art, left: border + mat, top: border + mat },
    ])
    .png()
    .toBuffer();
  return rotate ? sharp(framed).rotate(rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer() : framed;
}

async function compose() {
  const W = 2400;
  const H = 1260;
  const bgSrc = fs.existsSync(BACKDROP)
    ? BACKDROP
    : path.join(PUB, "generated", "grifters", "hero-hollywood-world.png");

  const bg = await sharp(bgSrc)
    .resize(W, H, { fit: "cover", position: "attention" })
    .modulate({ brightness: 1.03 })
    .toBuffer();

  const wash = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="w" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fdfbf7" stop-opacity="0.94"/>
      <stop offset="0.46" stop-color="#fdfbf7" stop-opacity="0.6"/>
      <stop offset="0.72" stop-color="#fdfbf7" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#fdfbf7" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.82" stop-color="#fdfbf7" stop-opacity="0"/>
      <stop offset="1" stop-color="#fdfbf7" stop-opacity="0.55"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#w)"/>
  <rect width="${W}" height="${H}" fill="url(#b)"/>
</svg>`);

  const star = (x: number, y: number, s: number, c: string, o = 1) =>
    `<path transform="translate(${x},${y}) scale(${s})" opacity="${o}" fill="${c}" shape-rendering="crispEdges" d="M4 0h1v3h3v1h1v1H8v1H5v3H4V6H1V5H0V4h1V3h3z"/>`;

  const type = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <g transform="translate(130,0)">
    <g shape-rendering="crispEdges">
      <path transform="translate(8,296) scale(8.2)" fill="#c9a24b" d="M0 5h2v2h2V5h2V3h2v2h2v2h2V5h2v6H0z"/>
      <path transform="translate(8,296) scale(8.2)" fill="${INK}" opacity="0.35" d="M0 12h14v1H0z"/>
    </g>
    <text x="0" y="612" font-family="Helvetica, Arial, sans-serif" font-size="238" font-weight="800" fill="${INK}" letter-spacing="-9">GRIFTERS</text>
    <text x="8" y="730" font-family="Helvetica, Arial, sans-serif" font-size="80" font-weight="500" fill="${INK}">Hollywood, <tspan fill="#2ebd6b">minted.</tspan></text>
    <g font-family="Courier, monospace" font-weight="bold">
      <text x="10" y="852" font-size="46" fill="#5a5a68" letter-spacing="4">2,222 CELEBRITY COLLECTIBLES</text>
      <text x="10" y="928" font-size="42" fill="#2ebd6b" letter-spacing="4">ROBINHOOD CHAIN</text>
      <text x="10" y="1004" font-size="42" fill="#c9a24b" letter-spacing="4">IDENTITY SEALED UNTIL REVEAL</text>
    </g>
  </g>
  ${star(1180, 200, 5.5, "#c9a24b", 0.95)}
  ${star(1300, 950, 4, "#2ebd6b", 0.85)}
  ${star(2280, 140, 5, "#e7a6c4", 0.9)}
  ${star(1780, 90, 3.4, "#8fb8e8", 0.9)}
  ${star(2330, 1080, 4, "#c9a24b", 0.9)}
</svg>`);

  const cards = await Promise.all([
    card("grifter-original.png", 360, "#FBE3D6", -9),
    card("grifter-champion.png", 400, "#F3E5C9", 7),
    card("grifter-icon.png", 540, "#F9DCE7", -3),
    card("grifter-internet.png", 380, "#DDF3E7", 9),
    card("prereveal.png", 340, "#E9E4F8", -11),
  ]);

  await sharp(bg)
    .composite([
      { input: wash, left: 0, top: 0 },
      { input: cards[0], left: 1290, top: 380 },
      { input: cards[4], left: 2080, top: 60 },
      { input: cards[1], left: 1520, top: 110 },
      { input: cards[3], left: 1990, top: 500 },
      { input: cards[2], left: 1620, top: 330 },
      { input: type, left: 0, top: 0 },
    ])
    .png({ palette: true, quality: 100, compressionLevel: 9 })
    .toFile(path.join(PUB, "og.png"));

  const kb = Math.round(fs.statSync(path.join(PUB, "og.png")).size / 1024);
  console.log(`og.png done (${W}x${H}, ${kb}KB)`);
}

ensureBackdrop()
  .then(compose)
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
