/**
 * Assembles the GRIFTERS teaser:
 *   title card (3.2s, slow zoom) → Kling scene (10s) → end card (4.2s)
 * with gentle crossfades, 1280x720@30. Silent by design — drop your
 * licensed music track on top in any editor, or pass AUDIO=path.mp3.
 * Run: npx tsx scripts/video/assemble.ts
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SCRATCH = process.env.SCRATCHPAD || "/tmp";
const FF =
  process.env.FFMPEG ||
  path.join(SCRATCH, "node_modules", "ffmpeg-static", "ffmpeg");

const DIR = path.join(process.cwd(), "public", "video");
const TITLE = path.join(DIR, "card-title.png");
const SCENE = path.join(DIR, "teaser-scene.mp4");
const END = path.join(DIR, "card-end.png");
const OUT = path.join(DIR, "grifters-teaser.mp4");
const AUDIO = process.env.AUDIO;

for (const f of [TITLE, SCENE, END]) {
  if (!fs.existsSync(f)) {
    console.error("missing:", f);
    process.exit(1);
  }
}
if (!fs.existsSync(FF)) {
  console.error("ffmpeg not found — set FFMPEG=/path/to/ffmpeg");
  process.exit(1);
}

const T_TITLE = 3.2;
const T_END = 4.2;
const XF = 0.5;

const filter = [
  // title: slow push-in
  `[0:v]scale=1280:720,zoompan=z='1+0.04*in/96':d=${Math.round(T_TITLE * 30)}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720:fps=30,format=yuv420p[title]`,
  // scene: normalize
  `[1:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=30,format=yuv420p[scene]`,
  // end: static
  `[2:v]scale=1280:720,fps=30,format=yuv420p[end]`,
  `[title][scene]xfade=transition=fade:duration=${XF}:offset=${T_TITLE - XF}[a]`,
  `[a][end]xfade=transition=fade:duration=${XF}:offset=${(T_TITLE - XF) + 10 - XF}[v]`,
].join(";");

const args = [
  "-y",
  "-loop", "1", "-t", String(T_TITLE), "-i", TITLE,
  "-i", SCENE,
  "-loop", "1", "-t", String(T_END), "-i", END,
  ...(AUDIO ? ["-i", AUDIO] : []),
  "-filter_complex", filter,
  "-map", "[v]",
  ...(AUDIO ? ["-map", "3:a", "-shortest", "-c:a", "aac", "-b:a", "192k"] : ["-an"]),
  "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-movflags", "+faststart",
  OUT,
];

console.log("assembling...");
execFileSync(FF, args, { stdio: ["ignore", "ignore", "inherit"] });
const kb = Math.round(fs.statSync(OUT).size / 1024);
console.log(`saved: ${OUT} (${kb}KB)`);
