/**
 * GRIFTERS story teaser v3 — cinematic programmatic animation, beat-synced.
 * Virtual camera + parallax, particle systems, shadows/glow, ink letterbox
 * with narrated captions, animated grain, typewriter ending.
 * Beat frames were extracted from bensound-nullpunkt's low-band onsets.
 * Run: npx tsx scripts/video/render-story-v3.ts <framesDir>
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const W = 1280;
const H = 720;
const FPS = 30;
const BAR = 58; // letterbox bar height
const PUB = path.join(process.cwd(), "public");
const FRAMES = process.argv[2] || "/tmp/grifters-frames-v3";
const INK = "#2a2a33";

// ——— beat-synced timeline (frames @30fps, from audio onsets) ———
const F = {
  titleFlash: 89, //   2.98s — title ends on kick
  captures: [96, 118, 136, 154], // card reveals on kicks
  sealCut: 172, //     5.72s
  packLand: 192, //    6.40s
  dives: [200, 211, 218, 225],
  glint: 251, //       8.36s
  qPulse: 272,
  chainCut: 333, //   11.10s
  hopLands: [354, 372, 391, 408],
  barrage: [451, 458, 466],
  endStart: 472,
  sting: 518, //      17.27s
  end: 612, //        20.4s
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const eoc = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const eic = (t: number) => Math.pow(clamp(t), 3);
const eio = (t: number) => (clamp(t) < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * clamp(t) + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const backOut = (t: number) => {
  const c = 1.70158;
  const x = clamp(t) - 1;
  return 1 + (c + 1) * x * x * x + c * x * x;
};

const svgSparkle = (s: number, c: string, o = 1) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 9 9" shape-rendering="crispEdges"><path fill="${c}" fill-opacity="${o}" d="M4 0h1v3h3v1h1v1H8v1H5v3H4V6H1V5H0V4h1V3h3z"/></svg>`;

async function main() {
  fs.rmSync(FRAMES, { recursive: true, force: true });
  fs.mkdirSync(FRAMES, { recursive: true });
  const png = (svg: string) => sharp(Buffer.from(svg)).png().toBuffer();

  /* ————— global overlays ————— */
  const vignette = await png(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="v" cx="0.5" cy="0.46" r="0.75"><stop offset="0.62" stop-color="#2a2a33" stop-opacity="0"/><stop offset="1" stop-color="#2a2a33" stop-opacity="0.14"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#v)"/></svg>`,
  );
  const grains: Buffer[] = [];
  for (let i = 0; i < 3; i++) {
    grains.push(
      await png(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="${i * 7 + 1}"/><feColorMatrix type="matrix" values="0 0 0 0 0.16 0 0 0 0 0.16 0 0 0 0 0.2 0 0 0 0.05 0"/></filter><rect width="${W}" height="${H}" filter="url(#n)"/></svg>`,
      ),
    );
  }
  const barTop = await png(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${BAR}"><rect width="${W}" height="${BAR}" fill="${INK}"/><rect y="${BAR - 3}" width="${W}" height="3" fill="#c9a24b" fill-opacity="0.5"/></svg>`,
  );
  const barBot = await png(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${BAR}"><rect width="${W}" height="${BAR}" fill="${INK}"/><rect width="${W}" height="3" fill="#c9a24b" fill-opacity="0.5"/></svg>`,
  );
  const caption = (text: string, color: string) =>
    png(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${BAR}"><text x="${W / 2}" y="${BAR / 2 + 8}" text-anchor="middle" font-family="Courier, monospace" font-size="21" font-weight="bold" fill="${color}" letter-spacing="9">${text}</text></svg>`,
    );
  const capFlash = await caption("EVERY FLASH CAPTURES AN ICON", "#f4e7cd");
  const capSeal = await caption("IDENTITY SEALED", "#e5cf9a");
  const capChain = await caption("MINTED ON ROBINHOOD CHAIN", "#8fd4ae");

  const flashLv: Buffer[] = [];
  for (let i = 1; i <= 10; i++)
    flashLv.push(await sharp({ create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: i / 10 } } }).png().toBuffer());
  const flashAt = (a: number) => flashLv[clamp(Math.round(a * 10), 1, 10) - 1];

  const sparkGold = await png(svgSparkle(52, "#c9a24b"));
  const sparkGoldSm = await png(svgSparkle(28, "#e5cf9a"));
  const sparkMint = await png(svgSparkle(30, "#2ebd6b", 0.9));
  const sparkPink = await png(svgSparkle(26, "#e7a6c4", 0.9));
  const sparkWhite = await png(svgSparkle(34, "#ffffff", 0.9));

  const bokeh = await png(
    `<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90"><defs><radialGradient id="b"><stop offset="0.2" stop-color="#fff" stop-opacity="0.35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><circle cx="45" cy="45" r="44" fill="url(#b)"/></svg>`,
  );
  const glowGold = await png(
    `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="560"><defs><radialGradient id="g"><stop offset="0.1" stop-color="#f0dfae" stop-opacity="0.5"/><stop offset="0.55" stop-color="#f0dfae" stop-opacity="0.18"/><stop offset="1" stop-color="#f0dfae" stop-opacity="0"/></radialGradient></defs><circle cx="280" cy="280" r="278" fill="url(#g)"/></svg>`,
  );
  const shadowFor = async (w: number, squash = 1) =>
    png(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${Math.max(10, Math.round(w * 0.2 * squash))}"><ellipse cx="${w / 2}" cy="${Math.max(5, Math.round(w * 0.1 * squash))}" rx="${w * 0.44}" ry="${Math.max(4, w * 0.085 * squash)}" fill="#2a2a33" fill-opacity="0.16"/></svg>`,
    );

  /* ————— backgrounds (oversized for camera moves) ————— */
  const bgWorld = await sharp(path.join(PUB, "generated", "grifters", "hero-hollywood-world.png"))
    .resize(1560, 1040, { fit: "cover" }).modulate({ brightness: 1.04 }).png().toBuffer();
  const bgMint = await sharp(path.join(PUB, "generated", "grifters", "mint-room.png"))
    .resize(1480, 987, { fit: "cover" }).modulate({ brightness: 1.06, saturation: 0.92 }).png().toBuffer();
  const bgCity = await sharp(path.join(PUB, "generated", "grifters", "robinhood-pixel-city.png"))
    .resize(1800, 760, { fit: "cover" }).modulate({ brightness: 1.05 }).png().toBuffer();
  const bgCream = await png(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fdfbf7"/><stop offset="0.55" stop-color="#f7f3ec"/><stop offset="1" stop-color="#f4e7cd"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#bg)"/></svg>`,
  );

  /* ————— title parts ————— */
  const crownBig = await png(
    `<svg xmlns="http://www.w3.org/2000/svg" width="132" height="112" viewBox="0 0 14 12" shape-rendering="crispEdges"><path fill="#c9a24b" d="M0 3h2v2h2V3h2V1h2v2h2v2h2V3h2v6H0z"/><rect y="10" width="14" height="1" fill="${INK}" opacity="0.35"/></svg>`,
  );
  const titleText = await png(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="150"><text x="400" y="118" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="124" font-weight="800" fill="${INK}" letter-spacing="-4">GRIFTERS</text></svg>`,
  );
  const presentsText = await png(
    `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="50"><text x="250" y="34" text-anchor="middle" font-family="Courier, monospace" font-size="27" font-weight="bold" fill="#6b6b78" letter-spacing="14">PRESENTS</text></svg>`,
  );
  const underline = async (w: number) =>
    sharp({ create: { width: Math.max(2, w), height: 5, channels: 4, background: "#c9a24b" } }).png().toBuffer();

  /* ————— cards / pack / chain ————— */
  const ACCENTS: Record<string, string> = {
    "grifter-icon.png": "#F9DCE7",
    "grifter-champion.png": "#F3E5C9",
    "grifter-original.png": "#FBE3D6",
    "grifter-internet.png": "#DDF3E7",
  };
  async function framedCard(file: string, size: number) {
    const art = await sharp(path.join(PUB, "nfts", file)).resize(size, size, { kernel: "nearest" }).toBuffer();
    const mat = Math.round(size * 0.035);
    const border = 5;
    const inner = size + mat * 2;
    const total = inner + border * 2 + 10;
    return sharp({ create: { width: total, height: total, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([
        { input: await sharp({ create: { width: inner + border * 2, height: inner + border * 2, channels: 4, background: ACCENTS[file] } }).png().toBuffer(), left: 10, top: 10 },
        { input: await sharp({ create: { width: inner + border * 2, height: inner + border * 2, channels: 4, background: INK } }).png().toBuffer(), left: 0, top: 0 },
        { input: await sharp({ create: { width: inner, height: inner, channels: 4, background: "#ffffff" } }).png().toBuffer(), left: border, top: border },
        { input: art, left: border + mat, top: border + mat },
      ])
      .png().toBuffer();
  }
  const cardFiles = ["grifter-icon.png", "grifter-champion.png", "grifter-original.png", "grifter-internet.png"];
  const cards = await Promise.all(cardFiles.map((f) => framedCard(f, 400)));

  const packBuf = await png(`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="411" viewBox="0 0 190 260">
  <defs>
    <linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fdfbf7"/><stop offset="0.34" stop-color="#f9dfe9"/><stop offset="0.62" stop-color="#e9e4f8"/><stop offset="1" stop-color="#e0f4e9"/></linearGradient>
    <pattern id="cr" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="6" height="18" fill="#f4e7cd"/><rect x="6" width="6" height="18" fill="#fdfbf7"/><rect x="12" width="6" height="18" fill="#e0f4e9"/></pattern>
  </defs>
  <rect x="8" y="18" width="174" height="224" fill="url(#b)" stroke="${INK}" stroke-width="4"/>
  <rect x="8" y="0" width="174" height="18" fill="url(#cr)" stroke="${INK}" stroke-width="3"/>
  <rect x="8" y="242" width="174" height="18" fill="url(#cr)" stroke="${INK}" stroke-width="3"/>
  <g shape-rendering="crispEdges"><path transform="translate(72,42) scale(3.3)" fill="#c9a24b" d="M0 5h2v2h2V5h2V3h2v2h2v2h2V5h2v6H0z"/></g>
  <text x="95" y="118" text-anchor="middle" font-family="Courier, monospace" font-size="24" font-weight="bold" fill="${INK}" letter-spacing="2">GRIFTERS</text>
  <line x1="40" y1="132" x2="150" y2="132" stroke="${INK}" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="4 4"/>
  <text x="95" y="156" text-anchor="middle" font-family="Courier, monospace" font-size="10.5" font-weight="bold" fill="#6b6b78" letter-spacing="1">1 DIGITAL COLLECTIBLE</text>
  <text x="95" y="174" text-anchor="middle" font-family="Courier, monospace" font-size="10.5" font-weight="bold" fill="#c9a24b" letter-spacing="1">IDENTITY SEALED</text>
  <text x="95" y="192" text-anchor="middle" font-family="Courier, monospace" font-size="9.5" font-weight="bold" fill="#2ebd6b" letter-spacing="1">ROBINHOOD CHAIN</text>
  <text x="95" y="228" text-anchor="middle" font-family="Courier, monospace" font-size="28" font-weight="bold" fill="#6b6b78">?</text>
</svg>`);
  const glintStreak = await png(
    `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="460"><rect width="70" height="460" fill="#ffffff" fill-opacity="0.42" transform="skewX(-14)"/></svg>`,
  );
  const qGold = await png(
    `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="86"><text x="35" y="66" text-anchor="middle" font-family="Courier, monospace" font-size="64" font-weight="bold" fill="#c9a24b" fill-opacity="0.55">?</text></svg>`,
  );
  const blockBuf = await png(
    `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="115" viewBox="0 0 100 82" shape-rendering="crispEdges"><rect x="2" y="2" width="96" height="78" fill="#ffffff" fill-opacity="0.94" stroke="${INK}" stroke-width="4"/><rect x="14" y="16" width="24" height="16" fill="#2ebd6b" opacity="0.8"/><rect x="56" y="44" width="24" height="16" fill="#8fb8e8" opacity="0.8"/></svg>`,
  );
  const counterChip = (n: number) =>
    png(
      `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="44"><rect x="1" y="1" width="118" height="42" fill="#ffffff" stroke="${INK}" stroke-width="3"/><text x="60" y="30" text-anchor="middle" font-family="Courier, monospace" font-size="21" font-weight="bold" fill="#c9a24b" letter-spacing="2">${String(n).padStart(2, "0")}/04</text></svg>`,
    );
  const chips = await Promise.all([1, 2, 3, 4].map(counterChip));

  /* ————— typewriter end card states ————— */
  const L1 = "THE CAMERAS CAUGHT";
  const L2 = "SOMETHING.";
  const endState = (chars: number, caret: boolean, footer: boolean) => {
    const c1 = L1.slice(0, clamp(chars, 0, L1.length));
    const c2 = chars > L1.length ? L2.slice(0, chars - L1.length) : "";
    // left-anchored typing so text builds left→right like a real typewriter
    const ADV = 36; // Courier 50px advance + 6px letter-spacing
    const x1 = Math.round(W / 2 - (L1.length * ADV) / 2);
    const x2 = Math.round(W / 2 - (L2.length * ADV) / 2);
    const caretSvg = caret
      ? chars <= L1.length
        ? `<rect x="${x1 + c1.length * ADV + 4}" y="300" width="18" height="44" fill="#c9a24b"/>`
        : `<rect x="${x2 + c2.length * ADV + 4}" y="380" width="18" height="44" fill="#c9a24b"/>`
      : "";
    return png(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#fdfbf7"/>
  <text x="${x1}" y="336" text-anchor="start" font-family="Courier, monospace" font-size="50" font-weight="bold" fill="${INK}" letter-spacing="6">${c1}</text>
  <text x="${x2}" y="416" text-anchor="start" font-family="Courier, monospace" font-size="50" font-weight="bold" fill="#c9a24b" letter-spacing="6">${c2}</text>
  ${caretSvg}
  ${footer ? `<g shape-rendering="crispEdges"><path transform="translate(${W / 2 - 32},486) scale(4.6)" fill="#c9a24b" opacity="0.9" d="M0 5h2v2h2V5h2V3h2v2h2v2h2V5h2v6H0z"/></g><text x="${W / 2}" y="608" text-anchor="middle" font-family="Courier, monospace" font-size="21" font-weight="bold" fill="#a3a3ad" letter-spacing="8">2,222 · ROBINHOOD CHAIN · REVEAL PENDING</text>` : ""}
</svg>`);
  };

  /* ————— scaled-variant cache ————— */
  const cache = new Map<string, Buffer>();
  async function scaled(key: string, buf: Buffer, scale: number, scaleY?: number) {
    const sx = Math.max(0.05, Math.round(scale * 50) / 50);
    const sy = Math.max(0.05, Math.round((scaleY ?? scale) * 50) / 50);
    const k = `${key}|${sx}|${sy}`;
    if (!cache.has(k)) {
      const m = await sharp(buf).metadata();
      cache.set(
        k,
        await sharp(buf)
          .resize(Math.max(6, Math.round(m.width! * sx)), Math.max(6, Math.round(m.height! * sy)), { kernel: "nearest", fit: "fill" })
          .png().toBuffer(),
      );
    }
    return cache.get(k)!;
  }
  const dims = async (b: Buffer) => {
    const m = await sharp(b).metadata();
    return { w: m.width!, h: m.height! };
  };

  type Layer = { input: Buffer; left: number; top: number };
  const CENTER_Y = H / 2 - 8;

  console.log(`rendering ${F.end} frames ...`);
  for (let f = 0; f < F.end; f++) {
    const layers: Layer[] = [];
    let base: Buffer = bgCream;
    let letterbox = true;
    let capBuf: Buffer | null = null;

    /* ————— A: animated title build ————— */
    if (f < F.titleFlash) {
      base = bgCream;
      letterbox = true;
      // crown drops with bounce (0-18)
      const cd = backOut(clamp(f / 20));
      layers.push({ input: crownBig, left: W / 2 - 66, top: Math.round(lerp(-140, 158, cd)) });
      // wordmark slides up (6-26)
      const tw = eoc(clamp((f - 6) / 20));
      if (tw > 0.01) layers.push({ input: titleText, left: W / 2 - 400, top: Math.round(lerp(H, 268, tw)) });
      // underline draws (24-40)
      const uw = Math.round(300 * eoc(clamp((f - 24) / 16)));
      if (uw > 2) layers.push({ input: await underline(uw), left: W / 2 - uw / 2, top: 420 });
      // PRESENTS appears (34+), letterbox sparkles
      if (f >= 34) layers.push({ input: presentsText, left: W / 2 - 250, top: 438 });
      if (f >= 40) {
        if (f % 24 < 12) layers.push({ input: sparkGoldSm, left: 356, top: 208 });
        else layers.push({ input: sparkPink, left: 896, top: 500 });
        if (f % 30 < 10) layers.push({ input: sparkMint, left: 250, top: 430 });
      }
      if (f > F.titleFlash - 6) layers.push({ input: flashAt((f - (F.titleFlash - 6)) / 6), left: 0, top: 0 });
    } else if (f < F.sealCut) {
      /* ————— B: flash captures (virtual camera over world) ————— */
      const t = (f - F.titleFlash) / (F.sealCut - F.titleFlash);
      const z = 1 + 0.07 * eio(t);
      const cw = Math.round(W / z);
      const ch = Math.round(H / z);
      const cx = Math.round(lerp(40, 220, t));
      const cy = Math.round(lerp(140, 170, t));
      base = await sharp(bgWorld).extract({ left: cx, top: cy, width: cw, height: ch }).resize(W, H, { kernel: "nearest" }).toBuffer();
      capBuf = capFlash;

      // drifting bokeh (parallax light layer)
      for (let i = 0; i < 5; i++) {
        const bx = Math.round((((i * 277 + f * (1.2 + i * 0.28)) % (W + 140)) - 90));
        const by = Math.round(90 + ((i * 173) % 320) + 14 * Math.sin(f / 22 + i));
        layers.push({ input: bokeh, left: bx, top: by });
      }

      // live card: shutter-flip in on its beat, flies to corner stack on next beat
      let idx = -1;
      for (let i = 0; i < F.captures.length; i++) if (f >= F.captures[i]) idx = i;
      if (idx >= 0) {
        const born = F.captures[idx];
        const since = f - born;
        // flip-in: scaleX 0.1 → overshoot → 1
        const flip = clamp(since / 8);
        const sxFlip = flip < 1 ? lerp(0.1, 1, backOut(flip)) : 1;
        const bob = Math.round(4 * Math.sin(f / 12 + idx));
        const buf = await scaled(`card${idx}`, cards[idx], 1 * sxFlip, 1);
        const d = await dims(buf);
        // shadow
        const sh = await shadowFor(360, 1);
        layers.push({ input: sh, left: W / 2 - 180, top: CENTER_Y + 232 });
        layers.push({ input: buf, left: Math.round(W / 2 - d.w / 2), top: Math.round(CENTER_Y - d.h / 2 + bob) });
        if (since >= 3 && since <= 14) layers.push({ input: sparkGold, left: W / 2 + 178, top: CENTER_Y - 224 });
        if (since >= 5 && since <= 16) layers.push({ input: sparkWhite, left: W / 2 - 238, top: CENTER_Y + 130 });
      }
      // previous cards fly to bottom-right corner stack
      for (let i = 0; i < idx; i++) {
        const leave = F.captures[i + 1];
        const tt = clamp((f - leave) / 12);
        if (tt >= 1) continue;
        const e = eic(tt);
        const s = lerp(1, 0.12, e);
        const buf = await scaled(`card${i}`, cards[i], s);
        const d = await dims(buf);
        const x = lerp(W / 2, W - 96, e);
        const y = lerp(CENTER_Y, H - BAR - 40, e);
        layers.push({ input: buf, left: Math.round(x - d.w / 2), top: Math.round(y - d.h / 2) });
      }
      // corner counter chip
      if (idx >= 0) {
        const captured = Math.min(idx + (f >= F.captures[idx] + 8 ? 1 : 0), 4);
        if (captured > 0) layers.push({ input: chips[captured - 1], left: W - 150, top: H - BAR - 62 });
      }
      // flash spikes on each capture beat
      for (const b of F.captures) {
        const d = f - b;
        if (d >= 0 && d < 5) layers.push({ input: flashAt(1 - d / 5), left: 0, top: 0 });
      }
      if (f > F.sealCut - 5) layers.push({ input: flashAt((f - (F.sealCut - 5)) / 5), left: 0, top: 0 });
    } else if (f < F.chainCut) {
      /* ————— C: sealing (mint room, slow push-in) ————— */
      const t = (f - F.sealCut) / (F.chainCut - F.sealCut);
      const z = 1 + 0.06 * t;
      const cw = Math.round(W / z);
      const ch = Math.round(H / z);
      base = await sharp(bgMint)
        .extract({ left: Math.round(100 * z - 60), top: Math.round(120 + 30 * t), width: cw, height: ch })
        .resize(W, H, { kernel: "nearest" })
        .toBuffer();
      if (f >= 258) capBuf = capSeal;

      const packD = { w: 300, h: 411 };
      const rise = eoc(clamp((f - (F.sealCut + 4)) / (F.packLand - F.sealCut - 4)));
      const packY = Math.round(lerp(H + 30, CENTER_Y - packD.h / 2 + 26, rise));
      const packX = W / 2 - packD.w / 2;

      // glow + shadow behind pack
      layers.push({ input: glowGold, left: W / 2 - 280, top: CENTER_Y - 260 });
      const sh = await shadowFor(300, 1);
      layers.push({ input: sh, left: W / 2 - 150, top: CENTER_Y + 218 });

      // cards dive in on kicks (behind the pack)
      for (let i = 0; i < 4; i++) {
        const start = F.dives[i];
        const tt = clamp((f - start) / 16);
        if (f < start - 20 || tt >= 1) continue;
        const pre = clamp((f - (start - 20)) / 20); // approach from corner
        const e = tt > 0 ? eic(tt) : 0;
        const fromX = [W * 0.12, W * 0.9, -60, W * 1.02][i];
        const fromY = [H * 0.2, H * 0.16, H * 0.62, H * 0.7][i];
        const holdX = lerp(fromX, W * [0.28, 0.72, 0.2, 0.8][i], eoc(pre));
        const holdY = lerp(fromY, H * 0.3, eoc(pre));
        const x = lerp(holdX, W / 2, e);
        const y = lerp(holdY, CENTER_Y + 30, e);
        const s = lerp(0.42, 0.1, e);
        const buf = await scaled(`card${i}`, cards[i], s);
        const d = await dims(buf);
        layers.push({ input: buf, left: Math.round(x - d.w / 2), top: Math.round(y - d.h / 2) });
        if (tt > 0.85) layers.push({ input: sparkGoldSm, left: Math.round(x - 14), top: Math.round(y - 60) });
      }

      layers.push({ input: packBuf, left: packX, top: packY });

      // glint streak sweeps the pack after last dive
      if (f >= F.glint && f < F.glint + 16) {
        const gt = (f - F.glint) / 16;
        const gx = Math.round(lerp(packX - 60, packX + packD.w + 20, gt));
        const streak = await sharp(glintStreak).extract({ left: 0, top: 0, width: 70, height: 411 }).png().toBuffer();
        // clip streak to pack area horizontally
        if (gx > packX - 40 && gx < packX + packD.w) layers.push({ input: streak, left: gx, top: packY });
      }
      // crown sparkle + ? pulse on beats
      if (f >= F.glint && (f - F.glint) % 24 < 10) layers.push({ input: sparkGold, left: packX + 124, top: packY + 30 });
      if (f >= F.qPulse) {
        const pulse = 0.9 + 0.2 * Math.abs(Math.sin((f - F.qPulse) / 14));
        const q = await scaled("qgold", qGold, pulse);
        const qd = await dims(q);
        layers.push({ input: q, left: Math.round(W / 2 - qd.w / 2), top: Math.round(packY + 320 - qd.h / 2) });
      }
      if (f > F.chainCut - 5) layers.push({ input: flashAt((f - (F.chainCut - 5)) / 5), left: 0, top: 0 });
    } else if (f < F.barrage[0]) {
      /* ————— D: onchain (camera tracks the hopping pack) ————— */
      capBuf = f >= 366 ? capChain : null;
      // world coords: blocks every 300px; camera pans to follow pack
      const blocksX = [200, 500, 800, 1100, 1400];
      const blockY = 512;
      // pack world x: hops between blocks on beat landings
      let px = blocksX[0];
      let hopH = 0;
      for (let i = 0; i < 4; i++) {
        const land = F.hopLands[i];
        const start = land - 16;
        if (f >= land) px = blocksX[i + 1];
        else if (f >= start) {
          const tt = (f - start) / 16;
          px = lerp(blocksX[i], blocksX[i + 1], eio(tt));
          hopH = 120 * Math.sin(Math.PI * tt);
        }
      }
      const camX = Math.round(clamp(px - W / 2 + 60, 0, 1800 - W));
      base = await sharp(bgCity).extract({ left: camX, top: 20, width: W, height: H }).toBuffer();

      // blocks + growing links (world→screen via camX)
      for (let i = 0; i < blocksX.length; i++) {
        const appear = i === 0 ? F.chainCut : F.hopLands[i - 1] - 6;
        if (f < appear) continue;
        const pop = eoc(clamp((f - appear) / 7));
        const bb = await scaled("block", blockBuf, 0.65 + 0.35 * pop);
        const bd = await dims(bb);
        const sx = blocksX[i] - camX;
        if (sx < -160 || sx > W + 160) continue;
        layers.push({ input: bb, left: Math.round(sx - bd.w / 2), top: blockY });
        if (i > 0 && f > appear + 3) {
          const grow = eoc(clamp((f - appear - 3) / 9));
          const full = 300 - 130;
          const wpx = Math.max(4, Math.round(full * grow));
          const link = await sharp({ create: { width: wpx, height: 9, channels: 4, background: { r: 46, g: 189, b: 107, alpha: 0.8 } } }).png().toBuffer();
          layers.push({ input: link, left: Math.round(blocksX[i - 1] - camX + 62), top: blockY + 52 });
        }
      }
      // green pulse traveling the drawn links
      const pt = ((f - F.chainCut) % 40) / 40;
      const pulseX = lerp(blocksX[0], px, pt) - camX;
      if (f > F.hopLands[0]) {
        const dot = await sharp({ create: { width: 14, height: 14, channels: 4, background: { r: 46, g: 189, b: 107, alpha: 0.95 } } }).png().toBuffer();
        layers.push({ input: dot, left: Math.round(pulseX), top: blockY + 50 });
      }
      // pack + squashing shadow
      const packS = 0.4;
      const pb = await scaled("pack", packBuf, packS);
      const pd = await dims(pb);
      const sqk = clamp(1 - hopH / 160, 0.4, 1);
      const sh = await shadowFor(150, sqk);
      layers.push({ input: sh, left: Math.round(px - camX - 75), top: blockY + 8 });
      layers.push({ input: pb, left: Math.round(px - camX - pd.w / 2), top: Math.round(blockY - pd.h + 26 - hopH) });
      // landing sparkle bursts on kicks
      for (const land of F.hopLands) {
        const d = f - land;
        if (d >= 0 && d < 10) {
          layers.push({ input: sparkMint, left: Math.round(px - camX - 70 + d * 3), top: blockY - 10 - d * 2 });
          layers.push({ input: sparkGoldSm, left: Math.round(px - camX + 46 - d * 2), top: blockY - 20 - d * 3 });
        }
      }
      if (f > F.barrage[0] - 4) layers.push({ input: flashAt((f - (F.barrage[0] - 4)) / 4), left: 0, top: 0 });
    } else if (f < F.endStart) {
      /* ————— E: flash barrage ————— */
      base = await endState(0, false, false);
      letterbox = false;
      for (const b of F.barrage) {
        const d = f - b;
        if (d >= 0 && d < 6) layers.push({ input: flashAt(1 - d / 6), left: 0, top: 0 });
      }
    } else {
      /* ————— F: typewriter end ————— */
      letterbox = false;
      const total = L1.length + L2.length;
      const chars = Math.min(total, Math.floor((f - F.endStart) / 2));
      const done = chars >= total;
      const caret = !done ? true : f % 24 < 12;
      const footer = f >= F.sting + 8;
      base = await endState(chars, caret && f < F.sting + 40, footer);
      if (done && f >= F.sting && f < F.sting + 14) {
        layers.push({ input: sparkGold, left: 902, top: 380 });
      }
      if (footer && f % 30 < 15) layers.push({ input: sparkGoldSm, left: 906, top: 356 });
      if (f === F.sting || f === F.sting + 1) layers.push({ input: flashAt(0.5 - 0.25 * (f - F.sting)), left: 0, top: 0 });
    }

    /* ————— global finishing: letterbox, caption, vignette, grain ————— */
    if (letterbox) {
      layers.push({ input: barTop, left: 0, top: 0 });
      layers.push({ input: barBot, left: 0, top: H - BAR });
      if (capBuf) layers.push({ input: capBuf, left: 0, top: H - BAR });
    }
    layers.push({ input: vignette, left: 0, top: 0 });
    layers.push({ input: grains[f % 3], left: 0, top: 0 });

    await sharp(base)
      .composite(layers.map((l) => ({ ...l, left: Math.round(l.left), top: Math.round(l.top) })))
      .png()
      .toFile(path.join(FRAMES, `f${String(f).padStart(4, "0")}.png`));
    if (f % 60 === 0) process.stdout.write(`  frame ${f}/${F.end}\r`);
  }
  console.log(`\ndone: ${F.end} frames (${(F.end / FPS).toFixed(1)}s)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
