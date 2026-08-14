/**
 * GRIFTERS asset generation.
 *
 * Generates missing artwork with the OpenAI Images API and saves it locally.
 * - Requires OPENAI_API_KEY in the environment (server-side only).
 * - Skips assets that already exist (deterministic filenames).
 * - Fails gracefully when no key is present: the site runs without generation.
 *
 * Run: npx tsx scripts/generate-assets.ts
 */
import fs from "node:fs";
import path from "node:path";

const NFT_DIR = path.join(process.cwd(), "public", "nfts");
const GEN_DIR = path.join(process.cwd(), "public", "generated");
const GRIF_DIR = path.join(process.cwd(), "public", "generated", "grifters");

const STYLE = `Extremely high quality retro pixel art, chunky visible square pixels, clean black pixel outlines around the character, luxury collectible NFT profile picture, side profile bust portrait facing right, character occupies center of frame, soft pastel palette, tiny four-point pixel sparkle stars scattered in background, subtle dithering texture in the background, premium glamorous Hollywood mood, flat lighting, no text anywhere in the image, square 1:1 composition`;

/** Shared prefix for the supporting visual system — keeps every asset in one universe. */
const WORLD = `Premium light-theme pixel-art illustration belonging to a luxury Hollywood collectible universe, clean intentional pixel clusters, sophisticated editorial composition, soft pastel palette of warm ivory, cream, powder blue, pale cyan, mint green, blush pink, lavender and champagne gold, subtle retro digital texture, crisp pixel edges, high-end NFT art direction, no people, no characters, no dark backgrounds, no cyberpunk, no neon, no readable text`;

type Job = {
  file: string;
  dir: string;
  prompt: string;
  size: "1024x1024" | "1536x1024" | "1024x1536";
  transparent?: boolean;
};

const jobs: Job[] = [
  // ——— Collection artwork (pixel celebrity archetypes, matching supplied references) ———
  {
    file: "grifter-icon.png",
    dir: NFT_DIR,
    size: "1024x1024",
    prompt: `${STYLE}. A glamorous wealthy blonde socialite heiress with long straight platinum blonde hair, wearing a pink jeweled tiara, large black rectangular sunglasses, glossy pink lips, fluffy pink fur coat over a pink sequin dress, pink heart pendant necklace with pearls, diamond stud earring, carrying a light pink luxury handbag with silver chain strap, a faint glowing white halo ring floating above her head. Background: pale powder blue sky with a faint pixel Eiffel Tower silhouette and pale blue palm trees, pink sparkle stars.`,
  },
  {
    file: "grifter-champion.png",
    dir: NFT_DIR,
    size: "1024x1024",
    prompt: `${STYLE}. A wealthy champion boxer, bald dark-skinned man with a short black goatee beard, wearing large black square sunglasses, a diamond stud earring, a luxurious black and gold bomber jacket with high collar, thick gold cuban link chain necklace with a large round diamond-encrusted gold medallion, small golden boxing gloves hanging from his shoulder. Background: rich warm golden yellow with a faint pixel championship title belt, faint boxing ring ropes and faint stacks of money, white sparkle stars.`,
  },
  {
    file: "grifter-original.png",
    dir: NFT_DIR,
    size: "1024x1024",
    prompt: `${STYLE}. A glamorous 2000s Hollywood starlet with long wavy ginger copper red hair, wearing stylish pink tinted sunglasses with pink frames, glossy pink lips, pearl stud earrings, a shimmering light pink sequin top with a pink cardigan, white pearl necklace with a small pink heart pendant. Background: warm peach and pink sunset gradient sky, faint pixel Hollywood hills with a faint hillside sign shape, silhouetted palm trees, a faint vintage convertible car, white sparkle stars.`,
  },
  {
    file: "grifter-internet.png",
    dir: NFT_DIR,
    size: "1024x1024",
    prompt: `${STYLE}. A glamorous internet celebrity, olive-skinned woman with dark brown hair in a high top bun with long straight lengths falling down, bold dark eyebrows, wearing black rectangular eyeglasses with clear lenses, glossy pink lips, small diamond stud earring, black structured blazer over black top, thin gold necklace with small diamond pendant, black quilted designer handbag with gold chain strap. Background: soft mint green with faint pixel futuristic skyline of Dubai with a sail-shaped tower, faint palm tree, a faint glowing halo ring above her head, cream sparkle stars.`,
  },
  {
    file: "grifter-legacy.png",
    dir: NFT_DIR,
    size: "1024x1024",
    prompt: `${STYLE}. An elegant older Hollywood icon and former Olympic athlete, a graceful woman with long flowing chestnut brown hair, wearing large dark designer cat-eye sunglasses, deep rose lips, white pearl stud earrings, an elegant cream white silk v-neck gown with delicate pleats, a fine silver necklace with a round pearl pendant. Background: soft lilac lavender gradient with a faint pixel laurel wreath, a faint classical villa with cypress trees and a faint antique telescope, white sparkle stars.`,
  },
  // ——— Pre-reveal NFT ———
  {
    file: "prereveal.png",
    dir: NFT_DIR,
    size: "1024x1024",
    prompt: `Extremely high quality retro pixel art, chunky visible square pixels, luxury collectible NFT, square 1:1 composition. A mysterious glamorous figure shown only as a soft lavender-grey pixel silhouette standing behind translucent shimmering pearl white curtains, the silhouette wears a faint tiara shape and a faint necklace silhouette, a small elegant golden pixel question mark floating in front of the curtains at chest height, faint glowing halo above. Palette: pastel lavender, pale sky blue, blush pink, cream, soft gold. Tiny four-point pixel sparkle stars, gentle dithering, velvet red carpet rope stanchions at the bottom corners in soft gold, premium mysterious mood, no readable text other than the question mark symbol.`,
  },
  // ——— Supporting graphics ———
  {
    file: "hero-environment.png",
    dir: GEN_DIR,
    size: "1536x1024",
    prompt: `Wide panoramic retro pixel art landscape, chunky visible square pixels, extremely light and airy pastel palette of warm off-white, pearl, pale sky blue, powder blue, blush pink, champagne and the faintest mint green. A dreamy Los Angeles Beverly Hills skyline at the horizon drawn very faintly, soft pixel clouds, elegant pale blue palm trees on the sides, tiny white four-point camera flash sparkles scattered in the sky, faint sun glow. Everything extremely subtle, low contrast, luminous, like a pale watercolor made of pixels. No characters, no people, no text.`,
  },
  {
    file: "lore-divider.png",
    dir: GEN_DIR,
    size: "1536x1024",
    prompt: `Wide retro pixel art still life collage on a warm cream pearl background, chunky visible square pixels: vintage movie tickets in blush pink and champagne, a strip of pixel film with empty frames, a small gold star award trophy, a pixel autograph pen with a looping ink flourish, a polaroid photo frame, a small retro pixel camera with flash sparkle, a pixel crown, scattered four-point sparkle stars. Pastel palette: cream, blush pink, pale blue, muted gold, soft lavender. Elegant editorial spacing between objects, luminous and light, no readable text.`,
  },
  {
    file: "chain-graphic.png",
    dir: GEN_DIR,
    size: "1536x1024",
    prompt: `Wide abstract retro pixel art network graphic on a very pale mint and white background, chunky visible square pixels: translucent pixel blocks connected by thin pixel chain links forming an elegant flowing network, small glowing nodes in soft mint green, pale sky blue and soft gold, faint feather-like leaf shape made of pixels, tiny white sparkle stars. Extremely light, financial, clean, premium. Low contrast, luminous, no text, no characters.`,
  },
  {
    file: "ticket-texture.png",
    dir: GEN_DIR,
    size: "1536x1024",
    prompt: `Retro pixel art collectible admission ticket on a pale cream background, chunky visible square pixels: one elegant horizontal admission ticket in blush pink and champagne gold with perforated pixel edge notches, a pixel star emblem in its center, subtle dithered shading, tiny sparkle stars around it. Luxurious, light, editorial. No readable text.`,
  },
];

/* ——— Supporting visual system: environments ——— */
const envJobs: Job[] = [
  {
    file: "hero-hollywood-world.png",
    dir: GRIF_DIR,
    size: "1536x1024",
    prompt: `${WORLD}. Very wide dreamy panorama of the Hollywood hills at golden daylight: soft pixel clouds, elegant pale palm trees, faint luxury hotel silhouettes, a distant low-contrast city skyline, tiny white four-point camera-flash sparkles in the sky, faint studio searchlight beams, the faintest mint-green digital accent squares floating. Everything extremely pale, low contrast, luminous, designed to sit far behind foreground content.`,
  },
  {
    file: "hero-hollywood-world-mobile.png",
    dir: GRIF_DIR,
    size: "1024x1536",
    prompt: `${WORLD}. Tall vertical dreamy composition of Hollywood hills: pale pixel clouds at the top, distant hills and a faint skyline at the bottom, elegant pale palm fronds entering from the edges, tiny white four-point sparkles, faintest mint-green digital accents. Extremely pale and low contrast, designed as a background.`,
  },
  {
    file: "collection-studio-background.png",
    dir: GRIF_DIR,
    size: "1536x1024",
    prompt: `${WORLD}. High-end photography studio interior: white seamless paper backdrop sweep, pale mint softbox studio lights on stands, subtle pixel camera tripods, soft blush-pink velvet ropes on champagne stanchions at the sides, tiny floating sparkles. Airy, bright, minimal, very low contrast.`,
  },
  {
    file: "pixel-dressing-room.png",
    dir: GRIF_DIR,
    size: "1536x1024",
    prompt: `${WORLD}. Very pale luxury Hollywood dressing room: mirror with warm round marquee bulbs, elegant garment rack with pastel outfits as simple pixel shapes, a small jewelry table with tiny sparkling pieces, champagne-gold trim details, mint accent highlights. Extremely low contrast, dreamy, background-quality.`,
  },
  {
    file: "fame-history-collage.png",
    dir: GRIF_DIR,
    size: "1536x1024",
    prompt: `${WORLD}. Wide editorial still-life collage of celebrity memorabilia arranged left to right like a timeline: vintage cinema tickets, magazine page edges, a film reel, a blank autograph card with a looping ink flourish, a retro VHS cassette, a blank trading card, a paparazzi camera with a tiny flash sparkle, a small old cinema marquee shape, and finally a glowing modern digital collectible card with mint-green pixel edges. Objects float on warm cream with generous spacing, no faces, no readable text.`,
  },
  {
    file: "celebrity-vault.png",
    dir: GRIF_DIR,
    size: "1536x1024",
    prompt: `${WORLD}. Dreamy luxury archive room: empty ornate collectible frames on pale walls, glass display cases with soft reflections, elegant card drawers, gentle spotlight cones from above, pastel lavender carpeting, champagne-gold details. Feels like a private museum of collectibles, empty of people, extremely low contrast.`,
  },
  {
    file: "reveal-stage.png",
    dir: GRIF_DIR,
    size: "1536x1024",
    prompt: `${WORLD}. Cinematic light premiere stage: layered translucent pearl-white curtains at center, soft blush-pink velvet curtains framing the left and right edges, pale spotlight beams crossing from above, champagne-gold stage trim, tiny camera flash sparkles, soft pastel cloud smoke at the stage floor, faint mint edge lighting. Center of the image stays calm and empty for foreground artwork.`,
  },
  {
    file: "robinhood-pixel-city.png",
    dir: GRIF_DIR,
    size: "1536x1024",
    prompt: `${WORLD}. Light futuristic financial district in pale mint green and white: clean glass pixel buildings, abstract translucent chain-link blocks floating between towers, thin mint-colored data rails connecting rooftops, tiny pastel blocks traveling the rails, white sky with faint sparkles. Optimistic, clean, financial, extremely low contrast.`,
  },
  {
    file: "mint-room.png",
    dir: GRIF_DIR,
    size: "1536x1024",
    prompt: `${WORLD}. Premium minimal collectible showroom interior: pale ivory walls with soft futuristic architecture curves, gentle mint accent lighting strips, floating white display pedestals, small glass card cases, champagne-gold trim lines, subtle palm-leaf shadows on the floor. Apple-store cleanliness meets luxury boutique, empty center for foreground content.`,
  },
  {
    file: "faq-clouds.png",
    dir: GRIF_DIR,
    size: "1536x1024",
    prompt: `${WORLD}. Extremely subtle sky scene: soft powder-blue pixel clouds drifting on near-white cream sky, a few tiny four-point stars, the faintest champagne glow near the horizon. Almost invisible, ultra low contrast, background texture only.`,
  },
  {
    file: "footer-hollywood-sunset.png",
    dir: GRIF_DIR,
    size: "1536x1024",
    prompt: `${WORLD}. Very wide pale pastel sunset panorama over Los Angeles: peach and blush gradient sky, silhouetted pixel palms in soft lavender, distant hills and a gentle city skyline, first tiny stars appearing, small mint-green digital accent squares floating near the skyline. Light and warm, never dark, low contrast.`,
  },
];

/* ——— Supporting visual system: transparent props ——— */
const propJobs: Job[] = [
  { file: "grifters-key.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A single beautiful champagne-gold pixel-art key floating on a fully transparent background, ornate bow shaped like a tiny crown, small sparkling highlights, crisp chunky pixels, centered, generous empty margin.` },
  { file: "gem-common.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A single faceted ice-blue pixel-art crystal gemstone on a fully transparent background, pale powder-blue facets with white highlights, crisp chunky pixels, centered.` },
  { file: "gem-rare.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A single faceted mint-green emerald-like pixel-art crystal gemstone on a fully transparent background, soft mint facets with white glints, crisp chunky pixels, centered.` },
  { file: "gem-epic.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A single faceted lavender pixel-art crystal gemstone on a fully transparent background, soft purple facets with white sparkles, crisp chunky pixels, centered.` },
  { file: "gem-legendary.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A single magnificent champagne-gold pixel-art diamond on a fully transparent background, rich gold facets with white and cream highlights and a tiny crown detail above it, crisp chunky pixels, centered.` },
  { file: "pixel-camera.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A single retro paparazzi pixel-art camera with a small flash burst sparkle, cream and charcoal body with champagne details, fully transparent background, crisp chunky pixels, centered.` },
  { file: "pixel-film-reel.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A single vintage pixel-art film reel with a short ribbon of film unspooling, cream and powder-blue tones with champagne center, fully transparent background, crisp chunky pixels, centered.` },
  { file: "pixel-champagne.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A single elegant pixel-art champagne coupe glass with tiny rising sparkle bubbles, pale gold liquid, fully transparent background, crisp chunky pixels, centered.` },
  { file: "pixel-vip-ticket.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A single luxurious pixel-art admission ticket with perforated stub edge and a small star emblem, blush pink and champagne gold, fully transparent background, crisp chunky pixels, centered, no readable text.` },
  { file: "trait-tiara.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A single dainty pixel-art princess tiara with pink gems, silver band with sparkle highlights, fully transparent background, crisp chunky pixels, centered.` },
  { file: "trait-chain.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A single luxurious pixel-art gold cuban-link chain necklace with a small diamond pendant, fully transparent background, crisp chunky pixels, centered.` },
  { file: "trait-glasses.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A single pair of glamorous pixel-art oversized sunglasses, black frames with a soft pink tint reflection, fully transparent background, crisp chunky pixels, centered.` },
  { file: "trait-handbag.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A single luxury pixel-art quilted handbag in pale pink with a small gold chain strap, fully transparent background, crisp chunky pixels, centered.` },
  { file: "trait-halo.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A single softly glowing pixel-art halo ring floating at a slight angle with tiny sparkles, pale gold and white, fully transparent background, crisp chunky pixels, centered.` },
  { file: "trait-special.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A single small pixel-art camera flash starburst with four-point sparkles, white and champagne, fully transparent background, crisp chunky pixels, centered.` },
  { file: "mint-success-rays.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A radial pixel-art starburst of soft light rays emanating from the center, pale champagne and mint pastel rays with tiny four-point sparkles, fully transparent background, the exact center left empty, crisp chunky pixels.` },
  { file: "pass-event.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A small pixel-art scene of a blush velvet rope on champagne stanchions with a pale ticket floating above, fully transparent background, crisp chunky pixels, centered.` },
  { file: "pass-meet.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. Two abstract pixel-art golden four-point stars gently approaching each other with tiny sparkles between them, fully transparent background, crisp chunky pixels, centered.` },
  { file: "pass-memorabilia.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A single blank pixel-art collectible card with a looping autograph ink flourish and an elegant pen beside it, cream and champagne tones, fully transparent background, crisp chunky pixels, centered, no readable text.` },
  { file: "pass-digital.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A small pixel-art golden key floating in front of a pale mint screen shape with soft glow, fully transparent background, crisp chunky pixels, centered.` },
  { file: "pass-experience.png", dir: GRIF_DIR, size: "1024x1024", transparent: true, prompt: `${WORLD}. A single elegant pixel-art golden door slightly ajar with soft pastel light pouring out, tiny sparkles in the light, fully transparent background, crisp chunky pixels, centered.` },
];

jobs.push(...envJobs, ...propJobs);

async function main() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.log("OPENAI_API_KEY not set — skipping asset generation. Site will use existing assets.");
    return;
  }
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey: key });

  for (const job of jobs) {
    const out = path.join(job.dir, job.file);
    if (fs.existsSync(out)) {
      console.log(`skip (exists): ${job.file}`);
      continue;
    }
    console.log(`generating: ${job.file} ...`);
    const attempt = async (prompt: string) => {
      const res = await client.images.generate({
        model: "gpt-image-1",
        prompt,
        size: job.size,
        quality: "high",
        n: 1,
        ...(job.transparent ? { background: "transparent" as const } : {}),
      });
      const b64 = res.data?.[0]?.b64_json;
      if (!b64) throw new Error("no image data returned");
      fs.mkdirSync(job.dir, { recursive: true });
      fs.writeFileSync(out, Buffer.from(b64, "base64"));
      console.log(`saved: ${out}`);
    };
    try {
      await attempt(job.prompt);
    } catch (err) {
      // retry once with a simplified prompt; never block, never log secrets
      console.error(`retrying ${job.file}:`, err instanceof Error ? err.message : "error");
      try {
        await attempt(job.prompt.split(".").slice(0, 2).join("."));
      } catch {
        console.error(`failed: ${job.file} — site falls back to CSS/SVG`);
      }
    }
  }

  // Optimize: create webp versions alongside the PNGs.
  try {
    const { default: sharp } = await import("sharp");
    for (const dir of [NFT_DIR, GEN_DIR, GRIF_DIR]) {
      if (!fs.existsSync(dir)) continue;
      for (const f of fs.readdirSync(dir)) {
        if (!f.endsWith(".png")) continue;
        const webp = path.join(dir, f.replace(/\.png$/, ".webp"));
        if (fs.existsSync(webp)) continue;
        await sharp(path.join(dir, f)).webp({ quality: 92, nearLossless: true }).toFile(webp);
        console.log(`webp: ${path.basename(webp)}`);
      }
    }
  } catch {
    console.log("sharp unavailable — skipped webp conversion.");
  }
}

main();
