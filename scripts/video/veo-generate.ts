/**
 * Generates the two teaser scenes with Veo 3.1 (Gemini API) — image-to-video
 * with native audio. Requires GEMINI_API_KEY (server-side only, never logged).
 * Run: npx tsx scripts/video/veo-generate.ts
 */
import fs from "node:fs";
import path from "node:path";

const KEY = process.env.GEMINI_API_KEY;
const HOST = "https://generativelanguage.googleapis.com/v1beta";
const DIR = path.join(process.cwd(), "public", "video");
const MODELS = ["veo-3.1-generate-preview", "veo-3.1-fast-generate-preview", "veo-3.1-lite-generate-preview"];

const JOBS = [
  {
    out: "veo-premiere.mp4",
    image: path.join(DIR, "teaser-keyframe.png"),
    prompt:
      "Animate this retro pixel art scene, keeping the exact chunky pixel art style and pastel palette throughout, camera locked with a very slow subtle push-in. The paparazzi photographer fires bright white camera flashes every couple of seconds, each flash briefly whiting the edges of frame. The glowing sealed collectible pack in the center hovers gently and pulses with warm golden light, its crown emblem twinkling. Golden four-point sparkles and pastel confetti rain down softly. The theater marquee bulbs flicker on warmly. Velvet ropes sway slightly. Audio: rapid camera shutter clicks and flashbulb pops, a soft excited crowd murmur in the distance, gentle magical shimmer chimes when sparkles fall.",
  },
  {
    out: "veo-seal.mp4",
    image: path.join(DIR, "veo-keyframe-seal.png"),
    prompt:
      "Animate this retro pixel art scene, keeping the exact chunky pixel art style and pastel palette, very slow cinematic push-in toward the sealed collectible pack on its pedestal. The pack hovers almost imperceptibly and glows with breathing golden light. A bright foil glint sweeps diagonally across the pack once. The large question mark on the pack pulses softly. Tiny golden and mint sparkles drift through the air of the showroom. Soft light rays from the ceiling shift slowly. Audio: hushed luxurious ambience, a deep soft heartbeat pulse building anticipation, delicate crystalline shimmer when the glint sweeps.",
  },
];

async function submit(job: (typeof JOBS)[number]) {
  const image = fs.readFileSync(job.image).toString("base64");
  for (const model of MODELS) {
    const res = await fetch(`${HOST}/models/${model}:predictLongRunning?key=${KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt: `${job.prompt} Strictly avoid: realistic rendering, 3d, photographic look, blur, darkness, new characters, readable text, watermarks.`, image: { bytesBase64Encoded: image, mimeType: "image/png" } }],
        parameters: { aspectRatio: "16:9", resolution: "720p" },
      }),
    });
    const j = (await res.json()) as any;
    if (j.name) {
      console.log(`${job.out}: submitted (${model})`);
      return j.name as string;
    }
    console.log(`${job.out} ${model}: ${j.error?.message?.slice(0, 140) ?? "unknown error"}`);
  }
  throw new Error(`${job.out}: all models rejected`);
}

async function poll(op: string, out: string) {
  for (let i = 0; i < 90; i++) {
    await new Promise((r) => setTimeout(r, 10000));
    const j = (await (await fetch(`${HOST}/${op}?key=${KEY}`)).json()) as any;
    if (j.error) throw new Error(`${out}: ${j.error.message}`);
    if (j.done) {
      const sample =
        j.response?.generateVideoResponse?.generatedSamples?.[0]?.video ??
        j.response?.videos?.[0] ??
        j.response?.generatedVideos?.[0]?.video;
      const uri = sample?.uri;
      if (!uri) throw new Error(`${out}: no video uri in ${JSON.stringify(j.response)?.slice(0, 300)}`);
      const dl = await fetch(uri.includes("key=") ? uri : `${uri}${uri.includes("?") ? "&" : "?"}key=${KEY}`);
      const buf = Buffer.from(await dl.arrayBuffer());
      fs.writeFileSync(path.join(DIR, out), buf);
      console.log(`${out}: saved (${Math.round(buf.length / 1024)}KB)`);
      return;
    }
    process.stdout.write(`  ${out}: rendering ${i * 10}s\r`);
  }
  throw new Error(`${out}: timed out`);
}

async function main() {
  if (!KEY) throw new Error("GEMINI_API_KEY not set");
  const pending = JOBS.filter((j) => !fs.existsSync(path.join(DIR, j.out)));
  if (!pending.length) {
    console.log("both clips exist — delete to regenerate");
    return;
  }
  const ops = await Promise.all(pending.map(submit));
  await Promise.all(ops.map((op, i) => poll(op, pending[i].out)));
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
