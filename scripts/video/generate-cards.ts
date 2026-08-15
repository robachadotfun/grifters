/**
 * Title + end cards for the GRIFTERS teaser (1280x720).
 * Run: npx tsx scripts/video/generate-cards.ts
 */
import path from "node:path";
import sharp from "sharp";

const DIR = path.join(process.cwd(), "public", "video");
const W = 1280;
const H = 720;
const INK = "#2a2a33";

const star = (x: number, y: number, s: number, c: string, o = 1) =>
  `<path transform="translate(${x},${y}) scale(${s})" opacity="${o}" fill="${c}" shape-rendering="crispEdges" d="M4 0h1v3h3v1h1v1H8v1H5v3H4V6H1V5H0V4h1V3h3z"/>`;

async function titleCard() {
  const svg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fdfbf7"/>
      <stop offset="0.55" stop-color="#f7f3ec"/>
      <stop offset="1" stop-color="#f4e7cd"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g shape-rendering="crispEdges">
    <path transform="translate(${W / 2 - 66},178) scale(9.4)" fill="#c9a24b" d="M0 5h2v2h2V5h2V3h2v2h2v2h2V5h2v6H0z"/>
    <path transform="translate(${W / 2 - 66},178) scale(9.4)" fill="${INK}" opacity="0.35" d="M0 12h14v1H0z"/>
  </g>
  <text x="${W / 2}" y="418" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="120" font-weight="800" fill="${INK}" letter-spacing="-4">GRIFTERS</text>
  <rect x="${W / 2 - 150}" y="452" width="300" height="4" fill="#c9a24b"/>
  <text x="${W / 2}" y="516" text-anchor="middle" font-family="Courier, monospace" font-size="30" font-weight="bold" fill="#6b6b78" letter-spacing="14">PRESENTS</text>
  ${star(250, 160, 3.4, "#c9a24b", 0.85)}
  ${star(990, 520, 2.6, "#2ebd6b", 0.7)}
  ${star(1050, 190, 3, "#e7a6c4", 0.8)}
  ${star(210, 540, 2.4, "#8fb8e8", 0.7)}
</svg>`);
  await sharp(svg).png().toFile(path.join(DIR, "card-title.png"));
  console.log("card-title.png");
}

async function endCard() {
  const svg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#fdfbf7"/>
  <text x="${W / 2}" y="342" text-anchor="middle" font-family="Courier, monospace" font-size="52" font-weight="bold" fill="${INK}" letter-spacing="6">THE CAMERAS CAUGHT</text>
  <text x="${W / 2}" y="418" text-anchor="middle" font-family="Courier, monospace" font-size="52" font-weight="bold" letter-spacing="6" fill="#c9a24b">SOMETHING.</text>
  ${star(W / 2 + 258, 380, 3.2, "#c9a24b", 0.95)}
  <g shape-rendering="crispEdges">
    <path transform="translate(${W / 2 - 33},492) scale(4.6)" fill="#c9a24b" opacity="0.9" d="M0 5h2v2h2V5h2V3h2v2h2v2h2V5h2v6H0z"/>
  </g>
  <text x="${W / 2}" y="622" text-anchor="middle" font-family="Courier, monospace" font-size="22" font-weight="bold" fill="#a3a3ad" letter-spacing="8">2,222 · COMING SOON ON ROBINHOOD CHAIN</text>
</svg>`);
  await sharp(svg).png().toFile(path.join(DIR, "card-end.png"));
  console.log("card-end.png");
}

titleCard().then(endCard).catch((e) => {
  console.error(e);
  process.exit(1);
});
