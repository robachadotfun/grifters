/**
 * GRIFTERS story teaser — programmatic frame-by-frame animation.
 * Five beats: title → flash-captures → sealing → onchain hop → end card.
 * Renders 1280x720@30 frames with sharp, encode with ffmpeg afterwards.
 * Run: npx tsx scripts/video/render-story.ts <framesDir>
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const W = 1280;
const H = 720;
const FPS = 30;
const PUB = path.join(process.cwd(), "public");
const FRAMES = process.argv[2] || "/tmp/grifters-frames";
const INK = "#2a2a33";

// ——— timing (frames) ———
const T = {
  titleEnd: 84, // 2.8s
  revealEnd: 174, // 5.8s
  sealEnd: 264, // 8.8s
  chainEnd: 378, // 12.6s
  flashEnd: 390, // 13.0s
  end: 522, // 17.4s
};

// ——— easing ———
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const easeInCubic = (t: number) => Math.pow(clamp(t), 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ——— svg helpers ———
const sparkleSvg = (size: number, color: string) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 9 9" shape-rendering="crispEdges"><path fill="${color}" d="M4 0h1v3h3v1h1v1H8v1H5v3H4V6H1V5H0V4h1V3h3z"/></svg>`,
  );

const packSvg = (w: number) => {
  const h = Math.round(w * 1.37);
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 190 260">
  <defs>
    <linearGradient id="b" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fdfbf7"/><stop offset="0.34" stop-color="#f9dfe9"/>
      <stop offset="0.62" stop-color="#e9e4f8"/><stop offset="1" stop-color="#e0f4e9"/>
    </linearGradient>
    <pattern id="crimp" width="18" height="18" patternUnits="userSpaceOnUse">
      <rect width="6" height="18" fill="#f4e7cd"/><rect x="6" width="6" height="18" fill="#fdfbf7"/><rect x="12" width="6" height="18" fill="#e0f4e9"/>
    </pattern>
  </defs>
  <rect x="8" y="18" width="174" height="224" fill="url(#b)" stroke="${INK}" stroke-width="4"/>
  <rect x="8" y="0" width="174" height="18" fill="url(#crimp)" stroke="${INK}" stroke-width="3"/>
  <rect x="8" y="242" width="174" height="18" fill="url(#crimp)" stroke="${INK}" stroke-width="3"/>
  <g shape-rendering="crispEdges">
    <path transform="translate(72,42) scale(3.3)" fill="#c9a24b" d="M0 5h2v2h2V5h2V3h2v2h2v2h2V5h2v6H0z"/>
  </g>
  <text x="95" y="118" text-anchor="middle" font-family="Courier, monospace" font-size="24" font-weight="bold" fill="${INK}" letter-spacing="2">GRIFTERS</text>
  <line x1="40" y1="132" x2="150" y2="132" stroke="${INK}" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="4 4"/>
  <text x="95" y="156" text-anchor="middle" font-family="Courier, monospace" font-size="10.5" font-weight="bold" fill="#6b6b78" letter-spacing="1">1 DIGITAL COLLECTIBLE</text>
  <text x="95" y="174" text-anchor="middle" font-family="Courier, monospace" font-size="10.5" font-weight="bold" fill="#c9a24b" letter-spacing="1">IDENTITY SEALED</text>
  <text x="95" y="192" text-anchor="middle" font-family="Courier, monospace" font-size="9.5" font-weight="bold" fill="#2ebd6b" letter-spacing="1">ROBINHOOD CHAIN</text>
  <text x="95" y="228" text-anchor="middle" font-family="Courier, monospace" font-size="28" font-weight="bold" fill="#6b6b78">?</text>
</svg>`);
};

const blockSvg = (w: number) =>
  Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${Math.round(w * 0.82)}" viewBox="0 0 100 82" shape-rendering="crispEdges">
  <rect x="2" y="2" width="96" height="78" fill="#ffffff" fill-opacity="0.92" stroke="${INK}" stroke-width="4"/>
  <rect x="14" y="16" width="24" height="16" fill="#2ebd6b" opacity="0.8"/>
  <rect x="56" y="44" width="24" height="16" fill="#8fb8e8" opacity="0.8"/>
</svg>`);

const linkSvg = (w: number) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="10"><rect width="${w}" height="10" fill="#2ebd6b" opacity="0.75"/></svg>`,
  );

const captionSvg = (text: string, color = "#6b6b78") =>
  Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="60">
  <text x="${W / 2}" y="40" text-anchor="middle" font-family="Courier, monospace" font-size="26" font-weight="bold" fill="${color}" letter-spacing="10">${text}</text>
</svg>`);

async function main() {
  fs.rmSync(FRAMES, { recursive: true, force: true });
  fs.mkdirSync(FRAMES, { recursive: true });

  // ——— prebuild assets ———
  const bgTitle = await sharp(path.join(PUB, "video", "card-title.png")).resize(W, H).png().toBuffer();
  const bgEnd = await sharp(path.join(PUB, "video", "card-end.png")).resize(W, H).png().toBuffer();
  const bgWorldFull = await sharp(path.join(PUB, "generated", "grifters", "hero-hollywood-world.png"))
    .resize(1400, 934, { fit: "cover" })
    .modulate({ brightness: 1.03 })
    .png()
    .toBuffer();
  const bgMint = await sharp(path.join(PUB, "generated", "grifters", "mint-room.png"))
    .resize(W, H, { fit: "cover" })
    .modulate({ brightness: 1.05, saturation: 0.9 })
    .png()
    .toBuffer();
  const bgCity = await sharp(path.join(PUB, "generated", "grifters", "robinhood-pixel-city.png"))
    .resize(W, H, { fit: "cover" })
    .modulate({ brightness: 1.04 })
    .png()
    .toBuffer();

  // framed NFT cards (like the site's collectible frames)
  const ACCENTS: Record<string, string> = {
    "grifter-icon.png": "#F9DCE7",
    "grifter-champion.png": "#F3E5C9",
    "grifter-original.png": "#FBE3D6",
    "grifter-internet.png": "#DDF3E7",
  };
  async function framedCard(file: string, size: number) {
    const art = await sharp(path.join(PUB, "nfts", file)).resize(size, size, { kernel: "nearest" }).toBuffer();
    const mat = Math.round(size * 0.035);
    const border = Math.max(4, Math.round(size * 0.012));
    const inner = size + mat * 2;
    const total = inner + border * 2 + 10;
    return sharp({ create: { width: total, height: total, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([
        { input: await sharp({ create: { width: inner + border * 2, height: inner + border * 2, channels: 4, background: ACCENTS[file] } }).png().toBuffer(), left: 10, top: 10 },
        { input: await sharp({ create: { width: inner + border * 2, height: inner + border * 2, channels: 4, background: INK } }).png().toBuffer(), left: 0, top: 0 },
        { input: await sharp({ create: { width: inner, height: inner, channels: 4, background: "#ffffff" } }).png().toBuffer(), left: border, top: border },
        { input: art, left: border + mat, top: border + mat },
      ])
      .png()
      .toBuffer();
  }
  const CARD_MAX = 430;
  const cardFiles = ["grifter-icon.png", "grifter-champion.png", "grifter-original.png", "grifter-internet.png"];
  const cardsFull = await Promise.all(cardFiles.map((f) => framedCard(f, CARD_MAX)));

  // scaled variant cache (nearest keeps pixels crisp)
  const scaleCache = new Map<string, Buffer>();
  async function scaled(key: string, buf: Buffer, scale: number) {
    const s = Math.max(0.06, Math.round(scale * 40) / 40);
    const k = `${key}-${s}`;
    if (!scaleCache.has(k)) {
      const meta = await sharp(buf).metadata();
      scaleCache.set(k, await sharp(buf).resize(Math.max(8, Math.round(meta.width! * s)), null, { kernel: "nearest" }).png().toBuffer());
    }
    return scaleCache.get(k)!;
  }

  // white flash overlays at alpha steps
  const flashLevels: Buffer[] = [];
  for (let i = 1; i <= 10; i++) {
    flashLevels.push(
      await sharp({ create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: i / 10 } } }).png().toBuffer(),
    );
  }
  const flashAt = (a: number) => flashLevels[clamp(Math.round(a * 10), 1, 10) - 1];

  const sparkGold = await sharp(sparkleSvg(56, "#c9a24b")).png().toBuffer();
  const sparkGoldSm = await sharp(sparkleSvg(30, "#e5cf9a")).png().toBuffer();
  const sparkMint = await sharp(sparkleSvg(34, "#2ebd6b")).png().toBuffer();
  const sparkPink = await sharp(sparkleSvg(30, "#e7a6c4")).png().toBuffer();

  const packFull = await sharp(packSvg(320)).png().toBuffer(); // 320x438
  const blockFull = await sharp(blockSvg(150)).png().toBuffer();

  const capFlash = await sharp(captionSvg("EVERY FLASH CAPTURES AN ICON")).png().toBuffer();
  const capSeal = await sharp(captionSvg("IDENTITY SEALED", "#c9a24b")).png().toBuffer();
  const capChain = await sharp(captionSvg("MINTED ON ROBINHOOD CHAIN", "#2ebd6b")).png().toBuffer();

  type Layer = { input: Buffer; left: number; top: number };

  // reveal beats: frame at which each card appears (accelerating rhythm)
  const beats = [90, 122, 148, 166];

  // chain hop schedule
  const blocks = [
    { x: 170, y: 500 },
    { x: 430, y: 470 },
    { x: 690, y: 500 },
    { x: 950, y: 470 },
  ];
  const hopLen = 26;
  const hopStart = (i: number) => 276 + i * hopLen;

  console.log(`rendering ${T.end} frames to ${FRAMES} ...`);
  for (let f = 0; f < T.end; f++) {
    const layers: Layer[] = [];
    let base: Buffer;

    if (f < T.titleEnd) {
      // ——— A: title, slow zoom ———
      const z = 1 + 0.05 * easeInOut(f / T.titleEnd);
      const cw = Math.round(W / z);
      const ch = Math.round(H / z);
      base = await sharp(bgTitle)
        .extract({ left: Math.round((W - cw) / 2), top: Math.round((H - ch) / 2), width: cw, height: ch })
        .resize(W, H, { kernel: "nearest" })
        .png()
        .toBuffer();
      if (f % 26 < 13) layers.push({ input: sparkGoldSm, left: 380, top: 150 });
      else layers.push({ input: sparkPink, left: 860, top: 520 });
      // ramp into first flash
      if (f > T.titleEnd - 7) layers.push({ input: flashAt((f - (T.titleEnd - 7)) / 7), left: 0, top: 0 });
    } else if (f < T.revealEnd) {
      // ——— B: flash captures ———
      const t = (f - T.titleEnd) / (T.revealEnd - T.titleEnd);
      const panX = Math.round(lerp(0, 120, t));
      base = await sharp(bgWorldFull).extract({ left: panX, top: 100, width: W, height: H }).png().toBuffer();

      // which card is live?
      let idx = -1;
      for (let i = 0; i < beats.length; i++) if (f >= beats[i]) idx = i;
      if (idx >= 0) {
        const since = f - beats[idx];
        const pop = easeOutCubic(clamp(since / 7));
        const s = (0.82 + 0.18 * pop) * (CARD_MAX + 60) / (CARD_MAX + 60);
        const buf = await scaled(`card${idx}`, cardsFull[idx], s * 0.98);
        const meta = await sharp(buf).metadata();
        const bob = Math.round(4 * Math.sin((f / FPS) * 2.2));
        layers.push({ input: buf, left: Math.round(W / 2 - meta.width! / 2), top: Math.round(H / 2 - meta.height! / 2 - 14 + bob) });
        // star pop after each flash
        if (since >= 4 && since <= 16) {
          layers.push({ input: sparkGold, left: W / 2 + 190, top: H / 2 - 230 });
        }
      }
      layers.push({ input: capFlash, left: 0, top: H - 74 });
      // flash spikes at each beat
      for (const b of beats) {
        const d = f - b;
        if (d >= 0 && d < 5) layers.push({ input: flashAt(1 - d / 5), left: 0, top: 0 });
      }
      if (f > T.revealEnd - 5) layers.push({ input: flashAt((f - (T.revealEnd - 5)) / 5), left: 0, top: 0 });
    } else if (f < T.sealEnd) {
      // ——— C: sealing ———
      base = bgMint;
      const packW0 = 320;
      const packMeta = { w: packW0, h: Math.round(packW0 * 1.37) };
      const packRise = easeOutCubic(clamp((f - 178) / 26));
      const packY = Math.round(lerp(H + 40, H / 2 - packMeta.h / 2 + 30, packRise));
      const packX = Math.round(W / 2 - packMeta.w / 2);

      // four cards spiral in and dive into the pack
      for (let i = 0; i < 4; i++) {
        const start = 174 + i * 12;
        const dur = 30;
        const tt = clamp((f - start) / dur);
        if (tt >= 1) continue;
        const e = easeInCubic(tt);
        const fromX = [W * 0.5, -180, W * 0.85, W * 0.15][i];
        const fromY = [H * 0.5 - 14, H * 0.25, H * 0.2, H * 0.85][i];
        const scale = lerp(i === 0 ? 0.98 : 0.62, 0.16, e);
        const buf = await scaled(`card${i}`, cardsFull[i], scale);
        const meta = await sharp(buf).metadata();
        const x = Math.round(lerp(fromX, W / 2, e) - meta.width! / 2);
        const y = Math.round(lerp(fromY, H / 2 + 10, e) - meta.height! / 2);
        layers.push({ input: buf, left: x, top: y });
      }
      layers.push({ input: packFull, left: packX, top: packY });
      // crown glint + sparkle burst once sealed
      if (f >= 226 && f < 250 && (f - 226) % 12 < 6) {
        layers.push({ input: sparkGold, left: packX + packMeta.w / 2 - 28, top: packY + 26 });
      }
      if (f >= 232 && f % 18 < 9) layers.push({ input: sparkMint, left: packX - 50, top: packY + 180 });
      if (f >= 238) layers.push({ input: capSeal, left: 0, top: H - 74 });
      if (f > T.sealEnd - 5) layers.push({ input: flashAt((f - (T.sealEnd - 5)) / 5), left: 0, top: 0 });
    } else if (f < T.chainEnd) {
      // ——— D: onchain hops ———
      base = bgCity;
      const packScale = 0.42;
      const packBuf = await scaled("pack", packFull, packScale);
      const pm = await sharp(packBuf).metadata();

      // blocks + links appear as the pack lands
      for (let i = 0; i < blocks.length; i++) {
        const appear = i === 0 ? 264 : hopStart(i - 1) + hopLen - 4;
        if (f < appear) continue;
        const pop = easeOutCubic(clamp((f - appear) / 8));
        const buf = await scaled("block", blockFull, 0.6 + 0.4 * pop);
        const meta = await sharp(buf).metadata();
        layers.push({ input: buf, left: Math.round(blocks[i].x - meta.width! / 2), top: Math.round(blocks[i].y) });
        // link draws to next block
        if (i > 0) {
          const linkStart = appear + 2;
          const grow = easeOutCubic(clamp((f - linkStart) / 10));
          const full = blocks[i].x - blocks[i - 1].x - 130;
          const wpx = Math.max(2, Math.round(full * grow));
          layers.push({
            input: await scaled(`link${wpx}`, await sharp(linkSvg(wpx)).png().toBuffer(), 1),
            left: blocks[i - 1].x + 66,
            top: blocks[i - 1].y + 56,
          });
        }
      }

      // pack position: idle on block 0, then parabolic hops
      let px = blocks[0].x;
      let py = blocks[0].y - pm.height! + 24;
      for (let i = 0; i < 3; i++) {
        const hs = hopStart(i);
        if (f >= hs + hopLen) {
          px = blocks[i + 1].x;
          py = blocks[i + 1].y - pm.height! + 24;
        } else if (f >= hs) {
          const tt = (f - hs) / hopLen;
          px = lerp(blocks[i].x, blocks[i + 1].x, easeInOut(tt));
          const yBase = lerp(blocks[i].y, blocks[i + 1].y, tt) - pm.height! + 24;
          py = yBase - 130 * Math.sin(Math.PI * tt);
        }
      }
      layers.push({ input: packBuf, left: Math.round(px - pm.width! / 2), top: Math.round(py) });
      if (f % 20 < 10) layers.push({ input: sparkMint, left: Math.round(px + 60), top: Math.round(py - 24) });
      if (f >= 286) layers.push({ input: capChain, left: 0, top: H - 74 });
      if (f > T.chainEnd - 5) layers.push({ input: flashAt((f - (T.chainEnd - 5)) / 5), left: 0, top: 0 });
    } else if (f < T.flashEnd) {
      // ——— E: flash barrage ———
      base = bgEnd;
      const seq = [1, 0.35, 0.85, 0.25, 0.6, 0.15, 0.4, 0.1, 0.2, 0.05, 0.1, 0.05];
      layers.push({ input: flashAt(seq[f - T.chainEnd] ?? 0.05), left: 0, top: 0 });
    } else {
      // ——— F: end card ———
      base = bgEnd;
      if (f % 30 < 15) layers.push({ input: sparkGoldSm, left: 905, top: 355 });
    }

    await sharp(base)
      .composite(layers)
      .png()
      .toFile(path.join(FRAMES, `f${String(f).padStart(4, "0")}.png`));
    if (f % 60 === 0) process.stdout.write(`  frame ${f}/${T.end}\r`);
  }
  console.log(`\ndone: ${T.end} frames (${(T.end / FPS).toFixed(1)}s)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
