/**
 * GRIFTERS wave 4 — the big roster: ~236 new celebrity archetypes so the
 * 2,222 collection averages only ~8 tokens per celebrity. Same STYLE
 * formula. Skips existing files; safe to re-run until complete.
 * Also writes scripts/reveal/roster.json (all waves merged) which
 * build-collection.ts consumes.
 *
 * Run: npx tsx scripts/generate-nfts-wave4.ts
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) throw new Error("OPENAI_API_KEY missing");

const NFT_DIR = path.join(process.cwd(), "public", "nfts");

const STYLE = `Extremely high quality retro pixel art, chunky visible square pixels, clean black pixel outlines around the character, luxury collectible NFT profile picture, side profile bust portrait facing right, character occupies center of frame, soft pastel palette, tiny four-point pixel sparkle stars scattered in background, subtle dithering texture in the background, premium glamorous Hollywood mood, flat lighting, no text anywhere in the image, square 1:1 composition`;

// [slug, NAME, THE LABEL, character description, background motif]
type E = [string, string, string, string, string];
const NEW: E[] = [
  // ——— music: hip-hop / r&b ———
  ["shakira", "SHAKIRA", "THE HIPS", "a Colombian pop goddess, tan-skinned woman with long golden wavy curls, wearing a coin-belt crop top and gold bangles", "pale amber gradient with faint pixel wolf and guitar silhouettes"],
  ["sza", "SZA", "THE SIREN", "an ethereal R&B songstress, brown-skinned woman with huge voluminous dark curls, dewy skin, wearing a sage-green corset top and silver chains", "pale sage gradient with faint pixel ocean-wave and bee silhouettes"],
  ["kendrick", "KENDRICK", "THE POET", "a Pulitzer-grade West Coast rapper, dark-skinned man with short braids, calm intense eyes, wearing a plain white tee and a single diamond stud", "pale dodger-blue gradient with faint pixel crown-of-thorns and butterfly silhouettes"],
  ["cole", "COLE", "THE PROFESSOR", "a introspective North Carolina rapper, light-brown-skinned man with a short afro and beard, wearing a plain hoodie", "pale forest-green gradient with faint pixel basketball-rim and vinyl silhouettes"],
  ["future", "FUTURE", "THE PLUTO", "an Atlanta trap icon, dark-skinned man with short dreads and designer sunglasses, wearing a black leather jacket and layered diamond chains", "pale violet gradient with faint pixel planet and astronaut silhouettes"],
  ["wayne", "WAYNE", "THE CARTER", "a legendary New Orleans rapper, dark-skinned man with long dreadlocks and face tattoos, wearing a red bandana-print jacket and diamond grill smile", "pale crimson gradient with faint pixel skateboard and fireman-helmet silhouettes"],
  ["savage", "SAVAGE", "THE 21", "a deadpan Atlanta-London rapper, dark-skinned man with a dagger face tattoo between brows, short fade, wearing a black puffer and cross chain", "pale slate gradient with faint pixel dagger and British-flag silhouettes"],
  ["uzi", "UZI", "THE ROCKSTAR", "a genre-bending Philly rapper, brown-skinned man with pink dreads and a diamond forehead gem, wearing a studded punk jacket", "pale magenta gradient with faint pixel UFO and lightning silhouettes"],
  ["post", "POST", "THE POSTY", "a tattooed genre-blending superstar, fair-skinned man with brown curls and full face tattoos, gold teeth smile, wearing a floral western shirt", "pale peach gradient with faint pixel beer-can and barbed-wire silhouettes"],
  ["bruno", "BRUNO", "THE 24K", "a retro-funk showman, light-brown-skinned man with a pompadour and gold chains, wearing a red silk shirt and gold-rimmed sunglasses", "pale gold gradient with faint pixel disco-ball and saxophone silhouettes"],
  ["usher", "USHER", "THE CONFESSION", "a smooth R&B king, dark-skinned man with a clean fade and diamond earrings, wearing an open white shirt and layered silver chains", "pale ice-blue gradient with faint pixel roller-skate and microphone silhouettes"],
  ["megan", "MEGAN", "THE STALLION", "a Houston rap queen, brown-skinned woman with long straight black hair and bold lashes, wearing an orange bodysuit and hoops", "pale orange gradient with faint pixel horse and flame silhouettes"],
  ["tyler", "TYLER", "THE CREATOR", "an eccentric rap auteur, dark-skinned man wearing a pastel ushanka hat and pearl necklace over a preppy cardigan", "pale mint gradient with faint pixel bellhop-cart and rose silhouettes"],
  ["rocky", "ROCKY", "THE FLACKO", "a fashion-forward Harlem rapper, brown-skinned man with braids under a silk headscarf, wearing a designer varsity jacket", "pale taupe gradient with faint pixel flag and diamond silhouettes"],
  ["gunna", "GUNNA", "THE DRIP", "a melodic Atlanta rapper, dark-skinned man with shoulder dreads, wearing a pastel designer cardigan and iced-out watch", "pale lavender gradient with faint pixel raindrop silhouettes"],
  ["baby", "BABY", "THE 4PF", "an Atlanta street-rap star, dark-skinned man with short dreads and a diamond cross chain, wearing a black designer tracksuit", "pale grey gradient with faint pixel four-point-flag silhouettes"],
  ["jack", "JACK", "THE HARLOW", "a smooth Kentucky rapper, fair-skinned man with curly brown hair, confident smirk, wearing a cream knit polo", "pale cream gradient with faint pixel horseshoe silhouettes"],
  ["dre", "DRE", "THE DOCTOR", "a legendary producer mogul, dark-skinned man with a clean bald head and goatee, wearing a black tee and studio headphones around neck", "pale charcoal-blue gradient with faint pixel mixing-board and headphone silhouettes"],
  ["curtis", "CURTIS", "THE FIFTY", "a bulletproof rap mogul, muscular dark-skinned man with a low fade, wearing a white tank top and a chunky cross chain", "pale steel gradient with faint pixel vitamin-water-bottle and boxing-glove silhouettes"],
  ["cube", "CUBE", "THE CUBE", "a West Coast rap-and-film legend, dark-skinned man with a jheri-curl era fade and scowl, wearing a black Raiders-style cap and jacket", "pale silver gradient with faint pixel lowrider silhouettes"],
  // ——— music: pop ———
  ["ed", "ED", "THE SHAPE", "a ginger singer-songwriter phenomenon, fair-skinned man with messy red hair and glasses, holding a small acoustic guitar, wearing a plaid shirt", "pale butter gradient with faint pixel maths-symbol silhouettes"],
  ["harry", "HARRY", "THE STYLES", "a flamboyant British pop-rock star, fair-skinned man with tousled brown hair, wearing a pearl necklace and a 70s patterned flared suit", "pale watermelon-pink gradient with faint pixel cherry and boa silhouettes"],
  ["niall", "NIALL", "THE GOLDEN", "an Irish pop charmer, fair-skinned man with light brown hair, warm grin, wearing a retro golf sweater", "pale shamrock gradient with faint pixel guitar silhouettes"],
  ["sam", "SAM", "THE UNHOLY", "a soulful British vocalist, fair-skinned person with platinum short hair and pearl earrings, wearing an elegant black silk blouse", "pale pearl gradient with faint pixel dove silhouettes"],
  ["charlie", "CHARLIE", "THE ATTENTION", "a perfect-pitch pop craftsman, fair-skinned man with neat brown hair, wearing a simple black tee and silver chain", "pale sky gradient with faint pixel piano-key silhouettes"],
  ["demi", "DEMI", "THE PHOENIX", "a powerhouse pop vocalist, light-tan-skinned woman with a sleek dark bob, wearing a black blazer with silver jewelry", "pale smoke gradient with faint pixel phoenix-wing silhouettes"],
  ["camila", "CAMILA", "THE HAVANA", "a Cuban-American pop star, tan-skinned woman with long dark waves and a red flower behind her ear, wearing a ruffled crop top", "pale sunset gradient with faint pixel palm and trumpet silhouettes"],
  ["halsey", "HALSEY", "THE BADLANDS", "an alt-pop shapeshifter, fair-skinned woman with a shaved-side pastel-blue pixie cut and small tattoos, wearing a slip dress", "pale periwinkle gradient with faint pixel crown and moth silhouettes"],
  ["lizzo", "LIZZO", "THE FLUTE", "a joyful pop-rap diva, dark-skinned woman with glamorous long black waves, wearing a sparkling rainbow bodysuit, holding a tiny flute", "pale rainbow-sherbet gradient with faint pixel flute silhouettes"],
  ["lorde", "LORDE", "THE ROYAL", "a moody New Zealand art-pop auteur, fair-skinned woman with wild dark curls and dark lipstick, wearing a simple black slip", "pale teal-grey gradient with faint pixel crown silhouettes"],
  ["lana", "LANA", "THE VIDEOGAME", "a cinematic sadcore songstress, fair-skinned woman with a 60s brunette beehive and winged liner, wearing a white sundress and flower crown", "pale faded-americana gradient with faint pixel diner-sign and rose silhouettes"],
  ["olivia", "OLIVIA", "THE SOUR", "a gen-z pop-punk breakout, light-tan-skinned woman with long dark hair and butterfly clips, wearing a plaid skirt set and chunky rings", "pale lilac gradient with faint pixel butterfly and driver-license silhouettes"],
  ["sabrina", "SABRINA", "THE ESPRESSO", "a petite retro-pop bombshell, fair-skinned woman with big blonde 60s curls and heart-shaped face, wearing a pale blue corset dress", "pale espresso-cream gradient with faint pixel coffee-cup and heart silhouettes"],
  ["chappell", "CHAPPELL", "THE FEMININOMENON", "a theatrical drag-glam pop star, fair-skinned woman with huge fiery red curls and dramatic white face paint with red accents, wearing an extravagant rhinestone outfit", "pale bubblegum gradient with faint pixel swan and star silhouettes"],
  ["ice", "ICE", "THE SPICE", "a Bronx drill princess, light-brown-skinned woman with a ginger curly bob, wearing a baby-blue puffer and silver hoops", "pale baby-blue gradient with faint pixel snowflake silhouettes"],
  ["katy", "KATY", "THE FIREWORK", "a candy-pop showwoman, fair-skinned woman with jet-black retro waves and bright blue eyes, wearing a whipped-cream-inspired pastel corset", "pale cotton-candy gradient with faint pixel firework and cupcake silhouettes"],
  ["pink", "PINK", "THE ACROBAT", "a fearless pop-rock aerialist, fair-skinned woman with a platinum spiked pixie cut, wearing a studded leather vest", "pale fuchsia gradient with faint pixel trapeze silhouettes"],
  ["kesha", "KESHA", "THE ANIMAL", "a glitter-rock survivor, fair-skinned woman with long blonde hair with blue streaks and glitter face paint", "pale glitter-gold gradient with faint pixel dollar-sign silhouettes"],
  ["avril", "AVRIL", "THE SK8ER", "a pop-punk princess, fair-skinned woman with long straight blonde hair and heavy black eyeliner, wearing a black tie over a white tank", "pale checkerboard-grey gradient with faint pixel skateboard silhouettes"],
  ["gwen", "GWEN", "THE HOLLABACK", "a ska-pop fashion icon, fair-skinned woman with platinum victory rolls and bold red lips, wearing a plaid crop jacket", "pale banana gradient with faint pixel megaphone and harajuku-star silhouettes"],
  ["fergie", "FERGIE", "THE DUTCHESS", "a glamorous pop-hop diva, tan-skinned woman with long honey hair, wearing a metallic gold jacket", "pale gold gradient with faint pixel crown silhouettes"],
  ["ciara", "CIARA", "THE GOODIES", "a smooth R&B dancer-singer, brown-skinned woman with long dark waves, wearing a cropped leather jacket and hoops", "pale ice gradient with faint pixel one-two-step footprint silhouettes"],
  ["alicia", "ALICIA", "THE KEYS", "a soulful piano queen, light-brown-skinned woman with braided crown hair and no-makeup glow, wearing a flowing ivory wrap", "pale ivory gradient with faint pixel piano-key silhouettes"],
  ["mariah", "MARIAH", "THE BUTTERFLY", "the queen of vocal runs, light-tan-skinned woman with long golden curls, wearing a shimmering champagne gown", "pale champagne gradient with faint pixel butterfly and snowflake silhouettes"],
  ["celine", "CELINE", "THE HEART", "a legendary power balladeer, fair-skinned woman with an elegant chestnut updo, wearing a sculptural white gown", "pale arctic gradient with faint pixel ship-bow and heart silhouettes"],
  ["jlo", "JLO", "THE JENNY", "a Bronx triple-threat superstar, tan-skinned woman with a sleek honey-highlighted bun and giant hoops, wearing a plunging green tropical-print top", "pale jungle-green gradient with faint pixel block-letters and diamond silhouettes"],
  ["jt", "JT", "THE MIRRORS", "a suave pop-and-suit hitmaker, fair-skinned man with short curly hair and stubble, wearing a tailored suit and tie", "pale silver gradient with faint pixel mirror and boy-band silhouettes"],
  // ——— music: latin / global ———
  ["maluma", "MALUMA", "THE PRETTY BOY", "a Colombian reggaeton heartthrob, tan-skinned man with a blonde buzz cut and face tattoos, wearing a lilac silk shirt and diamond chains", "pale lilac gradient with faint pixel rose silhouettes"],
  ["jose", "JOSE", "THE BALVIN", "a Colombian reggaeton innovator, tan-skinned man with rainbow-dyed short hair, wearing a neon streetwear jacket", "pale neon-pastel gradient with faint pixel lightning-smile silhouettes"],
  ["karol", "KAROL", "THE BICHOTA", "a Colombian reggaeton queen, tan-skinned woman with long turquoise-blue hair, wearing a sparkling red bodysuit", "pale turquoise gradient with faint pixel heart-anchor silhouettes"],
  ["rosalia", "ROSALIA", "THE MOTOMAMI", "a Spanish flamenco-pop innovator, fair-skinned woman with long jet-black hair and long jeweled nails, wearing a red leather moto jacket", "pale scarlet gradient with faint pixel butterfly-helmet silhouettes"],
  ["peso", "PESO", "THE DOBLE P", "a Mexican corridos superstar, tan-skinned man with a short mullet cut, wearing a Cuban-collar shirt and a thin gold chain", "pale desert gradient with faint pixel charro-hat silhouettes"],
  ["anitta", "ANITTA", "THE FUNK", "a Brazilian funk queen, tan-skinned woman with long dark ombré waves, wearing a green-and-gold carnival top", "pale carnival gradient with faint pixel Rio-skyline silhouettes"],
  // ——— music: k-pop ———
  ["jungkook", "JUNGKOOK", "THE GOLDEN MAKNAE", "a Korean pop golden boy, fair-skinned man with dark fringe hair and a lip piercing, wearing a white tee and layered chains, arm tattoos", "pale amethyst gradient with faint pixel bunny silhouettes"],
  ["jimin", "JIMIN", "THE FILTER", "a Korean pop dance prodigy, fair-skinned man with silver-grey swept hair and soft features, wearing a black silk blouse", "pale periwinkle gradient with faint pixel serotonin-bubble silhouettes"],
  ["lisa", "LISA", "THE LALISA", "a Thai rap-dance superstar, fair-skinned woman with blunt bangs and a long blonde ponytail, wearing a jeweled crop top", "pale banana-cream gradient with faint pixel crown silhouettes"],
  ["jennie", "JENNIE", "THE SOLO", "a Korean it-girl rapper, fair-skinned woman with soft black waves, wearing a tweed crop jacket and pearls", "pale rose gradient with faint pixel teddy-bear silhouettes"],
  ["rose", "ROSE", "THE APT", "a Korean-Australian vocalist, fair-skinned woman with long rose-gold hair, wearing a slip dress and holding a tiny guitar", "pale rose-gold gradient with faint pixel apartment-blocks silhouettes"],
  ["jisoo", "JISOO", "THE FLOWER", "a Korean visual queen, fair-skinned woman with long black hair and flower pin, wearing an elegant white blouse", "pale orchid gradient with faint pixel flower silhouettes"],
  ["psy", "PSY", "THE GANGNAM", "a Korean viral legend, fair-skinned man with slick black hair and round sunglasses, wearing a powder-blue tuxedo with bow tie", "pale powder-blue gradient with faint pixel horse-dance silhouettes"],
  // ——— music: rock / legends ———
  ["mick", "MICK", "THE LIPS", "a strutting rock frontman legend, fair-skinned man with shaggy dark hair and famous full lips, wearing an open patterned shirt and scarves", "pale crimson gradient with faint pixel tongue-and-lips silhouettes"],
  ["paul", "PAUL", "THE BEATLE", "a legendary Liverpool songwriter, fair-skinned man with a classic mop-top and warm eyes, wearing a collarless 60s suit, holding a small violin-shaped bass", "pale abbey-road gradient with faint pixel zebra-crossing silhouettes"],
  ["elton", "ELTON", "THE ROCKETMAN", "a flamboyant piano legend, fair-skinned man wearing enormous jeweled star-shaped glasses and a sequined feathered suit", "pale rainbow gradient with faint pixel piano and rocket silhouettes"],
  ["bono", "BONO", "THE ONE", "an Irish stadium-rock frontman, fair-skinned man with swept-back hair and tinted wraparound sunglasses, wearing a black leather jacket", "pale joshua-tree gradient with faint pixel desert-tree silhouettes"],
  ["slash", "SLASH", "THE RIFF", "a legendary guitarist, light-brown-skinned man with a black top hat over huge dark curls and mirrored sunglasses, holding a sunburst guitar", "pale smoke gradient with faint pixel guitar silhouettes"],
  ["bruce", "BRUCE", "THE BOSS", "a heartland rock legend, fair-skinned man with slicked dark hair and rolled denim sleeves, a red bandana in his back pocket, holding a telecaster-shaped guitar", "pale americana gradient with faint pixel flag and highway silhouettes"],
  // ——— music: edm / dj ———
  ["tiesto", "TIESTO", "THE GODFATHER", "a Dutch EDM godfather, fair-skinned man with short grey-blonde hair, wearing all black with headphones around neck", "pale electric-blue gradient with faint pixel waveform silhouettes"],
  ["diplo", "DIPLO", "THE MAJOR", "a globe-trotting producer, fair-skinned man with a blonde undercut, wearing a pastel windbreaker", "pale tropical gradient with faint pixel lazer-horn silhouettes"],
  ["sonny", "SONNY", "THE DROP", "a bass-music pioneer, fair-skinned man with a black side-shaved long haircut and glasses, wearing a black band tee", "pale acid-green gradient with faint pixel alien-ship silhouettes"],
  ["mello", "MELLO", "THE HELMET", "a masked DJ wearing a white marshmallow-shaped helmet with x-eyes and a smile, wearing a white hoodie", "pale marshmallow gradient with faint pixel candy silhouettes"],
  ["kygo", "KYGO", "THE TROPICAL", "a Norwegian tropical-house producer, fair-skinned man with short brown hair, wearing a white tee and gold chain", "pale sunset-tropical gradient with faint pixel palm and piano silhouettes"],
  ["zedd", "ZEDD", "THE CLARITY", "a German-Russian EDM producer, fair-skinned man with dark swept hair, wearing a sleek black bomber", "pale spectrum gradient with faint pixel geometric-z silhouettes"],
  // ——— music: country ———
  ["wallen", "WALLEN", "THE WHISKEY", "a country-mullet superstar, fair-skinned man with a curly mullet and stubble, wearing a sleeveless flannel", "pale whiskey gradient with faint pixel bottle and barn silhouettes"],
  ["luke", "LUKE", "THE COMBS", "a burly country everyman, fair-skinned man with a trimmed beard, wearing a trucker cap and plain tee", "pale denim gradient with faint pixel truck silhouettes"],
  ["dolly", "DOLLY", "THE JOLENE", "a country queen legend, fair-skinned woman with a towering platinum-blonde bouffant and rhinestone-fringed western jacket", "pale butterfly-yellow gradient with faint pixel butterfly and banjo silhouettes"],
  ["shania", "SHANIA", "THE IMPRESSED", "a country-pop crossover queen, fair-skinned woman with long chestnut waves, wearing a leopard-print hooded cloak", "pale leopard-cream gradient with faint pixel boot silhouettes"],
  ["carrie", "CARRIE", "THE IDOL", "a powerhouse country vocalist, fair-skinned woman with long blonde curls, wearing a sparkling fringe dress", "pale prairie gradient with faint pixel louisville-slugger silhouettes"],
  // ——— sports: nba ———
  ["steph", "STEPH", "THE SPLASH", "a sharpshooting point guard, light-brown-skinned man with a short beard, wearing a blue-and-gold jersey, mouthguard dangling from his grin", "pale golden-bay gradient with faint pixel three-point-arc and splash silhouettes"],
  ["kevin", "KEVIN", "THE SLIM REAPER", "a silky seven-foot scorer, dark-skinned man with a slim frame and beard, wearing an orange-accent jersey", "pale sunset-orange gradient with faint pixel scythe-and-net silhouettes"],
  ["giannis", "GIANNIS", "THE FREAK", "a Greek basketball titan, dark-skinned man with a high fade and huge grin, wearing a green jersey", "pale cream-city gradient with faint pixel deer-antler silhouettes"],
  ["luka", "LUKA", "THE WONDERBOY", "a Slovenian basketball wizard, fair-skinned man with short brown hair and a sly smile, wearing a white-and-blue jersey", "pale alpine gradient with faint pixel step-back silhouettes"],
  ["nikola", "NIKOLA", "THE JOKER", "a Serbian triple-double center, fair-skinned man with tousled brown hair and a deadpan look, wearing a navy-and-gold jersey", "pale mile-high gradient with faint pixel horse silhouettes"],
  ["shaq", "SHAQ", "THE DIESEL", "a giant charismatic center legend, dark-skinned man with a bald head and huge smile, wearing a purple-and-gold jersey", "pale purple gradient with faint pixel shattered-backboard silhouettes"],
  ["michael", "MICHAEL", "THE AIRNESS", "the greatest basketball icon, dark-skinned man with a bald head and gold hoop earring, wearing a red-and-black jersey", "pale chicago-red gradient with faint pixel wings and six-trophy silhouettes"],
  ["magic", "MAGIC", "THE SHOWTIME", "a legendary smiling point guard, dark-skinned man with a short 80s afro and megawatt grin, wearing a purple-and-gold warmup jacket", "pale showtime gradient with faint pixel marquee-lights silhouettes"],
  ["kyrie", "KYRIE", "THE HANDLES", "a wizard-handled guard, brown-skinned man with a short beard and headband, wearing a black-and-white jersey", "pale slate gradient with faint pixel crossover-ankle silhouettes"],
  ["wemby", "WEMBY", "THE ALIEN", "a 7-foot-4 French phenom, light-brown-skinned man with a high flat-top fade, wearing a silver-and-black jersey", "pale silver gradient with faint pixel alien and spur silhouettes"],
  // ——— sports: nfl ———
  ["brady", "BRADY", "THE SEVEN RINGS", "the greatest quarterback ever, fair-skinned man with a chiseled jaw and short brown hair, wearing a navy football jersey", "pale patriot gradient with faint pixel seven-ring silhouettes"],
  ["patrick", "PATRICK", "THE SHOWTIME ARM", "a no-look-pass quarterback, light-brown-skinned man with a curly mohawk fade and headband, wearing a red jersey", "pale arrowhead-red gradient with faint pixel sidearm-throw silhouettes"],
  ["kelce", "KELCE", "THE TIGHT END", "a party-legend tight end, fair-skinned man with a fade and beard, wearing a red jersey with shoulder pads peeking", "pale confetti gradient with faint pixel podcast-mic and ring silhouettes"],
  ["lamar", "LAMAR", "THE ERA 8", "an electric dual-threat quarterback, dark-skinned man with short dreads, wearing a purple jersey", "pale raven-purple gradient with faint pixel juke-move silhouettes"],
  ["odell", "ODELL", "THE CATCH", "a one-handed-catch superstar, brown-skinned man with a blonde-dyed mohawk fade, wearing a white jersey", "pale sky gradient with faint pixel one-hand-catch silhouettes"],
  // ——— sports: football/soccer ———
  ["neymar", "NEYMAR", "THE JOGA", "a Brazilian trickster forward, tan-skinned man with a blonde-streaked mohawk and diamond studs, wearing a yellow-and-green jersey", "pale samba gradient with faint pixel rainbow-flick silhouettes"],
  ["kylian", "KYLIAN", "THE TURTLE", "a French speedster striker, brown-skinned man with a short fade, arms-crossed confident look, wearing a navy jersey", "pale bleu gradient with faint pixel ninja-turtle-mask silhouettes"],
  ["erling", "ERLING", "THE CYBORG", "a Norwegian goal machine, fair-skinned man with long blonde hair tied back, wearing a sky-blue jersey", "pale viking-ice gradient with faint pixel robot-goal silhouettes"],
  ["jude", "JUDE", "THE BELLINGHAM", "an English midfield prodigy, brown-skinned man with a short fade and confident grin, wearing a white jersey", "pale madrid-white gradient with faint pixel arms-out celebration silhouettes"],
  ["vini", "VINI", "THE DANCE", "a Brazilian winger showman, brown-skinned man with short curls, joyful smile, wearing a white jersey", "pale samba-white gradient with faint pixel dance-step silhouettes"],
  ["lamine", "LAMINE", "THE 304", "a teenage Spanish wonder-winger, brown-skinned man with a short fade, wearing a blaugrana striped jersey", "pale blaugrana gradient with faint pixel left-foot-curl silhouettes"],
  ["zlatan", "ZLATAN", "THE LION", "a Swedish striker with godlike confidence, fair-skinned man with a topknot bun and sharp nose, wearing a black jersey", "pale nordic gradient with faint pixel lion and taekwondo-kick silhouettes"],
  ["becks", "BECKS", "THE FREE KICK", "an English fashion-icon midfielder, fair-skinned man with a blonde undercut and tattoo sleeves, wearing a tailored suit over a jersey collar", "pale wembley gradient with faint pixel bending-free-kick silhouettes"],
  ["ronaldinho", "RONALDINHO", "THE SMILE", "a Brazilian magician with an endless grin, brown-skinned man with long curly hair in a headband, wearing a yellow jersey", "pale carnival-yellow gradient with faint pixel elastico silhouettes"],
  ["mo", "MO", "THE PHARAOH", "an Egyptian king of the kop, tan-skinned man with a big black curly hair and full beard, wearing a red jersey", "pale anfield-red gradient with faint pixel pyramid silhouettes"],
  ["son", "SON", "THE SONNY", "a South Korean captain forward, fair-skinned man with dark hair and a bright smile, wearing a white jersey", "pale spurs gradient with faint pixel camera-frame celebration silhouettes"],
  ["kane", "KANE", "THE HURRICANE", "an English goal-scoring captain, fair-skinned man with short brown hair, wearing a red-and-white jersey", "pale bavarian gradient with faint pixel golden-boot silhouettes"],
  ["robert", "ROBERT", "THE NINE", "a Polish clinical striker, fair-skinned man with sharp features and short brown hair, wearing a blaugrana jersey", "pale striker gradient with faint pixel goal-net silhouettes"],
  ["modric", "MODRIC", "THE METRONOME", "a Croatian midfield maestro, fair-skinned man with long sandy hair tucked behind ears, wearing a checkered-accent jersey", "pale checkered gradient with faint pixel golden-ball silhouettes"],
  // ——— sports: tennis ———
  ["roger", "ROGER", "THE MAESTRO OF SW19", "a Swiss tennis artist, fair-skinned man with swept dark hair and a cream cardigan over tennis whites, holding a wooden racket", "pale wimbledon gradient with faint pixel strawberry silhouettes"],
  ["rafa", "RAFA", "THE BULL", "a Spanish clay-court warrior, tan-skinned man with a bandana and sleeveless shirt, biting a small gold trophy", "pale terracotta gradient with faint pixel bull and clay-court silhouettes"],
  ["novak", "NOVAK", "THE DJOKER", "a Serbian iron-willed champion, fair-skinned man with short dark hair, arms stretched wide, wearing a blue tennis polo", "pale mountain gradient with faint pixel calendar-slam silhouettes"],
  ["naomi", "NAOMI", "THE HAMAICHI", "a Japanese-Haitian tennis star, brown-skinned woman with a curly high bun and visor, wearing a sleek tennis dress", "pale sakura gradient with faint pixel wave silhouettes"],
  ["coco", "COCO", "THE NEW GUARD", "an American teen tennis champion, dark-skinned woman with long braids in a ponytail, wearing a white tennis dress", "pale flushing-blue gradient with faint pixel trophy silhouettes"],
  ["carlos", "CARLOS", "THE CHARISMA", "a Spanish tennis prodigy, tan-skinned man with short curly hair and a huge smile, wearing a coral tennis shirt", "pale coral gradient with faint pixel drop-shot silhouettes"],
  ["venus", "VENUS", "THE PIONEER", "a legendary tennis trailblazer, dark-skinned woman with beaded braids, wearing an elegant white tennis dress", "pale lavender gradient with faint pixel torch silhouettes"],
  // ——— sports: f1 ———
  ["lewisf1", "LEWIS", "THE 44", "a seven-time British racing champion, brown-skinned man with short braids and diamond studs, wearing a teal racing suit with harness straps", "pale teal gradient with faint pixel checkered-flag silhouettes"],
  ["max", "MAX", "THE LIMIT", "a Dutch racing machine, fair-skinned man with short brown hair and intense eyes, wearing a navy-and-orange racing suit", "pale orange-army gradient with faint pixel lion-crest silhouettes"],
  ["charles", "CHARLES", "THE PREDESTINATO", "a Monegasque scarlet-team driver, fair-skinned man with soft brown hair and green eyes, wearing a scarlet racing suit", "pale scarlet gradient with faint pixel prancing-horse silhouettes"],
  ["lando", "LANDO", "THE PAPAYA", "a British racing jokester, fair-skinned man with curly brown hair and a cheeky grin, wearing a papaya-orange racing suit", "pale papaya gradient with faint pixel quadrant silhouettes"],
  ["fernando", "FERNANDO", "THE SAMURAI", "a Spanish racing veteran, tan-skinned man with dark hair and a knowing smirk, wearing a green racing suit", "pale racing-green gradient with faint pixel samurai-helmet silhouettes"],
  // ——— sports: combat ———
  ["mike", "MIKE", "THE BADDEST", "the baddest man on the planet, dark-skinned man with a face tattoo around one eye and gold teeth smile, wearing black boxing gloves over bare shoulders", "pale iron gradient with faint pixel pigeon silhouettes"],
  ["canelo", "CANELO", "THE CINNAMON", "a Mexican boxing king, fair-skinned man with short red hair and freckles, wearing green-and-gold boxing gloves", "pale mexican-gold gradient with faint pixel eagle silhouettes"],
  ["fury", "FURY", "THE GYPSY KING", "a giant British heavyweight, fair-skinned man with a shaved head and beard, wearing a robe with a crown motif", "pale union gradient with faint pixel crown-and-belt silhouettes"],
  ["khabib", "KHABIB", "THE EAGLE", "an undefeated Dagestani grappler, tan-skinned man with a beard, wearing a papakha wool hat", "pale mountain gradient with faint pixel eagle silhouettes"],
  ["ronda", "RONDA", "THE ARMBAR", "a trailblazing MMA champion, fair-skinned woman with blonde hair pulled tight, wearing a black-and-gold fight kit", "pale judo-gold gradient with faint pixel armbar silhouettes"],
  ["jon", "JON", "THE BONES", "a dominant light-heavyweight legend, dark-skinned man with a short fade, wearing a championship belt over one shoulder", "pale octagon gradient with faint pixel bones silhouettes"],
  ["cena", "CENA", "THE INVISIBLE", "a wrestling superstar and film star, muscular fair-skinned man with a military-style buzz cut, wearing a salute-pose denim shorts look and armband", "pale hustle-blue gradient with faint pixel you-cant-see-me hand silhouettes"],
  // ——— sports: other ———
  ["rory", "RORY", "THE GRAND SLAM", "a Northern Irish golf champion, fair-skinned man with curly brown hair, wearing a green polo and white glove", "pale masters-green gradient with faint pixel azalea silhouettes"],
  ["tony", "TONY", "THE 900", "a skateboarding legend, fair-skinned man with a weathered grin and helmet under his arm, wearing a skate tee", "pale halfpipe gradient with faint pixel skateboard silhouettes"],
  ["simone", "SIMONE", "THE GOAT VAULT", "the greatest gymnast ever, dark-skinned woman with a slicked bun and sparkling leotard with a tiny goat motif", "pale chalk gradient with faint pixel balance-beam silhouettes"],
  ["phelps", "PHELPS", "THE FISH", "the most decorated Olympian, fair-skinned man in a swim cap and goggles pushed up, medals stacked on his chest", "pale pool-blue gradient with faint pixel lane-line silhouettes"],
  ["shaun", "SHAUN", "THE TOMATO", "a snowboarding legend, fair-skinned man with long red hair under a beanie, wearing a snow jacket with goggles", "pale powder gradient with faint pixel halfpipe silhouettes"],
  // ——— sports: cricket ———
  ["virat", "VIRAT", "THE CHASE MASTER", "an Indian batting king, tan-skinned man with a sharp beard and intense eyes, wearing a blue cricket jersey", "pale india-blue gradient with faint pixel cricket-bat and cover-drive silhouettes"],
  ["dhoni", "DHONI", "THE FINISHER", "a legendary Indian captain-keeper, tan-skinned man with short salt-and-pepper hair, calm smile, wearing a blue jersey with keeper gloves", "pale helicopter gradient with faint pixel stumps and helicopter-shot silhouettes"],
  ["sachin", "SACHIN", "THE MASTER BLASTER", "the god of cricket, tan-skinned man with curly hair, wearing a blue jersey and holding a classic bat", "pale wankhede gradient with faint pixel straight-drive silhouettes"],
  // ——— bollywood / india ———
  ["srk", "SRK", "THE BAADSHAH", "the king of Bollywood, tan-skinned man with tousled dark hair and dimpled smile, arms-open romantic pose, wearing a black tuxedo", "pale mannat gradient with faint pixel open-arms and film-reel silhouettes"],
  ["salman", "SALMAN", "THE BHAI", "a Bollywood action superstar, tan-skinned man with a muscular build, wearing a turquoise bracelet and unbuttoned shirt", "pale being-human gradient with faint pixel bracelet silhouettes"],
  ["aamir", "AAMIR", "THE PERFECTIONIST", "a Bollywood method master, tan-skinned man with a salt-and-pepper crew cut, thoughtful expression, wearing a simple kurta", "pale earthy gradient with faint pixel film-clapper silhouettes"],
  ["amitabh", "AMITABH", "THE SHAHENSHAH", "the towering legend of Indian cinema, tan-skinned elder man with a white goatee and rectangular glasses, wearing a bandhgala suit", "pale sepia gradient with faint pixel angry-young-man silhouettes"],
  ["deepika", "DEEPIKA", "THE MASTANI", "a Bollywood queen, tan-skinned woman with long black waves and a small nose ring, wearing an elegant emerald lehenga blouse and jhumka earrings", "pale emerald gradient with faint pixel paisley silhouettes"],
  ["priyanka", "PRIYANKA", "THE GLOBAL", "a global Indian superstar, tan-skinned woman with caramel-highlighted waves, wearing a power blazer and statement earrings", "pale rose-gold gradient with faint pixel globe silhouettes"],
  ["alia", "ALIA", "THE GULLY GIRL", "a gen-z Bollywood darling, fair-skinned woman with soft brown hair and bright doe eyes, wearing a pastel saree blouse", "pale peony gradient with faint pixel star silhouettes"],
  ["ranveer", "RANVEER", "THE ENERGY", "Bollywood's maximalist showman, tan-skinned man with a handlebar mustache and man-bun, wearing an outrageous printed jacket and round sunglasses", "pale kaleidoscope gradient with faint pixel firecracker silhouettes"],
  ["hrithik", "HRITHIK", "THE GREEK GOD", "Bollywood's dance god, tan-skinned man with light hazel eyes and swept brown hair, wearing a fitted white shirt", "pale bronze gradient with faint pixel dance-step silhouettes"],
  ["akshay", "AKSHAY", "THE KHILADI", "a Bollywood action-comedy machine, tan-skinned man with a sharp jaw and short hair, wearing a bomber jacket", "pale khaki gradient with faint pixel stunt-motorbike silhouettes"],
  ["katrina", "KATRINA", "THE SHEILA", "a Bollywood glamour icon, fair-skinned woman with soft brown waves, wearing a shimmering gold dance costume", "pale gold gradient with faint pixel bollywood-stage silhouettes"],
  ["diljit", "DILJIT", "THE PANJAB", "a Punjabi global music star, tan-skinned man with a neat black turban and beard, wearing a designer tracksuit with a gold chain", "pale mustard-field gradient with faint pixel tractor and mic silhouettes"],
  ["ap", "AP", "THE BROWN MUNDE", "a Punjabi-Canadian melodic rapper, tan-skinned man with a trimmed beard and diamond ear studs, wearing a black bomber", "pale toronto-fog gradient with faint pixel maple-leaf silhouettes"],
  // ——— film: leading men ———
  ["brad", "BRAD", "THE GOLDEN BOY", "an eternal Hollywood golden boy, fair-skinned man with swept blonde hair and a chiseled jaw, wearing a linen shirt and sunglasses hooked at the collar", "pale malibu gradient with faint pixel fight-soap silhouettes"],
  ["cruise", "CRUISE", "THE MAVERICK", "an ageless action megastar, fair-skinned man with dark swept hair and a huge grin, wearing an aviator jacket and sunglasses", "pale jet-stream gradient with faint pixel fighter-jet silhouettes"],
  ["hanks", "HANKS", "THE NICEST", "America's nicest leading man, fair-skinned man with grey curls and kind eyes, wearing a cardigan", "pale typewriter gradient with faint pixel park-bench and volleyball silhouettes"],
  ["holland", "HOLLAND", "THE WEB", "a boyish London action star, fair-skinned young man with brown curls, wearing a red hoodie", "pale web-red gradient with faint pixel web-line silhouettes"],
  ["denzel", "DENZEL", "THE EQUALIZER", "a commanding two-time-Oscar legend, dark-skinned man with a grey-flecked fade, wearing a tailored charcoal suit", "pale charcoal gradient with faint pixel scales-of-justice silhouettes"],
  ["will", "WILL", "THE FRESH PRINCE", "a megawatt Hollywood superstar, dark-skinned man with a fade and big grin, wearing a 90s-print flipped-cap streetwear look", "pale bel-air gradient with faint pixel throne silhouettes"],
  ["keanu", "KEANU", "THE ONE WHO KNOWS", "the internet's favorite action star, fair-skinned man with shoulder-length black hair and beard, wearing a black suit with a loose tie", "pale matrix-green gradient with faint pixel falling-code silhouettes"],
  ["gosling", "GOSLING", "THE LITERALLY ME", "a stoic heartthrob actor, fair-skinned man with slicked blonde hair, wearing a white scorpion-embroidered bomber jacket", "pale neon-drive gradient with faint pixel scorpion silhouettes"],
  ["reynolds", "REYNOLDS", "THE FOURTH WALL", "a wisecracking Canadian star, fair-skinned man with neat brown hair and a smirk, wearing a red-and-black motif jacket", "pale maple gradient with faint pixel katana silhouettes"],
  ["hugh", "HUGH", "THE CLAWS", "a song-and-dance action legend, fair-skinned man with muttonchop sideburns and swept hair, wearing a white tank with dog tags", "pale outback gradient with faint pixel claw-mark silhouettes"],
  ["rdj", "RDJ", "THE GENIUS", "a charismatic comeback king, fair-skinned man with a signature goatee and tinted glasses, wearing a sharp blazer over a band tee", "pale arc-glow gradient with faint pixel arc-reactor silhouettes"],
  ["hemsworth", "HEMSWORTH", "THE HAMMER", "an Australian demigod action star, fair-skinned man with shoulder-length blonde hair and a huge frame, wearing a leather-strap fantasy vest", "pale storm gradient with faint pixel hammer and lightning silhouettes"],
  ["evans", "EVANS", "THE SHIELD", "America's square-jawed sweetheart, fair-skinned man with neat brown hair and beard, wearing a navy henley", "pale liberty-blue gradient with faint pixel round-shield silhouettes"],
  ["pratt", "PRATT", "THE LORD", "a lovable action-comedy star, fair-skinned man with short brown hair and a grin, wearing a maroon space jacket", "pale galaxy gradient with faint pixel cassette-walkman silhouettes"],
  ["matt", "MATT", "THE GOOD WILL", "a Boston everyman superstar, fair-skinned man with short sandy hair, wearing a bourne-grey jacket", "pale boston gradient with faint pixel chalkboard-equation silhouettes"],
  ["ben", "BEN", "THE GONE GIRL", "a brooding Boston director-star, fair-skinned man with dark hair and stubble, holding an iced coffee, back tattoo hinted", "pale dunkin-orange gradient with faint pixel bat-shape silhouettes"],
  ["george", "GEORGE", "THE SILVER FOX", "Hollywood's silver fox, fair-skinned man with salt-and-pepper hair and a tuxedo, martini-dry smile", "pale lake-como gradient with faint pixel espresso-cup silhouettes"],
  ["johnny", "JOHNNY", "THE PIRATE", "an eccentric character-actor legend, fair-skinned man with shoulder-length dark hair, a mustache-goatee, rings on every finger, wearing a bohemian scarf and fedora", "pale rum gradient with faint pixel compass silhouettes"],
  ["freeman", "FREEMAN", "THE NARRATOR", "the voice of god himself, dark-skinned elder man with white curls, freckles and gold hoop earrings, wearing a wise cardigan", "pale shawshank gradient with faint pixel penguin-march silhouettes"],
  ["samuel", "SAMUEL", "THE COOLEST", "the coolest man in cinema, dark-skinned man with a kangol cap and goatee, wearing a leather jacket with an eyepatch pushed up", "pale royale gradient with faint pixel wallet and lightsaber-purple silhouettes"],
  ["momoa", "MOMOA", "THE AQUA", "a Hawaiian warrior superstar, tan-skinned man with long dark waves and a beard, tribal tattoo sleeve, wearing a leather vest", "pale ocean gradient with faint pixel trident silhouettes"],
  ["statham", "STATHAM", "THE TRANSPORTER", "a gravel-voiced British action star, fair-skinned man with a shaved head and stubble, wearing a fitted black suit with rolled cuffs", "pale gunmetal gradient with faint pixel getaway-car silhouettes"],
  ["vin", "VIN", "THE FAMILY", "a gravelly street-racing patriarch, tan-skinned man with a bald head, wearing a white tank top and a cross necklace", "pale asphalt gradient with faint pixel muscle-car silhouettes"],
  ["hart", "HART", "THE LITTLE BIG MAN", "a pocket-sized comedy megastar, dark-skinned man with a short fade and huge laugh, wearing a fitted bomber", "pale comedy-gold gradient with faint pixel mic-stand silhouettes"],
  ["adam", "ADAM", "THE SANDMAN", "a beloved comedy everyman, fair-skinned man with messy grey-flecked hair, wearing an oversized hoodie and basketball shorts vibe", "pale waterboy gradient with faint pixel golf-club silhouettes"],
  ["jim", "JIM", "THE RUBBERFACE", "a rubber-faced comedy legend, fair-skinned man with swept brown hair and a huge elastic grin", "pale mask-green gradient with faint pixel pet-detective silhouettes"],
  ["eddie", "EDDIE", "THE RAW", "a comedy royalty legend, dark-skinned man with a classic 80s jheri curl and mustache, wearing a red leather suit", "pale red-leather gradient with faint pixel laugh silhouettes"],
  ["jackie", "JACKIE", "THE STUNTMAN", "a martial-arts comedy legend, fair-skinned East Asian man with shaggy black hair and a warm grin, wearing a mandarin-collar jacket, bandaged knuckles", "pale jade gradient with faint pixel ladder-and-fist silhouettes"],
  ["pedro", "PEDRO", "THE DADDY", "the internet's favorite dad actor, tan-skinned man with a salt-and-pepper mustache and warm eyes, wearing a brown adventurer jacket", "pale wasteland gradient with faint pixel mushroom and helmet silhouettes"],
  ["cillian", "CILLIAN", "THE BLINDER", "a piercing-eyed Irish star, fair-skinned man with razor cheekbones and icy blue eyes, wearing a 1920s newsboy cap and overcoat", "pale birmingham gradient with faint pixel razor-cap silhouettes"],
  ["austin", "AUSTIN", "THE ELVIS", "a retro-cool leading man, fair-skinned man with a dark pompadour and smolder, wearing a pink 50s jacket", "pale memphis gradient with faint pixel jukebox silhouettes"],
  // ——— film: leading women ———
  ["margot", "MARGOT", "THE BARBIE", "a luminous Australian superstar, fair-skinned woman with platinum waves and red lips, wearing a pink gingham dress", "pale barbie-pink gradient with faint pixel dreamhouse silhouettes"],
  ["scarlett", "SCARLETT", "THE WIDOW", "a smoky-voiced screen siren, fair-skinned woman with a blonde bob and red lips, wearing a black tactical-chic jacket", "pale noir gradient with faint pixel hourglass silhouettes"],
  ["angelina", "ANGELINA", "THE FEMME", "a legendary screen femme fatale, fair-skinned woman with sharp cheekbones and full lips, wearing a black gown with a thigh-high slit hinted", "pale onyx gradient with faint pixel dagger and wings silhouettes"],
  ["jlaw", "JLAW", "THE GIRL ON FIRE", "a down-to-earth Oscar winner, fair-skinned woman with a blonde lob, wearing a red carpet gown", "pale ember gradient with faint pixel bow-and-arrow silhouettes"],
  ["aniston", "ANISTON", "THE RACHEL", "America's forever sweetheart, fair-skinned woman with the iconic layered honey-blonde haircut, wearing a 90s slip dress", "pale central-perk gradient with faint pixel coffee-cup silhouettes"],
  ["emma", "EMMA", "THE LALA", "a doe-eyed Oscar darling, fair-skinned woman with a red bob and freckles, wearing a yellow dance dress", "pale la-la-yellow gradient with faint pixel observatory silhouettes"],
  ["watson", "WATSON", "THE BRIGHTEST", "a British book-smart icon, fair-skinned woman with a chic pixie-to-lob brown cut, wearing a sustainable-chic blazer", "pale library gradient with faint pixel wand and book silhouettes"],
  ["anne", "ANNE", "THE PRINCESS DIARY", "a radiant theatre-kid queen, fair-skinned woman with dark hair and huge doe eyes, wearing an elegant white gown", "pale genovia gradient with faint pixel tiara silhouettes"],
  ["natalie", "NATALIE", "THE SWAN", "a balletic Oscar winner, fair-skinned woman with a dark ballerina bun, wearing a feathered black-and-white costume", "pale swan gradient with faint pixel feather silhouettes"],
  ["gal", "GAL", "THE WONDER", "an Israeli warrior-princess star, tan-skinned woman with long dark waves, wearing a gold-and-red armored corset", "pale amazon gradient with faint pixel lasso silhouettes"],
  ["charlize", "CHARLIZE", "THE FURIOSA", "a steely South African superstar, fair-skinned woman with a platinum crop, wearing a desert-worn jacket with a grease smudge", "pale fury-road gradient with faint pixel war-rig silhouettes"],
  ["julia", "JULIA", "THE PRETTY WOMAN", "America's megawatt smile, fair-skinned woman with big auburn curls and the widest grin, wearing a red opera gown with white gloves", "pale rodeo-drive gradient with faint pixel shopping-bag silhouettes"],
  ["meryl", "MERYL", "THE STREEP", "the greatest living actress, fair-skinned elder woman with an elegant silver updo and glasses on a chain, wearing a cerulean power coat", "pale cerulean gradient with faint pixel award-statuette silhouettes"],
  ["sandra", "SANDRA", "THE SPEED", "America's practical sweetheart, fair-skinned woman with dark brown hair and bangs, wearing a bomber jacket", "pale gravity gradient with faint pixel bus and star silhouettes"],
  ["nicole", "NICOLE", "THE PORCELAIN", "an ethereal Australian Oscar winner, fair-skinned woman with strawberry-blonde curls, wearing a couture emerald gown", "pale moulin gradient with faint pixel windmill silhouettes"],
  ["anya", "ANYA", "THE QUEENS GAMBIT", "a wide-eyed chess-prodigy actress, fair-skinned woman with a 60s red bob and doll eyes, wearing a mod checkered dress", "pale chessboard gradient with faint pixel chess-queen silhouettes"],
  ["florence", "FLORENCE", "THE MIDSOMMAR", "a British powerhouse ingenue, fair-skinned woman with a blonde bob and strong brows, wearing a flower-crown-adorned white dress", "pale flower-field gradient with faint pixel may-queen silhouettes"],
  ["sydney", "SYDNEY", "THE EUPHORIC", "a bombshell gen-z actress, fair-skinned woman with long blonde waves, wearing a glitter-tear-makeup look and a slip dress", "pale euphoria-purple gradient with faint pixel glitter-tear silhouettes"],
  ["jenna", "JENNA", "THE WEDNESDAY", "a deadpan gothic it-girl, light-tan-skinned woman with black braided pigtails and bangs, wearing a black collared dress", "pale nevermore gradient with faint pixel cello and hand silhouettes"],
  ["millie", "MILLIE", "THE ELEVEN", "a telekinetic child-star-turned-mogul, fair-skinned young woman with a slicked bun, wearing a pink 80s dress with a denim jacket", "pale upside-down gradient with faint pixel waffle silhouettes"],
  ["salma", "SALMA", "THE FRIDA", "a Mexican screen legend, tan-skinned woman with dark center-parted hair and bold brows, wearing an embroidered floral blouse", "pale frida-teal gradient with faint pixel marigold silhouettes"],
  ["penelope", "PENELOPE", "THE MADRE", "a Spanish cinema queen, tan-skinned woman with long chocolate waves, wearing a red flamenco-inspired dress", "pale almodovar-red gradient with faint pixel rose silhouettes"],
  ["fox", "FOX", "THE TRANSFORMER", "a 2000s bombshell icon, fair-skinned woman with long black hair and blue eyes, wearing a leather jacket over a band tee", "pale y2k gradient with faint pixel car-hood silhouettes"],
  ["chappelle", "CHAPPELLE", "THE TRUTH", "a legendary stand-up philosopher, dark-skinned man with a grey-flecked goatee, wearing a tan jumpsuit with a cigarette-free mic hand", "pale block-party gradient with faint pixel microphone silhouettes"],
  // ——— models ———
  ["gigi", "GIGI", "THE HADID", "a golden supermodel, fair-skinned woman with honey-blonde hair in a sleek high pony, wearing a structured blazer with nothing flashy", "pale vogue gradient with faint pixel runway-light silhouettes"],
  ["bella", "BELLA", "THE MUSE", "an angular brunette supermodel, fair-skinned woman with a sleek dark bun and razor cheekbones, wearing a 90s minimalist slip", "pale editorial-grey gradient with faint pixel orchid silhouettes"],
  ["cara", "CARA", "THE BROWS", "a British supermodel wildcard, fair-skinned woman with thick dark brows and tousled blonde hair, wearing a leather jacket and beanie", "pale london-fog gradient with faint pixel lion-tattoo silhouettes"],
  ["campbell", "CAMPBELL", "THE WALK", "the runway legend of legends, dark-skinned woman with long straight center-parted hair, wearing couture shoulders and diamond drops", "pale catwalk gradient with faint pixel stiletto silhouettes"],
  ["heidi", "HEIDI", "THE HALLOWEEN", "a German supermodel-host, fair-skinned woman with long blonde layers, wearing a sleek black gown and statement necklace", "pale runway-pink gradient with faint pixel pumpkin silhouettes"],
  ["tyra", "TYRA", "THE SMIZE", "a supermodel mogul, brown-skinned woman with voluminous honey waves, giving the definitive smize, wearing a fierce magenta gown", "pale magenta gradient with faint pixel camera-flash silhouettes"],
  ["emrata", "EMRATA", "THE BODY", "a model-author it-girl, fair-skinned woman with long dark center-parted hair and full lips, wearing a minimalist black crop set", "pale downtown gradient with faint pixel book silhouettes"],
  ["hailey", "HAILEY", "THE RHODE", "a glazed-skin beauty mogul, fair-skinned woman with a slicked-back bun and glossy lips, wearing an oversized blazer", "pale glazed-donut gradient with faint pixel lip-balm silhouettes"],
  ["kate", "KATE", "THE MOSS", "the original waif supermodel, fair-skinned woman with undone blonde hair and smudged liner, wearing a vintage slip dress", "pale 90s-film gradient with faint pixel polaroid silhouettes"],
  ["cindy", "CINDY", "THE SUPER", "the definitive 90s supermodel, fair-skinned woman with big brunette blowout hair and the famous beauty mark, wearing an off-shoulder bodysuit", "pale pepsi-diner gradient with faint pixel soda-can silhouettes"],
  ["gisele", "GISELE", "THE BOSSA", "a Brazilian super of supers, tan-skinned woman with sun-kissed beach waves, wearing a bronze slip dress", "pale ipanema gradient with faint pixel wave silhouettes"],
  // ——— tv / internet ———
  ["ellen", "ELLEN", "THE DANCE HOST", "a talk-show comedy host, fair-skinned woman with a platinum pixie cut, wearing a crisp white blazer and sneakers energy", "pale daytime-blue gradient with faint pixel dancing-shoe silhouettes"],
  ["fallon", "FALLON", "THE GIGGLE", "a giggly late-night host, fair-skinned man with brown hair and a boyish grin, wearing a tailored suit at a desk pose", "pale late-night-blue gradient with faint pixel cue-card silhouettes"],
  ["kimmel", "KIMMEL", "THE ROAST", "a deadpan late-night host, fair-skinned man with dark hair and a knowing smirk, wearing a suit with a loosened tie", "pale hollywood-night gradient with faint pixel theater-marquee silhouettes"],
  ["trevor", "TREVOR", "THE DAILY", "a South African comedy host, light-brown-skinned man with a short fade and dimpled grin, wearing a slim suit", "pale johannesburg gradient with faint pixel globe silhouettes"],
  ["joe", "JOE", "THE PODFATHER", "the biggest podcaster alive, muscular fair-skinned man with a shaved head, wearing a black tee and headphones", "pale studio-red gradient with faint pixel mic-and-elk silhouettes"],
  ["gordon", "GORDON", "THE IDIOT SANDWICH", "a fiery celebrity chef, fair-skinned man with spiky blonde hair and forehead creases mid-shout, wearing chef whites", "pale kitchen-steel gradient with faint pixel pan-and-flame silhouettes"],
  ["martha", "MARTHA", "THE HOMEMAKER", "a domestic-empire legend, fair-skinned elder woman with a sleek blonde bob, wearing a chic gardening jacket, holding a pixel pie", "pale kitchen-cream gradient with faint pixel whisk silhouettes"],
  ["khloe", "KHLOE", "THE GOOD AMERICAN", "a reality-TV glam sister, fair-skinned woman with a sleek platinum ponytail and glam contour, wearing a nude bodysuit", "pale nude-pink gradient with faint pixel denim silhouettes"],
  ["kourtney", "KOURTNEY", "THE POOSH", "a gothic-wellness reality star, light-tan-skinned woman with a black choppy bob, wearing a band tee under a leather blazer", "pale blush-goth gradient with faint pixel lemon-water silhouettes"],
  ["speed", "SPEED", "THE SEWEY", "an explosive streaming phenomenon, brown-skinned young man with short twists, mid-scream excited face, wearing a soccer jersey", "pale hyper-yellow gradient with faint pixel controller and lightning silhouettes"],
  ["kai", "KAI", "THE MAFIA BOSS", "a marathon-streaming superstar, brown-skinned young man with short dreads and a chain, laughing hard, wearing a designer hoodie", "pale streamer-purple gradient with faint pixel chat-bubble silhouettes"],
  ["logan", "LOGAN", "THE MAVERICK BIRD", "a boxer-podcaster influencer, fair-skinned man with a swept blonde quiff, wearing a pastel merch hoodie", "pale prime-blue gradient with faint pixel energy-bottle silhouettes"],
  ["jake", "JAKE", "THE PROBLEM CHILD", "a YouTuber-turned-boxer, fair-skinned man with a buzz cut and diamond studs, wearing boxing hand wraps and a robe", "pale problem-gold gradient with faint pixel glove silhouettes"],
  ["ksi", "KSI", "THE NIGHTMARE", "a British YouTube-boxing mogul, dark-skinned man with a short fade and headband, wearing a red-and-black robe", "pale sidemen-red gradient with faint pixel crossed-gloves silhouettes"],
  ["felix", "FELIX", "THE BRO FIST", "the original YouTube king, fair-skinned man with swept blonde hair and a beard, wearing a black tee and headphones", "pale 9-year-old-army gradient with faint pixel bro-fist silhouettes"],
  ["charli", "CHARLI", "THE RENEGADE", "the queen of short-form dance, fair-skinned young woman with a dark messy bun, wearing a cropped hoodie and layered necklaces", "pale hype-pink gradient with faint pixel dance-arrow silhouettes"],
  ["addison", "ADDISON", "THE OBSESSED", "a short-form star turned pop actress, fair-skinned woman with honey-blonde waves, wearing a y2k baby tee and low-rise vibe", "pale y2k-lavender gradient with faint pixel flip-phone silhouettes"],
  // ——— tech / business ———
  ["jeff", "JEFF", "THE EVERYTHING STORE", "a shredded e-commerce emperor, fair-skinned man with a shiny bald head and muscular arms in a fitted polo and puffy vest, tiny rocket pin", "pale delivery-blue gradient with faint pixel smile-arrow and rocket silhouettes"],
  ["mark", "MARK", "THE METAVERSE", "a jiu-jitsu-era social-network founder, fair-skinned man with short curly hair and a gold chain over a boxy tee", "pale meta-blue gradient with faint pixel vr-headset silhouettes"],
  ["bill", "BILL", "THE WINDOWS", "a philanthropist software pioneer, fair-skinned elder man with glasses and a side-part, wearing a v-neck sweater over a collared shirt", "pale windows-blue gradient with faint pixel four-pane-window silhouettes"],
  ["warren", "WARREN", "THE ORACLE OF OMAHA", "a folksy investing legend, fair-skinned elder man with white hair and thick glasses, warm grin, holding a cherry cola can", "pale ledger-cream gradient with faint pixel newspaper and cola silhouettes"],
  ["tim", "TIM", "THE APPLE", "a calm tech CEO, fair-skinned man with silver hair and rimless glasses, wearing a navy zip-up over a collared shirt", "pale titanium gradient with faint pixel single-fruit silhouettes"],
  ["altman", "ALTMAN", "THE AGI", "a boyish AI-lab CEO, fair-skinned man with short brown hair and intense green eyes, wearing a grey henley", "pale gradient-descent gradient with faint pixel neural-node silhouettes"],
  ["jensen", "JENSEN", "THE LEATHER JACKET", "a chip-empire CEO, East Asian man with grey swept hair and glasses, wearing his signature black leather jacket", "pale gpu-green gradient with faint pixel graphics-chip silhouettes"],
  ["vitalik", "VITALIK", "THE ETHEREAL", "a lanky crypto philosopher, fair-skinned man with a sharp jaw and cropped hair, wearing a unicorn-print tee", "pale ether-purple gradient with faint pixel octahedron silhouettes"],
];

async function gen(e: E) {
  const [slug, , , desc, bg] = e;
  const file = `grifter-${slug}.png`;
  const dest = path.join(NFT_DIR, file);
  if (fs.existsSync(dest)) {
    console.log(`skip: ${file}`);
    return;
  }
  const prompt = `${STYLE}. ${desc.charAt(0).toUpperCase() + desc.slice(1)}. Background: ${bg}, with tiny four-point sparkle stars.`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-image-1", prompt, size: "1024x1024", quality: "high", n: 1 }),
      });
      if (!res.ok) {
        const t = (await res.text()).slice(0, 140);
        console.log(`fail ${file} (a${attempt}): ${res.status} ${t}`);
        if (res.status === 429) await new Promise((r) => setTimeout(r, 30000));
        else if (res.status === 400) return console.log(`MODERATION SKIP: ${file}`);
        continue;
      }
      const j = (await res.json()) as { data: { b64_json: string }[] };
      fs.writeFileSync(dest, Buffer.from(j.data[0].b64_json, "base64"));
      await sharp(dest).webp({ quality: 92 }).toFile(dest.replace(/\.png$/, ".webp"));
      console.log(`done: ${file}`);
      return;
    } catch (err) {
      console.log(`err ${file} (a${attempt}): ${err instanceof Error ? err.message : err}`);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  console.log(`GAVE UP: ${file}`);
}

// Existing waves 1–3 roster (file/name/label) — merged into roster.json.
const EXISTING: [string, string, string][] = [
  ["grifter-icon.png", "PARIS", "THE ICON"], ["grifter-champion.png", "FLOYD", "THE CHAMPION"],
  ["grifter-original.png", "LINDSAY", "THE ORIGINAL"], ["grifter-internet.png", "MIA", "THE INTERNET"],
  ["grifter-legacy.png", "CAITLYN", "THE LEGACY"], ["grifter-hitmaker.png", "DRAKE", "THE HITMAKER"],
  ["grifter-starboy.png", "ABEL", "THE STARBOY"], ["grifter-popprince.png", "JUSTIN", "THE POP PRINCE"],
  ["grifter-mogul.png", "KYLIE", "THE MOGUL"], ["grifter-momager.png", "KRIS", "THE MOMAGER"],
  ["grifter-runway.png", "KENDALL", "THE RUNWAY"], ["grifter-empire.png", "KIM", "THE EMPIRE"],
  ["grifter-visionary.png", "YE", "THE VISIONARY"], ["grifter-plug.png", "NAV", "THE PLUG"],
  ["grifter-heartthrob.png", "ZAYN", "THE HEARTTHROB"], ["grifter-songbird.png", "TAYLOR", "THE SONGBIRD"],
  ["grifter-empress.png", "ROBYN", "THE EMPRESS"], ["grifter-queen.png", "BEY", "THE QUEEN"],
  ["grifter-dynasty.png", "SHAWN", "THE DYNASTY"], ["grifter-king.png", "LEBRON", "THE KING"],
  ["grifter-ace.png", "SERENA", "THE ACE"], ["grifter-phenom.png", "CRISTIANO", "THE PHENOM"],
  ["grifter-maestro.png", "LEO", "THE MAESTRO"], ["grifter-smooth.png", "CALVIN", "THE SMOOTH"],
  ["grifter-lyricist.png", "MARSHALL", "THE LYRICIST"], ["grifter-voice.png", "ADELE", "THE VOICE"],
  ["grifter-whisper.png", "BILLIE", "THE WHISPER"], ["grifter-disco.png", "DUA", "THE DISCO"],
  ["grifter-ponytail.png", "ARIANA", "THE PONYTAIL"], ["grifter-sweetheart.png", "SELENA", "THE SWEETHEART"],
  ["grifter-rebel.png", "MILEY", "THE REBEL"], ["grifter-shapeshifter.png", "DOJA", "THE SHAPESHIFTER"],
  ["grifter-rager.png", "TRAVIS", "THE RAGER"], ["grifter-firecracker.png", "CARDI", "THE FIRECRACKER"],
  ["grifter-barb.png", "NICKI", "THE BARB"], ["grifter-popprincess.png", "BRITNEY", "THE POP PRINCESS"],
  ["grifter-material.png", "MADONNA", "THE MATERIAL GIRL"], ["grifter-oracle.png", "OPRAH", "THE ORACLE"],
  ["grifter-rock.png", "DWAYNE", "THE ROCK"], ["grifter-notorious.png", "CONOR", "THE NOTORIOUS"],
  ["grifter-masters.png", "ELDRICK", "THE MASTERS"], ["grifter-lightning.png", "USAIN", "THE LIGHTNING"],
  ["grifter-martian.png", "ELON", "THE MARTIAN"], ["grifter-benefactor.png", "JIMMY", "THE BENEFACTOR"],
  ["grifter-arthouse.png", "TIMOTHEE", "THE ARTHOUSE"], ["grifter-itgirl.png", "ZENDAYA", "THE IT GIRL"],
  ["grifter-oscar.png", "LEONARDO", "THE OSCAR"], ["grifter-monster.png", "GAGA", "THE MONSTER"],
  ["grifter-conejo.png", "BENITO", "THE CONEJO"],
];

function writeRoster() {
  const roster = [
    ...EXISTING.map(([file, name, label]) => ({ file, name, label })),
    ...NEW.map(([slug, name, label]) => ({ file: `grifter-${slug}.png`, name, label })),
  ];
  const names = new Set<string>();
  for (const r of roster) {
    if (names.has(r.name)) console.log(`WARNING duplicate name: ${r.name}`);
    names.add(r.name);
  }
  fs.writeFileSync(path.join(process.cwd(), "scripts/reveal/roster.json"), JSON.stringify(roster, null, 1));
  console.log(`roster.json written: ${roster.length} archetypes`);
}

async function main() {
  writeRoster();
  const CONCURRENCY = 8;
  const queue = [...NEW];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      for (let e = queue.shift(); e; e = queue.shift()) await gen(e);
    }),
  );
  const have = NEW.filter(([s]) => fs.existsSync(path.join(NFT_DIR, `grifter-${s}.png`))).length;
  console.log(`wave 4 pass complete: ${have}/${NEW.length} present`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
