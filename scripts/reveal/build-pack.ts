/**
 * Reveal pack — metadata + images keyed by SEALED MANIFEST POSITION,
 * which is what GriftersReveal.identityIndexOf(tokenId) returns.
 *   .reveal-pack/meta/{pos}.json   ← tokenURI target after setBaseURI
 *   .reveal-pack/img/{pos}.webp    ← 512px nearest-neighbor WebP
 *   .reveal-pack/manifest-public.json + salt.txt  ← published for auditors
 * STAYS GITIGNORED until the reveal word has landed (position order IS
 * the secret). Publish with scripts/reveal/publish-pack.sh.
 *
 * Run: npx tsx scripts/reveal/build-pack.ts
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SITE = "https://www.grifters.market";
const OUT = path.join(process.cwd(), ".reveal-pack");
const manifest = JSON.parse(fs.readFileSync(".manifest/manifest.json", "utf8")) as {
  items: { identity: number; name: string; archetype: string; celebrity: string; gem: string; prop: string; finish: string; edition?: string; image: string }[];
};
const salt = fs.readFileSync(".manifest/SALT.txt", "utf8").trim();

async function main() {
  fs.mkdirSync(path.join(OUT, "meta"), { recursive: true });
  fs.mkdirSync(path.join(OUT, "img"), { recursive: true });
  const items = manifest.items;
  if (items.length !== 2222) throw new Error("manifest size");

  let done = 0;
  const work = items.map((it, pos) => async () => {
    const imgOut = path.join(OUT, "img", `${pos}.webp`);
    if (!fs.existsSync(imgOut)) {
      await sharp(path.join(".collection", it.image)).resize(512, 512, { kernel: "nearest" }).webp({ quality: 80 }).toFile(imgOut);
    }
    const rarity = it.gem === "ICONIC" ? "ICONIC" : it.gem;
    const meta = {
      name: `GRIFTERS — ${it.name}`,
      description: `${it.celebrity}, ${it.archetype.toLowerCase()}. One of 2,222 pixel celebrity collectibles on Robinhood Chain. Identity assigned by one word of mined entropy (StonkPit DERP conductor) against a pre-committed sealed manifest — verifiable by anyone.`,
      image: `${SITE}/meta/img/${pos}.webp`,
      external_url: `${SITE}/gallery`,
      attributes: [
        { trait_type: "Celebrity", value: it.celebrity },
        { trait_type: "Archetype", value: it.archetype },
        { trait_type: "Rarity", value: rarity },
        { trait_type: "Prop", value: it.prop },
        { trait_type: "Finish", value: it.finish },
        ...(it.edition ? [{ trait_type: "Edition", value: it.edition }] : []),
        { trait_type: "Manifest Position", value: pos, display_type: "number" },
      ],
    };
    fs.writeFileSync(path.join(OUT, "meta", `${pos}.json`), JSON.stringify(meta));
    if (++done % 250 === 0) console.log(`packed ${done}/2222`);
  });
  // 8-way concurrency for sharp
  const q = [...work];
  await Promise.all(Array.from({ length: 8 }, async () => { for (let w = q.shift(); w; w = q.shift()) await w(); }));

  fs.writeFileSync(path.join(OUT, "manifest-public.json"), JSON.stringify({ supply: 2222, items }, null, 1));
  fs.writeFileSync(path.join(OUT, "salt.txt"), salt + "\n");
  const size = fs.readdirSync(path.join(OUT, "img")).reduce((a, f) => a + fs.statSync(path.join(OUT, "img", f)).size, 0);
  console.log(`pack complete: 2,222 meta + 2,222 img (${(size / 1024 / 1024).toFixed(0)} MB) → ${OUT}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
