/**
 * Animates the teaser keyframe via the Kling image-to-video API,
 * polls until complete and downloads the clip.
 * Requires KLING_API_KEY (server-side only, never logged).
 * Run: npx tsx scripts/video/kling-animate.ts
 */
import fs from "node:fs";
import path from "node:path";

const HOST = "https://api-singapore.klingai.com";
const KEY = process.env.KLING_API_KEY;
const KEYFRAME = path.join(process.cwd(), "public", "video", "teaser-keyframe.png");
const OUT = path.join(process.cwd(), "public", "video", "teaser-scene.mp4");
const TASK_FILE = path.join(process.cwd(), "public", "video", ".kling-task.json");

const PROMPT = `Pixel art scene comes alive with premiere-night energy while keeping the exact retro pixel art style: the paparazzi photographer's camera fires bright white flash bursts every couple of seconds, each flash briefly lighting the scene; the sealed collectible pack in the center hovers gently up and down and glows warmly, its crown emblem twinkling; golden four-point sparkles and tiny confetti pieces rain down softly from the sky; the theater marquee lights flicker on; velvet ropes sway very slightly; clouds drift slowly. Camera locked, no zoom, no pan. Everything stays crisp pixel art, light pastel, joyful and glamorous.`;

const NEGATIVE = `realistic, 3d render, photographic, blur, smooth gradients, dark, night, people walking, new characters appearing, faces, text, watermark, distortion of the pack`;

const MODELS = ["kling-v2-5-turbo", "kling-v2-1", "kling-v2-master", "kling-v1-6"];

async function api(pathname: string, init?: RequestInit) {
  const res = await fetch(`${HOST}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  return res.json() as Promise<{ code: number; message: string; data?: any }>;
}

async function createTask(): Promise<string> {
  const image = fs.readFileSync(KEYFRAME).toString("base64");
  // most capable first, cheapest last — first config the balance affords wins
  const tiers: { mode: "pro" | "std"; duration: "10" | "5" }[] = [
    { mode: "pro", duration: "10" },
    { mode: "std", duration: "10" },
    { mode: "pro", duration: "5" },
    { mode: "std", duration: "5" },
  ];
  for (const tier of tiers) {
    for (const model of MODELS) {
      const r = await api("/v1/videos/image2video", {
        method: "POST",
        body: JSON.stringify({
          model_name: model,
          image,
          prompt: PROMPT,
          negative_prompt: NEGATIVE,
          mode: tier.mode,
          duration: tier.duration,
          cfg_scale: 0.5,
        }),
      });
      if (r.code === 0 && r.data?.task_id) {
        console.log(`task: ${r.data.task_id} (${model} ${tier.mode} ${tier.duration}s)`);
        fs.writeFileSync(TASK_FILE, JSON.stringify({ task_id: r.data.task_id, model, ...tier }));
        return r.data.task_id;
      }
      console.log(`  ${model} ${tier.mode} ${tier.duration}s: ${r.message ?? r.code}`);
    }
  }
  throw new Error("all models/tiers rejected the task");
}

async function poll(taskId: string) {
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 15000));
    const r = await api(`/v1/videos/image2video/${taskId}`);
    const status = r.data?.task_status;
    process.stdout.write(`  ${status ?? r.message}      \r`);
    if (status === "succeed") {
      const url = r.data?.task_result?.videos?.[0]?.url;
      if (!url) throw new Error("no video url in result");
      return url as string;
    }
    if (status === "failed") throw new Error(`generation failed: ${r.data?.task_status_msg}`);
  }
  throw new Error("timed out");
}

async function main() {
  if (!KEY) throw new Error("KLING_API_KEY not set");
  if (fs.existsSync(OUT)) {
    console.log("teaser-scene.mp4 exists — delete to regenerate");
    return;
  }
  // resume a pending task if present
  let taskId: string | null = null;
  if (fs.existsSync(TASK_FILE)) {
    taskId = JSON.parse(fs.readFileSync(TASK_FILE, "utf8")).task_id;
    console.log("resuming task:", taskId);
  }
  if (!taskId) taskId = await createTask();
  console.log("polling (10s pro renders typically take a few minutes)...");
  const url = await poll(taskId);
  console.log("\ndownloading...");
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  fs.writeFileSync(OUT, buf);
  fs.rmSync(TASK_FILE, { force: true });
  console.log(`saved: ${OUT} (${Math.round(buf.length / 1024)}KB)`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
