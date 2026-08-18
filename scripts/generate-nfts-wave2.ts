/**
 * GRIFTERS wave 2 — eleven new pixel celebrity archetypes in the exact
 * style of the original five. Skips files that already exist.
 *
 * Run: npx tsx scripts/generate-nfts-wave2.ts
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) throw new Error("OPENAI_API_KEY missing");

const NFT_DIR = path.join(process.cwd(), "public", "nfts");

const STYLE = `Extremely high quality retro pixel art, chunky visible square pixels, clean black pixel outlines around the character, luxury collectible NFT profile picture, side profile bust portrait facing right, character occupies center of frame, soft pastel palette, tiny four-point pixel sparkle stars scattered in background, subtle dithering texture in the background, premium glamorous Hollywood mood, flat lighting, no text anywhere in the image, square 1:1 composition`;

const jobs: { file: string; prompt: string }[] = [
  {
    file: "grifter-hitmaker.png",
    prompt: `${STYLE}. A wealthy hip-hop superstar, light-brown-skinned man with short black hair and a full neatly-groomed black beard, wearing a luxurious cream puffer jacket over a white tee, thin gold chain necklace, small diamond stud earring, a subtle owl-shaped gold pendant. Background: soft powder-blue evening sky with a faint pixel CN-tower-style skyline silhouette and pale gold sparkle stars.`,
  },
  {
    file: "grifter-starboy.png",
    prompt: `${STYLE}. A famous R&B singer, dark-skinned man with short black coiled hair and a light beard, wearing a sharp scarlet-red blazer over a black shirt, thin silver chain, confident expression. Background: pale blush-pink dusk sky with faint pixel city lights bokeh and soft lavender clouds, white sparkle stars.`,
  },
  {
    file: "grifter-popprince.png",
    prompt: `${STYLE}. A young pop superstar, fair-skinned man with tousled blonde hair under a backwards baseball cap, small neck tattoos, wearing an oversized pastel lavender hoodie and a silver chain. Background: soft lilac-purple gradient with faint pixel stage lights and white sparkle stars.`,
  },
  {
    file: "grifter-mogul.png",
    prompt: `${STYLE}. A glamorous young beauty mogul, tan-skinned woman with long sleek raven-black hair, full glossy nude-pink lips, long lashes, wearing a blush-pink silk slip dress, layered gold necklaces, holding a tiny pink lipstick tube. Background: pale rose-pink gradient with faint pixel cosmetic bottles silhouettes and gold sparkle stars.`,
  },
  {
    file: "grifter-momager.png",
    prompt: `${STYLE}. An elegant powerful businesswoman matriarch, fair-skinned woman with a short jet-black pixie cut, wearing a crisp white power suit with champagne-gold earrings, holding a tiny retro flip phone, subtle knowing smile. Background: pale champagne-cream gradient with faint pixel martini glass and contract-paper silhouettes, gold sparkle stars.`,
  },
  {
    file: "grifter-runway.png",
    prompt: `${STYLE}. A world-famous supermodel, tan-skinned woman with a long sleek brunette ponytail, high cheekbones, small gold hoop earrings, wearing a minimalist black turtleneck and thin cat-eye sunglasses. Background: very pale ivory runway scene with faint pixel camera flashes and soft grey sparkle stars.`,
  },
  {
    file: "grifter-empire.png",
    prompt: `${STYLE}. A glamorous reality-TV superstar and business empress, olive-skinned woman with very long straight black hair with a center part, wearing a champagne-beige fitted bodysuit, large diamond drop earrings, holding a tiny smartphone. Background: soft pearl-grey gradient with a faint pixel diamond and faint dollar-note silhouettes, white sparkle stars.`,
  },
  {
    file: "grifter-visionary.png",
    prompt: `${STYLE}. A famous music producer and fashion visionary, dark-skinned man with short black hair, wearing small dark rectangular shield sunglasses, a plain heavyweight taupe-brown designer sweatshirt, single gold chain. Background: warm sand-beige minimalist gradient with faint pixel stadium-light beams and cream sparkle stars.`,
  },
  {
    file: "grifter-plug.png",
    prompt: `${STYLE}. A melodic rap producer, brown-skinned South-Asian man with a neat black beard, wearing a black designer cap, an iced-out diamond cuban chain, and a charcoal hoodie with a small diamond pendant. Background: pale ice-blue gradient with faint pixel mixing-console sliders and white sparkle stars.`,
  },
  {
    file: "grifter-heartthrob.png",
    prompt: `${STYLE}. A brooding pop heartthrob, olive-skinned man with a tall black quiff hairstyle and light stubble, arm tattoos peeking from a rolled-sleeve black leather jacket over a white tee, silver earring. Background: soft mint-green gradient with faint pixel microphone silhouette and white sparkle stars.`,
  },
  {
    file: "grifter-songbird.png",
    prompt: `${STYLE}. A beloved singer-songwriter superstar, fair-skinned woman with blonde bangs and long wavy hair, bright red lips, delicate cat-eye eyeliner, wearing a sparkling champagne sequin dress, small silver guitar-pick pendant. Background: pale sky-blue gradient with faint pixel acoustic guitar silhouette and gold four-point sparkle stars.`,
  },
];

async function gen(job: { file: string; prompt: string }) {
  const dest = path.join(NFT_DIR, job.file);
  if (fs.existsSync(dest)) {
    console.log(`skip: ${job.file}`);
    return;
  }
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1", prompt: job.prompt, size: "1024x1024", quality: "high", n: 1 }),
  });
  if (!res.ok) {
    console.log(`FAIL ${job.file}: ${res.status} ${(await res.text()).slice(0, 200)}`);
    return;
  }
  const j = (await res.json()) as { data: { b64_json: string }[] };
  fs.writeFileSync(dest, Buffer.from(j.data[0].b64_json, "base64"));
  await sharp(dest).webp({ quality: 92 }).toFile(dest.replace(/\.png$/, ".webp"));
  console.log(`done: ${job.file}`);
}

async function main() {
  for (const job of jobs) await gen(job);
  console.log("wave 2 complete");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
