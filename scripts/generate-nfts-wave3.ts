/**
 * GRIFTERS wave 3 — 32 more pixel celebrity archetypes, same style
 * formula as waves 1–2. Skips files that already exist; safe to re-run
 * until all 32 land.
 *
 * Run: npx tsx scripts/generate-nfts-wave3.ts
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) throw new Error("OPENAI_API_KEY missing");

const NFT_DIR = path.join(process.cwd(), "public", "nfts");

const STYLE = `Extremely high quality retro pixel art, chunky visible square pixels, clean black pixel outlines around the character, luxury collectible NFT profile picture, side profile bust portrait facing right, character occupies center of frame, soft pastel palette, tiny four-point pixel sparkle stars scattered in background, subtle dithering texture in the background, premium glamorous Hollywood mood, flat lighting, no text anywhere in the image, square 1:1 composition`;

const jobs: { file: string; prompt: string }[] = [
  { file: "grifter-empress.png", prompt: `${STYLE}. A Caribbean-born music and beauty empress, brown-skinned woman with dark wavy shoulder-length hair, wine-red lipstick, gold hoop earrings, wearing an oversized ivory designer coat over a emerald slip dress, layered gold necklaces. Background: pale seafoam gradient with faint pixel perfume bottle and diamond silhouettes, gold sparkle stars.` },
  { file: "grifter-queen.png", prompt: `${STYLE}. A regal R&B superstar, brown-skinned woman with long honey-blonde waves, glamorous gold drop earrings, wearing a golden sequin gown with structured shoulders, subtle crown motif hairpin. Background: pale champagne gradient with faint pixel stage-light beams and a tiny bee silhouette, gold sparkle stars.` },
  { file: "grifter-dynasty.png", prompt: `${STYLE}. A legendary New York rap mogul, dark-skinned man with a full black beard and low fade, wearing a navy fitted baseball cap slightly tilted, crisp white tee under an open black blazer, single gold chain, calm knowing smile. Background: pale powder-blue gradient with faint pixel Brooklyn-bridge silhouette, white sparkle stars.` },
  { file: "grifter-king.png", prompt: `${STYLE}. A basketball king, muscular dark-skinned man with a full black beard and black headband, wearing a sleeveless purple-and-gold basketball jersey, gold chain, confident jaw. Background: pale lavender gradient with a faint pixel crown floating above and faint basketball-court lines, gold sparkle stars.` },
  { file: "grifter-ace.png", prompt: `${STYLE}. A tennis champion queen, dark-skinned woman with a sleek black bun and gold hoop earrings, wearing a white athletic dress with gold trim, holding a pastel tennis racket over her shoulder. Background: pale mint-green gradient with faint pixel tennis-court lines and a small gold trophy silhouette, white sparkle stars.` },
  { file: "grifter-phenom.png", prompt: `${STYLE}. A world-famous Portuguese footballer, tan-skinned man with short dark slicked-back hair and sharp jawline, wearing a red-and-green football jersey with a subtle number seven patch shape, small stud earring. Background: pale sky-blue gradient with faint pixel stadium arcs and a small gold ball silhouette, white sparkle stars.` },
  { file: "grifter-maestro.png", prompt: `${STYLE}. A legendary Argentine footballer, fair-skinned man with short brown hair and a full reddish-brown beard, wearing a sky-blue-and-white striped football jersey, calm humble expression. Background: pale cream gradient with faint pixel World-Cup-trophy silhouette and confetti pixels, gold sparkle stars.` },
  { file: "grifter-smooth.png", prompt: `${STYLE}. A laid-back West Coast rap legend, slim dark-skinned man with long braids, thin black sunglasses, wearing a blue flannel shirt and a single gold chain with a small paw pendant. Background: pale baby-blue gradient with faint pixel palm trees and vinyl-record silhouettes, white sparkle stars.` },
  { file: "grifter-lyricist.png", prompt: `${STYLE}. An iconic Detroit rapper, fair-skinned man with a platinum-blonde buzz cut and sharp jaw, wearing a grey hoodie with the hood down and a silver chain, intense focused eyes. Background: pale silver-grey gradient with faint pixel cassette-tape and microphone silhouettes, white sparkle stars.` },
  { file: "grifter-voice.png", prompt: `${STYLE}. A powerhouse British soul singer, fair-skinned woman with an elegant honey-blonde updo, dramatic winged black eyeliner, classic red lips, wearing a black sequin gown and pearl earrings. Background: pale blush gradient with faint pixel grand-piano silhouette, gold sparkle stars.` },
  { file: "grifter-whisper.png", prompt: `${STYLE}. A gen-z alt-pop phenomenon, fair-skinned young woman with black hair with neon-green roots, wearing an oversized neon-green-and-black baggy streetwear set, chunky silver chain, sleepy half-smile. Background: pale grey-green gradient with faint pixel spider and blohsh-like abstract shapes, white sparkle stars.` },
  { file: "grifter-disco.png", prompt: `${STYLE}. A British-Albanian disco-pop star, tan-skinned woman with long sleek black hair with a center part, wearing a metallic lilac futuristic crop top and layered chokers, glossy lips. Background: pale lilac gradient with faint pixel disco-ball and laser-line silhouettes, white sparkle stars.` },
  { file: "grifter-ponytail.png", prompt: `${STYLE}. A petite pop diva, light-tan-skinned woman with a very long high brunette ponytail, dramatic cat-eye liner, oversized cream sweater-dress and thigh-high boots, small heart earring. Background: pale pink cloud gradient with faint pixel moon and star silhouettes, white sparkle stars.` },
  { file: "grifter-sweetheart.png", prompt: `${STYLE}. A beloved pop-and-TV sweetheart, tan-skinned woman with dark brown hair in soft waves, warm brown eyes, classic red lips, wearing an elegant white blazer dress and small gold hoops. Background: pale peach gradient with faint pixel cooking-pan and heart silhouettes, gold sparkle stars.` },
  { file: "grifter-rebel.png", prompt: `${STYLE}. A pop-rock rebel, fair-skinned woman with a shaggy blonde mullet, wearing a black leather jacket over a metallic red top, layered silver chains, tongue-in-cheek smirk. Background: pale rose gradient with faint pixel disco-ball wrecking-sphere silhouette, white sparkle stars.` },
  { file: "grifter-shapeshifter.png", prompt: `${STYLE}. A playful genre-bending pop-rap star, light-brown-skinned woman with a candy-pink bob wig and space buns, wearing a holographic pink top with a tiny cow-print collar, star-shaped earrings, sly cat-like smile. Background: pale bubblegum gradient with faint pixel planet and cat silhouettes, white sparkle stars.` },
  { file: "grifter-rager.png", prompt: `${STYLE}. A Houston rage-rap superstar, brown-skinned man with short braids, wearing a brown vintage workwear jacket over a black tee, diamond cross chain, calm intense look. Background: pale tan gradient with faint pixel cactus and rollercoaster silhouettes, white sparkle stars.` },
  { file: "grifter-firecracker.png", prompt: `${STYLE}. A Bronx rap firecracker, light-brown-skinned woman with extremely long ombré red-to-orange hair, long jeweled nails visible on one raised hand, wearing a leopard-print coat and big gold hoops. Background: pale coral gradient with faint pixel crown and dollar-heart silhouettes, gold sparkle stars.` },
  { file: "grifter-barb.png", prompt: `${STYLE}. A queen-bee rap superstar, light-brown-skinned woman with a glossy pastel-pink wig with straight bangs, wearing a pink latex-look jacket, chunky diamond chain, playful wink expression. Background: pale pink gradient with faint pixel butterfly and crown silhouettes, white sparkle stars.` },
  { file: "grifter-popprincess.png", prompt: `${STYLE}. An early-2000s pop princess, fair-skinned woman with butterfly-clipped platinum-blonde hair, wearing a sparkling pink crop top with low-rise sparkle belt, small silver hoop earrings, bright smile. Background: pale bubblegum gradient with faint pixel butterfly and star-microphone silhouettes, white sparkle stars.` },
  { file: "grifter-material.png", prompt: `${STYLE}. An eighties pop icon reinventor, fair-skinned woman with teased platinum-blonde curls tied with a black lace bow, bold red lips, beauty mark, wearing black lace gloves and layered pearl necklaces over a corset-style top. Background: pale mauve gradient with faint pixel boombox and cross silhouettes, white sparkle stars.` },
  { file: "grifter-oracle.png", prompt: `${STYLE}. A legendary talk-show billionaire, dark-skinned woman with voluminous dark curls, warm confident smile, statement gold earrings, wearing a plum power blazer, holding a slim pixel microphone. Background: pale gold gradient with faint pixel book and sunrise silhouettes, gold sparkle stars.` },
  { file: "grifter-rock.png", prompt: `${STYLE}. A megastar action hero, bald muscular tan-skinned man with one eyebrow raised, wearing a fitted black turtleneck, subtle tribal tattoo peeking at the shoulder, small chain. Background: pale slate gradient with faint pixel dumbbell and film-clapper silhouettes, white sparkle stars.` },
  { file: "grifter-notorious.png", prompt: `${STYLE}. A brash Irish fighting champion, fair-skinned man with a groomed ginger beard and slicked-back hair, wearing a tailored three-piece pinstripe suit with a pocket square, chest tattoos peeking at the collar, cocky grin. Background: pale emerald gradient with faint pixel championship-belt and clover silhouettes, gold sparkle stars.` },
  { file: "grifter-masters.png", prompt: `${STYLE}. A golf legend, light-brown-skinned man wearing a black golf cap and a bright red polo shirt, calm focused eyes, one gloved hand holding a pixel golf club over his shoulder. Background: pale green gradient with faint pixel flag-on-green and trophy silhouettes, white sparkle stars.` },
  { file: "grifter-lightning.png", prompt: `${STYLE}. The fastest sprinter alive, tall dark-skinned man with a short fade, huge joyful grin, wearing a green-and-gold running singlet with a small lightning-bolt pendant. Background: pale yellow gradient with faint pixel stopwatch and lightning-bolt silhouettes, white sparkle stars.` },
  { file: "grifter-martian.png", prompt: `${STYLE}. An eccentric rocket-and-robot tech magnate, fair-skinned man with short dark hair, slight smirk, wearing a black bomber jacket with a tiny rocket patch over a black tee. Background: pale ice-blue gradient with faint pixel rocket, satellite and mars-dot silhouettes, white sparkle stars.` },
  { file: "grifter-benefactor.png", prompt: `${STYLE}. The internet's biggest giveaway YouTuber, young fair-skinned man with fluffy brown hair and a friendly open-mouth grin, wearing a teal hoodie with a small panther-like logo shape, holding a stack of pixel gift boxes. Background: pale teal gradient with faint pixel play-button and gift silhouettes, white sparkle stars.` },
  { file: "grifter-arthouse.png", prompt: `${STYLE}. An arthouse heartthrob actor, slim fair-skinned young man with tousled dark curly hair and sharp cheekbones, wearing an avant-garde shimmering backless-style halter top with a delicate chain necklace, brooding gaze. Background: pale dune-peach gradient with faint pixel desert-dune and film-reel silhouettes, white sparkle stars.` },
  { file: "grifter-itgirl.png", prompt: `${STYLE}. Hollywood's reigning it-girl, light-brown-skinned woman with long auburn waves, elegant gold statement earrings, wearing a sculptural champagne evening gown with structured shoulders, poised expression. Background: pale rose-gold gradient with faint pixel spider-web-thin couture and film-camera silhouettes, gold sparkle stars.` },
  { file: "grifter-oscar.png", prompt: `${STYLE}. A golden-era leading man, fair-skinned actor with slicked-back dirty-blonde hair and a neat goatee, wearing a classic black tuxedo with bow tie, holding a small golden statuette-shaped award, satisfied smile. Background: pale champagne gradient with faint pixel yacht and iceberg silhouettes, gold sparkle stars.` },
  { file: "grifter-monster.png", prompt: `${STYLE}. An avant-garde pop performance artist, fair-skinned woman with platinum-white hair in a sculptural swoop, dramatic silver face jewel under one eye, wearing an architectural silver-white outfit with sharp shoulders. Background: pale ice gradient with faint pixel piano and claw-hand silhouettes, white sparkle stars.` },
  { file: "grifter-conejo.png", prompt: `${STYLE}. A Puerto Rican reggaeton superstar, tan-skinned man with a short fade and thin mustache, small white sunglasses, wearing a pastel-pink utility vest over a white tee, one small hoop earring, relaxed cool expression. Background: pale sunset-peach gradient with faint pixel bunny-ears and palm silhouettes, white sparkle stars.` },
];

async function gen(job: { file: string; prompt: string }) {
  const dest = path.join(NFT_DIR, job.file);
  if (fs.existsSync(dest)) {
    console.log(`skip: ${job.file}`);
    return;
  }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-image-1", prompt: job.prompt, size: "1024x1024", quality: "high", n: 1 }),
      });
      if (!res.ok) {
        console.log(`fail ${job.file} (attempt ${attempt}): ${res.status} ${(await res.text()).slice(0, 160)}`);
        if (res.status === 429) await new Promise((r) => setTimeout(r, 30000));
        continue;
      }
      const j = (await res.json()) as { data: { b64_json: string }[] };
      fs.writeFileSync(dest, Buffer.from(j.data[0].b64_json, "base64"));
      await sharp(dest).webp({ quality: 92 }).toFile(dest.replace(/\.png$/, ".webp"));
      console.log(`done: ${job.file}`);
      return;
    } catch (e) {
      console.log(`err ${job.file} (attempt ${attempt}): ${e instanceof Error ? e.message : e}`);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  console.log(`GAVE UP: ${job.file}`);
}

async function main() {
  for (const job of jobs) await gen(job);
  console.log("wave 3 complete");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
