/**
 * Generates the hero keyframe still for the GRIFTERS teaser video.
 * The still is what Kling animates (image-to-video).
 * Run: npx tsx scripts/video/generate-keyframe.ts
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "video", "teaser-keyframe.png");

const PROMPT = `Premium light-theme pixel-art scene, retro 16-bit game style with chunky crisp pixels, luxury Hollywood collectible universe, soft pastel palette of warm ivory, cream, powder blue, mint green, blush pink, lavender and champagne gold.

A glamorous movie-premiere red carpet scene in wide 16:9 composition: a blush-pink carpet runs across warm sand-colored ground toward an elegant art-deco theater entrance on the right side with a blank glowing marquee. Champagne-gold velvet rope stanchions line the carpet. In the CENTER of the carpet stands a single large sealed trading-card pack, cream and pastel colored with a tiny gold pixel crown emblem and a question mark, softly glowing. On the left, two small pixel paparazzi figures seen from behind in dark suits hold cameras raised toward the pack (figures generic and faceless, no celebrity likeness). Pale palm trees at the edges, soft pixel clouds in a cream sky, tiny white four-point sparkle stars. Flat side-view game-like composition similar to a retro platformer scene, clean horizon line, generous sky space above for effects. No readable text, no dark areas, luminous, high-end NFT teaser art.`;

async function main() {
  if (fs.existsSync(OUT)) {
    console.log("keyframe exists — delete to regenerate");
    return;
  }
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set");
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey: key });
  console.log("generating teaser keyframe...");
  const res = await client.images.generate({
    model: "gpt-image-1",
    prompt: PROMPT,
    size: "1536x1024",
    quality: "high",
    n: 1,
  });
  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error("no image data");
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(b64, "base64"));
  console.log("saved:", OUT);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
