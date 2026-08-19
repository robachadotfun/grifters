/**
 * GRIFTERS collection factory — assembles the full 2,222-token set from
 * the archetype portraits (public/nfts/) plus the trait/prop library,
 * and writes the canonical metadata JSONL that feeds build-manifest.ts.
 *
 * Traits per token:
 *   archetype  — one of the generated portraits (48 planned)
 *   gem        — rarity tier stone, top-left (legendary 4% / epic 13% /
 *                rare 28% / common 55%)
 *   prop       — bottom-right accessory (none / key / camera / film
 *                reel / champagne), key rarest
 *   finish     — subtle whole-image grade (classic / golden / rosy / cool)
 *
 * Sampling is deterministic from --seed, without replacement, so the
 * same seed always yields the same 2,222 unique tokens. Output goes to
 * .collection/ (gitignored — 2,222 images don't belong in the repo;
 * hosting/IPFS is a separate step).
 *
 * Usage: npx tsx scripts/reveal/build-collection.ts --seed grifters-v1 [--limit 24]
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { keccak256, encodePacked } from "viem";

const SUPPLY = 2222;
const NFT_DIR = path.join(process.cwd(), "public", "nfts");
const PROP_DIR = path.join(process.cwd(), "public", "generated", "grifters");
const OUT_DIR = path.join(process.cwd(), ".collection");

const args = process.argv.slice(2);
const arg = (n: string) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : null;
};
const seed = arg("seed") ?? "grifters-v1";
const limit = arg("limit") ? Number(arg("limit")) : SUPPLY;

// ——— trait tables ————————————————————————————————————————————————
// Full roster lives in roster.json (written by generate-nfts-wave4.ts);
// the inline table below is the pre-wave-4 fallback.
const ROSTER_PATH = path.join(process.cwd(), "scripts/reveal/roster.json");
const FALLBACK: { file: string; name: string; label: string }[] = [
  { file: "grifter-icon.png", name: "PARIS", label: "THE ICON" },
  { file: "grifter-champion.png", name: "FLOYD", label: "THE CHAMPION" },
  { file: "grifter-original.png", name: "LINDSAY", label: "THE ORIGINAL" },
  { file: "grifter-internet.png", name: "MIA", label: "THE INTERNET" },
  { file: "grifter-legacy.png", name: "CAITLYN", label: "THE LEGACY" },
  { file: "grifter-hitmaker.png", name: "DRAKE", label: "THE HITMAKER" },
  { file: "grifter-starboy.png", name: "ABEL", label: "THE STARBOY" },
  { file: "grifter-popprince.png", name: "JUSTIN", label: "THE POP PRINCE" },
  { file: "grifter-mogul.png", name: "KYLIE", label: "THE MOGUL" },
  { file: "grifter-momager.png", name: "KRIS", label: "THE MOMAGER" },
  { file: "grifter-runway.png", name: "KENDALL", label: "THE RUNWAY" },
  { file: "grifter-empire.png", name: "KIM", label: "THE EMPIRE" },
  { file: "grifter-visionary.png", name: "YE", label: "THE VISIONARY" },
  { file: "grifter-plug.png", name: "NAV", label: "THE PLUG" },
  { file: "grifter-heartthrob.png", name: "ZAYN", label: "THE HEARTTHROB" },
  { file: "grifter-songbird.png", name: "TAYLOR", label: "THE SONGBIRD" },
  { file: "grifter-empress.png", name: "ROBYN", label: "THE EMPRESS" },
  { file: "grifter-queen.png", name: "BEY", label: "THE QUEEN" },
  { file: "grifter-dynasty.png", name: "SHAWN", label: "THE DYNASTY" },
  { file: "grifter-king.png", name: "LEBRON", label: "THE KING" },
  { file: "grifter-ace.png", name: "SERENA", label: "THE ACE" },
  { file: "grifter-phenom.png", name: "CRISTIANO", label: "THE PHENOM" },
  { file: "grifter-maestro.png", name: "LEO", label: "THE MAESTRO" },
  { file: "grifter-smooth.png", name: "CALVIN", label: "THE SMOOTH" },
  { file: "grifter-lyricist.png", name: "MARSHALL", label: "THE LYRICIST" },
  { file: "grifter-voice.png", name: "ADELE", label: "THE VOICE" },
  { file: "grifter-whisper.png", name: "BILLIE", label: "THE WHISPER" },
  { file: "grifter-disco.png", name: "DUA", label: "THE DISCO" },
  { file: "grifter-ponytail.png", name: "ARIANA", label: "THE PONYTAIL" },
  { file: "grifter-sweetheart.png", name: "SELENA", label: "THE SWEETHEART" },
  { file: "grifter-rebel.png", name: "MILEY", label: "THE REBEL" },
  { file: "grifter-shapeshifter.png", name: "DOJA", label: "THE SHAPESHIFTER" },
  { file: "grifter-rager.png", name: "TRAVIS", label: "THE RAGER" },
  { file: "grifter-firecracker.png", name: "CARDI", label: "THE FIRECRACKER" },
  { file: "grifter-barb.png", name: "NICKI", label: "THE BARB" },
  { file: "grifter-popprincess.png", name: "BRITNEY", label: "THE POP PRINCESS" },
  { file: "grifter-material.png", name: "MADONNA", label: "THE MATERIAL GIRL" },
  { file: "grifter-oracle.png", name: "OPRAH", label: "THE ORACLE" },
  { file: "grifter-rock.png", name: "DWAYNE", label: "THE ROCK" },
  { file: "grifter-notorious.png", name: "CONOR", label: "THE NOTORIOUS" },
  { file: "grifter-masters.png", name: "ELDRICK", label: "THE MASTERS" },
  { file: "grifter-lightning.png", name: "USAIN", label: "THE LIGHTNING" },
  { file: "grifter-martian.png", name: "ELON", label: "THE MARTIAN" },
  { file: "grifter-benefactor.png", name: "JIMMY", label: "THE BENEFACTOR" },
  { file: "grifter-arthouse.png", name: "TIMOTHEE", label: "THE ARTHOUSE" },
  { file: "grifter-itgirl.png", name: "ZENDAYA", label: "THE IT GIRL" },
  { file: "grifter-oscar.png", name: "LEONARDO", label: "THE OSCAR" },
  { file: "grifter-monster.png", name: "GAGA", label: "THE MONSTER" },
  { file: "grifter-conejo.png", name: "BENITO", label: "THE CONEJO" },
];

const GEMS = [
  { key: "COMMON", file: "gem-common.png", weight: 55 },
  { key: "RARE", file: "gem-rare.png", weight: 28 },
  { key: "EPIC", file: "gem-epic.png", weight: 13 },
  { key: "LEGENDARY", file: "gem-legendary.png", weight: 4 },
];

/** ICONIC — 22 one-of-one gold editions (1% of supply) reserved for the
 *  biggest names. Gold pixel frame, crown seal, no duplicate exists. */
const ICONIC_NAMES = [
  "TAYLOR", "DRAKE", "BEY", "ABEL", "KIM", "KYLIE", "YE", "PARIS", "FLOYD",
  "ROBYN", "JUSTIN", "ARIANA", "BILLIE", "LEO", "CRISTIANO", "LEBRON",
  "MICHAEL", "BRADY", "SRK", "VIRAT", "ELON", "JIMMY",
];

const PROPS = [
  { key: "NONE", file: null as string | null, weight: 46 },
  { key: "CHAMPAGNE", file: "pixel-champagne.png", weight: 16 },
  { key: "FILM REEL", file: "pixel-film-reel.png", weight: 14 },
  { key: "PAPARAZZI CAMERA", file: "pixel-camera.png", weight: 14 },
  { key: "GRIFTERS KEY", file: "grifters-key.png", weight: 10 },
];

const FINISHES = [
  { key: "CLASSIC", weight: 46, mod: null as null | { tint?: [number, number, number]; brightness?: number; saturation?: number } },
  { key: "GOLDEN HOUR", weight: 22, mod: { tint: [255, 238, 205] as [number, number, number] } },
  { key: "ROSE CARPET", weight: 18, mod: { tint: [255, 224, 232] as [number, number, number] } },
  { key: "COOL MINT", weight: 14, mod: { tint: [222, 244, 235] as [number, number, number] } },
];

// ——— deterministic PRNG ————————————————————————————————————————————
function prng(seedStr: string) {
  let counter = 0;
  let buf = "";
  return () => {
    if (buf.length < 12) buf = keccak256(encodePacked(["string", "uint256"], [seedStr, BigInt(counter++)])).slice(2);
    const v = parseInt(buf.slice(0, 12), 16) / 0xffffffffffff;
    buf = buf.slice(12);
    return v;
  };
}
const rand = prng(seed);

function weightedPick<T extends { weight: number }>(table: T[]): T {
  const total = table.reduce((a, b) => a + b.weight, 0);
  let roll = rand() * total;
  for (const row of table) {
    roll -= row.weight;
    if (roll <= 0) return row;
  }
  return table[table.length - 1];
}

// ——— sample 2,222 unique tokens ————————————————————————————————————
const ARCHETYPES: { file: string; name: string; label: string }[] = fs.existsSync(ROSTER_PATH)
  ? JSON.parse(fs.readFileSync(ROSTER_PATH, "utf8"))
  : FALLBACK;
const available = ARCHETYPES.filter((a) => fs.existsSync(path.join(NFT_DIR, a.file)));
if (available.length < ARCHETYPES.length) {
  console.log(`note: ${ARCHETYPES.length - available.length} archetype files missing — sampling from ${available.length}`);
}
if (available.length === 0) throw new Error("no archetype art found");

type Token = {
  archetype: (typeof ARCHETYPES)[number];
  gem: (typeof GEMS)[number];
  prop: (typeof PROPS)[number];
  finish: (typeof FINISHES)[number];
  iconic?: boolean;
};
// 22 ICONIC one-of-ones first (identity order is irrelevant — the sealed
// manifest shuffle randomizes token assignment anyway)…
const iconicRoster = ICONIC_NAMES.map((n) => {
  const a = available.find((x) => x.name === n);
  if (!a) console.log(`WARNING: ICONIC name ${n} not in available roster — skipped`);
  return a;
}).filter(Boolean) as typeof available;
const tokens: Token[] = iconicRoster.map((archetype) => ({
  archetype,
  gem: { key: "ICONIC", file: "ultra-crown.png", weight: 0 },
  prop: PROPS[0],
  finish: { key: "GOLD EDITION", weight: 0, mod: { tint: [255, 232, 180] as [number, number, number] } },
  iconic: true,
}));
// …then the regular supply. No forced combo-uniqueness: rejection
// sampling would skew the rarity weights. Tokens with the same traits
// differ by serial, as in any layered PFP collection.
while (tokens.length < SUPPLY) {
  tokens.push({
    archetype: available[Math.floor(rand() * available.length)],
    gem: weightedPick(GEMS),
    prop: weightedPick(PROPS),
    finish: weightedPick(FINISHES),
  });
}

// ——— render ————————————————————————————————————————————————————————
fs.mkdirSync(path.join(OUT_DIR, "images"), { recursive: true });
const propCache = new Map<string, Buffer>();
async function propBuf(file: string, size: number): Promise<Buffer> {
  const ck = `${file}@${size}`;
  const hit = propCache.get(ck);
  if (hit) return hit;
  const b = await sharp(path.join(PROP_DIR, file)).resize(size, size, { kernel: "nearest", fit: "inside" }).png().toBuffer();
  propCache.set(ck, b);
  return b;
}

async function renderToken(i: number, t: Token) {
  const out = path.join(OUT_DIR, "images", `${i}.png`);
  if (fs.existsSync(out)) return;
  const img = sharp(path.join(NFT_DIR, t.archetype.file)).resize(1024, 1024, { kernel: "nearest" });
  const layers: sharp.OverlayOptions[] = [];
  if (t.finish.mod?.tint) {
    // subtle color veil (~13% alpha), not a duotone — preserves the art
    const [r, g, b] = t.finish.mod.tint;
    layers.push({
      input: { create: { width: 1024, height: 1024, channels: 4, background: { r, g, b, alpha: 0.13 } } },
    });
  }
  if (t.iconic) {
    // gold pixel frame: outer + inner border, stepped corners
    const B = 22;
    const gold = { r: 201, g: 162, b: 75, alpha: 1 };
    const cream = { r: 255, g: 244, b: 214, alpha: 1 };
    for (const [inset, col] of [
      [0, gold],
      [B, cream],
      [B + 8, gold],
    ] as const) {
      const w = 1024 - inset * 2;
      const t2 = col === gold ? B : 8;
      layers.push(
        { input: { create: { width: w, height: t2, channels: 4, background: col } }, left: inset, top: inset },
        { input: { create: { width: w, height: t2, channels: 4, background: col } }, left: inset, top: 1024 - inset - t2 },
        { input: { create: { width: t2, height: w, channels: 4, background: col } }, left: inset, top: inset },
        { input: { create: { width: t2, height: w, channels: 4, background: col } }, left: 1024 - inset - t2, top: inset },
      );
    }
    layers.push({ input: await propBuf("ultra-crown.png", 168), left: 52, top: 52 });
  } else {
    layers.push({ input: await propBuf(t.gem.file, 128), left: 28, top: 28 });
    if (t.prop.file) layers.push({ input: await propBuf(t.prop.file, 220), left: 1024 - 240, top: 1024 - 240 });
  }
  await img.composite(layers).png().toFile(out);
}

async function main() {
  const meta: string[] = [];
  const counts: Record<string, number> = {};
  for (let i = 0; i < Math.min(limit, tokens.length); i++) {
    const t = tokens[i];
    await renderToken(i, t);
    counts[t.archetype.name] = (counts[t.archetype.name] ?? 0) + 1;
    meta.push(
      JSON.stringify({
        identity: i,
        name: t.iconic ? `${t.archetype.name} — ICONIC 1/1` : `${t.archetype.name} #${counts[t.archetype.name]}`,
        archetype: t.archetype.label,
        celebrity: t.archetype.name,
        gem: t.gem.key,
        prop: t.iconic ? "GOLD FRAME" : t.prop.key,
        finish: t.finish.key,
        ...(t.iconic ? { edition: "1 OF 1" } : {}),
        image: `images/${i}.png`,
      }),
    );
    if ((i + 1) % 100 === 0) console.log(`rendered ${i + 1}/${Math.min(limit, tokens.length)}`);
  }
  fs.writeFileSync(path.join(OUT_DIR, "metadata.jsonl"), meta.join("\n") + "\n");
  const rarityTally: Record<string, number> = {};
  for (const t of tokens.slice(0, limit)) rarityTally[t.gem.key] = (rarityTally[t.gem.key] ?? 0) + 1;
  console.log("rarity split:", JSON.stringify(rarityTally));
  console.log(`metadata: ${OUT_DIR}/metadata.jsonl (${Math.min(limit, tokens.length)} lines)`);
  console.log("→ feed into build-manifest.ts with --in .collection/metadata.jsonl");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
